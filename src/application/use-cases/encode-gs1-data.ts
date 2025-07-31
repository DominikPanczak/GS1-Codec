import { 
  GS1EncodeResult, 
  GS1ValidationService, 
  GS1EncodingService
} from '../../domain';

/**
 * Use case do kodowania danych GS1
 */
export class EncodeGS1DataUseCase {
  constructor(
    private readonly validationService: GS1ValidationService,
    private readonly encodingService: GS1EncodingService
  ) {}

  /**
   * Koduje dane do formatu GS1 z walidacją
   */
  async execute(data: Map<string, string>): Promise<GS1EncodeResult> {
    try {
      // Walidacja danych wejściowych
      const validationResult = await this.validationService.validateDataSet(data);
      
      if (!validationResult.isValid) {
        return {
          success: false,
          encodedData: '',
          errors: validationResult.errors.map(e => e.message),
          inputData: data
        };
      }

      // Kodowanie danych
      const encodeResult = await this.encodingService.encode(data);
      
      if (!encodeResult.success) {
        return encodeResult;
      }

      // Dodatkowa walidacja zakodowanego stringa
      const encodedValidation = await this.validationService.validateEncodedString(encodeResult.encodedData);
      
      if (!encodedValidation.isValid) {
        return {
          success: false,
          encodedData: '',
          errors: [
            ...encodeResult.errors,
            ...encodedValidation.errors.map(e => `Validation of encoded data failed: ${e.message}`)
          ],
          inputData: data
        };
      }

      return encodeResult;
      
    } catch (error) {
      return {
        success: false,
        encodedData: '',
        errors: [`Encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        inputData: data
      };
    }
  }
}

/**
 * DTO dla żądania kodowania
 */
export interface EncodeGS1DataRequest {
  /** Dane do zakodowania jako mapa AI -> wartość */
  readonly data: Record<string, string>;
  /** Opcje kodowania */
  readonly options?: EncodeOptions;
}

/**
 * Opcje kodowania
 */
export interface EncodeOptions {
  /** Czy włączyć ścisłą walidację */
  readonly strictValidation?: boolean;
  /** Czy dodać separatory funkcyjne (FNC1) */
  readonly includeFunctionCodeOne?: boolean;
  /** Format wyjściowy */
  readonly outputFormat?: 'gs1-128' | 'gs1-datamatrix' | 'plain';
}