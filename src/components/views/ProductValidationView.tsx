import React from 'react';
import { Product } from '../../types/index.js';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Boxes,
  Cpu,
  FileCheck,
} from 'lucide-react';

interface ProductValidationViewProps {
  products: Product[];
  onUpdateProductStatus: (id: string, updates: Partial<Product>) => Promise<void>;
  onOpenDetailModal: (product: Product) => void;
}

export const ProductValidationView: React.FC<ProductValidationViewProps> = ({
  products,
  onUpdateProductStatus,
  onOpenDetailModal,
}) => {
  const handleSampleStatusChange = async (product: Product, sampleStatus: Product['sampleStatus']) => {
    let newProductStatus: Product['status'] = product.status;
    if (sampleStatus === 'tested_passed') {
      newProductStatus = 'approved';
    } else if (sampleStatus === 'tested_failed') {
      newProductStatus = 'rejected';
    } else if (sampleStatus === 'ordered' || sampleStatus === 'received') {
      newProductStatus = 'testing';
    }

    await onUpdateProductStatus(product.id, {
      sampleStatus,
      status: newProductStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          مركز فحص وتأهيل المنتجات (Product Validation & Testing)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          منظومة التحقق الفني والمطابقة الميدانية وفحص العينات التجريبية قبل صرف ميزانيات الاستيراد
        </p>
      </div>

      {/* Validation Checklist Protocol */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          معايير فحص العينات الإلزامية في الأردن (5-Point Protocol)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">1. التوافق الكهربائي 220V</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              فحص التردد 50Hz والقابس الثلاثي البريطاني Type G لضمان إجازة المواصفات والمقاييس.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">2. متانة الخامات وجودة التقفيل</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              فحص البلاستيك، الألمنيوم، المفصلات، وقوة المغناطيس لتقليل نسبة المرتجعات.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-purple-400 block">3. جودة علبة التغليف (Packaging)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              تصميم كرتون أنيق يتحمل الشحن والتخزين ومناسب للعرض على رفوف محلات التجزئة.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block">4. القبول الميداني للمحلات</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              عرض العينة الأولية على 3 إلى 5 محلات في الصويفية أو الجاردنز للتأكد من رغبتهم بشرائها.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400 block">5. حماية حقوق الملكية والماركات</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              التأكد من عدم وجود شعارات مقلدة (Anti-Counterfeit) لتجنب المصادرة الجمركية في العقبة.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Products List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center justify-between">
          <span>حالة فحص العينات لمنتجات المنظومة ({products.length})</span>
          <span className="text-xs font-normal text-slate-400">
            يمكنك تغيير حالة العينة مباشرة بنقرة واحدة
          </span>
        </h2>

        <div className="space-y-4">
          {products.map(product => {
            const currentSample = product.sampleStatus || 'not_ordered';

            return (
              <div
                key={product.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{product.nameAr}</span>
                    <span className="font-mono text-xs text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {product.sku}
                    </span>
                    {product.isDemo && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        DEMO
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>التصنيف: <strong className="text-slate-300">{product.categoryNameAr || 'عام'}</strong></span>
                    <span>التكلفة: <strong className="text-slate-300 font-mono">{product.targetCostJod.toFixed(2)} د.أ</strong></span>
                    <span>البيع: <strong className="text-cyan-300 font-mono">{product.targetSellingPriceJod.toFixed(2)} د.أ</strong></span>
                    <span>الهامش: <strong className="text-emerald-400 font-mono">%{product.estimatedMarginPercent}</strong></span>
                  </div>
                  {product.notes && (
                    <p className="text-xs text-slate-400 line-clamp-1">{product.notes}</p>
                  )}
                </div>

                {/* Sample Stage Selector */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 ml-1">حالة العينة:</span>
                  {[
                    { id: 'not_ordered', label: 'لم تُطلب', color: 'slate' },
                    { id: 'ordered', label: 'طُلبت للشحن', color: 'blue' },
                    { id: 'received', label: 'وصلت عمان', color: 'purple' },
                    { id: 'tested_passed', label: 'اجتازت الفحص ✓', color: 'emerald' },
                    { id: 'tested_failed', label: 'فشلت ✗', color: 'rose' },
                  ].map(stage => {
                    const isActive = currentSample === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleSampleStatusChange(product, stage.id as any)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                          isActive
                            ? stage.color === 'emerald'
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : stage.color === 'rose'
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                              : stage.color === 'purple'
                              ? 'bg-purple-600 text-white'
                              : stage.color === 'blue'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {stage.label}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => onOpenDetailModal(product)}
                    className="p-1.5 text-xs text-cyan-400 hover:bg-slate-800 rounded transition ml-1"
                  >
                    عرض الملف
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
