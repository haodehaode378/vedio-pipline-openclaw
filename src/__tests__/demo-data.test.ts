import { describe, it, expect } from 'vitest';
import { demoProducts } from '../modules/demo-data/products/index.js';

describe('Demo Products', () => {
  it('should have 30 demo products', () => {
    expect(demoProducts.length).toBe(30);
  });

  it('should cover all 20 categories', () => {
    const categories = new Set(demoProducts.map((p) => p.category));
    expect(categories.size).toBe(20);
  });

  it('should have valid ProductInput fields for all products', () => {
    for (const product of demoProducts) {
      expect(product.name).toBeTruthy();
      expect(product.category).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.description).toBeTruthy();
    }
  });

  it('should have at least 2 products per category for some categories', () => {
    const categoryCounts: Record<string, number> = {};
    for (const p of demoProducts) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    // At least some categories should have 2 products
    const categoriesWithTwoPlus = Object.values(categoryCounts).filter((c) => c >= 2);
    expect(categoriesWithTwoPlus.length).toBeGreaterThan(0);
  });

  it('should have products with originalPrice > price for discount scenarios', () => {
    const discounted = demoProducts.filter((p) => p.originalPrice && p.originalPrice > p.price);
    expect(discounted.length).toBeGreaterThan(0);
  });

  it('should have products with keyFeatures', () => {
    const withFeatures = demoProducts.filter((p) => p.keyFeatures && p.keyFeatures.length > 0);
    expect(withFeatures.length).toBeGreaterThan(0);
  });
});
