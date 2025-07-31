import { GS1Codec, createGS1Codec, STANDARD_AIS } from '../index';

describe('GS1Codec', () => {
  let codec: GS1Codec;
  
  beforeEach(() => {
    codec = createGS1Codec();
  });
  
  describe('encode', () => {
    it('should encode GTIN successfully', async () => {
      const data = {
        [STANDARD_AIS.GTIN]: '01234567890128'
      };
      
      const result = await codec.encode(data);
      
      expect(result.success).toBe(true);
      expect(result.encodedData).toBe('0101234567890128');
      expect(result.errors).toHaveLength(0);
    });
    
    it('should encode multiple elements with separators', async () => {
      const data = {
        [STANDARD_AIS.GTIN]: '01234567890128',
        [STANDARD_AIS.BATCH_LOT]: 'ABC123'
      };
      
      const result = await codec.encode(data);
      
      expect(result.success).toBe(true);
      expect(result.encodedData).toContain('0101234567890128');
      expect(result.encodedData).toContain('10ABC123');
      expect(result.errors).toHaveLength(0);
    });
    
    it('should fail validation for invalid GTIN', async () => {
      const data = {
        [STANDARD_AIS.GTIN]: '123' // Za krótki
      };
      
      const result = await codec.encode(data);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    it('should fail for empty data', async () => {
      const result = await codec.encode({});
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('decode', () => {
    it('should decode GTIN successfully', async () => {
      const encodedData = '0101234567890128';
      
      const result = await codec.decode(encodedData);
      
      expect(result.success).toBe(true);
      expect(result.data[STANDARD_AIS.GTIN]).toBe('01234567890128');
      expect(result.errors).toHaveLength(0);
    });
    
    it('should decode multiple elements', async () => {
      const encodedData = '0101234567890128' + String.fromCharCode(29) + '10ABC123';
      
      const result = await codec.decode(encodedData);
      
      expect(result.success).toBe(true);
      expect(result.data[STANDARD_AIS.GTIN]).toBe('01234567890128');
      expect(result.data[STANDARD_AIS.BATCH_LOT]).toBe('ABC123');
    });
    
    it('should fail for invalid encoded data', async () => {
      const result = await codec.decode('invalid');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    it('should fail for empty encoded data', async () => {
      const result = await codec.decode('');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('validation', () => {
    it('should validate element successfully', async () => {
      const result = await codec.validateElement(STANDARD_AIS.GTIN, '01234567890128');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should fail validation for invalid element', async () => {
      const result = await codec.validateElement(STANDARD_AIS.GTIN, '123');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    it('should validate data set successfully', async () => {
      const data = {
        [STANDARD_AIS.GTIN]: '01234567890128',
        [STANDARD_AIS.BATCH_LOT]: 'ABC123'
      };
      
      const result = await codec.validateDataSet(data);
      
      expect(result.isValid).toBe(true);
    });
    
    it('should validate encoded string successfully', async () => {
      const result = await codec.validateEncodedString('0101234567890128');
      
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('round-trip encoding/decoding', () => {
    it('should encode and decode data correctly', async () => {
      const originalData = {
        [STANDARD_AIS.GTIN]: '01234567890128',
        [STANDARD_AIS.BATCH_LOT]: 'ABC123',
        [STANDARD_AIS.SERIAL]: 'XYZ789'
      };
      
      // Encode
      const encodeResult = await codec.encode(originalData);
      expect(encodeResult.success).toBe(true);
      
      // Decode
      const decodeResult = await codec.decode(encodeResult.encodedData);
      expect(decodeResult.success).toBe(true);
      
      // Compare
      expect(decodeResult.data).toEqual(originalData);
    });
  });
});