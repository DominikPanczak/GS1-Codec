import { 
  GS1ValidationService,
  ValidationResult
} from '../../domain';

/**
 * Use case do walidacji danych GS1
 */
export class ValidateGS1DataUseCase {
  constructor(
    private readonly validationService: GS1ValidationService
  ) {}

  /**
   * Waliduje pojedynczy element danych
   */
  async validateElement(ai: string, value: string): Promise<ValidationResult> {
    try {
      return await this.validationService.validateElement(ai, value);
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          code: 'VALIDATION_ERROR',
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          field: ai,
          value: value
        }],
        warnings: []
      };
    }
  }

  /**
   * Waliduje zestaw danych
   */
  async validateDataSet(data: Map<string, string>): Promise<ValidationResult> {
    try {
      return await this.validationService.validateDataSet(data);
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          code: 'VALIDATION_ERROR',
          message: `Dataset validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        warnings: []
      };
    }
  }

  /**
   * Waliduje zakodowany string GS1
   */
  async validateEncodedString(encodedData: string): Promise<ValidationResult> {
    try {
      return await this.validationService.validateEncodedString(encodedData);
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          code: 'VALIDATION_ERROR',
          message: `Encoded string validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          value: encodedData
        }],
        warnings: []
      };
    }
  }
}

/**
 * DTO dla żądania walidacji elementu
 */
export interface ValidateElementRequest {
  readonly ai: string;
  readonly value: string;
}

/**
 * DTO dla żądania walidacji zestawu danych
 */
export interface ValidateDataSetRequest {
  readonly data: Record<string, string>;
}

/**
 * DTO dla żądania walidacji zakodowanego stringa
 */
export interface ValidateEncodedStringRequest {
  readonly encodedData: string;
}