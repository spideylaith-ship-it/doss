import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateJordanLandedCost, validateProductInput } from './costCalculations.js';

test('Jordan landed cost calculates base conversion and customs correctly', () => {
  // Example: Product costing $10 USD
  // 1 USD = 0.709 JOD => 7.09 JOD base
  // Shipping: 1.0 JOD
  // CIF = 7.09 + 1.0 = 8.09 JOD
  // Customs (20% of CIF) = 8.09 * 0.20 = 1.618 JOD
  // Sales Tax (16% of CIF + Duty = 9.708 * 0.16) = 1.553 JOD
  // Clearance = 0.5 JOD, Inland = 0.2 JOD
  // Total = 7.09 + 1.0 + 1.618 + 1.553 + 0.5 + 0.2 = 11.961 JOD
  // Retail price = 20.0 JOD
  // Profit = 20.0 - 11.961 = 8.039 JOD

  const result = calculateJordanLandedCost({
    purchasePriceCurrency: 'USD',
    purchasePrice: 10,
    exchangeRateToJod: 0.709,
    customsDutyPercent: 20,
    salesTaxPercent: 16,
    shippingPerUnitJod: 1.0,
    clearancePerUnitJod: 0.5,
    inlandTransportPerUnitJod: 0.2,
    additionalFeesPerUnitJod: 0,
    suggestedRetailPriceJod: 20,
  });

  assert.equal(result.basePriceJod, 7.09);
  assert.equal(result.customsDutyJod, 1.618);
  assert.equal(result.salesTaxJod, 1.553);
  assert.equal(result.totalLandedCostJod, 11.961);
  assert.equal(result.projectedProfitPerUnitJod, 8.039);
  assert.ok(result.projectedMarginPercent > 40);
  assert.ok(result.roiPercent > 60);
});

test('Product validation flags missing Arabic name and invalid prices', () => {
  const invalidResult = validateProductInput({
    nameAr: '',
    categoryId: '',
    targetCostJod: 15,
    targetSellingPriceJod: 10, // Selling price lower than cost
  });

  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.nameAr);
  assert.ok(invalidResult.errors.categoryId);
  assert.ok(invalidResult.errors.targetSellingPriceJod);

  const validResult = validateProductInput({
    nameAr: 'حامل هاتف مغناطيسي للسيارة',
    categoryId: 'car_accessories',
    targetCostJod: 3.5,
    targetSellingPriceJod: 9.0,
  });

  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});
