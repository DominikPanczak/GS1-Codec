import { 
  EncodeGS1DataUseCase, 
  DecodeGS1DataUseCase, 
  ValidateGS1DataUseCase
} from '../application';
import { 
  GS1EncodeResult, 
  ValidationResult 
} from '../domain';
import { ServiceFactory } from '../infrastructure';

/**
 * Główna klasa API dla kodeka GS1
 */
export class GS1Codec {
  private readonly encodeUseCase: EncodeGS1DataUseCase;
  private readonly decodeUseCase: DecodeGS1DataUseCase;
  private readonly validateUseCase: ValidateGS1DataUseCase;
  
  constructor() {
    const validationService = ServiceFactory.getValidationService();
    const encodingService = ServiceFactory.getEncodingService();
    
    this.encodeUseCase = new EncodeGS1DataUseCase(validationService, encodingService);
    this.decodeUseCase = new DecodeGS1DataUseCase(validationService, encodingService);
    this.validateUseCase = new ValidateGS1DataUseCase(validationService);
  }
  
  /**
   * Koduje dane do formatu GS1
   * @param data Dane do zakodowania jako obiekt AI -> wartość
   * @returns Wynik kodowania z walidacją
   */
  async encode(data: Record<string, string>): Promise<GS1EncodeResult> {
    const dataMap = new Map(Object.entries(data));
    return await this.encodeUseCase.execute(dataMap);
  }
  
  /**
   * Dekoduje string GS1 do danych
   * @param encodedData Zakodowany string GS1
   * @returns Wynik dekodowania z walidacją jako obiekt AI -> wartość
   */
  async decode(encodedData: string): Promise<GS1DecodeResultFlat> {
    const result = await this.decodeUseCase.execute(encodedData);
    
    // Konwertuj Map do obiektu dla wygody użycia
    const dataObject: Record<string, string> = {};
    result.data.forEach((value, key) => {
      dataObject[key] = value;
    });
    
    return {
      success: result.success,
      data: dataObject,
      errors: result.errors,
      originalData: result.originalData
    };
  }
  
  /**
   * Waliduje pojedynczy element danych GS1
   * @param ai Application Identifier
   * @param value Wartość do walidacji
   * @returns Wynik walidacji
   */
  async validateElement(ai: string, value: string): Promise<ValidationResult> {
    return await this.validateUseCase.validateElement(ai, value);
  }
  
  /**
   * Waliduje zestaw danych GS1
   * @param data Dane do walidacji jako obiekt AI -> wartość
   * @returns Wynik walidacji
   */
  async validateDataSet(data: Record<string, string>): Promise<ValidationResult> {
    const dataMap = new Map(Object.entries(data));
    return await this.validateUseCase.validateDataSet(dataMap);
  }
  
  /**
   * Waliduje zakodowany string GS1
   * @param encodedData Zakodowany string do walidacji
   * @returns Wynik walidacji
   */
  async validateEncodedString(encodedData: string): Promise<ValidationResult> {
    return await this.validateUseCase.validateEncodedString(encodedData);
  }
}

/**
 * Wynik dekodowania z danymi jako obiekt zamiast Map
 */
export interface GS1DecodeResultFlat {
  /** Czy dekodowanie się powiodło */
  readonly success: boolean;
  /** Zdekodowane dane jako obiekt AI -> wartość */
  readonly data: Record<string, string>;
  /** Błędy walidacji jeśli wystąpiły */
  readonly errors: readonly string[];
  /** Oryginalny zakodowany string */
  readonly originalData: string;
}