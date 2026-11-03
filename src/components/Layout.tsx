import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Building2,
  Calculator,
  ShieldCheck,
  FileCheck2,
  Users,
  FileText,
  Settings,
  Package,
  Plus,
  Menu,
  X,
  Server,
  Layers,
  Sparkles,
  ChevronDown,
  User,
} from 'lucide-react';
import { TeamMember, TeamMemberId } from '../types/index.js';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAddProduct: () => void;
  teamMembers: TeamMember[];
  activeUserId: TeamMemberId;
  onChangeActiveUser: (userId: TeamMemberId) => void;
  realCount: number;
  demoCount: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeSection,
  onNavigate,
  onOpenAddProduct,
  teamMembers,
  activeUserId,
  onChangeActiveUser,
  realCount,
  demoCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeUser = teamMembers.find(m => m.id === activeUserId);

  const navigationItems = [
    { id: 'dashboard', label: 'لوحة القيادة', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'إدارة المنتجات', labelEn: 'Product Management', icon: Package },
    { id: 'discovery', label: 'استكشاف المنتجات', labelEn: 'Product Discovery', icon: Compass },
    { id: 'jordan_market', label: 'استخبارات السوق الأردني', labelEn: 'Jordan Market', icon: MapPin },
    { id: 'suppliers', label: 'استخبارات الموردين', labelEn: 'Suppliers', icon: Building2 },
    { id: 'calculator', label: 'حاسبة التكلفة في الأردن', labelEn: 'Landed Cost Calc', icon: Calculator },
    { id: 'validation', label: 'تقييم وفحص الجدوى', labelEn: 'Product Validation', icon: ShieldCheck },
    { id: 'buying_center', label: 'مركز قرارات الشراء', labelEn: 'Buying Decisions', icon: FileCheck2 },
    { id: 'team', label: 'إدارة فريق العمل', labelEn: 'Team Management', icon: Users },
    { id: 'reports', label: 'التقارير التحليلية', labelEn: 'Reports', icon: FileText },
    { id: 'settings', label: 'الإعدادات والعملات', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 font-['Cairo',sans-serif]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center px-4 lg:px-8 justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition transform">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-wide">DOSS UNIVERSE</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  OS v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400">الاستخبارات التجارية والاستيراد — الأردن</p>
            </div>
          </div>
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center gap-3">
          {/* Database & Persistence Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>قاعدة البيانات: متصلة ودائمة</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold font-mono">{realCount} فعلي</span>
            <span className="text-amber-400 font-bold font-mono">{demoCount} تجريبي</span>
          </div>

          {/* Quick Add Product Button */}
          <button
            onClick={onOpenAddProduct}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة منتج</span>
          </button>

          {/* Active User Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 text-xs transition"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                style={{ backgroundColor: activeUser?.avatarColor || '#10B981' }}
              >
                {activeUser?.nameAr.charAt(0) || 'ل'}
              </div>
              <div className="text-right hidden sm:block">
                <span className="font-bold text-white block leading-tight">{activeUser?.nameAr || 'ليث'}</span>
                <span className="text-[9px] text-slate-400 block leading-tight">عضو الفريق</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 text-[11px] text-slate-400 border-b border-slate-800">
                  تبديل منظور عضو الفريق الحالي:
                </div>
                {teamMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => {
                      onChangeActiveUser(member.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      activeUserId === member.id
                        ? 'bg-cyan-500/10 text-cyan-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{member.nameAr}</span>
                      <span className="block text-[10px] text-slate-400">{member.titleAr}</span>
                    </div>
                    {activeUserId === member.id && <span className="text-cyan-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-l border-slate-800/80 p-4 shrink-0">
          <div className="space-y-1 overflow-y-auto pr-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>}
                </button>
              );
            })}
          </div>

          {/* Quick Jordan Info Footer */}
          <div className="mt-auto pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>العملة المعتمدة:</span>
              <strong className="text-slate-300 font-mono">دينار أردني (JOD)</strong>
            </div>
            <div className="flex justify-between">
              <span>ضريبة المبيعات:</span>
              <strong className="text-slate-300 font-mono">16%</strong>
            </div>
            <div className="flex justify-between">
              <span>رسم الجمارك:</span>
              <strong className="text-slate-300 font-mono">20%</strong>
            </div>
            <p className="text-[10px] text-slate-600 pt-1">
              مؤسسة دوس يونيفرس — عمان
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-72 bg-slate-900 h-full p-4 flex flex-col border-l border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-2">
                <span className="font-bold text-white text-sm">القائمة الرئيسية</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
