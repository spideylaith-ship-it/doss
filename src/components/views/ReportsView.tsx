import React from 'react';
import { Product, DashboardMetrics, ProductCategory, TeamMember } from '../../types/index.js';
import {
  FileText,
  Download,
  TrendingUp,
  PieChart,
  BarChart3,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ReportsViewProps {
  metrics: DashboardMetrics | null;
  products: Product[];
  categories: ProductCategory[];
  teamMembers: TeamMember[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  metrics,
  products,
  categories,
  teamMembers,
}) => {
  const exportCsv = () => {
    const headers = ['ID', 'SKU', 'Name_AR', 'Name_EN', 'Category', 'Cost_JOD', 'Price_JOD', 'Margin_Percent', 'Status', 'Supplier', 'Is_Demo'];
    const rows = products.map(p => [
      p.id,
      p.sku,
      `"${p.nameAr.replace(/"/g, '""')}"`,
      `"${(p.nameEn || '').replace(/"/g, '""')}"`,
      `"${(p.categoryNameAr || '').replace(/"/g, '""')}"`,
      p.targetCostJod,
      p.targetSellingPriceJod,
      p.estimatedMarginPercent,
      p.status,
      `"${(p.supplierName || '').replace(/"/g, '""')}"`,
      p.isDemo ? 'DEMO' : 'LIVE',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DOSS_UNIVERSE_Products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DOSS_UNIVERSE_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Category profit breakdown
  const categoryStats = categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const totalPotential = catProducts.reduce((sum, p) => sum + (p.targetSellingPriceJod - p.targetCostJod) * 100, 0);
    return {
      category: cat,
      count: catProducts.length,
      potentialProfitJod: totalPotential,
    };
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            التقارير التحليلية والتجارية (Commercial Reports)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ملخص الأداء المالي، توزيع خطوط المنتجات، وتصدير البيانات لجداول Excel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            تصدير إلى Excel (CSV)
          </button>
          <button
            onClick={exportJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            تصدير نسخة احتياطية (JSON)
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">إجمالي المنتجات المسجلة:</span>
          <p className="text-2xl font-black font-mono text-white mt-1">{products.length}</p>
          <div className="text-[11px] text-slate-500 mt-2">
            {metrics?.realProductsCount ?? 0} فعلي | {metrics?.demoProductsCount ?? 0} تجريبي
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">الربح المتوقع للمنتجات المعتمدة:</span>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {metrics?.potentialProfitJod?.toLocaleString() ?? 0} د.أ
          </p>
          <div className="text-[11px] text-slate-500 mt-2">دفعة أولى 100 قطعة</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">رأس المال التشغيلي المستهدف:</span>
          <p className="text-2xl font-black font-mono text-cyan-300 mt-1">
            {metrics?.totalEstimatedInvestmentJod?.toLocaleString() ?? 0} د.أ
          </p>
          <div className="text-[11px] text-slate-500 mt-2">تكلفة بضائع وشحن وجمارك</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">متوسط هامش الربح الإجمالي:</span>
          <p className="text-2xl font-black font-mono text-purple-400 mt-1">
            %{(products.reduce((acc, p) => acc + p.estimatedMarginPercent, 0) / (products.length || 1)).toFixed(1)}
          </p>
          <div className="text-[11px] text-slate-500 mt-2">نسبة تغطية المخاطر</div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          توزيع المنتجات والربحية حسب التصنيف التجاري
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">التصنيف</th>
                <th className="py-3 px-4">نوع التصنيف</th>
                <th className="py-3 px-4">عدد المنتجات</th>
                <th className="py-3 px-4">الربح المتوقع التقديري (JOD)</th>
                <th className="py-3 px-4">نسبة المساهمة في المنظومة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {categoryStats.map(stat => {
                const percent = products.length > 0 ? ((stat.count / products.length) * 100).toFixed(1) : '0';
                return (
                  <tr key={stat.category.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{stat.category.nameAr}</td>
                    <td className="py-3 px-4 text-slate-400">{stat.category.isCustom ? 'مخصص' : 'قياسي'}</td>
                    <td className="py-3 px-4 font-mono">{stat.count}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {stat.potentialProfitJod.toFixed(2)} د.أ
                    </td>
                    <td className="py-3 px-4 font-mono">%{percent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
