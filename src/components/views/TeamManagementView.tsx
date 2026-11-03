import React, { useState } from 'react';
import { TeamMember, TeamTask, TeamMemberId, PriorityLevel, Product } from '../../types/index.js';
import {
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Shield,
  Briefcase,
  Camera,
  DollarSign,
  Truck,
  Store,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface TeamManagementViewProps {
  teamMembers: TeamMember[];
  tasks: TeamTask[];
  products: Product[];
  onAddTask: (task: Partial<TeamTask>) => Promise<void>;
  onUpdateTask: (id: string, updates: Partial<TeamTask>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({
  teamMembers,
  tasks,
  products,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // New task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState<TeamMemberId>('laith');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('normal');
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [relatedProductId, setRelatedProductId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRoleIcon = (id: string) => {
    switch (id) {
      case 'laith':
        return <Camera className="w-5 h-5 text-emerald-400" />;
      case 'yamen':
        return <DollarSign className="w-5 h-5 text-blue-400" />;
      case 'ahmad':
        return <Truck className="w-5 h-5 text-purple-400" />;
      case 'zaid':
        return <Store className="w-5 h-5 text-amber-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedMemberFilter !== 'all' && t.assignedTo !== selectedMemberFilter) return false;
    if (selectedStatusFilter !== 'all' && t.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const relatedProd = products.find(p => p.id === relatedProductId);
      await onAddTask({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        assignedTo,
        priority: taskPriority,
        dueDate: taskDueDate,
        relatedProductId: relatedProductId || undefined,
        relatedProductName: relatedProd ? relatedProd.nameAr : undefined,
        createdBy: 'النظام',
      });
      setTaskTitle('');
      setTaskDesc('');
      setRelatedProductId('');
      setIsAddingTask(false);
    } catch (err: any) {
      alert(err.message || 'فشل إضافة المهمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusCycle = async (task: TeamTask) => {
    let nextStatus: TeamTask['status'] = 'in_progress';
    if (task.status === 'pending') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    else if (task.status === 'completed') nextStatus = 'pending';

    await onUpdateTask(task.id, { status: nextStatus });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            فريق عمل DOSS UNIVERSE وتوزيع الصلاحيات
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            الهيكل التنظيمي الرباعي للشركة وتوزيع مهام التسويق، المالية، الشحن والمبيعات الميدانية
          </p>
        </div>

        <button
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          إسناد مهمة جديدة لعضو في الفريق
        </button>
      </div>

      {/* 4 Team Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md"
                    style={{ backgroundColor: `${member.avatarColor}25`, border: `1px solid ${member.avatarColor}50` }}
                  >
                    {getRoleIcon(member.id)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{member.nameAr}</h3>
                    <span className="text-xs text-slate-400 block font-mono" dir="ltr">{member.nameEn}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-xs font-semibold text-cyan-400 block mb-1">
                  {member.titleAr}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {member.roleDescriptionAr}
                </p>
              </div>

              {/* Core Responsibilities */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  المسؤوليات الرئيسية:
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {member.coreResponsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Member Stats */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                المهام النشطة: <strong className="text-white font-mono">{member.activeTasksCount ?? 0}</strong>
              </span>
              <span className="text-slate-400">
                المنتجات المسندة: <strong className="text-cyan-400 font-mono">{member.evaluatedProductsCount ?? 0}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Role-Based Permissions & Responsibilities Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          مصفوفة الصلاحيات واعتماد قرارات الشراء (Approval & Signoff Matrix)
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          أي قرار استيراد أو شراء بحاجة لتوقيع الأعضاء الأربعة لضمان عدم شراء أي منتج بدون توافق كامل
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">عضو الفريق</th>
                <th className="py-3 px-4">المجال التخصصي</th>
                <th className="py-3 px-4">صلاحيات النظام</th>
                <th className="py-3 px-4">معيار التوقيع على قرار الشراء (Signoff)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  ليث (Laith)
                </td>
                <td className="py-3 px-4">التسويق والمحتوى المرئي</td>
                <td className="py-3 px-4">إدارة مكتبة العينات، خطط الإعلانات، تقييم القبول البصري</td>
                <td className="py-3 px-4 text-emerald-300">
                  التأكد من إمكانية إنتاج فيديو جذاب ومحتوى إعلاني عالي التحويل للجمهور الأردني
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  يامن (Yamen)
                </td>
                <td className="py-3 px-4">المالية والتفاوض الفني</td>
                <td className="py-3 px-4">حاسبة التكلفة الواصلة، شروط المصانع، التحويلات البنكية</td>
                <td className="py-3 px-4 text-blue-300">
                  اعتماد السعر الصافي، هامش ربح لا يقل عن 50%، ومطابقة كهربائية 220V
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  أحمد (Ahmad)
                </td>
                <td className="py-3 px-4">الأبحاث والعمليات والشحن</td>
                <td className="py-3 px-4">تنسيق الشحن البحري والجوي، التخليص في العقبة، الجرد</td>
                <td className="py-3 px-4 text-purple-300">
                  تأكيد بند التعريفة HS Code وتكلفة الشحن الحقيقية وسرعة وصول الحاوية
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  زيد (Zaid)
                </td>
                <td className="py-3 px-4">المبيعات وتوزيع المحلات</td>
                <td className="py-3 px-4">شبكة تجار التجزئة، الصويفية، الجاردنز، الزرقاء، إربد</td>
                <td className="py-3 px-4 text-amber-300">
                  تأكيد طلب المحلات الفعلي واستعداد التجار لشراء المنتج بسعر الجملة
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Tasks Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              سجل المهام التنفيذية للفريق ({filteredTasks.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              انقر على حالة أي مهمة لتبديلها مباشرة (معلقة ➔ قيد التنفيذ ➔ مكتملة)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMemberFilter}
              onChange={e => setSelectedMemberFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="all">كل أعضاء الفريق</option>
              <option value="laith">ليث (التسويق)</option>
              <option value="yamen">يامن (المالية)</option>
              <option value="ahmad">أحمد (العمليات)</option>
              <option value="zaid">زيد (المبيعات)</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="all">كل الحالات</option>
              <option value="pending">معلقة</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتملة</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              لا توجد مهام تطابق هذا الفلتر
            </div>
          ) : (
            filteredTasks.map(task => {
              const member = teamMembers.find(m => m.id === task.assignedTo);

              return (
                <div
                  key={task.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{task.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {task.priority === 'urgent' ? 'عاجلة' : task.priority === 'high' ? 'مرتفعة' : 'عادية'}
                      </span>
                      {task.relatedProductName && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          مرتبطة بـ: {task.relatedProductName}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>المسند إليه: <strong className="text-slate-300">{member?.nameAr || task.assignedTo}</strong></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> تاريخ الاستحقاق: {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStatusCycle(task)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : task.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {task.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> مكتملة
                        </>
                      ) : task.status === 'in_progress' ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" /> قيد التنفيذ
                        </>
                      ) : (
                        'معلقة (انقر لبدء العمل)'
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('هل تريد حذف هذه المهمة؟')) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">إسناد مهمة جديدة لعضو الفريق</h3>
            <p className="text-xs text-slate-400 mb-4">
              حدد عنوان المهمة والمسؤول وتاريخ الإنجاز المطلوب
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عنوان المهمة <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="مثال: فحص عينات الشواحن اللاسلكية والتأكد من توافق 220V"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تفاصيل المهمة
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="سجل أي متطلبات محددة، روابط أو أرقام للتواصل..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    المسؤول
                  </label>
                  <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value as TeamMemberId)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="laith">ليث (التسويق والمحتوى)</option>
                    <option value="yamen">يامن (المالية والتفاوض)</option>
                    <option value="ahmad">أحمد (الأبحاث والشحن)</option>
                    <option value="zaid">زيد (المبيعات والتوزيع)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الأولوية
                  </label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="normal">عادية</option>
                    <option value="high">مرتفعة</option>
                    <option value="urgent">عاجلة جداً</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    تاريخ الاستحقاق
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ربط بمنتج (اختياري)
                  </label>
                  <select
                    value={relatedProductId}
                    onChange={e => setRelatedProductId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="">بدون ربط</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition"
                >
                  {isSubmitting ? 'جاري الإنشاء...' : 'إسناد المهمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
