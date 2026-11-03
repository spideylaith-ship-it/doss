import React, { useState } from 'react';
import { SupplierRecord } from '../../types/index.js';
import {
  Building2,
  Plus,
  Star,
  CheckCircle,
  ExternalLink,
  Phone,
  Mail,
  Search,
  Clock,
  Boxes,
  ShieldCheck,
} from 'lucide-react';

interface SupplierIntelligenceViewProps {
  suppliers: SupplierRecord[];
  onAddSupplier: (supplier: Partial<SupplierRecord>) => Promise<void>;
}

export const SupplierIntelligenceView: React.FC<SupplierIntelligenceViewProps> = ({
  suppliers,
  onAddSupplier,
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('الصين');
  const [platform, setPlatform] = useState<SupplierRecord['platform']>('Alibaba');
  const [mainProductsAr, setMainProductsAr] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [moq, setMoq] = useState<number>(200);
  const [typicalLeadTimeDays, setTypicalLeadTimeDays] = useState<number>(14);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = suppliers.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.mainProductsAr.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddSupplier({
        name: name.trim(),
        country: country.trim(),
        platform,
        mainProductsAr: mainProductsAr.trim(),
        contactPerson: contactPerson.trim(),
        contactMethod: contactMethod.trim(),
        moq: Number(moq) || 100,
        typicalLeadTimeDays: Number(typicalLeadTimeDays) || 15,
        rating: 4,
        verifiedStatus: true,
        notes: notes.trim(),
      });
      setName('');
      setMainProductsAr('');
      setContactPerson('');
      setContactMethod('');
      setNotes('');
      setIsAdding(false);
    } catch (err: any) {
      alert(err.message || 'فشل حفظ المورد');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            استخبارات الموردين والمصانع (Supplier Intelligence)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            دليل المصانع المباشرة وشركاء التوريد في الصين (شنتشن، نينغبو، إيوو)، تركيا والإمارات
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          إضافة مورد جديد
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث باسم المورد، بلد المصنع، أو تخصص المنتجات..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(supplier => (
          <div
            key={supplier.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">{supplier.name}</h3>
                  <span className="text-xs text-cyan-400 font-medium block mt-0.5">
                    {supplier.country}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {supplier.rating}.0
                </div>
              </div>

              <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500">التخصص: </span>
                  <strong className="text-white">{supplier.mainProductsAr}</strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">جهة التواصل: </span>
                  {supplier.contactPerson || 'غير محدد'}
                </div>
                <div className="text-slate-300 font-mono text-[11px]" dir="ltr">
                  {supplier.contactMethod}
                </div>
              </div>

              {supplier.notes && (
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {supplier.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Boxes className="w-3.5 h-3.5 text-slate-500" /> MOQ: {supplier.moq} قطعة
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> مدة الإنتاج: {supplier.typicalLeadTimeDays} يوم
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">تسجيل مورد أو مصنع جديد</h3>
            <p className="text-xs text-slate-400 mb-4">
              احفظ تفاصيل الاتصال، الحد الأدنى للطلب (MOQ)، والمنصة
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اسم المصنع أو الشركة الموردة <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: Shenzhen Joyroom Electronics"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    بلد ومقر المصنع
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="الصين (شنتشن)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    منصة التوريد
                  </label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Alibaba">Alibaba</option>
                    <option value="1688">1688 (مباشر محلي صيني)</option>
                    <option value="Direct Factory">مصنع مباشر (Direct)</option>
                    <option value="Trade Fair">معرض تجاري (Canton Fair)</option>
                    <option value="Local">وكيل أو مستورد محلي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  المنتجات الرئيسية
                </label>
                <input
                  type="text"
                  value={mainProductsAr}
                  onChange={e => setMainProductsAr(e.target.value)}
                  placeholder="مثال: شواحن سريعة، كوابل، سماعات بلوتوث"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    المسؤول في المصنع
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Andy Liu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    طريقة التواصل (WeChat / WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={contactMethod}
                    onChange={e => setContactMethod(e.target.value)}
                    placeholder="WeChat ID or WhatsApp"
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الحد الأدنى للطلب (MOQ)
                  </label>
                  <input
                    type="number"
                    value={moq}
                    onChange={e => setMoq(parseInt(e.target.value, 10) || 100)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    مدة الإنتاج التقريبية (أيام)
                  </label>
                  <input
                    type="number"
                    value={typicalLeadTimeDays}
                    onChange={e => setTypicalLeadTimeDays(parseInt(e.target.value, 10) || 14)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ملاحظات وتقييم التعامل
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="ملاحظات حول الأسعار، المرونة في الدفع، وسرعة الرد..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ المورد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
