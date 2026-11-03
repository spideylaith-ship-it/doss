import React, { useState } from 'react';
import { calculateJordanLandedCost, DEFAULT_EXCHANGE_RATES } from '../../utils/costCalculations.js';
import { Product, ProductCategory } from '../../types/index.js';
import { Calculator, ArrowLeft, Check, Sparkles, DollarSign, Info, ShieldCheck, Save } from 'lucide-react';

interface LandedCostCalculatorViewProps {
  categories: ProductCategory[];
  onSaveAsProduct: (productData: Partial<Product>) => Promise<void>;
  onNavigateToProducts: () => void;
}

export const LandedCostCalculatorView: React.FC<LandedCostCalculatorViewProps> = ({
  categories,
  onSaveAsProduct,
  onNavigateToProducts,
}) => {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'CNY' | 'JOD'>('USD');
  const [purchasePrice, setPurchasePrice] = useState<number>(12);
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATES.USD);
  const [shippingMethod, setShippingMethod] = useState<'sea_lcl' | 'sea_fcl' | 'air_express'>('sea_lcl');
  const [shippingPerUnitJod, setShippingPerUnitJod] = useState<number>(1.2);
  const [customsDutyPercent, setCustomsDutyPercent] = useState<number>(20);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(16);
  const [clearancePerUnitJod, setClearancePerUnitJod] = useState<number>(0.5);
  const [inlandTransportPerUnitJod, setInlandTransportPerUnitJod] = useState<number>(0.2);
  const [additionalFeesPerUnitJod, setAdditionalFeesPerUnitJod] = useState<number>(0.1);
  const [suggestedRetailPriceJod, setSuggestedRetailPriceJod] = useState<number>(25);

  // Quick save to product state
  const [productNameAr, setProductNameAr] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Recalculate whenever currency changes
  const handleCurrencyChange = (curr: 'USD' | 'EUR' | 'CNY' | 'JOD') => {
    setCurrency(curr);
    setExchangeRate(DEFAULT_EXCHANGE_RATES[curr] || 1.0);
  };

  const handleShippingChange = (method: 'sea_lcl' | 'sea_fcl' | 'air_express') => {
    setShippingMethod(method);
    if (method === 'sea_fcl') setShippingPerUnitJod(0.6);
    else if (method === 'sea_lcl') setShippingPerUnitJod(1.2);
    else if (method === 'air_express') setShippingPerUnitJod(3.8);
  };

  const result = calculateJordanLandedCost({
    purchasePriceCurrency: currency,
    purchasePrice: Number(purchasePrice) || 0,
    exchangeRateToJod: Number(exchangeRate) || 1,
    customsDutyPercent: Number(customsDutyPercent) || 0,
    salesTaxPercent: Number(salesTaxPercent) || 0,
    shippingPerUnitJod: Number(shippingPerUnitJod) || 0,
    clearancePerUnitJod: Number(clearancePerUnitJod) || 0,
    inlandTransportPerUnitJod: Number(inlandTransportPerUnitJod) || 0,
    additionalFeesPerUnitJod: Number(additionalFeesPerUnitJod) || 0,
    suggestedRetailPriceJod: Number(suggestedRetailPriceJod) || 0,
  });

  const handleSaveAsProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productNameAr.trim()) {
      alert('يرجى إدخال اسم المنتج بالعربية لحفظه');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCat = categories.find(c => c.id === selectedCategoryId);
      await onSaveAsProduct({
        nameAr: productNameAr.trim(),
        categoryId: selectedCategoryId,
        categoryNameAr: selectedCat?.nameAr || 'عام',
        targetCostJod: result.totalLandedCostJod,
        targetSellingPriceJod: result.suggestedRetailPriceJod,
        estimatedMarginPercent: result.projectedMarginPercent,
        status: 'evaluation',
        priority: 'high',
        assignedTeamMemberId: 'yamen',
        landedCost: result,
        notes: `تم حساب التكلفة عبر حاسبة الجمارك الأردنية: رسم جمركي ${customsDutyPercent}%، ضريبة مبيعات ${salesTaxPercent}%، شحن ${shippingMethod}.`,
      });
      setSaveSuccess(true);
      setProductNameAr('');
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'فشل حفظ المنتج');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-cyan-400" />
            حاسبة التكلفة الإجمالية الواصلة في الأردن (Jordan Landed Cost)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            احتساب دقيق للتكلفة الحقيقية تشمل CIF، الجمارك، ضريبة المبيعات 16%، التخليص ومصاريف الموانئ في العقبة وعمان
          </p>
        </div>
        <button
          onClick={onNavigateToProducts}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 self-start"
        >
          <ArrowLeft className="w-4 h-4" /> العودة لإدارة المنتجات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            معطيات الشراء والتوريد الدولية
          </h2>

          {/* Currency & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                عملة الشراء من المصنع
              </label>
              <select
                value={currency}
                onChange={e => handleCurrencyChange(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="USD">الدولار الأمريكي (USD)</option>
                <option value="CNY">اليوان الصيني (CNY)</option>
                <option value="EUR">اليورو الأوروبي (EUR)</option>
                <option value="JOD">الدينار الأردني (JOD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                سعر القطعة في المصنع ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={purchasePrice}
                onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                سعر الصرف مقابل الدينار
              </label>
              <input
                type="number"
                step="0.001"
                value={exchangeRate}
                onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">1 {currency} = {exchangeRate} د.أ</span>
            </div>
          </div>

          {/* Shipping Method and Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                طريقة ونوع الشحن الدولي
              </label>
              <select
                value={shippingMethod}
                onChange={e => handleShippingChange(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="sea_lcl">بحري تجميع LCL (ميناء العقبة - اقتصادي)</option>
                <option value="sea_fcl">بحري حاوية كاملة FCL (كميات ضخمة)</option>
                <option value="air_express">جوي سريع Air Express (عينات وطلبيات طارئة)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                تكلفة الشحن المقدرة للقطعة (JOD)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={shippingPerUnitJod}
                onChange={e => setShippingPerUnitJod(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Jordan Customs & Sales Tax */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                التعريفة الجمركية وضريبة المبيعات في الأردن
              </span>
              <span className="text-[10px] text-slate-400">تُحتسب تراكمياً على CIF</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نسبة الرسم الجمركي (%)
                </label>
                <select
                  value={customsDutyPercent}
                  onChange={e => setCustomsDutyPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="0">0% (معفى بموجب اتفاقيات تجارية)</option>
                  <option value="5">5% (ملحقات وأجهزة حاسوب)</option>
                  <option value="15">15% (أدوات صناعية ومعدات)</option>
                  <option value="20">20% (الرسم العام الاستهلاكي في الأردن)</option>
                  <option value="30">30% (كماليات ومنتجات فاخرة)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  الضريبة العامة على المبيعات (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={salesTaxPercent}
                  onChange={e => setSalesTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">النسبة القياسية في الأردن 16%</span>
              </div>
            </div>
          </div>

          {/* Local Handling & Inland Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                تخليص ومناولة موانئ (JOD)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={clearancePerUnitJod}
                onChange={e => setClearancePerUnitJod(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                نقل بري لمستودع عمان (JOD)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={inlandTransportPerUnitJod}
                onChange={e => setInlandTransportPerUnitJod(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                مصاريف إضافية / فحص (JOD)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={additionalFeesPerUnitJod}
                onChange={e => setAdditionalFeesPerUnitJod(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Target Selling Price */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-cyan-300 mb-1">
              سعر البيع المقترح للمستهلك النهائي في الأردن (JOD)
            </label>
            <input
              type="number"
              step="0.25"
              min="0.1"
              value={suggestedRetailPriceJod}
              onChange={e => setSuggestedRetailPriceJod(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-4 py-2.5 text-lg font-bold text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Right Output Results & Save (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Results Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center justify-between">
              <span>هيكل التكلفة الواصلة الصافية</span>
              <span className="text-xs font-mono text-cyan-400">Jordan Landed Breakdown</span>
            </h3>

            {/* Total Landed Cost Hero */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-4">
              <span className="text-xs text-slate-400">التكلفة الإجمالية الواصلة للقطعة (مستودع عمان):</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-black text-white font-mono">
                  {result.totalLandedCostJod.toFixed(3)} د.أ
                </span>
                <span className="text-xs text-slate-400">
                  ≈ ${(result.totalLandedCostJod / exchangeRate).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Breakdown lines */}
            <div className="space-y-2 text-xs border-b border-slate-800 pb-4 mb-4">
              <div className="flex justify-between text-slate-300">
                <span>سعر الشراء من المصنع:</span>
                <span className="font-mono">{result.basePriceJod.toFixed(3)} د.أ</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>الشحن الدولي للقطعة:</span>
                <span className="font-mono">{result.shippingPerUnitJod.toFixed(3)} د.أ</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>رسم الجمارك ({result.customsDutyPercent}% على CIF):</span>
                <span className="font-mono font-semibold">+{result.customsDutyJod.toFixed(3)} د.أ</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>ضريبة المبيعات الأردنية (16%):</span>
                <span className="font-mono font-semibold">+{result.salesTaxJod.toFixed(3)} د.أ</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>تخليص ومناولة ونقل محلي:</span>
                <span className="font-mono">
                  +{(result.clearancePerUnitJod + result.inlandTransportPerUnitJod + result.additionalFeesPerUnitJod).toFixed(3)} د.أ
                </span>
              </div>
            </div>

            {/* Profit & Margin Highlights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">صافي الربح للقطعة:</span>
                <span
                  className={`text-xl font-black font-mono ${
                    result.projectedProfitPerUnitJod > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.projectedProfitPerUnitJod > 0 ? `+${result.projectedProfitPerUnitJod.toFixed(3)} د.أ` : `${result.projectedProfitPerUnitJod.toFixed(3)} د.أ`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">هامش الربح (Margin):</span>
                  <span
                    className={`text-lg font-black font-mono ${
                      result.projectedMarginPercent >= 50
                        ? 'text-emerald-400'
                        : result.projectedMarginPercent >= 30
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}
                  >
                    %{result.projectedMarginPercent}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">العائد على الاستثمار (ROI):</span>
                  <span className="text-lg font-black font-mono text-purple-400">
                    %{result.roiPercent}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Save to Persistent Database Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Save className="w-4 h-4 text-emerald-400" />
              حفظ هذا الحساب كمنتج حقيقي في النظام
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              سيتم تسجيل المنتج فوراً في قاعدة البيانات الدائمة على الخادم وربطه بهيكل التكلفة الحالي
            </p>

            {saveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-3">
                <Check className="w-4 h-4" />
                تم حفظ المنتج بنجاح في قاعدة البيانات الدائمة!
              </div>
            )}

            <form onSubmit={handleSaveAsProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  اسم المنتج بالعربية <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productNameAr}
                  onChange={e => setProductNameAr(e.target.value)}
                  placeholder="مثال: مكنسة سيارة لاسلكية بقوة 9000Pa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  التصنيف
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={e => setSelectedCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ الدائم...' : 'تأكيد الحفظ في قاعدة بيانات المنتجات'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
