import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ProductStatus, TeamMember } from '../../types/index.js';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';

interface ProductManagementViewProps {
  products: Product[];
  categories: ProductCategory[];
  teamMembers: TeamMember[];
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onOpenDetailModal: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onRefresh: () => void;
  onAddCategory: (category: { nameAr: string; nameEn?: string; descriptionAr?: string }) => Promise<ProductCategory>;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  products,
  categories,
  teamMembers,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onDeleteProduct,
  onRefresh,
  onAddCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDataType, setSelectedDataType] = useState<string>('all'); // all | live | demo
  const [sortBy, setSortBy] = useState<'date' | 'margin' | 'cost' | 'price'>('date');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchSupplier = p.supplierName?.toLowerCase().includes(q);
          const matchNotes = p.notes?.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchSupplier && !matchNotes) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && p.status !== selectedStatus) {
          return false;
        }

        // Data type filter (Real vs Demo)
        if (selectedDataType === 'live' && p.isDemo) return false;
        if (selectedDataType === 'demo' && !p.isDemo) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'margin') return b.estimatedMarginPercent - a.estimatedMarginPercent;
        if (sortBy === 'cost') return b.targetCostJod - a.targetCostJod;
        if (sortBy === 'price') return b.targetSellingPriceJod - a.targetSellingPriceJod;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedDataType, sortBy]);

  const handleDelete = async (p: Product) => {
    const confirmText = p.isDemo
      ? `هل تريد حذف هذا السجل التجريبي "${p.nameAr}"؟`
      : `تحذير: هل أنت متأكد من حذف المنتج الفعلي "${p.nameAr}" من قاعدة البيانات بشكل نهائي؟`;

    if (window.confirm(confirmText)) {
      setDeletingId(p.id);
      try {
        await onDeleteProduct(p.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameAr.trim()) return;
    setCatSaving(true);
    try {
      await onAddCategory({
        nameAr: newCatNameAr.trim(),
        nameEn: newCatNameEn.trim(),
      });
      setNewCatNameAr('');
      setNewCatNameEn('');
      setShowCategoryModal(false);
    } catch (err: any) {
      alert(err.message || 'فشل إضافة التصنيف');
    } finally {
      setCatSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            إدارة المنتجات وفرص التوريد
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredProducts.length} منتج
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل وحفظ المنتجات في قاعدة البيانات الدائمة، مع ربطها بهيكل التكلفة الواصلة للأردن
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            إضافة تصنيف جديد
          </button>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition"
            title="تحديث البيانات من الخادم"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم العربي، الإنجليزي، SKU، المورد، أو الملاحظات..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">كافة التصنيفات ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">كافة الحالات</option>
              <option value="evaluation">قيد التقييم والاستكشاف</option>
              <option value="testing">قيد فحص العينات</option>
              <option value="sourcing">قيد التفاوض والتوريد</option>
              <option value="approved">معتمد للشراء النهائي</option>
              <option value="rejected">مرفوض (غير مجدي)</option>
            </select>
          </div>

          {/* Real vs Demo filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDataType}
              onChange={e => setSelectedDataType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">كل السجلات (فعلي + تجريبي)</option>
              <option value="live">السجلات الفعلية فقط (Live)</option>
              <option value="demo">البيانات التجريبية فقط (Demo)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-1">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="date">الأحدث</option>
              <option value="margin">أعلى هامش</option>
              <option value="price">أعلى سعر</option>
              <option value="cost">أعلى تكلفة</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Summary */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span>النتائج المعروضة: <strong className="text-white">{filteredProducts.length}</strong> من أصل {products.length}</span>
            {selectedDataType !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                فلتر: {selectedDataType === 'live' ? 'سجلات فعلية فقط' : 'بيانات تجريبية فقط'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>LIVE DATA = مخزن في قاعدة البيانات الدائمة على الخادم</span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد منتجات مطابقة للبحث أو الفلتر</h3>
            <p className="text-xs text-slate-400">
              جرب تغيير معايير البحث أو قم بإضافة أول منتج تجاري جديد إلى المنظومة
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              إضافة منتج الآن
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">نوع البيانات</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">اسم المنتج</th>
                  <th className="py-3.5 px-4">التصنيف</th>
                  <th className="py-3.5 px-4">المورد والمنشأ</th>
                  <th className="py-3.5 px-4">التكلفة (JOD)</th>
                  <th className="py-3.5 px-4">البيع المقترح (JOD)</th>
                  <th className="py-3.5 px-4">هامش الربح</th>
                  <th className="py-3.5 px-4">المسؤول</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map(product => {
                  const assignee = getMember(product.assignedTeamMemberId);
                  const isDeleting = deletingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      <td className="py-3.5 px-4">
                        {product.isDemo ? (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-bold">
                            DEMO
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-bold">
                            LIVE
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-cyan-300 text-[11px]">
                        {product.sku}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div
                          onClick={() => onOpenDetailModal(product)}
                          className="font-bold text-white hover:text-cyan-400 cursor-pointer transition"
                        >
                          {product.nameAr}
                        </div>
                        {product.nameEn && (
                          <div className="text-[10px] text-slate-400 font-mono truncate" dir="ltr">
                            {product.nameEn}
                          </div>
                        )}
                        {product.sourceUrl && (
                          <a
                            href={product.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyan-400 mt-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> المصدر
                          </a>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {product.categoryNameAr || 'عام'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{product.supplierName || 'غير محدد'}</div>
                        <div className="text-[10px] text-slate-500">{product.supplierCountry || 'الصين'}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-200 font-semibold">
                        {product.targetCostJod.toFixed(2)} د.أ
                      </td>

                      <td className="py-3.5 px-4 font-mono text-cyan-300 font-bold">
                        {product.targetSellingPriceJod.toFixed(2)} د.أ
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-400">
                          %{product.estimatedMarginPercent}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          +{(product.targetSellingPriceJod - product.targetCostJod).toFixed(2)} د.أ
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-slate-300 font-medium">
                          {assignee?.nameAr || product.assignedTeamMemberId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {product.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            معتمد للشراء
                          </span>
                        )}
                        {product.status === 'evaluation' && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            قيد التقييم
                          </span>
                        )}
                        {product.status === 'sourcing' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            قيد التوريد
                          </span>
                        )}
                        {product.status === 'testing' && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                            فحص عينة
                          </span>
                        )}
                        {product.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                            مرفوض
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenDetailModal(product)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                            title="عرض التفاصيل والهيكل المالي"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                            title="تعديل المنتج"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={isDeleting}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition disabled:opacity-40"
                            title="حذف المنتج من النظام"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">إضافة تصنيف منتجات جديد</h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنك تصنيف أي نوع من المنتجات دون حصر (ملابس، ديكور، صناعي، إلخ)
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اسم التصنيف بالعربية <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatNameAr}
                  onChange={e => setNewCatNameAr(e.target.value)}
                  placeholder="مثال: مستلزمات المزارع والحدائق"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الاسم بالإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  value={newCatNameEn}
                  onChange={e => setNewCatNameEn(e.target.value)}
                  placeholder="e.g. Garden & Outdoor"
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 text-left"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={catSaving}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition"
                >
                  {catSaving ? 'جاري الحفظ...' : 'حفظ التصنيف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
