import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppDatabaseSchema, Product, ProductCategory, TeamMember, TeamTask, BuyingDecision, JordanMarketIntelligenceItem, SupplierRecord, AppSettings } from '../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'doss_universe.json');

const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'electronics',
    nameAr: 'إلكترونيات وأجهزة ذكية',
    nameEn: 'Smart Electronics & Gadgets',
    icon: 'Cpu',
    descriptionAr: 'ملحقات الهواتف الذكية، شواحن، إلكترونيات محمولة عالية الطلب في السوق الأردني',
    isCustom: false,
  },
  {
    id: 'auto_accessories',
    nameAr: 'إكسسوارات وعناية بالسيارات',
    nameEn: 'Auto Accessories & Detailing',
    icon: 'Car',
    descriptionAr: 'حوامل الهواتف، أجهزة نفخ الإطارات، مكانس السيارات ومنتجات العناية بالمركبات',
    isCustom: false,
  },
  {
    id: 'home_innovations',
    nameAr: 'مبتكرات المنزل والمطبخ',
    nameEn: 'Home & Kitchen Innovations',
    icon: 'Home',
    descriptionAr: 'أدوات ذكية للمطبخ والمنزل تروج بقوة عبر منصات التواصل والمبيعات المباشرة',
    isCustom: false,
  },
  {
    id: 'personal_care',
    nameAr: 'العناية الشخصية والأناقة',
    nameEn: 'Personal Care & Grooming',
    icon: 'Sparkles',
    descriptionAr: 'ماكينات حلاقة مبتكرة، أجهزة تدليك منزلية وأدوات صحية خفيفة',
    isCustom: false,
  },
  {
    id: 'fragrances_ambiance',
    nameAr: 'العطور ومعطرات الأجواء',
    nameEn: 'Fragrances & Aromatherapy',
    icon: 'Flame',
    descriptionAr: 'أجهزة تعطير الفنادق بالزيوت الأساسية وبخاخات متطورة لمحلات وتجار التجزئة',
    isCustom: false,
  },
  {
    id: 'tools_hardware',
    nameAr: 'معدات وأدوات تقنية خفيفة',
    nameEn: 'Tools & Hardware',
    icon: 'Wrench',
    descriptionAr: 'مفكات كهربائية دقيقة، إضاءات عمل وأدوات الصيانة المنزلية',
    isCustom: false,
  },
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'laith',
    nameAr: 'ليث',
    nameEn: 'Laith',
    titleAr: 'مدير التسويق، التصوير وصناعة المحتوى المرئي',
    titleEn: 'Marketing, Photography & Video Editing',
    roleDescriptionAr: 'مسؤول عن تصوير عينات المنتجات، إنتاج فيديوهات تيك توك وريلز عالية التحويل، وإدارة الحملات الإعلانية المدفوعة.',
    coreResponsibilities: [
      'تصوير فوتوغرافي احترافي لعينات المنتجات الجديدة',
      'مونتاج مقاطع فيديو إعلانية قصيرة (Reels / TikTok) تحاكي السوق الأردني',
      'اختبار زوايا البيع التسويقية وفحص رد فعل الجمهور المستهدف',
      'إعداد المواد البصرية للمحلات ونقاط البيع (POS)',
    ],
    email: 'spideylaith@gmail.com',
    avatarColor: '#10B981', // Emerald
  },
  {
    id: 'yamen',
    nameAr: 'يامن',
    nameEn: 'Yamen',
    titleAr: 'مدير المالية، التفاوض مع الموردين والإشراف الفني',
    titleEn: 'Finance, Supplier Negotiations & Technical Supervision',
    roleDescriptionAr: 'مسؤول عن حساب التكلفة الإجمالية الواصلة (Landed Cost)، التفاوض الصارم مع مصانع الصين وتركيا، واعتماد الجودة الفنية.',
    coreResponsibilities: [
      'التفاوض المباشر حول الأسعار وكميات الحد الأدنى (MOQ) وشروط الدفع',
      'التدقيق المالي وحساب الجمارك وضريبة المبيعات 16% وهامش الربح الصافي بالدينار',
      'فحص المواصفات الكهربائية والمطابقة الفنية (220V / 50Hz)',
      'إدارة التحويلات البنكية للمصانع والاعتمادات المستندية',
    ],
    email: 'yamen@dossuniverse.com',
    avatarColor: '#3B82F6', // Blue
  },
  {
    id: 'ahmad',
    nameAr: 'أحمد',
    nameEn: 'Ahmad',
    titleAr: 'مدير أبحاث المنتجات، العمليات والشحن واللوجستيات',
    titleEn: 'Product Research, Operations & Logistics',
    roleDescriptionAr: 'مسؤول عن استكشاف فرص المنتجات عبر 1688 وAlibaba، تنسيق الشحن البحري والجوي، والتخليص الجمركي في العقبة والمطار.',
    coreResponsibilities: [
      'البحث اليومي عن المنتجات الرائجة عالمياً والقابلة للتسويق في الأردن',
      'متابعة شحنات الحاويات البحرية والتجميع (LCL) عبر ميناء العقبة',
      'التنسيق مع شركات التخليص الجمركي ومطابقة متطلبات مؤسسة المواصفات والمقاييس',
      'إدارة التخزين في مستودعات عمان وجرد المخزون الفعلي',
    ],
    email: 'ahmad@dossuniverse.com',
    avatarColor: '#8B5CF6', // Purple
  },
  {
    id: 'zaid',
    nameAr: 'زيد',
    nameEn: 'Zaid',
    titleAr: 'مدير المبيعات الميدانية والتوزيع لشبكة المحلات',
    titleEn: 'Field Sales & Shop Distribution',
    roleDescriptionAr: 'مسؤول عن بناء وتغذية شبكة المحلات وتجار التجزئة في عمان، الزرقاء، إربد وباقي المحافظات، وتحصيل الدفعات.',
    coreResponsibilities: [
      'زيارات ميدانية لمحلات الصويفية، وسط البلد، الزرقاء وإربد لعرض العينات',
      'إبرام اتفاقيات التوريد بنظام الكاش أو الأجل القصير مع أصحاب المتاجر',
      'متابعة سرعة دوران المنتجات في نقاط البيع (Sell-through rate)',
      'جمع الملاحظات الميدانية المباشرة من الزبائن والتجار ونقلها للفريق',
    ],
    email: 'zaid@dossuniverse.com',
    avatarColor: '#F59E0B', // Amber
  },
];

const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-demo-1',
    nameAr: 'قاعدة شحن مغناطيسية 3 في 1 قابلة للطي من الألمنيوم',
    nameEn: 'Foldable 3-in-1 Magnetic Aluminum Charging Stand',
    sku: 'DOSS-EL-014',
    categoryId: 'electronics',
    categoryNameAr: 'إلكترونيات وأجهزة ذكية',
    status: 'approved',
    targetCostJod: 8.85,
    targetSellingPriceJod: 22.0,
    estimatedMarginPercent: 59.8,
    supplierName: 'Shenzhen Baseus OEM Partner',
    supplierCountry: 'الصين',
    sourceUrl: 'https://detail.1688.com/offer/example1.html',
    notes: 'منتج متميز جداً للسوق المحلي. تم فحص عينة سابقة وقوة المغناطيس ممتازة. مناسب لمحلات الصويفية ومبيعات إنستغرام.',
    priority: 'high',
    assignedTeamMemberId: 'yamen',
    isDemo: true,
    sampleStatus: 'tested_passed',
    marketFeasibilityScore: 92,
    landedCost: {
      purchasePriceCurrency: 'USD',
      purchasePrice: 7.5,
      exchangeRateToJod: 0.709,
      customsDutyPercent: 20,
      salesTaxPercent: 16,
      shippingPerUnitJod: 0.8,
      clearancePerUnitJod: 0.45,
      inlandTransportPerUnitJod: 0.2,
      additionalFeesPerUnitJod: 0.1,
      basePriceJod: 5.318,
      customsDutyJod: 1.224,
      salesTaxJod: 1.175,
      totalLandedCostJod: 8.85,
      suggestedRetailPriceJod: 22.0,
      projectedProfitPerUnitJod: 13.15,
      projectedMarginPercent: 59.8,
      roiPercent: 148.6,
    },
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-28T14:30:00.000Z',
  },
  {
    id: 'prod-demo-2',
    nameAr: 'مضخة إطارات رقمية لاسلكية ذكية ببطارية 6000mAh',
    nameEn: 'Smart Portable Cordless Tire Inflator 150PSI',
    sku: 'DOSS-AU-029',
    categoryId: 'auto_accessories',
    categoryNameAr: 'إكسسوارات وعناية بالسيارات',
    status: 'sourcing',
    targetCostJod: 12.4,
    targetSellingPriceJod: 28.0,
    estimatedMarginPercent: 55.7,
    supplierName: 'Ningbo Autotech Co., Ltd',
    supplierCountry: 'الصين',
    sourceUrl: 'https://alibaba.com/product-example2',
    notes: 'مطلوبة بكثرة لدى محلات زينة السيارات في شارع الجاردنز والبيادر. يامن يتفاوض حالياً على تقليل MOQ إلى 300 قطعة.',
    priority: 'urgent',
    assignedTeamMemberId: 'ahmad',
    isDemo: true,
    sampleStatus: 'ordered',
    marketFeasibilityScore: 88,
    landedCost: {
      purchasePriceCurrency: 'USD',
      purchasePrice: 11.0,
      exchangeRateToJod: 0.709,
      customsDutyPercent: 20,
      salesTaxPercent: 16,
      shippingPerUnitJod: 1.3,
      clearancePerUnitJod: 0.6,
      inlandTransportPerUnitJod: 0.25,
      additionalFeesPerUnitJod: 0.1,
      basePriceJod: 7.799,
      customsDutyJod: 1.82,
      salesTaxJod: 1.747,
      totalLandedCostJod: 12.4,
      suggestedRetailPriceJod: 28.0,
      projectedProfitPerUnitJod: 15.6,
      projectedMarginPercent: 55.7,
      roiPercent: 125.8,
    },
    createdAt: '2026-10-20T11:15:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'prod-demo-3',
    nameAr: 'جهاز تعطير الفنادق الذكي بتقنية النانو كولد بدون ماء',
    nameEn: 'Smart Waterless Cold-Air Aroma Scent Diffuser',
    sku: 'DOSS-FR-008',
    categoryId: 'fragrances_ambiance',
    categoryNameAr: 'العطور ومعطرات الأجواء',
    status: 'evaluation',
    targetCostJod: 17.2,
    targetSellingPriceJod: 42.0,
    estimatedMarginPercent: 59.0,
    supplierName: 'Guangzhou Grasse Aroma Tech',
    supplierCountry: 'الصين',
    sourceUrl: 'https://alibaba.com/product-example3',
    notes: 'فرصة قوية جداً. يغطي حتى 300 متر مكعب. تم الاتفاق مع 3 صالونات ومحلات في عبدون لتجربته فور وصول العينة.',
    priority: 'high',
    assignedTeamMemberId: 'zaid',
    isDemo: true,
    sampleStatus: 'ordered',
    marketFeasibilityScore: 85,
    landedCost: {
      purchasePriceCurrency: 'USD',
      purchasePrice: 15.5,
      exchangeRateToJod: 0.709,
      customsDutyPercent: 20,
      salesTaxPercent: 16,
      shippingPerUnitJod: 1.8,
      clearancePerUnitJod: 0.8,
      inlandTransportPerUnitJod: 0.3,
      additionalFeesPerUnitJod: 0.2,
      basePriceJod: 10.99,
      customsDutyJod: 2.558,
      salesTaxJod: 2.456,
      totalLandedCostJod: 17.2,
      suggestedRetailPriceJod: 42.0,
      projectedProfitPerUnitJod: 24.8,
      projectedMarginPercent: 59.0,
      roiPercent: 144.2,
    },
    createdAt: '2026-10-24T16:00:00.000Z',
    updatedAt: '2026-10-31T17:20:00.000Z',
  },
  {
    id: 'prod-demo-4',
    nameAr: 'ماكينة حلاقة وتشذيب دقيقة للشعر واللحية بنصل تيتانيوم',
    nameEn: 'Precision Titanium Blade Zero-Gapped Hair Trimmer',
    sku: 'DOSS-PC-019',
    categoryId: 'personal_care',
    categoryNameAr: 'العناية الشخصية والأناقة',
    status: 'rejected',
    targetCostJod: 6.9,
    targetSellingPriceJod: 12.0,
    estimatedMarginPercent: 42.5,
    supplierName: 'Wenzhou Kemei OEM Factory',
    supplierCountry: 'الصين',
    sourceUrl: 'https://1688.com/offer/example4',
    notes: 'رُفض بعد التقييم الميداني: السوق المحلي في وسط البلد مغمور بموديلات مماثلة رديئة بسعر 7 دنانير، والمنافسة محروقة الأسعار.',
    priority: 'low',
    assignedTeamMemberId: 'zaid',
    isDemo: true,
    sampleStatus: 'tested_failed',
    marketFeasibilityScore: 40,
    createdAt: '2026-10-10T12:00:00.000Z',
    updatedAt: '2026-10-18T15:00:00.000Z',
  },
  {
    id: 'prod-demo-5',
    nameAr: 'مفك براغي كهربائي لاسلكي دقيق 62 في 1 مع إضاءة LED',
    nameEn: 'Mini Precision Electric Screwdriver 62-in-1 Kit',
    sku: 'DOSS-TL-005',
    categoryId: 'tools_hardware',
    categoryNameAr: 'معدات وأدوات تقنية خفيفة',
    status: 'testing',
    targetCostJod: 7.3,
    targetSellingPriceJod: 18.0,
    estimatedMarginPercent: 59.4,
    supplierName: 'Dongguan Wowstick Partner',
    supplierCountry: 'الصين',
    sourceUrl: 'https://detail.1688.com/offer/example5',
    notes: 'عينة قيد الفحص لدى يامن للتأكد من عزم الدوران (Torque) وجودة رؤوس المغناطيس. ليث أعد سكريبت إعلاني تجريبي.',
    priority: 'high',
    assignedTeamMemberId: 'laith',
    isDemo: true,
    sampleStatus: 'received',
    marketFeasibilityScore: 84,
    createdAt: '2026-10-27T08:30:00.000Z',
    updatedAt: '2026-11-02T11:00:00.000Z',
  },
];

const INITIAL_TASKS: TeamTask[] = [
  {
    id: 'task-1',
    title: 'تصوير فيديو تجريبي لقاعدة الشحن 3 في 1 بأسلوب Reels',
    description: 'إبراز سرعة الشحن وسهولة الطي وملاءمته لمكتب العمل، مع كتابة نص بالعامية الأردنية.',
    assignedTo: 'laith',
    relatedProductId: 'prod-demo-1',
    relatedProductName: 'قاعدة شحن مغناطيسية 3 في 1',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-11-06',
    createdAt: '2026-10-30T10:00:00.000Z',
    createdBy: 'يامن',
  },
  {
    id: 'task-2',
    title: 'التفاوض النهائي على سعر كمية 500 قطعة لمضخة الإطارات',
    description: 'الهدف خفض السعر من $11 إلى $9.8 FOB نينغبو، مع طلب علب كرتون بطباعة شعار DOSS.',
    assignedTo: 'yamen',
    relatedProductId: 'prod-demo-2',
    relatedProductName: 'مضخة إطارات رقمية لاسلكية',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-11-05',
    createdAt: '2026-10-29T14:00:00.000Z',
    createdBy: 'أحمد',
  },
  {
    id: 'task-3',
    title: 'تأكيد بند التعريفة الجمركية HS Code لجهاز التعطير البارد',
    description: 'التحقق من المخلص الجمركي في العقبة: هل يصنف كأجهزة كهربائية منزلية 20% أم تصنيف آخر، والتأكد من ضريبة المبيعات 16%.',
    assignedTo: 'ahmad',
    relatedProductId: 'prod-demo-3',
    relatedProductName: 'جهاز تعطير الفنادق الذكي',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-11-08',
    createdAt: '2026-11-01T09:30:00.000Z',
    createdBy: 'يامن',
  },
  {
    id: 'task-4',
    title: 'استطلاع أسعار محلات الهواتف في الصويفية ومكة مول لقواعد الشحن',
    description: 'معرفة الموديلات المعروضة حالياً وأسعار بيعها للزبون، لتقدير قدرتنا على التوريد بالجملة للمحلات بسعر 14 دينار لتباع بـ 22 دينار.',
    assignedTo: 'zaid',
    relatedProductId: 'prod-demo-1',
    relatedProductName: 'قاعدة شحن مغناطيسية 3 في 1',
    priority: 'normal',
    status: 'completed',
    dueDate: '2026-11-02',
    createdAt: '2026-10-28T11:00:00.000Z',
    createdBy: 'ليث',
  },
];

const INITIAL_DECISIONS: BuyingDecision[] = [
  {
    id: 'dec-1',
    productId: 'prod-demo-1',
    productName: 'قاعدة شحن مغناطيسية 3 في 1 قابلة للطي من الألمنيوم',
    decision: 'approve',
    targetPurchaseQuantity: 600,
    totalEstimatedBudgetJod: 5310,
    rationale: 'المنتج يمتلك هامش ربح يزيد عن 59%، ونتائج استطلاع زيد لمحلات الصويفية أكدت وجود فراغ في منتج ألمنيوم فخم بأقل من 25 دينار. العينة مجازة فنياً من يامن.',
    signoffs: {
      yamen: true,
      ahmad: true,
      zaid: true,
      laith: true,
    },
    status: 'ready_for_po',
    date: '2026-11-01',
  },
  {
    id: 'dec-2',
    productId: 'prod-demo-2',
    productName: 'مضخة إطارات رقمية لاسلكية ذكية ببطارية 6000mAh',
    decision: 'approve',
    targetPurchaseQuantity: 400,
    totalEstimatedBudgetJod: 4960,
    rationale: 'موسم الشتاء في الأردن يزيد الإقبال على مضخات الهواء المتنقلة لضبط ضغط الإطارات. بانتظار توقيع أحمد على أسعار الشحن البحري.',
    signoffs: {
      yamen: true,
      ahmad: false,
      zaid: true,
      laith: true,
    },
    status: 'pending_signoffs',
    date: '2026-11-02',
  },
];

const INITIAL_MARKET_INTELLIGENCE: JordanMarketIntelligenceItem[] = [
  {
    id: 'jmi-1',
    titleAr: 'دليل الجمارك وضريبة المبيعات الأردنية للاستيراد التجاري',
    titleEn: 'Jordan Customs & Sales Tax Operational Guide',
    category: 'customs_tax',
    governorateOrZone: 'العقبة / مطار الملكة علياء',
    summaryAr: 'تفاصيل احتساب الرسوم الجمركية على أساس CIF (القيمة + الشحن) وتطبيق ضريبة المبيعات العامة 16%.',
    detailsAr: 'تخضع معظم المنتجات التجارية الاستهلاكية غير المعفاة لرسم جمركي قياسي يتراوح بين 15% إلى 20%، وتضاف ضريبة المبيعات 16% على مجموع (قيمة البضاعة + الشحن + الرسم الجمركي). الشحن عبر ميناء العقبة أكثر جدوى للشحنات التي تزيد عن 3 متر مكعب (CBM).',
    impactScore: 'critical',
    keyTakeaways: [
      'ضريبة المبيعات 16% تحسب تراكمياً بعد الرسم الجمركي',
      'شهادة المنشأ والفاتورة المصدقة إلزامية لتفادي الغرامات',
      'فحص المواصفات والمقاييس (JSMO) للأجهزة الكهربائية يتطلب مطابقة 220V',
    ],
    updatedAt: '2026-10-25',
  },
  {
    id: 'jmi-2',
    titleAr: 'خريطة مناطق البيع بالتجزئة وتوزيع المحلات في عمان الكبرى',
    titleEn: 'Amman Retail Zones & Channel Viability',
    category: 'retail_channel',
    governorateOrZone: 'عمان (الصويفية، الجاردنز، وسط البلد، العبدلي)',
    summaryAr: 'تحليل شريحة القوة الشرائية وطريقة التعامل لكل منطقة جغرافية في العاصمة.',
    detailsAr: 'الصويفية ودابوق والعبدلي تتقبل المنتجات التقنية والإكسسوارات بأسعار من 18 إلى 45 دينار بهوامش ربح مرتفعة. شارع الجاردنز وشارع المدينة المنورة مركز ممتاز لإكسسوارات السيارات، بينما وسط البلد والوحدات تتطلب منتجات سريعة الدوران بأسعار أقل من 10 دنانير.',
    impactScore: 'high',
    keyTakeaways: [
      'الصويفية: تركز على التصميم الفاخر والمغناطيس القوي',
      'الجاردنز: استهلاك مرتفع لأجهزة العناية بالمركبات',
      'طريقة الدفع للمحلات: يفضل اعتماد بيع كاش أو كمبيالة أسبوعين للمحلات الموثوقة',
    ],
    updatedAt: '2026-10-28',
  },
  {
    id: 'jmi-3',
    titleAr: 'شبكة التوزيع في المحافظات (إربد والزرقاء)',
    titleEn: 'Governorate Distribution Strategy (Irbid & Zarqa)',
    category: 'regional_market',
    governorateOrZone: 'محافظات الشمال والوسط',
    summaryAr: 'فرص التوريد للمحلات الكبرى خارج العاصمة عمان لزيادة حجم المبيعات الإجمالي.',
    detailsAr: 'جامعة اليرم وشارع الجامعة في إربد سوق نشط للشباب والملحقات الذكية. أسواق الزرقاء تتميز بكثافة سكانية وحجم طلب عالٍ للمنتجات العائلية والمبتكرات العملية بأسعار تنافسية.',
    impactScore: 'medium',
    keyTakeaways: [
      'يوم توزيع محدد أسبوعياً يقلل تكلفة النقل اللوجستي',
      'تجار إربد يفضلون المنتجات المجربة والمطلوبة مسبقاً على السوشال ميديا',
    ],
    updatedAt: '2026-10-30',
  },
];

const INITIAL_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'sup-1',
    name: 'Shenzhen Yuda Technology Co., Ltd',
    country: 'الصين (شنتشن)',
    platform: 'Alibaba',
    mainProductsAr: 'شواحن لاسلكية، قواعد شحن MagSafe، بنوك طاقة',
    contactPerson: 'Jessica Chen',
    contactMethod: 'WeChat: yuda_tech_sz / WhatsApp: +86-13800000000',
    moq: 200,
    typicalLeadTimeDays: 14,
    rating: 5,
    verifiedStatus: true,
    notes: 'مورد موثوق جداً وتم طلب عينات منه مسبقاً، الجودة عالية ويقبل طباعة شعار ليزر.',
    isDemo: true,
  },
  {
    id: 'sup-2',
    name: 'Ningbo Honsun Auto Electrical Co.',
    country: 'الصين (نينغبو)',
    platform: '1688',
    mainProductsAr: 'مضخات إطارات ذكية، مكانس سيارات لاسلكية، محولات طاقة',
    contactPerson: 'David Wang',
    contactMethod: 'WeChat: ningbo_honsun / Email: sales@honsun-auto.com',
    moq: 300,
    typicalLeadTimeDays: 18,
    rating: 4,
    verifiedStatus: true,
    notes: 'مصنع مباشر في نينغبو، أسعاره أرخص بنسبة 22% من علي بابا، التواصل يحتاج لغة صينية عبر ويشات.',
    isDemo: true,
  },
  {
    id: 'sup-3',
    name: 'Istanbul Koku & Aroma Kimya',
    country: 'تركيا (إسطنبول)',
    platform: 'Trade Fair',
    mainProductsAr: 'زيوت عطرية مركزة للموزعات الكهربائية، معطرات فاخرة',
    contactPerson: 'Murat Yilmaz',
    contactMethod: 'WhatsApp: +90-5320000000',
    moq: 100,
    typicalLeadTimeDays: 8,
    rating: 5,
    verifiedStatus: true,
    notes: 'شحن سريع جداً من تركيا إلى الأردن (3 إلى 5 أيام بالطيران أو شاحنة الترانزيت)، زيوت بجودة أوروبية مطابقة للمواصفات.',
    isDemo: true,
  },
];

const INITIAL_SETTINGS: AppSettings = {
  companyNameAr: 'مؤسسة دوس يونيفرس للتجارة والتوزيع',
  companyNameEn: 'DOSS UNIVERSE Trading & Distribution Co.',
  city: 'عمان',
  country: 'المملكة الأردنية الهاشمية',
  defaultCurrency: 'JOD',
  exchangeRates: {
    USD: 0.709,
    EUR: 0.770,
    CNY: 0.100,
  },
  defaultSalesTaxPercent: 16,
  defaultCustomsDutyPercent: 20,
  defaultClearancePort: 'ميناء العقبة البحري / مطار الملكة علياء الدولي',
};

class DatabaseManager {
  private data: AppDatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadOrInit();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadOrInit(): AppDatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure structure contains required keys
        return {
          products: Array.isArray(parsed.products) ? parsed.products : INITIAL_DEMO_PRODUCTS,
          categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
          teamMembers: Array.isArray(parsed.teamMembers) && parsed.teamMembers.length > 0 ? parsed.teamMembers : INITIAL_TEAM,
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : INITIAL_TASKS,
          decisions: Array.isArray(parsed.decisions) ? parsed.decisions : INITIAL_DECISIONS,
          marketIntelligence: Array.isArray(parsed.marketIntelligence) ? parsed.marketIntelligence : INITIAL_MARKET_INTELLIGENCE,
          suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : INITIAL_SUPPLIERS,
          settings: parsed.settings || INITIAL_SETTINGS,
        };
      }
    } catch (err) {
      console.error('Failed reading existing db file, initializing fresh database:', err);
    }

    const initialDb: AppDatabaseSchema = {
      products: INITIAL_DEMO_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      teamMembers: INITIAL_TEAM,
      tasks: INITIAL_TASKS,
      decisions: INITIAL_DECISIONS,
      marketIntelligence: INITIAL_MARKET_INTELLIGENCE,
      suppliers: INITIAL_SUPPLIERS,
      settings: INITIAL_SETTINGS,
    };

    this.save(initialDb);
    return initialDb;
  }

  private save(data: AppDatabaseSchema): void {
    try {
      this.ensureDataDir();
      const tmpPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (err) {
      console.error('CRITICAL: Failed saving database to disk:', err);
    }
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const category = this.data.categories.find(c => c.id === productData.categoryId);
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      categoryNameAr: category ? category.nameAr : (productData.categoryNameAr || 'عام'),
      isDemo: false, // User created items are always real, never demo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.products.unshift(newProduct);
    this.save(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    if (updates.categoryId) {
      const category = this.data.categories.find(c => c.id === updates.categoryId);
      if (category) {
        updates.categoryNameAr = category.nameAr;
      }
    }

    const updated: Product = {
      ...this.data.products[idx],
      ...updates,
      id, // protect id
      updatedAt: new Date().toISOString(),
    };

    this.data.products[idx] = updated;
    this.save(this.data);
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save(this.data);
      return true;
    }
    return false;
  }

  // --- Categories ---
  public getCategories(): ProductCategory[] {
    return this.data.categories;
  }

  public addCategory(cat: Omit<ProductCategory, 'id' | 'isCustom'>): ProductCategory {
    const newCat: ProductCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      isCustom: true,
    };
    this.data.categories.push(newCat);
    this.save(this.data);
    return newCat;
  }

  // --- Team & Tasks ---
  public getTeamMembers(): TeamMember[] {
    return this.data.teamMembers.map(member => {
      const memberTasks = this.data.tasks.filter(t => t.assignedTo === member.id && t.status !== 'completed');
      const memberProducts = this.data.products.filter(p => p.assignedTeamMemberId === member.id);
      return {
        ...member,
        activeTasksCount: memberTasks.length,
        evaluatedProductsCount: memberProducts.length,
      };
    });
  }

  public getTasks(): TeamTask[] {
    return this.data.tasks;
  }

  public addTask(taskData: Omit<TeamTask, 'id' | 'createdAt'>): TeamTask {
    const newTask: TeamTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.unshift(newTask);
    this.save(this.data);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<TeamTask>): TeamTask | null {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = {
      ...this.data.tasks[idx],
      ...updates,
      id,
    };
    this.save(this.data);
    return this.data.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    const initLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    if (this.data.tasks.length !== initLen) {
      this.save(this.data);
      return true;
    }
    return false;
  }

  // --- Buying Decisions ---
  public getDecisions(): BuyingDecision[] {
    return this.data.decisions;
  }

  public addDecision(decisionData: Omit<BuyingDecision, 'id' | 'date'>): BuyingDecision {
    const newDecision: BuyingDecision = {
      ...decisionData,
      id: `dec-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.data.decisions.unshift(newDecision);
    this.save(this.data);
    return newDecision;
  }

  public updateDecisionSignoff(id: string, memberId: 'yamen' | 'ahmad' | 'zaid' | 'laith', approved: boolean): BuyingDecision | null {
    const idx = this.data.decisions.findIndex(d => d.id === id);
    if (idx === -1) return null;
    const dec = this.data.decisions[idx];
    dec.signoffs[memberId] = approved;
    const allSigned = dec.signoffs.yamen && dec.signoffs.ahmad && dec.signoffs.zaid && dec.signoffs.laith;
    if (allSigned && dec.decision === 'approve') {
      dec.status = 'ready_for_po';
    } else {
      dec.status = 'pending_signoffs';
    }
    this.save(this.data);
    return dec;
  }

  // --- Market Intelligence & Suppliers ---
  public getMarketIntelligence(): JordanMarketIntelligenceItem[] {
    return this.data.marketIntelligence;
  }

  public getSuppliers(): SupplierRecord[] {
    return this.data.suppliers;
  }

  public addSupplier(supplierData: Omit<SupplierRecord, 'id' | 'isDemo'>): SupplierRecord {
    const newSup: SupplierRecord = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      isDemo: false,
    };
    this.data.suppliers.unshift(newSup);
    this.save(this.data);
    return newSup;
  }

  // --- Settings ---
  public getSettings(): AppSettings {
    return this.data.settings;
  }

  public updateSettings(settingsUpdate: Partial<AppSettings>): AppSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settingsUpdate,
    };
    this.save(this.data);
    return this.data.settings;
  }

  // --- Metrics ---
  public getMetrics() {
    const products = this.data.products;
    const realProducts = products.filter(p => !p.isDemo);
    const demoProducts = products.filter(p => p.isDemo);

    const approvedProducts = products.filter(p => p.status === 'approved');
    const evaluationProducts = products.filter(p => p.status === 'evaluation');
    const rejectedProducts = products.filter(p => p.status === 'rejected');
    const sourcingProducts = products.filter(p => p.status === 'sourcing');
    const testingProducts = products.filter(p => p.status === 'testing');

    const potentialProfitJod = approvedProducts.reduce((sum, p) => {
      const margin = (p.targetSellingPriceJod - p.targetCostJod);
      return sum + (margin > 0 ? margin * 100 : 0); // baseline batch of 100 units
    }, 0);

    const totalEstimatedInvestmentJod = approvedProducts.reduce((sum, p) => {
      return sum + (p.targetCostJod * 100);
    }, 0);

    return {
      totalProducts: products.length,
      realProductsCount: realProducts.length,
      demoProductsCount: demoProducts.length,
      productsUnderEvaluation: evaluationProducts.length,
      approvedProducts: approvedProducts.length,
      rejectedProducts: rejectedProducts.length,
      sourcingProducts: sourcingProducts.length,
      testingProducts: testingProducts.length,
      potentialProfitJod: Number(potentialProfitJod.toFixed(2)),
      totalEstimatedInvestmentJod: Number(totalEstimatedInvestmentJod.toFixed(2)),
      pendingTasksCount: this.data.tasks.filter(t => t.status !== 'completed').length,
      readyDecisionsCount: this.data.decisions.filter(d => d.status === 'ready_for_po').length,
    };
  }
}

export const db = new DatabaseManager();
