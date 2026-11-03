import React from 'react';
import { Product } from '../types/index.js';
import { X, ExternalLink, Calendar, Tag, ShieldCheck, UserCheck, DollarSign, Edit3, Trash2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !product) return null;

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">معتمد للشراء النهائي</span>;
      case 'evaluation':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">قيد التقييم والاستكشاف</span>;
      case 'sourcing':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">قيد التفاوض والتوريد</span>;
      case 'testing':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">قيد فحص العينات</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">مرفوض (غير مجدي)</span>;
      default:
        return null;
    }
  };

  const getMemberName = (id: string) => {
    switch (id) {
      case 'laith': return 'ليث (التسويق والمحتوى)';
      case 'yamen': return 'يامن (المالية والتفاوض)';
      case 'ahmad': return 'أحمد (الأبحاث والعمليات)';
      case 'zaid': return 'زيد (المبيعات والتوزيع)';
      default: return id;
    }
  };

  const lc = product.landedCost;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 bg-slate-800 text-cyan-300 border border-slate-700 rounded-md">
              {product.sku}
            </span>
            {product.isDemo ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded font-bold">
                DEMO DATA / بيانات تجريبية
              </span>
            ) : (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded font-bold">
                LIVE DATA / بيانات فعلية محفوظة
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
              title="تعديل المنتج"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`هل أنت متأكد من رغبتك في حذف المنتج: "${product.nameAr}"؟`)) {
                  onDelete(product.id);
                  onClose();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="حذف المنتج"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">{product.nameAr}</h2>
            {product.nameEn && <p className="text-sm text-slate-400 font-mono mt-0.5" dir="ltr">{product.nameEn}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {getStatusBadge(product.status)}
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                {product.categoryNameAr || 'عام'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                المسؤول: {getMemberName(product.assignedTeamMemberId)}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                تاريخ التسجيل: {new Date(product.createdAt).toLocaleDateString('ar-JO')}
              </span>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400">التكلفة الواصلة المستهدفة:</span>
              <p className="text-lg font-bold font-mono text-white mt-0.5">{product.targetCostJod.toFixed(2)} د.أ</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">سعر البيع المقترح:</span>
              <p className="text-lg font-bold font-mono text-cyan-300 mt-0.5">{product.targetSellingPriceJod.toFixed(2)} د.أ</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">هامش الربح المتوقع:</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                +{((product.targetSellingPriceJod - product.targetCostJod)).toFixed(2)} د.أ (%{product.estimatedMarginPercent})
              </p>
            </div>
          </div>

          {/* Detailed Jordan Landed Cost Breakdown if available */}
          {lc && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                تفاصيل التكلفة الواصلة للأردن (Landed Cost Structure)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">سعر الشراء الأولي:</span>
                  <p className="font-mono font-semibold text-white mt-1">${lc.purchasePrice} ({lc.basePriceJod} د.أ)</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">الشحن الدولي للقطعة:</span>
                  <p className="font-mono font-semibold text-white mt-1">{lc.shippingPerUnitJod} د.أ</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">الجمارك الأردنية ({lc.customsDutyPercent}%):</span>
                  <p className="font-mono font-semibold text-amber-300 mt-1">{lc.customsDutyJod} د.أ</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">ضريبة المبيعات ({lc.salesTaxPercent}%):</span>
                  <p className="font-mono font-semibold text-amber-300 mt-1">{lc.salesTaxJod} د.أ</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>تخليص ومناولة: {lc.clearancePerUnitJod} د.أ | نقل داخلي: {lc.inlandTransportPerUnitJod} د.أ</span>
                <span className="text-emerald-400 font-bold">العائد على الاستثمار ROI: %{lc.roiPercent}</span>
              </div>
            </div>
          )}

          {/* Sourcing and Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400">المورد / المصنع:</span>
              <p className="font-medium text-white mt-0.5">{product.supplierName || 'غير محدد'}</p>
              <p className="text-xs text-slate-500 mt-0.5">بلد المنشأ: {product.supplierCountry || 'الصين'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">رابط المصدر:</span>
              {product.sourceUrl ? (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline text-xs mt-1 truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {product.sourceUrl}
                </a>
              ) : (
                <p className="text-xs text-slate-500 mt-1">لا يوجد رابط مسجل</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {product.notes && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">الملاحظات وأبحاث السوق:</span>
              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{product.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
