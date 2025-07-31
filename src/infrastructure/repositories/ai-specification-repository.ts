import { 
  AISpecificationRepository
} from '../../domain/interfaces/repositories';
import { 
  AISpecification,
  getAISpecification, 
  getAllKnownAIs 
} from '../../domain/specifications/gs1-specification';

/**
 * Implementacja repozytorium specyfikacji AI w pamięci
 */
export class InMemoryAISpecificationRepository implements AISpecificationRepository {
  
  async getSpecification(ai: string): Promise<AISpecification | undefined> {
    return getAISpecification(ai);
  }
  
  async getAllSpecifications(): Promise<AISpecification[]> {
    const allAIs = getAllKnownAIs();
    return allAIs
      .map(ai => getAISpecification(ai))
      .filter((spec): spec is AISpecification => spec !== undefined);
  }
  
  async isSupported(ai: string): Promise<boolean> {
    return getAISpecification(ai) !== undefined;
  }
}