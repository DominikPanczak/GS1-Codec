import { 
  GS1DecodeResult, 
  GS1ValidationService, 
  GS1EncodingService
} from '../../domain';

/**
 * Use case do dekodowania danych GS1
 */
export class DecodeGS1DataUseCase {
  constructor(
    private readonly validationService: GS1ValidationService,
    private readonly encodingService: GS1EncodingService
  ) {}

  /**
   * Dekoduje string GS1 do danych z walidacją
   */
  async execute(encodedData: string, options?: DecodeOptions): Promise<GS1DecodeResult> {
    try {
      // Walidacja formatu danych wejściowych
      const formatValidation = await this.validationService.validateEncodedString(encodedData);
      
      if (!formatValidation.isValid && options?.strictValidation !== false) {
        return {
          success: false,
          data: new Map(),
          errors: formatValidation.errors.map(e => e.message),
          originalData: encodedData
        };
      }

      // Dekodowanie danych
      const decodeResult = await this.encodingService.decode(encodedData);
      
      if (!decodeResult.success) {
        return decodeResult;
      }

      // Walidacja zdekodowanych danych
      const dataValidation = await this.validationService.validateDataSet(new Map(decodeResult.data));
      
      if (!dataValidation.isValid && options?.returnInvalidData !== true) {
        return {
          success: false,
          data: new Map(),
          errors: [
            ...decodeResult.errors,
            ...dataValidation.errors.map(e => `Decoded data validation failed: ${e.message}`)
          ],
          originalData: encodedData
        };
      }

      // Jeśli są błędy walidacji ale chcemy zwrócić dane i tak
      if (!dataValidation.isValid && options?.returnInvalidData === true) {
        return {
          success: false,
          data: decodeResult.data,
          errors: [
            ...decodeResult.errors,
            ...dataValidation.errors.map(e => `Warning: ${e.message}`)
          ],
          originalData: encodedData
        };
      }

      return decodeResult;
      
    } catch (error) {
      return {
        success: false,
        data: new Map(),
        errors: [`Decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        originalData: encodedData
      };
    }
  }
}

/**
 * DTO dla żądania dekodowania
 */
export interface DecodeGS1DataRequest {
  /** Zakodowany string GS1 */
  readonly encodedData: string;
  /** Opcje dekodowania */
  readonly options?: DecodeOptions;
}

/**
 * Opcje dekodowania
 */
export interface DecodeOptions {
  /** Czy włączyć ścisłą walidację */
  readonly strictValidation?: boolean;
  /** Czy zwrócić dane nawet jeśli walidacja się nie powiodła */
  readonly returnInvalidData?: boolean;
  /** Czy parsować daty do obiektów Date */
  readonly parseDates?: boolean;
  /** Czy normalizować wartości */
  readonly normalizeValues?: boolean;
}