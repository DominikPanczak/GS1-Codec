import { GS1DecodeResult, GS1EncodeResult } from '../entities/gs1-data';

/**
 * Serwis do walidacji danych GS1
 */
export interface GS1ValidationService {
  /** Waliduje pojedynczy element danych */
  validateElement(ai: string, value: string): Promise<ValidationResult>;
  
  /** Waliduje zestaw danych */
  validateDataSet(data: Map<string, string>): Promise<ValidationResult>;
  
  /** Waliduje zakodowany string GS1 */
  validateEncodedString(encodedData: string): Promise<ValidationResult>;
}

/**
 * Serwis do kodowania danych GS1
 */
export interface GS1EncodingService {
  /** Koduje dane do formatu GS1 */
  encode(data: Map<string, string>): Promise<GS1EncodeResult>;
  
  /** Dekoduje string GS1 do danych */
  decode(encodedData: string): Promise<GS1DecodeResult>;
}

/**
 * Serwis do parsowania danych GS1
 */
export interface GS1ParsingService {
  /** Parsuje zakodowany string do elementów */
  parseElements(encodedData: string): Promise<ParsedElement[]>;
  
  /** Identyfikuje AI w stringu */
  identifyAIs(encodedData: string): Promise<string[]>;
  
  /** Sprawdza format danych */
  validateFormat(encodedData: string): Promise<boolean>;
}

/**
 * Wynik walidacji
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
}

/**
 * Błąd walidacji
 */
export interface ValidationError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly value?: string;
}

/**
 * Ostrzeżenie walidacji
 */
export interface ValidationWarning {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly value?: string;
}

/**
 * Sparsowany element danych
 */
export interface ParsedElement {
  readonly ai: string;
  readonly value: string;
  readonly startPosition: number;
  readonly endPosition: number;
  readonly isValid: boolean;
}