import { 
  GS1EncodingService
} from '../../domain/interfaces/services';
import {
  GS1EncodeResult,
  GS1DecodeResult
} from '../../domain/entities/gs1-data';
import { GS1ParsingService } from '../../domain/interfaces/services';
import { AISpecificationRepository } from '../../domain/interfaces/repositories';

/**
 * Implementacja serwisu kodowania GS1
 */
export class DefaultGS1EncodingService implements GS1EncodingService {
  
  constructor(
    private readonly parsingService: GS1ParsingService,
    private readonly aiSpecRepository: AISpecificationRepository
  ) {}
  
  async encode(data: Map<string, string>): Promise<GS1EncodeResult> {
    const errors: string[] = [];
    
    try {
      if (data.size === 0) {
        return {
          success: false,
          encodedData: '',
          errors: ['No data provided for encoding'],
          inputData: data
        };
      }
      
      let encodedString = '';
      
      // Sortuj AI w kolejności rosnącej (zgodnie z zaleceniami GS1)
      const sortedAIs = Array.from(data.keys()).sort();
      
      for (let i = 0; i < sortedAIs.length; i++) {
        const ai = sortedAIs[i];
        const value = data.get(ai)!;
        
        // Pobierz specyfikację AI
        const spec = await this.aiSpecRepository.getSpecification(ai);
        
        if (!spec) {
          errors.push(`Unknown Application Identifier: ${ai}`);
          continue;
        }
        
        // Dodaj AI do stringa
        encodedString += ai;
        
        // Dodaj wartość
        encodedString += value;
        
        // Dodaj separator FNC1 jeśli potrzebny
        if (spec.variableLength && i < sortedAIs.length - 1) {
          // Dodaj FNC1 (Group Separator) między elementami o zmiennej długości
          encodedString += String.fromCharCode(29); // ASCII GS
        }
      }
      
      if (errors.length > 0) {
        return {
          success: false,
          encodedData: '',
          errors,
          inputData: data
        };
      }
      
      return {
        success: true,
        encodedData: encodedString,
        errors: [],
        inputData: data
      };
      
    } catch (error) {
      return {
        success: false,
        encodedData: '',
        errors: [`Encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        inputData: data
      };
    }
  }
  
  async decode(encodedData: string): Promise<GS1DecodeResult> {
    const errors: string[] = [];
    
    try {
      if (!encodedData || encodedData.trim().length === 0) {
        return {
          success: false,
          data: new Map(),
          errors: ['No encoded data provided for decoding'],
          originalData: encodedData
        };
      }
      
      // Parsuj elementy
      const parsedElements = await this.parsingService.parseElements(encodedData);
      
      if (parsedElements.length === 0) {
        return {
          success: false,
          data: new Map(),
          errors: ['No valid elements found in encoded data'],
          originalData: encodedData
        };
      }
      
      // Sprawdź czy wszystkie elementy są prawidłowe
      const invalidElements = parsedElements.filter(element => !element.isValid);
      if (invalidElements.length > 0) {
        errors.push(...invalidElements.map(element => 
          `Invalid element: AI ${element.ai} with value "${element.value}"`
        ));
      }
      
      // Sprawdź czy sparsowano całą długość danych
      const lastElement = parsedElements[parsedElements.length - 1];
      if (lastElement.endPosition < encodedData.length) {
        const unparsedData = encodedData.substring(lastElement.endPosition);
        errors.push(`Unparsed data remaining: "${unparsedData}"`);
      }
      
      // Stwórz mapę z wynikami
      const resultMap = new Map<string, string>();
      
      for (const element of parsedElements) {
        if (resultMap.has(element.ai)) {
          errors.push(`Duplicate Application Identifier found: ${element.ai}`);
        } else {
          resultMap.set(element.ai, element.value);
        }
      }
      
      const success = errors.length === 0;
      
      return {
        success,
        data: resultMap,
        errors,
        originalData: encodedData
      };
      
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