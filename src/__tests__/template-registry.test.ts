import { describe, it, expect } from 'vitest';
import { TemplateRegistry } from '../modules/templates/registry/index.js';

describe('TemplateRegistry', () => {
  const registry = new TemplateRegistry();

  it('should register 15 template families', () => {
    expect(registry.familyCount).toBe(15);
  });

  it('should register 45 template configs', () => {
    expect(registry.configCount).toBe(45);
  });

  it('should get all families', () => {
    const families = registry.getAllFamilies();
    expect(families.length).toBe(15);
    expect(families[0].id).toBeDefined();
    expect(families[0].name).toBeDefined();
  });

  it('should get family by id', () => {
    const family = registry.getFamily('TechClean');
    expect(family).toBeDefined();
    expect(family!.id).toBe('TechClean');
  });

  it('should return undefined for unknown family id', () => {
    expect(registry.getFamily('NonExistent')).toBeUndefined();
  });

  it('should get all configs', () => {
    const configs = registry.getAllConfigs();
    expect(configs.length).toBe(45);
  });

  it('should get configs by family', () => {
    const configs = registry.getConfigsByFamily('TechClean');
    expect(configs.length).toBe(3);
    configs.forEach((c) => {
      expect(c.familyId).toBe('TechClean');
    });
  });

  it('should get families by category', () => {
    const families = registry.getFamiliesByCategory('数码科技');
    expect(families.length).toBeGreaterThan(0);
    families.forEach((f) => {
      expect(f.suitableCategories).toContain('数码科技');
    });
  });

  it('should get families by goal', () => {
    const families = registry.getFamiliesByGoal('种草');
    expect(families.length).toBeGreaterThan(0);
  });

  it('should calculate total combinations', () => {
    const total = registry.totalCombinations;
    expect(total).toBeGreaterThan(0);
  });

  it('should get config by id', () => {
    const config = registry.getConfig('TechClean-standard-9:16-30s');
    expect(config).toBeDefined();
    expect(config!.familyId).toBe('TechClean');
  });

  it('should have all families with required fields', () => {
    const families = registry.getAllFamilies();
    for (const family of families) {
      expect(family.id).toBeTruthy();
      expect(family.name).toBeTruthy();
      expect(family.suitableCategories.length).toBeGreaterThan(0);
      expect(family.colorTheme).toBeDefined();
      expect(family.typography).toBeDefined();
    }
  });

  it('should have all configs with valid aspect ratios', () => {
    const configs = registry.getAllConfigs();
    for (const config of configs) {
      expect(config.supportedAspectRatios.length).toBeGreaterThan(0);
      config.supportedAspectRatios.forEach((r) => {
        expect(['9:16', '1:1', '16:9']).toContain(r);
      });
    }
  });
});
