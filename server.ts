import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db } from './server/db.js';
import { calculateJordanLandedCost, validateProductInput } from './src/utils/costCalculations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Request logging for API routes
  app.use('/api', (req, _res, next) => {
    // API request log
    next();
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      system: 'DOSS UNIVERSE OS v1.0 - Commercial Intelligence',
    });
  });

  // Dashboard Metrics
  app.get('/api/metrics', (_req: Request, res: Response) => {
    try {
      const metrics = db.getMetrics();
      res.json(metrics);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed calculating metrics', details: err.message });
    }
  });

  // Products API
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      let products = db.getProducts();
      const { search, category, status, isDemo, priority } = req.query;

      if (search && typeof search === 'string') {
        const q = search.trim().toLowerCase();
        products = products.filter(
          p =>
            p.nameAr.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.supplierName && p.supplierName.toLowerCase().includes(q)) ||
            (p.notes && p.notes.toLowerCase().includes(q))
        );
      }

      if (category && typeof category === 'string' && category !== 'all') {
        products = products.filter(p => p.categoryId === category);
      }

      if (status && typeof status === 'string' && status !== 'all') {
        products = products.filter(p => p.status === status);
      }

      if (priority && typeof priority === 'string' && priority !== 'all') {
        products = products.filter(p => p.priority === priority);
      }

      if (isDemo !== undefined && isDemo !== '') {
        const demoBool = isDemo === 'true';
        products = products.filter(p => p.isDemo === demoBool);
      }

      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed fetching products', details: err.message });
    }
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'المنتج غير موجود' });
      return;
    }
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const validation = validateProductInput(req.body);
      if (!validation.isValid) {
        res.status(400).json({ error: 'بيانات غير مكتملة', validationErrors: validation.errors });
        return;
      }

      const body = req.body;
      let landedCost = body.landedCost;
      if (!landedCost && body.targetCostJod && body.targetSellingPriceJod) {
        // Auto compute standard Jordan landed cost
        const settings = db.getSettings();
        landedCost = calculateJordanLandedCost({
          purchasePriceCurrency: 'USD',
          purchasePrice: body.targetCostJod / settings.exchangeRates.USD,
          exchangeRateToJod: settings.exchangeRates.USD,
          customsDutyPercent: settings.defaultCustomsDutyPercent,
          salesTaxPercent: settings.defaultSalesTaxPercent,
          shippingPerUnitJod: 1.0,
          clearancePerUnitJod: 0.5,
          inlandTransportPerUnitJod: 0.2,
          suggestedRetailPriceJod: body.targetSellingPriceJod,
        });
      }

      const marginPercent = body.targetSellingPriceJod > 0
        ? Number((((body.targetSellingPriceJod - body.targetCostJod) / body.targetSellingPriceJod) * 100).toFixed(1))
        : 0;

      const newProduct = db.addProduct({
        nameAr: body.nameAr.trim(),
        nameEn: body.nameEn ? body.nameEn.trim() : '',
        sku: body.sku ? body.sku.trim() : `DOSS-${Date.now().toString().slice(-4)}`,
        categoryId: body.categoryId,
        categoryNameAr: body.categoryNameAr,
        status: body.status || 'evaluation',
        targetCostJod: Number(body.targetCostJod),
        targetSellingPriceJod: Number(body.targetSellingPriceJod),
        estimatedMarginPercent: marginPercent,
        supplierName: body.supplierName ? body.supplierName.trim() : 'غير محدد',
        supplierCountry: body.supplierCountry ? body.supplierCountry.trim() : 'الصين',
        sourceUrl: body.sourceUrl ? body.sourceUrl.trim() : '',
        notes: body.notes ? body.notes.trim() : '',
        priority: body.priority || 'normal',
        assignedTeamMemberId: body.assignedTeamMemberId || 'yamen',
        isDemo: false,
        sampleStatus: body.sampleStatus || 'not_ordered',
        marketFeasibilityScore: body.marketFeasibilityScore || 75,
        landedCost,
      });

      res.status(201).json(newProduct);
    } catch (err: any) {
      console.error('Error adding product:', err);
      res.status(500).json({ error: 'فشل في حفظ المنتج الجديد', details: err.message });
    }
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (body.nameAr !== undefined || body.targetCostJod !== undefined || body.targetSellingPriceJod !== undefined) {
        const validation = validateProductInput({
          nameAr: body.nameAr,
          categoryId: body.categoryId,
          targetCostJod: body.targetCostJod,
          targetSellingPriceJod: body.targetSellingPriceJod,
        });
        if (!validation.isValid) {
          res.status(400).json({ error: 'بيانات غير صالحة', validationErrors: validation.errors });
          return;
        }
      }

      if (body.targetCostJod !== undefined && body.targetSellingPriceJod !== undefined) {
        body.estimatedMarginPercent = body.targetSellingPriceJod > 0
          ? Number((((body.targetSellingPriceJod - body.targetCostJod) / body.targetSellingPriceJod) * 100).toFixed(1))
          : 0;
      }

      const updated = db.updateProduct(id, body);
      if (!updated) {
        res.status(404).json({ error: 'المنتج غير موجود لتعديله' });
        return;
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل في تعديل المنتج', details: err.message });
    }
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = db.deleteProduct(id);
      if (!deleted) {
        res.status(404).json({ error: 'المنتج غير موجود لحذفه' });
        return;
      }
      res.json({ success: true, message: 'تم حذف المنتج بنجاح من قاعدة البيانات' });
    } catch (err: any) {
      res.status(500).json({ error: 'فشل في حذف المنتج', details: err.message });
    }
  });

  // Categories API
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json(db.getCategories());
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    try {
      const { nameAr, nameEn, descriptionAr, icon } = req.body;
      if (!nameAr || nameAr.trim().length < 2) {
        res.status(400).json({ error: 'اسم التصنيف بالعربية مطلوب' });
        return;
      }
      const newCat = db.addCategory({
        nameAr: nameAr.trim(),
        nameEn: nameEn ? nameEn.trim() : nameAr.trim(),
        descriptionAr: descriptionAr ? descriptionAr.trim() : '',
        icon: icon || 'Tag',
      });
      res.status(201).json(newCat);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل إضافة التصنيف', details: err.message });
    }
  });

  // Team & Tasks API
  app.get('/api/team', (_req: Request, res: Response) => {
    res.json(db.getTeamMembers());
  });

  app.get('/api/tasks', (_req: Request, res: Response) => {
    res.json(db.getTasks());
  });

  app.post('/api/tasks', (req: Request, res: Response) => {
    try {
      const { title, description, assignedTo, priority, dueDate, relatedProductId, relatedProductName, createdBy } = req.body;
      if (!title || title.trim().length < 3) {
        res.status(400).json({ error: 'عنوان المهمة مطلوب' });
        return;
      }
      const newTask = db.addTask({
        title: title.trim(),
        description: description ? description.trim() : '',
        assignedTo: assignedTo || 'laith',
        priority: priority || 'normal',
        status: 'pending',
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        relatedProductId,
        relatedProductName,
        createdBy: createdBy || 'النظام',
      });
      res.status(201).json(newTask);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل إنشاء المهمة', details: err.message });
    }
  });

  app.patch('/api/tasks/:id', (req: Request, res: Response) => {
    const updated = db.updateTask(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'المهمة غير موجودة' });
      return;
    }
    res.json(updated);
  });

  app.delete('/api/tasks/:id', (req: Request, res: Response) => {
    const deleted = db.deleteTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'المهمة غير موجودة لحذفها' });
      return;
    }
    res.json({ success: true });
  });

  // Buying Decisions API
  app.get('/api/decisions', (_req: Request, res: Response) => {
    res.json(db.getDecisions());
  });

  app.post('/api/decisions', (req: Request, res: Response) => {
    try {
      const { productId, productName, decision, targetPurchaseQuantity, totalEstimatedBudgetJod, rationale } = req.body;
      if (!productId || !decision) {
        res.status(400).json({ error: 'المنتج والقرار مطلوبان' });
        return;
      }
      const newDecision = db.addDecision({
        productId,
        productName: productName || 'منتج قيد القرار',
        decision,
        targetPurchaseQuantity: Number(targetPurchaseQuantity) || 100,
        totalEstimatedBudgetJod: Number(totalEstimatedBudgetJod) || 1000,
        rationale: rationale || '',
        signoffs: {
          yamen: false,
          ahmad: false,
          zaid: false,
          laith: false,
        },
        status: 'pending_signoffs',
      });
      res.status(201).json(newDecision);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل إضافة قرار الشراء', details: err.message });
    }
  });

  app.patch('/api/decisions/:id/signoff', (req: Request, res: Response) => {
    const { memberId, approved } = req.body;
    if (!['yamen', 'ahmad', 'zaid', 'laith'].includes(memberId)) {
      res.status(400).json({ error: 'عضو الفريق غير صالح' });
      return;
    }
    const updated = db.updateDecisionSignoff(req.params.id, memberId, Boolean(approved));
    if (!updated) {
      res.status(404).json({ error: 'قرار الشراء غير موجود' });
      return;
    }
    res.json(updated);
  });

  // Landed Cost Calculation API
  app.post('/api/calculate-cost', (req: Request, res: Response) => {
    try {
      const calculation = calculateJordanLandedCost(req.body);
      res.json(calculation);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل حساب التكلفة الإجمالية', details: err.message });
    }
  });

  // Market Intelligence & Suppliers API
  app.get('/api/market-intelligence', (_req: Request, res: Response) => {
    res.json(db.getMarketIntelligence());
  });

  app.get('/api/suppliers', (_req: Request, res: Response) => {
    res.json(db.getSuppliers());
  });

  app.post('/api/suppliers', (req: Request, res: Response) => {
    try {
      const { name, country, platform, mainProductsAr, contactPerson, contactMethod, moq, typicalLeadTimeDays, notes } = req.body;
      if (!name || name.trim().length < 2) {
        res.status(400).json({ error: 'اسم المورد مطلوب' });
        return;
      }
      const newSup = db.addSupplier({
        name: name.trim(),
        country: country || 'الصين',
        platform: platform || 'Alibaba',
        mainProductsAr: mainProductsAr || '',
        contactPerson: contactPerson || '',
        contactMethod: contactMethod || '',
        moq: Number(moq) || 100,
        typicalLeadTimeDays: Number(typicalLeadTimeDays) || 15,
        rating: 4,
        verifiedStatus: true,
        notes: notes || '',
      });
      res.status(201).json(newSup);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل إضافة المورد', details: err.message });
    }
  });

  // Settings API
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'فشل تحديث الإعدادات', details: err.message });
    }
  });

  // Vite middleware in dev or static serve in production
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DOSS UNIVERSE] Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
