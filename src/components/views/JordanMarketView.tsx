import React, { useState } from 'react';
import { JordanMarketIntelligenceItem } from '../../types/index.js';
import {
  Compass,
  MapPin,
  FileText,
  Building,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface JordanMarketViewProps {
  items: JordanMarketIntelligenceItem[];
}

export const JordanMarketView: React.FC<JordanMarketViewProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = items.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            استخبارات السوق الأردني (Jordan Market Intelligence)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            بيانات تجارية حقيقية حول قطاعات التوزيع في عمان، المحافظات، الجمارك، واللوائح التنظيمية
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'كافة القطاعات' },
            { id: 'customs_tax', label: 'الجمارك والضرائب' },
            { id: 'retail_channel', label: 'عمان والمحلات' },
            { id: 'regional_market', label: 'المحافظات' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedCategory(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === f.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jordan Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">مؤسسة المواصفات والمقاييس (JSMO)</span>
              <h4 className="text-sm font-bold text-white mt-0.5">مطابقة الأجهزة والمعدات</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            كافة المنتجات الكهربائية المستوردة تتطلب فحص مطابقة التردد 50Hz وجهد 220-240V، مع وجود قابس ثلاثي بريطاني (Type G) معتمد لضمان عدم حجز الشحنة.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">المناطق اللوجستية والحرة</span>
              <h4 className="text-sm font-bold text-white mt-0.5">العقبة والمنطقة الحرة الزرقاء</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            الشحن البحري LCL لميناء العقبة هو الخيار الأقل تكلفة لكل كرتونة، مع إمكانية التخزين في المنطقة الحرة بالزرقاء للتأجيل الجمركي والدفع عند التوزيع.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">سلوك المستهلك والتسعير</span>
              <h4 className="text-sm font-bold text-white mt-0.5">نقاط السعر النفسية (15 - 25 د.أ)</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            السوق الأردني يتقبل بسهولة المنتجات المسعرة بين 14.99 و24.99 دينار أردني مع توصيل مجاني داخل عمان (2 دينار) والمحافظات (3 دنانير).
          </p>
        </div>
      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block mb-1.5">
                  {item.governorateOrZone}
                </span>
                <h3 className="text-base font-bold text-white">{item.titleAr}</h3>
                <p className="text-xs text-slate-400 font-mono" dir="ltr">{item.titleEn}</p>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                  item.impactScore === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                أهمية {item.impactScore === 'critical' ? 'قصوى' : 'مرتفعة'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              {item.detailsAr}
            </p>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                الدروس المستفادة والتوصيات التشغيلية:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {item.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
              <span>تاريخ تدقيق المعلومة: {item.updatedAt}</span>
              <span className="text-cyan-400">محدث وموثق محلياً</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
