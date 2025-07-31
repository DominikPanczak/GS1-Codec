import { 
  GS1ValidationService, 
  GS1EncodingService, 
  GS1ParsingService 
} from '../../domain/interfaces/services';
import { AISpecificationRepository } from '../../domain/interfaces/repositories';

import { InMemoryAISpecificationRepository } from '../repositories/ai-specification-repository';
import { DefaultGS1ValidationService } from '../services/gs1-validation-service';
import { DefaultGS1ParsingService } from '../services/gs1-parsing-service';
import { DefaultGS1EncodingService } from '../services/gs1-encoding-service';

/**
 * Factory do tworzenia serwisów infrastruktury
 */
export class ServiceFactory {
  private static aiSpecRepository: AISpecificationRepository | null = null;
  private static validationService: GS1ValidationService | null = null;
  private static parsingService: GS1ParsingService | null = null;
  private static encodingService: GS1EncodingService | null = null;
  
  /**
   * Pobiera repozytorium specyfikacji AI (singleton)
   */
  static getAISpecificationRepository(): AISpecificationRepository {
    if (!this.aiSpecRepository) {
      this.aiSpecRepository = new InMemoryAISpecificationRepository();
    }
    return this.aiSpecRepository;
  }
  
  /**
   * Pobiera serwis walidacji (singleton)
   */
  static getValidationService(): GS1ValidationService {
    if (!this.validationService) {
      this.validationService = new DefaultGS1ValidationService(
        this.getAISpecificationRepository()
      );
    }
    return this.validationService;
  }
  
  /**
   * Pobiera serwis parsowania (singleton)
   */
  static getParsingService(): GS1ParsingService {
    if (!this.parsingService) {
      this.parsingService = new DefaultGS1ParsingService(
        this.getAISpecificationRepository()
      );
    }
    return this.parsingService;
  }
  
  /**
   * Pobiera serwis kodowania (singleton)
   */
  static getEncodingService(): GS1EncodingService {
    if (!this.encodingService) {
      this.encodingService = new DefaultGS1EncodingService(
        this.getParsingService(),
        this.getAISpecificationRepository()
      );
    }
    return this.encodingService;
  }
  
  /**
   * Resetuje wszystkie singletons (przydatne do testów)
   */
  static reset(): void {
    this.aiSpecRepository = null;
    this.validationService = null;
    this.parsingService = null;
    this.encodingService = null;
  }
}