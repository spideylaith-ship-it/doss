import React, { useState } from 'react';
import { AppSettings, ProductCategory } from '../../types/index.js';
import {
  Settings,
  Building,
  DollarSign,
  FolderPlus,
  ShieldCheck,
  Save,
  Check,
  Server,
  Layers,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  categories: ProductCategory[];
  onUpdateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  onAddCategory: (cat: { nameAr: string; nameEn?: string; descriptionAr?: string }) => Promise<ProductCategory>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  categories,
  onUpdateSettings,
  onAddCategory,
}) => {
  const [companyNameAr, setCompanyNameAr] = useState(settings.companyNameAr);
  const [companyNameEn, setCompanyNameEn] = useState(settings.companyNameEn);
  const [city, setCity] = useState(settings.city);
  const [usdRate, setUsdRate] = useState(settings.exchangeRates.USD);
  const [eurRate, setEurRate] = useState(settings.exchangeRates.EUR);
  const [cnyRate, setCnyRate] = useState(settings.exchangeRates.CNY);
  const [customsPercent, setCustomsPercent] = useState(settings.defaultCustomsDutyPercent);
  const [salesTaxPercent, setSalesTaxPercent] = useState(settings.defaultSalesTaxPercent);
  const [clearancePort, setClearancePort] = useState(settings.defaultClearancePort);

  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New category form
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateSettings({
        companyNameAr,
        companyNameEn,
        city,
        exchangeRates: {
          USD: Number(usdRate),
          EUR: Number(eurRate),
          CNY: Number(cnyRate),
        },
        defaultCustomsDutyPercent: Number(customsPercent),
        defaultSalesTaxPercent: Number(salesTaxPercent),
        defaultClearancePort: clearancePort,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'فشل حفظ الإعدادات');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatAr.trim()) return;
    setAddingCategory(true);
    try {
      await onAddCategory({
        nameAr: newCatAr.trim(),
        nameEn: newCatEn.trim(),
        descriptionAr: newCatDesc.trim(),
      });
      setNewCatAr('');
      setNewCatEn('');
      setNewCatDesc('');
    } catch (err: any) {
      alert(err.message || 'فشل إضافة التصنيف');
    } finally {
      setAddingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          إعدادات المنظومة والعملات (System Settings)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تخصيص أسعار الصرف، الرسوم الجمركية الافتراضية، وإدارة تصنيفات المنتجات
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          تم حفظ الإعدادات بنجاح وتحديث المتغيرات في قاعدة البيانات الدائمة!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company and Jordan Rates Form */}
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-5 h-5 text-cyan-400" />
            بيانات المنشأة ومعايير الاستيراد في الأردن
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم الشركة بالعربية
            </label>
            <input
              type="text"
              value={companyNameAr}
              onChange={e => setCompanyNameAr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Company Name (English)
            </label>
            <input
              type="text"
              value={companyNameEn}
              onChange={e => setCompanyNameEn(e.target.value)}
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white text-left font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المدينة والمقر الرئيسي
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ميناء ومنفذ التخليص الافتراضي
              </label>
              <input
                type="text"
                value={clearancePort}
                onChange={e => setClearancePort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              أسعار صرف العملات مقابل الدينار الأردني (JOD)
            </span>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">1 USD =</label>
                <input
                  type="number"
                  step="0.001"
                  value={usdRate}
                  onChange={e => setUsdRate(parseFloat(e.target.value) || 0.709)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">1 EUR =</label>
                <input
                  type="number"
                  step="0.001"
                  value={eurRate}
                  onChange={e => setEurRate(parseFloat(e.target.value) || 0.77)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">1 CNY =</label>
                <input
                  type="number"
                  step="0.001"
                  value={cnyRate}
                  onChange={e => setCnyRate(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Tax Rates */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              الرسوم الجمركية والضريبية العامة في الأردن
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">الرسم الجمركي الافتراضي (%)</label>
                <input
                  type="number"
                  step="1"
                  value={customsPercent}
                  onChange={e => setCustomsPercent(parseFloat(e.target.value) || 20)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ضريبة المبيعات العامة (%)</label>
                <input
                  type="number"
                  step="1"
                  value={salesTaxPercent}
                  onChange={e => setSalesTaxPercent(parseFloat(e.target.value) || 16)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {savingSettings ? 'جاري الحفظ...' : 'حفظ التعديلات في النظام'}
          </button>
        </form>

        {/* Categories Manager */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FolderPlus className="w-5 h-5 text-purple-400" />
              إضافة تصنيف منتجات جديد للمنظومة
            </h2>
            <p className="text-xs text-slate-400">
              المنظومة غير مقيدة بالعطور أو الإلكترونيات، وتسمح بإضافة أي قطاع سلعي
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اسم التصنيف بالعربية <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatAr}
                  onChange={e => setNewCatAr(e.target.value)}
                  placeholder="مثال: مستلزمات الطاقة الشمسية والتخييم"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Name (English)
                </label>
                <input
                  type="text"
                  value={newCatEn}
                  onChange={e => setNewCatEn(e.target.value)}
                  placeholder="e.g. Solar & Camping Gear"
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  وصف التصنيف
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  placeholder="وصف طبيعة المنتجات المستهدفة وقنوات البيع..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={addingCategory}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
              >
                {addingCategory ? 'جاري الحفظ...' : 'حفظ التصنيف الجديد'}
              </button>
            </form>
          </div>

          {/* Current Categories List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">التصنيفات المعتمدة حالياً ({categories.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-white">{cat.nameAr}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {cat.isCustom ? 'مخصص' : 'نظام'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
