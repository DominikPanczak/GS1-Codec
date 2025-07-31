/**
 * Reprezentuje pojedynczy element danych GS1
 */
export interface GS1DataElement {
  /** Identyfikator aplikacji (AI) */
  readonly applicationIdentifier: string;
  /** Wartość danych */
  readonly value: string;
  /** Czy element jest obowiązkowy */
  readonly required: boolean;
  /** Minimalna długość wartości */
  readonly minLength: number;
  /** Maksymalna długość wartości */
  readonly maxLength: number;
  /** Czy długość jest zmienna */
  readonly variableLength: boolean;
}

/**
 * Kolekcja elementów danych GS1
 */
export interface GS1DataCollection {
  /** Mapa elementów indeksowanych przez AI */
  readonly elements: ReadonlyMap<string, GS1DataElement>;
  
  /** Pobierz element po AI */
  getElement(ai: string): GS1DataElement | undefined;
  
  /** Sprawdź czy zawiera element o danym AI */
  hasElement(ai: string): boolean;
  
  /** Pobierz wszystkie AI */
  getAllAIs(): string[];
  
  /** Pobierz wszystkie elementy jako array */
  getAllElements(): GS1DataElement[];
}

/**
 * Wynik dekodowania danych GS1
 */
export interface GS1DecodeResult {
  /** Czy dekodowanie się powiodło */
  readonly success: boolean;
  /** Zdekodowane dane jako mapa AI -> wartość */
  readonly data: ReadonlyMap<string, string>;
  /** Błędy walidacji jeśli wystąpiły */
  readonly errors: readonly string[];
  /** Oryginalny zakodowany string */
  readonly originalData: string;
}

/**
 * Wynik kodowania danych GS1
 */
export interface GS1EncodeResult {
  /** Czy kodowanie się powiodło */
  readonly success: boolean;
  /** Zakodowany string GS1 */
  readonly encodedData: string;
  /** Błędy walidacji jeśli wystąpiły */
  readonly errors: readonly string[];
  /** Dane wejściowe użyte do kodowania */
  readonly inputData: ReadonlyMap<string, string>;
}