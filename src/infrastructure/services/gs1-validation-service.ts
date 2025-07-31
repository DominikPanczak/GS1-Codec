import { 
  GS1ValidationService, 
  ValidationResult, 
  ValidationError,
  ValidationWarning 
} from '../../domain/interfaces/services';
import { AISpecificationRepository } from '../../domain/interfaces/repositories';
// import { getAISpecification } from '../../domain/specifications/gs1-specification'; // Not used directly

/**
 * Implementacja serwisu walidacji GS1
 */
export class DefaultGS1ValidationService implements GS1ValidationService {
  
  constructor(
    private readonly aiSpecRepository: AISpecificationRepository
  ) {}
  
  async validateElement(ai: string, value: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    try {
      // Pobierz specyfikację AI
      const spec = await this.aiSpecRepository.getSpecification(ai);
      
      if (!spec) {
        errors.push({
          code: 'UNKNOWN_AI',
          message: `Unknown Application Identifier: ${ai}`,
          field: ai,
          value: value
        });
        return { isValid: false, errors, warnings };
      }
      
      // Walidacja długości
      if (value.length < spec.minLength) {
        errors.push({
          code: 'VALUE_TOO_SHORT',
          message: `Value too short for AI ${ai}. Expected minimum ${spec.minLength} characters, got ${value.length}`,
          field: ai,
          value: value
        });
      }
      
      if (value.length > spec.maxLength) {
        errors.push({
          code: 'VALUE_TOO_LONG',
          message: `Value too long for AI ${ai}. Expected maximum ${spec.maxLength} characters, got ${value.length}`,
          field: ai,
          value: value
        });
      }
      
      // Walidacja typu danych
      if (spec.dataType === 'numeric' && !/^[0-9]+$/.test(value)) {
        errors.push({
          code: 'INVALID_DATA_TYPE',
          message: `Invalid data type for AI ${ai}. Expected numeric value, got: ${value}`,
          field: ai,
          value: value
        });
      }
      
      // Walidacja długości zmiennej
      if (!spec.variableLength && value.length !== spec.maxLength) {
        errors.push({
          code: 'INVALID_FIXED_LENGTH',
          message: `Invalid length for fixed-length AI ${ai}. Expected exactly ${spec.maxLength} characters, got ${value.length}`,
          field: ai,
          value: value
        });
      }
      
      // Wykonaj dodatkową walidację jeśli jest dostępna
      if (spec.validator && !spec.validator(value)) {
        errors.push({
          code: 'CUSTOM_VALIDATION_FAILED',
          message: `Custom validation failed for AI ${ai} with value: ${value}`,
          field: ai,
          value: value
        });
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
      
    } catch (error) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        field: ai,
        value: value
      });
      
      return { isValid: false, errors, warnings };
    }
  }
  
  async validateDataSet(data: Map<string, string>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Waliduj każdy element
    for (const [ai, value] of data.entries()) {
      const elementValidation = await this.validateElement(ai, value);
      errors.push(...elementValidation.errors);
      warnings.push(...elementValidation.warnings);
    }
    
    // Sprawdź czy nie ma pustych danych
    if (data.size === 0) {
      warnings.push({
        code: 'EMPTY_DATASET',
        message: 'Dataset is empty'
      });
    }
    
    // Sprawdź duplikaty AI (nie powinno się zdarzyć z Map, ale sprawdźmy)
    const aiArray = Array.from(data.keys());
    const uniqueAIs = new Set(aiArray);
    if (aiArray.length !== uniqueAIs.size) {
      errors.push({
        code: 'DUPLICATE_AI',
        message: 'Dataset contains duplicate Application Identifiers'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  async validateEncodedString(encodedData: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    if (!encodedData || encodedData.trim().length === 0) {
      errors.push({
        code: 'EMPTY_ENCODED_DATA',
        message: 'Encoded data is empty',
        value: encodedData
      });
      return { isValid: false, errors, warnings };
    }
    
    // Podstawowa walidacja formatu
    // GS1 string powinien zaczynać się od AI (2-4 cyfry)
    if (!/^[0-9]{2,4}/.test(encodedData)) {
      errors.push({
        code: 'INVALID_FORMAT',
        message: 'Encoded data does not start with a valid Application Identifier',
        value: encodedData
      });
    }
    
    // Sprawdź czy nie ma niedozwolonych znaków kontrolnych
    if (/[\x00-\x1F\x7F]/.test(encodedData)) {
      warnings.push({
        code: 'CONTROL_CHARACTERS',
        message: 'Encoded data contains control characters',
        value: encodedData
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}