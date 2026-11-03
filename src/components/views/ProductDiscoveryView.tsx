import React, { useState } from 'react';
import { Product, ProductCategory, TeamMember } from '../../types/index.js';
import {
  Compass,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ProductDiscoveryViewProps {
  products: Product[];
  categories: ProductCategory[];
  teamMembers: TeamMember[];
  onOpenAddModal: () => void;
  onOpenDetailModal: (product: Product) => void;
  onNavigateToCalculator: () => void;
}

export const ProductDiscoveryView: React.FC<ProductDiscoveryViewProps> = ({
  products,
  categories,
  teamMembers,
  onOpenAddModal,
  onOpenDetailModal,
  onNavigateToCalculator,
}) => {
  const [filterStage, setFilterStage] = useState<'all' | 'high_margin' | 'urgent'>('all');

  // Candidate opportunities
  const discoveryCandidates = products.filter(p => {
    if (filterStage === 'high_margin') return p.estimatedMarginPercent >= 55;
    if (filterStage === 'urgent') return p.priority === 'urgent';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            استكشاف المنتجات والفرص التجارية (Product Discovery)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            منظومة استكشاف الفرص الاستيرادية وتصفية المنتجات ذات الطلب العالي والهوامش المرتفعة في الأردن
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToCalculator}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            حاسبة التكلفة الواصلة
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            إضافة فكرة منتج جديد
          </button>
        </div>
      </div>

      {/* Discovery Methodology & Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">معيار القبول التجاري</span>
              <h4 className="text-sm font-bold text-white mt-0.5">هامش ربح إجمالي {'>'} 50%</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            لحماية الشركة من تكاليف الإعلانات والجمارك المرتفعة، نشترط ألا يقل الفرق بين التكلفة الواصلة وسعر البيع عن 50%.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">عوامل الجاذبية البصرية</span>
              <h4 className="text-sm font-bold text-white mt-0.5">حل مشكلة واضحة بالفيديو</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            دور ليث في تقييم مدى سهولة إظهار مفعول المنتج خلال أول 3 ثوانٍ في فيديو قصير لتسهيل بيعه للمحلات والمستهلكين.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">صغر الحجم وخفة الوزن</span>
              <h4 className="text-sm font-bold text-white mt-0.5">توفير تكاليف الشحن الدولي</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            المنتجات الخفيفة والمدمجة تقلل تكلفة الشحن البحري والجوي للقطعة الواحدة، مما يعزز العائد على الاستثمار (ROI).
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStage('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterStage === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            كافة الفرص المكتشفة ({products.length})
          </button>
          <button
            onClick={() => setFilterStage('high_margin')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterStage === 'high_margin'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            هوامش استثنائية (55% فأعلى)
          </button>
          <button
            onClick={() => setFilterStage('urgent')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterStage === 'urgent'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            فرص ذات أولوية عاجلة
          </button>
        </div>
      </div>

      {/* Discovery Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discoveryCandidates.map(product => (
          <div
            key={product.id}
            onClick={() => onOpenDetailModal(product)}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl cursor-pointer transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[11px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {product.sku}
                </span>
                {product.isDemo ? (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-500/30">
                    DEMO
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    LIVE
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition mt-2">
                {product.nameAr}
              </h3>
              {product.nameEn && (
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate" dir="ltr">
                  {product.nameEn}
                </p>
              )}

              {/* Financial Box */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 mt-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block font-sans">التكلفة الواصلة:</span>
                  <span className="font-bold text-slate-200">{product.targetCostJod.toFixed(2)} د.أ</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-sans">سعر البيع المقترح:</span>
                  <span className="font-bold text-cyan-300">{product.targetSellingPriceJod.toFixed(2)} د.أ</span>
                </div>
              </div>

              {/* Margin & Sourcing */}
              <div className="flex items-center justify-between text-xs mt-3">
                <span className="text-slate-400">هامش الربح المتوقع:</span>
                <span className="font-mono font-black text-emerald-400">
                  %{product.estimatedMarginPercent} (+{(product.targetSellingPriceJod - product.targetCostJod).toFixed(2)} د.أ)
                </span>
              </div>

              {product.notes && (
                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed bg-slate-950/40 p-2 rounded">
                  {product.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>المورد: <strong className="text-slate-300">{product.supplierName || 'الصين'}</strong></span>
              <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-1">
                عرض الدراسة كاملة <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
