import type { AISpecification } from '../specifications/gs1-specification';

/**
 * Repository dla specyfikacji AI
 */
export interface AISpecificationRepository {
  /** Pobierz specyfikację dla danego AI */
  getSpecification(ai: string): Promise<AISpecification | undefined>;
  
  /** Pobierz wszystkie dostępne specyfikacje */
  getAllSpecifications(): Promise<AISpecification[]>;
  
  /** Sprawdź czy AI jest obsługiwane */
  isSupported(ai: string): Promise<boolean>;
}

/**
 * Repository dla konfiguracji walidacji
 */
export interface ValidationConfigRepository {
  /** Pobierz konfigurację walidacji dla danego AI */
  getValidationRules(ai: string): Promise<ValidationRule[]>;
  
  /** Sprawdź czy walidacja jest włączona dla AI */
  isValidationEnabled(ai: string): Promise<boolean>;
}

/**
 * Reguła walidacji
 */
export interface ValidationRule {
  readonly name: string;
  readonly description: string;
  readonly validator: (value: string) => boolean;
  readonly errorMessage: string;
}