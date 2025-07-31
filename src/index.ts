/**
 * GS1 Codec Library
 * 
 * Biblioteka TypeScript do kodowania i dekodowania danych GS1 z walidacją
 * zgodną ze standardem. Implementuje architekturę onion dla czystego
 * rozdzielenia warstw i łatwego testowania.
 */

// Main API
export { GS1Codec, GS1DecodeResultFlat } from './presentation/gs1-codec';

// Types
export { 
  GS1EncodeResult,
  ValidationResult,
  ValidationError,
  ValidationWarning 
} from './domain';

// Constants
export { 
  STANDARD_AIS,
  StandardAI 
} from './domain/value-objects/application-identifier';

// Factory function for convenience
import { GS1Codec } from './presentation/gs1-codec';

/**
 * Tworzy nową instancję kodeka GS1
 * @returns Nowa instancja GS1Codec
 */
export function createGS1Codec(): GS1Codec {
  return new GS1Codec();
}

// Default export
export default GS1Codec;