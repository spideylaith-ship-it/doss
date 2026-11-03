export type ProductStatus = 'evaluation' | 'approved' | 'rejected' | 'sourcing' | 'testing';
export type PriorityLevel = 'urgent' | 'high' | 'normal' | 'low';
export type TeamMemberId = 'laith' | 'yamen' | 'ahmad' | 'zaid';

export interface LandedCostCalculation {
  purchasePriceCurrency: 'USD' | 'EUR' | 'CNY' | 'JOD';
  purchasePrice: number;
  exchangeRateToJod: number;
  customsDutyPercent: number; // e.g. 20 for 20%
  salesTaxPercent: number; // e.g. 16 for 16%
  shippingPerUnitJod: number;
  clearancePerUnitJod: number;
  inlandTransportPerUnitJod: number;
  additionalFeesPerUnitJod: number;
  // Computed values
  basePriceJod: number;
  customsDutyJod: number;
  salesTaxJod: number;
  totalLandedCostJod: number;
  suggestedRetailPriceJod: number;
  projectedProfitPerUnitJod: number;
  projectedMarginPercent: number;
  roiPercent: number;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  sku: string;
  categoryId: string;
  categoryNameAr?: string;
  status: ProductStatus;
  targetCostJod: number;
  targetSellingPriceJod: number;
  estimatedMarginPercent: number;
  supplierName: string;
  supplierCountry: string;
  sourceUrl?: string;
  notes?: string;
  priority: PriorityLevel;
  assignedTeamMemberId: TeamMemberId;
  isDemo: boolean;
  sampleStatus?: 'not_ordered' | 'ordered' | 'received' | 'tested_passed' | 'tested_failed';
  marketFeasibilityScore?: number; // 0-100
  landedCost?: LandedCostCalculation;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  descriptionAr: string;
  isCustom: boolean;
}

export interface TeamMember {
  id: TeamMemberId;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  roleDescriptionAr: string;
  coreResponsibilities: string[];
  email: string;
  avatarColor: string;
  activeTasksCount?: number;
  evaluatedProductsCount?: number;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  assignedTo: TeamMemberId;
  relatedProductId?: string;
  relatedProductName?: string;
  priority: PriorityLevel;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

export interface BuyingDecision {
  id: string;
  productId: string;
  productName: string;
  decision: 'approve' | 'reject' | 'revise';
  targetPurchaseQuantity: number;
  totalEstimatedBudgetJod: number;
  rationale: string;
  signoffs: {
    yamen: boolean; // Finance & Supplier
    ahmad: boolean; // Shipping & Operations
    zaid: boolean;  // Retail sales demand
    laith: boolean; // Marketing & Media
  };
  status: 'ready_for_po' | 'pending_signoffs' | 'archived';
  date: string;
}

export interface JordanMarketIntelligenceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'customs_tax' | 'retail_channel' | 'regional_market' | 'pricing_benchmark';
  governorateOrZone: string;
  summaryAr: string;
  detailsAr: string;
  impactScore: 'critical' | 'high' | 'medium';
  keyTakeaways: string[];
  updatedAt: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  country: string;
  platform: 'Alibaba' | '1688' | 'Made-in-China' | 'Direct Factory' | 'Trade Fair' | 'Local';
  mainProductsAr: string;
  contactPerson: string;
  contactMethod: string;
  moq: number;
  typicalLeadTimeDays: number;
  rating: number; // 1-5
  verifiedStatus: boolean;
  notes: string;
  isDemo: boolean;
}

export interface AppSettings {
  companyNameAr: string;
  companyNameEn: string;
  city: string;
  country: string;
  defaultCurrency: string;
  exchangeRates: {
    USD: number;
    EUR: number;
    CNY: number;
  };
  defaultSalesTaxPercent: number;
  defaultCustomsDutyPercent: number;
  defaultClearancePort: string;
}

export interface AppDatabaseSchema {
  products: Product[];
  categories: ProductCategory[];
  teamMembers: TeamMember[];
  tasks: TeamTask[];
  decisions: BuyingDecision[];
  marketIntelligence: JordanMarketIntelligenceItem[];
  suppliers: SupplierRecord[];
  settings: AppSettings;
}

export interface DashboardMetrics {
  totalProducts: number;
  productsUnderEvaluation: number;
  approvedProducts: number;
  rejectedProducts: number;
  sourcingProducts: number;
  testingProducts: number;
  potentialProfitJod: number;
  totalEstimatedInvestmentJod: number;
  realProductsCount: number;
  demoProductsCount: number;
  pendingTasksCount: number;
  readyDecisionsCount: number;
}
