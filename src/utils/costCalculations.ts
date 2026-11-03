import { LandedCostCalculation } from '../types/index.js';

export interface LandedCostInput {
  purchasePriceCurrency: 'USD' | 'EUR' | 'CNY' | 'JOD';
  purchasePrice: number;
  exchangeRateToJod?: number;
  customsDutyPercent?: number;
  salesTaxPercent?: number;
  shippingPerUnitJod?: number;
  clearancePerUnitJod?: number;
  inlandTransportPerUnitJod?: number;
  additionalFeesPerUnitJod?: number;
  suggestedRetailPriceJod: number;
}

export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  USD: 0.709,
  EUR: 0.770,
  CNY: 0.100,
  JOD: 1.000,
};

export const DEFAULT_JORDAN_CUSTOMS_PERCENT = 20; // General duty standard in Jordan
export const DEFAULT_JORDAN_SALES_TAX_PERCENT = 16; // General sales tax in Jordan (16%)

/**
 * Calculates landed cost, customs duties, sales tax, and margins for goods imported to Jordan.
 */
export function calculateJordanLandedCost(input: LandedCostInput): LandedCostCalculation {
  const currency = input.purchasePriceCurrency || 'USD';
  const exchangeRate = input.exchangeRateToJod ?? (DEFAULT_EXCHANGE_RATES[currency] || 1.0);
  const customsRate = (input.customsDutyPercent ?? DEFAULT_JORDAN_CUSTOMS_PERCENT) / 100;
  const salesTaxRate = (input.salesTaxPercent ?? DEFAULT_JORDAN_SALES_TAX_PERCENT) / 100;

  const shipping = Number(input.shippingPerUnitJod || 0);
  const clearance = Number(input.clearancePerUnitJod || 0);
  const inland = Number(input.inlandTransportPerUnitJod || 0);
  const additional = Number(input.additionalFeesPerUnitJod || 0);
  const retailPrice = Number(input.suggestedRetailPriceJod || 0);

  // 1. Base price converted to Jordanian Dinar (JOD)
  const basePriceJod = Number((input.purchasePrice * exchangeRate).toFixed(3));

  // 2. CIF value for customs calculation (Goods base + International shipping)
  const cifValueJod = basePriceJod + shipping;

  // 3. Customs Duty in Jordan (applied to CIF)
  const customsDutyJod = Number((cifValueJod * customsRate).toFixed(3));

  // 4. Sales Tax in Jordan (16% applied to CIF + Customs Duty)
  const taxBaseJod = cifValueJod + customsDutyJod;
  const salesTaxJod = Number((taxBaseJod * salesTaxRate).toFixed(3));

  // 5. Total Landed Cost per unit at Amman warehouse
  const totalLandedCostJod = Number(
    (basePriceJod + shipping + customsDutyJod + salesTaxJod + clearance + inland + additional).toFixed(3)
  );

  // 6. Profit and Margins
  const projectedProfitPerUnitJod = Number((retailPrice - totalLandedCostJod).toFixed(3));
  
  const projectedMarginPercent = retailPrice > 0 
    ? Number(((projectedProfitPerUnitJod / retailPrice) * 100).toFixed(1))
    : 0;

  const roiPercent = totalLandedCostJod > 0
    ? Number(((projectedProfitPerUnitJod / totalLandedCostJod) * 100).toFixed(1))
    : 0;

  return {
    purchasePriceCurrency: currency,
    purchasePrice: Number(input.purchasePrice.toFixed(2)),
    exchangeRateToJod: exchangeRate,
    customsDutyPercent: input.customsDutyPercent ?? DEFAULT_JORDAN_CUSTOMS_PERCENT,
    salesTaxPercent: input.salesTaxPercent ?? DEFAULT_JORDAN_SALES_TAX_PERCENT,
    shippingPerUnitJod: shipping,
    clearancePerUnitJod: clearance,
    inlandTransportPerUnitJod: inland,
    additionalFeesPerUnitJod: additional,
    basePriceJod,
    customsDutyJod,
    salesTaxJod,
    totalLandedCostJod,
    suggestedRetailPriceJod: retailPrice,
    projectedProfitPerUnitJod,
    projectedMarginPercent,
    roiPercent,
  };
}

/**
 * Validates product creation/update input
 */
export function validateProductInput(data: {
  nameAr?: string;
  nameEn?: string;
  categoryId?: string;
  targetCostJod?: number;
  targetSellingPriceJod?: number;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.nameAr || data.nameAr.trim().length < 2) {
    errors.nameAr = 'يرجى إدخال اسم المنتج باللغة العربية (حرفان على الأقل)';
  }

  if (!data.categoryId || data.categoryId.trim().length === 0) {
    errors.categoryId = 'يرجى اختيار تصنيف للمنتج';
  }

  if (data.targetCostJod === undefined || isNaN(data.targetCostJod) || data.targetCostJod < 0) {
    errors.targetCostJod = 'التكلفة المستهدفة يجب أن تكون رقماً موجباً أو صفراً';
  }

  if (data.targetSellingPriceJod === undefined || isNaN(data.targetSellingPriceJod) || data.targetSellingPriceJod <= 0) {
    errors.targetSellingPriceJod = 'سعر البيع المقترح يجب أن يكون أكبر من صفر';
  }

  if (
    data.targetCostJod !== undefined &&
    data.targetSellingPriceJod !== undefined &&
    data.targetSellingPriceJod < data.targetCostJod
  ) {
    errors.targetSellingPriceJod = 'سعر البيع أقل من التكلفة المستهدفة (هامش ربح سلبي)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
