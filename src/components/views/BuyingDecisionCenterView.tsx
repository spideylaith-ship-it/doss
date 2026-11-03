import React, { useState } from 'react';
import { BuyingDecision, Product, TeamMember } from '../../types/index.js';
import {
  FileCheck2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSignature,
  DollarSign,
  Package,
} from 'lucide-react';

interface BuyingDecisionCenterViewProps {
  decisions: BuyingDecision[];
  products: Product[];
  teamMembers: TeamMember[];
  onToggleSignoff: (decisionId: string, memberId: 'yamen' | 'ahmad' | 'zaid' | 'laith', approved: boolean) => Promise<void>;
  onCreateDecision: (decision: Partial<BuyingDecision>) => Promise<void>;
}

export const BuyingDecisionCenterView: React.FC<BuyingDecisionCenterViewProps> = ({
  decisions,
  products,
  teamMembers,
  onToggleSignoff,
  onCreateDecision,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [targetQuantity, setTargetQuantity] = useState<number>(300);
  const [budgetJod, setBudgetJod] = useState<number>(2500);
  const [rationale, setRationale] = useState('');
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | 'revise'>('approve');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const prod = products.find(p => p.id === selectedProductId);
    setIsSubmitting(true);
    try {
      await onCreateDecision({
        productId: selectedProductId,
        productName: prod ? prod.nameAr : 'منتج تجاري',
        decision: decisionType,
        targetPurchaseQuantity: targetQuantity,
        totalEstimatedBudgetJod: budgetJod,
        rationale: rationale.trim(),
      });
      setIsAdding(false);
      setRationale('');
    } catch (err: any) {
      alert(err.message || 'فشل حفظ قرار الشراء');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-cyan-400" />
            مركز قرارات الشراء والتوقيعات الرباعية (Buying Decision Center)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            صندوق اعتماد أوامر الشراء الرسمية (Purchase Orders) بتوافق أعضاء الفريق الأربعة
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          طرح مقترح شراء جديد
        </button>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map(decision => {
          const allSigned =
            decision.signoffs.yamen &&
            decision.signoffs.ahmad &&
            decision.signoffs.zaid &&
            decision.signoffs.laith;

          return (
            <div
              key={decision.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 transition ${
                allSigned
                  ? 'border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{decision.productName}</h3>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        allSigned
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {allSigned ? 'جاهز لإصدار أمر الشراء PO' : 'بانتظار اكتمال التوقيعات'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Package className="w-3.5 h-3.5 text-cyan-400" />
                      الدفعة المستهدفة: {decision.targetPurchaseQuantity} قطعة
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      الميزانية المقدرة: {decision.totalEstimatedBudgetJod} د.أ
                    </span>
                    <span>تاريخ الطرح: {decision.date}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  حالة التوافق: <strong className="text-white font-mono">{Object.values(decision.signoffs).filter(Boolean).length} / 4</strong>
                </div>
              </div>

              {/* Rationale */}
              {decision.rationale && (
                <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                  {decision.rationale}
                </p>
              )}

              {/* 4 Signoff Buttons */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  توقيعات وموافقات فريق العمل (انقر لتبديل التوقيع):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['yamen', 'ahmad', 'zaid', 'laith'] as const).map(memberId => {
                    const signed = decision.signoffs[memberId];
                    const member = getMember(memberId);

                    return (
                      <button
                        key={memberId}
                        onClick={() => onToggleSignoff(decision.id, memberId, !signed)}
                        className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
                          signed
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block text-white">
                            {member?.nameAr || memberId}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {memberId === 'yamen' && 'اعتماد المالية والمورد'}
                            {memberId === 'ahmad' && 'اعتماد الشحن والجمارك'}
                            {memberId === 'zaid' && 'اعتماد طلب المحلات'}
                            {memberId === 'laith' && 'اعتماد الإعلان والتسويق'}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            signed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {signed ? '✓' : '○'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Decision Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">طرح قرار شراء للاعتماد الجماعي</h3>
            <p className="text-xs text-slate-400 mb-4">
              أدخل تفاصيل الدفعة المستهدفة والميزانية المرصودة للموافقة
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اختر المنتج <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nameAr} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الكمية المستهدفة (قطعة)
                  </label>
                  <input
                    type="number"
                    value={targetQuantity}
                    onChange={e => setTargetQuantity(parseInt(e.target.value, 10) || 100)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الميزانية الإجمالية التقديرية (JOD)
                  </label>
                  <input
                    type="number"
                    value={budgetJod}
                    onChange={e => setBudgetJod(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  مبررات قرار الشراء واستراتيجية البيع
                </label>
                <textarea
                  rows={3}
                  value={rationale}
                  onChange={e => setRationale(e.target.value)}
                  placeholder="سجل أسباب الثقة بالمنتج، هوامش الربح المتوقعة، ونتائج اختبار العينات..."
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
                  {isSubmitting ? 'جاري الطرح...' : 'طرح القرار للتوقيعات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
