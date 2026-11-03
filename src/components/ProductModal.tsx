import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, TeamMemberId, PriorityLevel, ProductStatus } from '../types/index.js';
import { validateProductInput } from '../utils/costCalculations.js';
import { X, Plus, AlertCircle, Sparkles, Check, DollarSign } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  productToEdit?: Product | null;
  categories: ProductCategory[];
  onAddCategory: (category: { nameAr: string; nameEn?: string; descriptionAr?: string }) => Promise<ProductCategory>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
  onAddCategory,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<ProductStatus>('evaluation');
  const [targetCostJod, setTargetCostJod] = useState<number | ''>('');
  const [targetSellingPriceJod, setTargetSellingPriceJod] = useState<number | ''>('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierCountry, setSupplierCountry] = useState('الصين');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [assignedTeamMemberId, setAssignedTeamMemberId] = useState<TeamMemberId>('yamen');
  const [sampleStatus, setSampleStatus] = useState<Product['sampleStatus']>('not_ordered');

  // New category creation state
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryNameAr, setNewCategoryNameAr] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setNameAr(productToEdit.nameAr || '');
      setNameEn(productToEdit.nameEn || '');
      setSku(productToEdit.sku || '');
      setCategoryId(productToEdit.categoryId || (categories[0]?.id ?? ''));
      setStatus(productToEdit.status || 'evaluation');
      setTargetCostJod(productToEdit.targetCostJod ?? '');
      setTargetSellingPriceJod(productToEdit.targetSellingPriceJod ?? '');
      setSupplierName(productToEdit.supplierName || '');
      setSupplierCountry(productToEdit.supplierCountry || 'الصين');
      setSourceUrl(productToEdit.sourceUrl || '');
      setNotes(productToEdit.notes || '');
      setPriority(productToEdit.priority || 'normal');
      setAssignedTeamMemberId(productToEdit.assignedTeamMemberId || 'yamen');
      setSampleStatus(productToEdit.sampleStatus || 'not_ordered');
    } else {
      setNameAr('');
      setNameEn('');
      setSku(`DOSS-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategoryId(categories[0]?.id || '');
      setStatus('evaluation');
      setTargetCostJod('');
      setTargetSellingPriceJod('');
      setSupplierName('');
      setSupplierCountry('الصين');
      setSourceUrl('');
      setNotes('');
      setPriority('normal');
      setAssignedTeamMemberId('yamen');
      setSampleStatus('not_ordered');
    }
    setErrors({});
    setIsAddingNewCategory(false);
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const costNum = Number(targetCostJod) || 0;
  const sellingNum = Number(targetSellingPriceJod) || 0;
  const profitNum = sellingNum - costNum;
  const marginPercent = sellingNum > 0 ? ((profitNum / sellingNum) * 100).toFixed(1) : '0';

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryNameAr.trim()) {
      alert('يرجى كتابة اسم التصنيف بالعربية');
      return;
    }
    setCategorySubmitting(true);
    try {
      const created = await onAddCategory({
        nameAr: newCategoryNameAr.trim(),
        nameEn: newCategoryNameEn.trim(),
        descriptionAr: newCategoryDesc.trim(),
      });
      setCategoryId(created.id);
      setIsAddingNewCategory(false);
      setNewCategoryNameAr('');
      setNewCategoryNameEn('');
      setNewCategoryDesc('');
    } catch (err: any) {
      alert(err.message || 'فشل إضافة التصنيف');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateProductInput({
      nameAr,
      nameEn,
      categoryId,
      targetCostJod: costNum,
      targetSellingPriceJod: sellingNum,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const selectedCategory = categories.find(c => c.id === categoryId);
      await onSave({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        sku: sku.trim() || `DOSS-${Date.now().toString().slice(-4)}`,
        categoryId,
        categoryNameAr: selectedCategory?.nameAr || 'عام',
        status,
        targetCostJod: costNum,
        targetSellingPriceJod: sellingNum,
        estimatedMarginPercent: Number(marginPercent),
        supplierName: supplierName.trim() || 'قيد البحث',
        supplierCountry: supplierCountry.trim() || 'الصين',
        sourceUrl: sourceUrl.trim(),
        notes: notes.trim(),
        priority,
        assignedTeamMemberId,
        sampleStatus,
      });
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'حدث خطأ أثناء حفظ المنتج' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة فرصة منتج جديد'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              سيتم حفظ المنتج بشكل دائم في قاعدة بيانات النظام على الخادم
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {errors.form && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.form}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                اسم المنتج بالعربية <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={e => setNameAr(e.target.value)}
                placeholder="مثال: شاحن لاسلكي مغناطيسي 3 في 1"
                className={`w-full bg-slate-950 border ${
                  errors.nameAr ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                } rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500`}
              />
              {errors.nameAr && <p className="text-xs text-rose-400 mt-1">{errors.nameAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                الاسم بالإنجليزية (اختياري)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="e.g. 3-in-1 Magnetic Wireless Charger"
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-left"
              />
            </div>
          </div>

          {/* SKU and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                رمز التتبع / SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-300">
                  التصنيف <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingNewCategory ? 'إلغاء' : 'إضافة تصنيف جديد'}
                </button>
              </div>

              {!isAddingNewCategory ? (
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr} {cat.isCustom ? '(مخصص)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-950 border border-cyan-500/40 rounded-lg space-y-2">
                  <p className="text-xs text-cyan-300 font-medium">إنشاء تصنيف جديد للمنتجات:</p>
                  <input
                    type="text"
                    value={newCategoryNameAr}
                    onChange={e => setNewCategoryNameAr(e.target.value)}
                    placeholder="اسم التصنيف بالعربية (مثال: ملابس وأزياء)"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={newCategoryNameEn}
                    onChange={e => setNewCategoryNameEn(e.target.value)}
                    placeholder="Category Name in English"
                    dir="ltr"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-white text-left"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(false)}
                      className="text-xs px-2.5 py-1 text-slate-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={categorySubmitting}
                      className="text-xs px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded"
                    >
                      {categorySubmitting ? 'جاري الحفظ...' : 'تأكيد وإضافة'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Margins in Jordanian Dinar */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              الجدوى المالية المبدئية (بالدينار الأردني JOD)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  التكلفة المستهدفة الواصلة (JOD) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={targetCostJod}
                  onChange={e => setTargetCostJod(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="مثال: 7.50"
                  className={`w-full bg-slate-900 border ${
                    errors.targetCostJod ? 'border-rose-500' : 'border-slate-700'
                  } rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500`}
                />
                {errors.targetCostJod && <p className="text-xs text-rose-400 mt-1">{errors.targetCostJod}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  سعر البيع المقترح للمستهلك (JOD) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={targetSellingPriceJod}
                  onChange={e =>
                    setTargetSellingPriceJod(e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  placeholder="مثال: 18.00"
                  className={`w-full bg-slate-900 border ${
                    errors.targetSellingPriceJod ? 'border-rose-500' : 'border-slate-700'
                  } rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500`}
                />
                {errors.targetSellingPriceJod && (
                  <p className="text-xs text-rose-400 mt-1">{errors.targetSellingPriceJod}</p>
                )}
              </div>

              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex flex-col justify-center">
                <span className="text-xs text-slate-400">هامش الربح المتوقع:</span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span
                    className={`text-lg font-bold font-mono ${
                      profitNum > 0 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {profitNum > 0 ? `+${profitNum.toFixed(2)} د.أ` : '0.00 د.أ'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      Number(marginPercent) >= 50
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : Number(marginPercent) > 25
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    %{marginPercent}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Priority & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                حالة التقييم
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProductStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="evaluation">قيد التقييم والاستكشاف</option>
                <option value="testing">قيد فحص العينات</option>
                <option value="sourcing">قيد التفاوض والتوريد</option>
                <option value="approved">معتمد للشراء النهائي</option>
                <option value="rejected">مرفوض (غير مجدي)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                الأولوية
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="urgent">عاجلة جداً (Urgent)</option>
                <option value="high">مرتفعة (High)</option>
                <option value="normal">عادية (Normal)</option>
                <option value="low">منخفضة (Low)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                المسؤول في الفريق
              </label>
              <select
                value={assignedTeamMemberId}
                onChange={e => setAssignedTeamMemberId(e.target.value as TeamMemberId)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="yamen">يامن (المالية والتفاوض الفني)</option>
                <option value="ahmad">أحمد (الأبحاث والعمليات والشحن)</option>
                <option value="zaid">زيد (المبيعات والتوزيع الميداني)</option>
                <option value="laith">ليث (التسويق والمحتوى المرئي)</option>
              </select>
            </div>
          </div>

          {/* Supplier Info & Source Link */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                اسم المصنع / المورد
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                placeholder="مثال: Shenzhen Tech Co."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                بلد التوريد
              </label>
              <input
                type="text"
                value={supplierCountry}
                onChange={e => setSupplierCountry(e.target.value)}
                placeholder="الصين، تركيا، الإمارات..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                حالة العينة التجريبية
              </label>
              <select
                value={sampleStatus}
                onChange={e => setSampleStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="not_ordered">لم تُطلب بعد</option>
                <option value="ordered">تم طلب العينة للشحن</option>
                <option value="received">وصلت عينة الفحص لعمان</option>
                <option value="tested_passed">اجتازت الفحص بنجاح</option>
                <option value="tested_failed">فشلت في الفحص</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              رابط المصدر أو المنتج (1688 / Alibaba / موقع المصنع)
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 text-sm focus:outline-none focus:border-cyan-500 text-left"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              ملاحظات أبحاث السوق والتقييم الداخلي
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="سجل انطباع الفريق، أسعار المنافسين في السوق الأردني، محلات مقترحة للتوزيع..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none text-sm"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              {productToEdit ? 'تعديل السجل الفعلي' : 'سيتم إنشاء سجل حقيقي في الخادم'}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-sm transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري الحفظ الدائم...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {productToEdit ? 'تحديث المنتج' : 'حفظ المنتج في النظام'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
