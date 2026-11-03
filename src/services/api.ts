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
  LandedCostCalculation,
} from '../types/index.js';

const BASE_URL = '/api';

export async function fetchMetrics(): Promise<DashboardMetrics> {
  const res = await fetch(`${BASE_URL}/metrics`);
  if (!res.ok) throw new Error('فشل جلب إحصائيات لوحة التحكم');
  return res.json();
}

export async function fetchProducts(params?: {
  search?: string;
  category?: string;
  status?: string;
  isDemo?: string;
  priority?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category && params.category !== 'all') query.append('category', params.category);
  if (params?.status && params.status !== 'all') query.append('status', params.status);
  if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
  if (params?.isDemo !== undefined && params.isDemo !== 'all') query.append('isDemo', params.isDemo);

  const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
  if (!res.ok) throw new Error('فشل جلب قائمة المنتجات');
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('فشل جلب بيانات المنتج');
  return res.json();
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل حفظ المنتج الجديد');
  }
  return res.json();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل تحديث بيانات المنتج');
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل حذف المنتج');
  }
  return res.json();
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('فشل جلب التصنيفات');
  return res.json();
}

export async function createCategory(cat: {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  icon?: string;
}): Promise<ProductCategory> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل إضافة التصنيف الجديد');
  }
  return res.json();
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const res = await fetch(`${BASE_URL}/team`);
  if (!res.ok) throw new Error('فشل جلب بيانات الفريق');
  return res.json();
}

export async function fetchTasks(): Promise<TeamTask[]> {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error('فشل جلب المهام');
  return res.json();
}

export async function createTask(task: Partial<TeamTask>): Promise<TeamTask> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('فشل إنشاء المهمة');
  return res.json();
}

export async function updateTask(id: string, updates: Partial<TeamTask>): Promise<TeamTask> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('فشل تحديث المهمة');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('فشل حذف المهمة');
}

export async function fetchDecisions(): Promise<BuyingDecision[]> {
  const res = await fetch(`${BASE_URL}/decisions`);
  if (!res.ok) throw new Error('فشل جلب قرارات الشراء');
  return res.json();
}

export async function createDecision(decision: Partial<BuyingDecision>): Promise<BuyingDecision> {
  const res = await fetch(`${BASE_URL}/decisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(decision),
  });
  if (!res.ok) throw new Error('فشل حفظ قرار الشراء');
  return res.json();
}

export async function toggleDecisionSignoff(
  decisionId: string,
  memberId: 'yamen' | 'ahmad' | 'zaid' | 'laith',
  approved: boolean
): Promise<BuyingDecision> {
  const res = await fetch(`${BASE_URL}/decisions/${decisionId}/signoff`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, approved }),
  });
  if (!res.ok) throw new Error('فشل تحديث التوقيع');
  return res.json();
}

export async function fetchMarketIntelligence(): Promise<JordanMarketIntelligenceItem[]> {
  const res = await fetch(`${BASE_URL}/market-intelligence`);
  if (!res.ok) throw new Error('فشل جلب بيانات السوق الأردني');
  return res.json();
}

export async function fetchSuppliers(): Promise<SupplierRecord[]> {
  const res = await fetch(`${BASE_URL}/suppliers`);
  if (!res.ok) throw new Error('فشل جلب قائمة الموردين');
  return res.json();
}

export async function createSupplier(supplier: Partial<SupplierRecord>): Promise<SupplierRecord> {
  const res = await fetch(`${BASE_URL}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  });
  if (!res.ok) throw new Error('فشل حفظ المورد');
  return res.json();
}

export async function fetchSettings(): Promise<AppSettings> {
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error('فشل جلب الإعدادات');
  return res.json();
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('فشل حفظ الإعدادات');
  return res.json();
}

export async function calculateLandedCostApi(input: any): Promise<LandedCostCalculation> {
  const res = await fetch(`${BASE_URL}/calculate-cost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('فشل حساب التكلفة');
  return res.json();
}
