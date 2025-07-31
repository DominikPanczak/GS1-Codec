import { 
  getAISpecification, 
  isKnownAI, 
  getAllKnownAIs
} from '../../../domain/specifications/gs1-specification';
import { STANDARD_AIS } from '../../../domain/value-objects/application-identifier';

describe('GS1 Specifications', () => {
  describe('getAISpecification', () => {
    it('should return specification for known AI', () => {
      const spec = getAISpecification(STANDARD_AIS.GTIN);
      
      expect(spec).toBeDefined();
      expect(spec?.ai).toBe(STANDARD_AIS.GTIN);
      expect(spec?.title).toContain('GTIN');
    });
    
    it('should return undefined for unknown AI', () => {
      const spec = getAISpecification('9999');
      
      expect(spec).toBeUndefined();
    });
  });
  
  describe('isKnownAI', () => {
    it('should return true for known AI', () => {
      expect(isKnownAI(STANDARD_AIS.GTIN)).toBe(true);
      expect(isKnownAI(STANDARD_AIS.BATCH_LOT)).toBe(true);
    });
    
    it('should return false for unknown AI', () => {
      expect(isKnownAI('9999')).toBe(false);
    });
  });
  
  describe('getAllKnownAIs', () => {
    it('should return array of known AIs', () => {
      const ais = getAllKnownAIs();
      
      expect(Array.isArray(ais)).toBe(true);
      expect(ais.length).toBeGreaterThan(0);
      expect(ais).toContain(STANDARD_AIS.GTIN);
      expect(ais).toContain(STANDARD_AIS.BATCH_LOT);
    });
  });
  
  describe('GTIN validation', () => {
    it('should validate correct GTIN', () => {
      const spec = getAISpecification(STANDARD_AIS.GTIN);
      
      expect(spec?.validator?.('01234567890128')).toBe(true); // Valid checksum
    });
    
    it('should reject GTIN with invalid checksum', () => {
      const spec = getAISpecification(STANDARD_AIS.GTIN);
      
      expect(spec?.validator?.('01234567890123')).toBe(false); // Invalid checksum
    });
    
    it('should reject GTIN with invalid length', () => {
      const spec = getAISpecification(STANDARD_AIS.GTIN);
      
      expect(spec?.validator?.('123')).toBe(false); // Too short
      expect(spec?.validator?.('123456789012345')).toBe(false); // Too long
    });
  });
  
  describe('Date validation', () => {
    it('should validate correct dates', () => {
      const spec = getAISpecification(STANDARD_AIS.PRODUCTION_DATE);
      
      expect(spec?.validator?.('230315')).toBe(true); // 15 marca 2023
      expect(spec?.validator?.('221231')).toBe(true); // 31 grudnia 2022
    });
    
    it('should reject invalid dates', () => {
      const spec = getAISpecification(STANDARD_AIS.PRODUCTION_DATE);
      
      expect(spec?.validator?.('231301')).toBe(false); // Miesiąc 13
      expect(spec?.validator?.('230232')).toBe(false); // 32 lutego
      expect(spec?.validator?.('220229')).toBe(false); // 29 lutego w roku nieprzestępnym
    });
    
    it('should accept leap year date', () => {
      const spec = getAISpecification(STANDARD_AIS.PRODUCTION_DATE);
      
      expect(spec?.validator?.('200229')).toBe(true); // 29 lutego 2020 (rok przestępny)
    });
  });
});