/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductCategory,
  TeamMember,
  TeamTask,
  BuyingDecision,
  JordanMarketIntelligenceItem,
  SupplierRecord,
  AppSettings,
  DashboardMetrics,
  TeamMemberId,
} from './types/index.js';
import * as api from './services/api.js';
import { Layout } from './components/Layout.js';
import { DashboardView } from './components/views/DashboardView.js';
import { ProductManagementView } from './components/views/ProductManagementView.js';
import { ProductDiscoveryView } from './components/views/ProductDiscoveryView.js';
import { JordanMarketView } from './components/views/JordanMarketView.js';
import { SupplierIntelligenceView } from './components/views/SupplierIntelligenceView.js';
import { LandedCostCalculatorView } from './components/views/LandedCostCalculatorView.js';
import { ProductValidationView } from './components/views/ProductValidationView.js';
import { BuyingDecisionCenterView } from './components/views/BuyingDecisionCenterView.js';
import { TeamManagementView } from './components/views/TeamManagementView.js';
import { ReportsView } from './components/views/ReportsView.js';
import { SettingsView } from './components/views/SettingsView.js';
import { ProductModal } from './components/ProductModal.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [decisions, setDecisions] = useState<BuyingDecision[]>([]);
  const [marketItems, setMarketItems] = useState<JordanMarketIntelligenceItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const [activeUserId, setActiveUserId] = useState<TeamMemberId>('laith');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productForDetail, setProductForDetail] = useState<Product | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        prods,
        cats,
        team,
        tsks,
        decs,
        market,
        sups,
        sets,
        mets,
      ] = await Promise.all([
        api.fetchProducts(),
        api.fetchCategories(),
        api.fetchTeam(),
        api.fetchTasks(),
        api.fetchDecisions(),
        api.fetchMarketIntelligence(),
        api.fetchSuppliers(),
        api.fetchSettings(),
        api.fetchMetrics(),
      ]);

      setProducts(prods);
      setCategories(cats);
      setTeamMembers(team);
      setTasks(tsks);
      setDecisions(decs);
      setMarketItems(market);
      setSuppliers(sups);
      setSettings(sets);
      setMetrics(mets);
    } catch (err: any) {
      console.error('Failed to load application data:', err);
      setError(err.message || 'فشل الاتصال بقاعدة البيانات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Product CRUD
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (productToEdit) {
      const updated = await api.updateProduct(productToEdit.id, productData);
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    } else {
      const created = await api.createProduct(productData);
      setProducts(prev => [created, ...prev]);
    }
    // Refresh metrics
    const updatedMetrics = await api.fetchMetrics();
    setMetrics(updatedMetrics);
    setProductToEdit(null);
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    const updatedMetrics = await api.fetchMetrics();
    setMetrics(updatedMetrics);
  };

  // Category CRUD
  const handleAddCategory = async (cat: { nameAr: string; nameEn?: string; descriptionAr?: string }) => {
    const created = await api.createCategory(cat);
    setCategories(prev => [...prev, created]);
    return created;
  };

  // Decisions
  const handleToggleDecisionSignoff = async (
    decisionId: string,
    memberId: 'yamen' | 'ahmad' | 'zaid' | 'laith',
    approved: boolean
  ) => {
    const updated = await api.toggleDecisionSignoff(decisionId, memberId, approved);
    setDecisions(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    const updatedMetrics = await api.fetchMetrics();
    setMetrics(updatedMetrics);
  };

  const handleCreateDecision = async (decision: Partial<BuyingDecision>) => {
    const created = await api.createDecision(decision);
    setDecisions(prev => [created, ...prev]);
    const updatedMetrics = await api.fetchMetrics();
    setMetrics(updatedMetrics);
  };

  // Tasks
  const handleAddTask = async (task: Partial<TeamTask>) => {
    const created = await api.createTask(task);
    setTasks(prev => [created, ...prev]);
    const updatedTeam = await api.fetchTeam();
    setTeamMembers(updatedTeam);
  };

  const handleUpdateTask = async (id: string, updates: Partial<TeamTask>) => {
    const updated = await api.updateTask(id, updates);
    setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    const updatedTeam = await api.fetchTeam();
    setTeamMembers(updatedTeam);
  };

  const handleDeleteTask = async (id: string) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    const updatedTeam = await api.fetchTeam();
    setTeamMembers(updatedTeam);
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: TeamTask['status']) => {
    const nextStatus: TeamTask['status'] =
      currentStatus === 'pending'
        ? 'in_progress'
        : currentStatus === 'in_progress'
        ? 'completed'
        : 'pending';
    await handleUpdateTask(taskId, { status: nextStatus });
  };

  // Suppliers
  const handleAddSupplier = async (sup: Partial<SupplierRecord>) => {
    const created = await api.createSupplier(sup);
    setSuppliers(prev => [created, ...prev]);
  };

  // Settings
  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  // Direct status update for product validation
  const handleUpdateProductStatus = async (id: string, updates: Partial<Product>) => {
    const updated = await api.updateProduct(id, updates);
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    const updatedMetrics = await api.fetchMetrics();
    setMetrics(updatedMetrics);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-xl shadow-cyan-500/20 animate-bounce mb-4">
          D
        </div>
        <h2 className="text-xl font-bold text-white">DOSS UNIVERSE</h2>
        <p className="text-xs text-slate-400 mt-1">جاري الاتصال بالخادم وقاعدة البيانات الدائمة...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">تعذر الاتصال بالخادم</h2>
          <p className="text-xs text-rose-300">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const realProductsCount = products.filter(p => !p.isDemo).length;
  const demoProductsCount = products.filter(p => p.isDemo).length;

  return (
    <Layout
      activeSection={activeSection}
      onNavigate={section => setActiveSection(section)}
      onOpenAddProduct={() => {
        setProductToEdit(null);
        setIsAddModalOpen(true);
      }}
      teamMembers={teamMembers}
      activeUserId={activeUserId}
      onChangeActiveUser={setActiveUserId}
      realCount={realProductsCount}
      demoCount={demoProductsCount}
    >
      {/* View Switcher */}
      {activeSection === 'dashboard' && (
        <DashboardView
          metrics={metrics}
          products={products}
          tasks={tasks}
          decisions={decisions}
          marketItems={marketItems}
          teamMembers={teamMembers}
          onNavigate={setActiveSection}
          onOpenAddProduct={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          onOpenProductDetail={setProductForDetail}
          onToggleDecisionSignoff={handleToggleDecisionSignoff}
          onToggleTaskStatus={handleToggleTaskStatus}
        />
      )}

      {activeSection === 'products' && (
        <ProductManagementView
          products={products}
          categories={categories}
          teamMembers={teamMembers}
          onOpenAddModal={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          onOpenEditModal={product => {
            setProductToEdit(product);
            setIsAddModalOpen(true);
          }}
          onOpenDetailModal={setProductForDetail}
          onDeleteProduct={handleDeleteProduct}
          onRefresh={loadData}
          onAddCategory={handleAddCategory}
        />
      )}

      {activeSection === 'discovery' && (
        <ProductDiscoveryView
          products={products}
          categories={categories}
          teamMembers={teamMembers}
          onOpenAddModal={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          onOpenDetailModal={setProductForDetail}
          onNavigateToCalculator={() => setActiveSection('calculator')}
        />
      )}

      {activeSection === 'jordan_market' && (
        <JordanMarketView items={marketItems} />
      )}

      {activeSection === 'suppliers' && (
        <SupplierIntelligenceView
          suppliers={suppliers}
          onAddSupplier={handleAddSupplier}
        />
      )}

      {activeSection === 'calculator' && (
        <LandedCostCalculatorView
          categories={categories}
          onSaveAsProduct={handleSaveProduct}
          onNavigateToProducts={() => setActiveSection('products')}
        />
      )}

      {activeSection === 'validation' && (
        <ProductValidationView
          products={products}
          onUpdateProductStatus={handleUpdateProductStatus}
          onOpenDetailModal={setProductForDetail}
        />
      )}

      {activeSection === 'buying_center' && (
        <BuyingDecisionCenterView
          decisions={decisions}
          products={products}
          teamMembers={teamMembers}
          onToggleSignoff={handleToggleDecisionSignoff}
          onCreateDecision={handleCreateDecision}
        />
      )}

      {activeSection === 'team' && (
        <TeamManagementView
          teamMembers={teamMembers}
          tasks={tasks}
          products={products}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {activeSection === 'reports' && (
        <ReportsView
          metrics={metrics}
          products={products}
          categories={categories}
          teamMembers={teamMembers}
        />
      )}

      {activeSection === 'settings' && settings && (
        <SettingsView
          settings={settings}
          categories={categories}
          onUpdateSettings={handleUpdateSettings}
          onAddCategory={handleAddCategory}
        />
      )}

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={productForDetail}
        isOpen={Boolean(productForDetail)}
        onClose={() => setProductForDetail(null)}
        onEdit={prod => {
          setProductForDetail(null);
          setProductToEdit(prod);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
      />
    </Layout>
  );
}
