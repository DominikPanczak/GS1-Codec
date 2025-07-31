import { 
  GS1ParsingService, 
  ParsedElement 
} from '../../domain/interfaces/services';
import { AISpecificationRepository } from '../../domain/interfaces/repositories';
import { getAISpecification } from '../../domain/specifications/gs1-specification';

/**
 * Implementacja serwisu parsowania GS1
 */
export class DefaultGS1ParsingService implements GS1ParsingService {
  
  constructor(
    private readonly aiSpecRepository: AISpecificationRepository
  ) {}
  
  async parseElements(encodedData: string): Promise<ParsedElement[]> {
    const elements: ParsedElement[] = [];
    let position = 0;
    
    while (position < encodedData.length) {
      // Próbuj zidentyfikować AI
      const aiResult = await this.identifyAIAtPosition(encodedData, position);
      
      if (!aiResult) {
        // Nie można zidentyfikować AI - przerwij parsowanie
        break;
      }
      
      const { ai, aiLength } = aiResult;
      const valueStartPosition = position + aiLength;
      
      // Pobierz specyfikację AI
      const spec = await this.aiSpecRepository.getSpecification(ai);
      
      if (!spec) {
        // Nieznane AI - zapisz jako nieprawidłowy element
        elements.push({
          ai,
          value: '',
          startPosition: position,
          endPosition: position + aiLength,
          isValid: false
        });
        position += aiLength;
        continue;
      }
      
      // Określ długość wartości
      let valueLength: number;
      let value: string;
      
      if (spec.variableLength) {
        // Dla zmiennych długości, szukaj separatora lub końca stringa
        const remainingData = encodedData.substring(valueStartPosition);
        const separatorIndex = this.findNextSeparator(remainingData, spec.maxLength);
        
        if (separatorIndex !== -1) {
          valueLength = separatorIndex;
          value = remainingData.substring(0, separatorIndex);
        } else {
          // Brak separatora - weź do końca lub maksymalną długość
          valueLength = Math.min(remainingData.length, spec.maxLength);
          value = remainingData.substring(0, valueLength);
        }
      } else {
        // Stała długość
        valueLength = spec.maxLength;
        value = encodedData.substring(valueStartPosition, valueStartPosition + valueLength);
      }
      
      // Sprawdź czy wartość jest prawidłowa
      const isValid = await this.validateElementValue(ai, value, spec);
      
      elements.push({
        ai,
        value,
        startPosition: position,
        endPosition: valueStartPosition + valueLength,
        isValid
      });
      
      position = valueStartPosition + valueLength;
      
      // Jeśli następny znak to separator, pomiń go
      if (position < encodedData.length && this.isSeparator(encodedData[position])) {
        position++;
      }
    }
    
    return elements;
  }
  
  async identifyAIs(encodedData: string): Promise<string[]> {
    const elements = await this.parseElements(encodedData);
    return elements.map(element => element.ai);
  }
  
  async validateFormat(encodedData: string): Promise<boolean> {
    try {
      const elements = await this.parseElements(encodedData);
      
      // Sprawdź czy udało się sparsować całą długość
      if (elements.length === 0) {
        return false;
      }
      
      const lastElement = elements[elements.length - 1];
      const parsedLength = lastElement.endPosition;
      
      // Sprawdź czy sparsowano całą długość (ignorując trailing separators)
      const trimmedLength = encodedData.trimEnd().length;
      
      return parsedLength >= trimmedLength;
      
    } catch {
      return false;
    }
  }
  
  /**
   * Identyfikuje AI na danej pozycji
   */
  private async identifyAIAtPosition(data: string, position: number): Promise<{ ai: string; aiLength: number } | null> {
    // Próbuj AI o długości 4, potem 3, potem 2
    for (const aiLength of [4, 3, 2]) {
      if (position + aiLength > data.length) {
        continue;
      }
      
      const potentialAI = data.substring(position, position + aiLength);
      
      if (!/^[0-9]+$/.test(potentialAI)) {
        continue;
      }
      
      const isSupported = await this.aiSpecRepository.isSupported(potentialAI);
      if (isSupported) {
        return { ai: potentialAI, aiLength };
      }
    }
    
    return null;
  }
  
  /**
   * Znajduje następny separator w danych
   */
  private findNextSeparator(data: string, maxLength: number): number {
    // Szukaj FNC1 (Group Separator) lub następnego AI
    for (let i = 1; i <= Math.min(data.length, maxLength); i++) {
      const char = data[i - 1];
      
      // Sprawdź czy to separator
      if (this.isSeparator(char)) {
        return i - 1;
      }
      
      // Sprawdź czy następne znaki to potencjalny AI
      if (i < data.length - 1) {
        const nextChars = data.substring(i, Math.min(i + 4, data.length));
        if (/^[0-9]{2,4}/.test(nextChars)) {
          // Sprawdź czy to rzeczywiście AI
          for (const aiLength of [2, 3, 4]) {
            if (i + aiLength <= data.length) {
              const potentialAI = nextChars.substring(0, aiLength);
              if (getAISpecification(potentialAI)) {
                return i;
              }
            }
          }
        }
      }
    }
    
    return -1; // Nie znaleziono separatora
  }
  
  /**
   * Sprawdza czy znak jest separatorem
   */
  private isSeparator(char: string): boolean {
    // FNC1 jest reprezentowany jako Group Separator (ASCII 29) lub czasem jako znak kontrolny
    return char === String.fromCharCode(29) || char === '\u001D';
  }
  
  /**
   * Waliduje wartość elementu
   */
  private async validateElementValue(_ai: string, value: string, spec: any): Promise<boolean> {
    if (value.length < spec.minLength || value.length > spec.maxLength) {
      return false;
    }
    
    if (spec.dataType === 'numeric' && !/^[0-9]+$/.test(value)) {
      return false;
    }
    
    if (spec.validator && !spec.validator(value)) {
      return false;
    }
    
    return true;
  }
}