import React from 'react';
import {
  DashboardMetrics,
  Product,
  TeamTask,
  BuyingDecision,
  JordanMarketIntelligenceItem,
  TeamMember,
} from '../../types/index.js';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileCheck2,
  Users,
  Compass,
  ArrowUpRight,
  Plus,
  Calculator,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  products: Product[];
  tasks: TeamTask[];
  decisions: BuyingDecision[];
  marketItems: JordanMarketIntelligenceItem[];
  teamMembers: TeamMember[];
  onNavigate: (section: string) => void;
  onOpenAddProduct: () => void;
  onOpenProductDetail: (product: Product) => void;
  onToggleDecisionSignoff: (decisionId: string, memberId: any, approved: boolean) => void;
  onToggleTaskStatus: (taskId: string, currentStatus: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  products,
  tasks,
  decisions,
  marketItems,
  teamMembers,
  onNavigate,
  onOpenAddProduct,
  onOpenProductDetail,
  onToggleDecisionSignoff,
  onToggleTaskStatus,
}) => {
  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-wide">
                لوحة القيادة والاستخبارات التجارية — DOSS UNIVERSE
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                الأردن — عمان
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              منظومة متكاملة لاكتشاف فرص المنتجات، تدقيق التكلفة الواصلة في الأردن (جمارك 20%، ضريبة مبيعات 16%)، وتنسيق قرارات الشراء لفريق العمل.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              إضافة فرصة منتج جديد
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              حاسبة التكلفة الواصلة
            </button>
          </div>
        </div>

        {/* Clear Data Distinction Notice */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">حالة سجلات البيانات:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {metrics?.realProductsCount ?? 0} منتج فعلي محفوظ دائم
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              {metrics?.demoProductsCount ?? 0} بيانات تجريبية (DEMO DATA)
            </span>
          </div>
          <span className="text-slate-400">
            قاعدة البيانات متصلة بالخادم المحلي وتدعم التحديث الفوري
          </span>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">إجمالي المنتجات المسجلة</span>
            <div className="p-2.5 bg-slate-800 group-hover:bg-cyan-500/20 text-cyan-400 rounded-xl transition">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-mono">{metrics?.totalProducts ?? 0}</span>
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              عرض المنتجات <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            تشمل كافة فرص التوريد قيد الدراسة والمعتمدة
          </p>
        </div>

        {/* Under Evaluation */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">منتجات قيد التقييم والاستكشاف</span>
            <div className="p-2.5 bg-slate-800 group-hover:bg-cyan-500/20 text-cyan-400 rounded-xl transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-cyan-300 font-mono">
              {metrics?.productsUnderEvaluation ?? 0}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
              نشطة حالياً
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            تخضع لدراسة الأسعار وطلب العينات
          </p>
        </div>

        {/* Approved Products */}
        <div
          onClick={() => onNavigate('buying_center')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">منتجات معتمدة للشراء</span>
            <div className="p-2.5 bg-slate-800 group-hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {metrics?.approvedProducts ?? 0}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
              جاهزة لأمر الشراء PO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            تمت الموافقة عليها بعد التأكد من الهوامش
          </p>
        </div>

        {/* Products Rejected */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-5 rounded-2xl shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">منتجات مستبعدة (مرفوضة)</span>
            <div className="p-2.5 bg-slate-800 group-hover:bg-rose-500/20 text-rose-400 rounded-xl transition">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-400 font-mono">
              {metrics?.rejectedProducts ?? 0}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
              حماية لرأس المال
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            رفضت بسبب حرق الأسعار أو ضعف الجودة
          </p>
        </div>
      </div>

      {/* Financial Potential & Commercial Horizon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              الربح الإجمالي المتوقع (دفعات أولى)
            </h3>
            <span className="text-xs text-slate-400 font-mono">JOD</span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black text-emerald-400 font-mono tracking-tight">
              {metrics?.potentialProfitJod?.toLocaleString() ?? 0} د.أ
            </span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              محسوب على أساس التوريد الأولي للمنتجات المعتمدة (متوسط دفعة تجريبية 100 قطعة لكل منتج معتمد) بعد خصم كافة الرسوم والجمارك الأردنية.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>رأس المال التشغيلي المقدر:</span>
              <span className="font-mono font-bold text-white">
                {metrics?.totalEstimatedInvestmentJod?.toLocaleString() ?? 0} د.أ
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>معدل هامش الربح المستهدف:</span>
              <span className="font-mono font-bold text-emerald-400">55% - 62%</span>
            </div>
          </div>
        </div>

        {/* Buying Decisions Status */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              مركز قرارات الشراء والتوقيعات الجماعية للفريق
            </h3>
            <button
              onClick={() => onNavigate('buying_center')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              عرض الكل <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {decisions.slice(0, 3).map(dec => (
              <div
                key={dec.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{dec.productName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        dec.status === 'ready_for_po'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {dec.status === 'ready_for_po' ? 'جاهز لأمر الشراء' : 'بانتظار توقيعات'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{dec.rationale}</p>
                  <p className="text-xs text-cyan-400 font-mono">
                    الكمية: {dec.targetPurchaseQuantity} قطعة | الميزانية المقدرة: {dec.totalEstimatedBudgetJod} د.أ
                  </p>
                </div>

                {/* Team Signoff Matrix */}
                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400 ml-1">التوقيعات:</span>
                  {(['yamen', 'ahmad', 'zaid', 'laith'] as const).map(memberId => {
                    const signed = dec.signoffs[memberId];
                    const member = getMember(memberId);
                    return (
                      <button
                        key={memberId}
                        onClick={() => onToggleDecisionSignoff(dec.id, memberId, !signed)}
                        title={`انقر لتعديل توقيع: ${member?.nameAr || memberId}`}
                        className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 transition ${
                          signed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {signed ? '✓' : '○'} {member?.nameAr || memberId}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Tasks and Jordan Market Intelligence Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Tasks Activity */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              أحدث مهام ونشاطات فريق العمل
            </h3>
            <button
              onClick={() => onNavigate('team')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              إدارة الفريق <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 4).map(task => {
              const assignee = getMember(task.assignedTo);
              return (
                <div
                  key={task.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{task.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {task.priority === 'urgent' ? 'عاجل' : 'عادي'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>المسؤول: <strong className="text-slate-300">{assignee?.nameAr || task.assignedTo}</strong></span>
                      <span>تاريخ الإنجاز: {task.dueDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleTaskStatus(task.id, task.status)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold shrink-0 transition ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {task.status === 'completed' ? 'منجزة ✓' : task.status === 'in_progress' ? 'قيد التنفيذ' : 'معلقة'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Market Research Activity */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              آخر استخبارات السوق الأردني (جمارك، مناطق، أسعار)
            </h3>
            <button
              onClick={() => onNavigate('jordan_market')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              قاعدة البيانات <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {marketItems.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.titleAr}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                    {item.governorateOrZone}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.summaryAr}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      • {takeaway}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products Pipeline */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">خط أنابيب المنتجات المسجلة حديثاً</h3>
            <p className="text-xs text-slate-400">
              انقر على أي منتج للاطلاع على هيكل التكلفة وهوامش الربح
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            إدارة كل المنتجات <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">نوع السجل</th>
                <th className="py-3 px-4">اسم المنتج</th>
                <th className="py-3 px-4">التصنيف</th>
                <th className="py-3 px-4">المسؤول</th>
                <th className="py-3 px-4">التكلفة (JOD)</th>
                <th className="py-3 px-4">البيع المقترح (JOD)</th>
                <th className="py-3 px-4">الهامش %</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.slice(0, 5).map(prod => (
                <tr
                  key={prod.id}
                  onClick={() => onOpenProductDetail(prod)}
                  className="hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="py-3 px-4">
                    {prod.isDemo ? (
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-500/30">
                        DEMO
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                        LIVE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {prod.nameAr}
                    {prod.nameEn && <span className="block text-[10px] text-slate-400 font-normal font-mono" dir="ltr">{prod.nameEn}</span>}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{prod.categoryNameAr || 'عام'}</td>
                  <td className="py-3 px-4 text-slate-300">{getMember(prod.assignedTeamMemberId)?.nameAr || prod.assignedTeamMemberId}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{prod.targetCostJod.toFixed(2)} د.أ</td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{prod.targetSellingPriceJod.toFixed(2)} د.أ</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">%{prod.estimatedMarginPercent}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] text-slate-300 font-medium">
                      {prod.status === 'approved' && 'معتمد للشراء'}
                      {prod.status === 'evaluation' && 'قيد التقييم'}
                      {prod.status === 'sourcing' && 'قيد التوريد'}
                      {prod.status === 'testing' && 'قيد الفحص'}
                      {prod.status === 'rejected' && 'مرفوض'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProductDetail(prod);
                      }}
                      className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition"
                    >
                      تفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
