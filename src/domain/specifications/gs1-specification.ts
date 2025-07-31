import { STANDARD_AIS } from '../value-objects/application-identifier';

/**
 * Specyfikacja dla pojedynczego AI
 */
export interface AISpecification {
  readonly ai: string;
  readonly title: string;
  readonly format: string;
  readonly minLength: number;
  readonly maxLength: number;
  readonly variableLength: boolean;
  readonly required: boolean;
  readonly dataType: 'numeric' | 'alphanumeric' | 'date';
  readonly validator?: (value: string) => boolean;
}

/**
 * Specyfikacje AI zgodnie ze standardem GS1
 */
export const GS1_SPECIFICATIONS: Record<string, AISpecification> = {
  [STANDARD_AIS.GTIN]: {
    ai: STANDARD_AIS.GTIN,
    title: 'Global Trade Item Number (GTIN)',
    format: 'N14',
    minLength: 14,
    maxLength: 14,
    variableLength: false,
    required: false,
    dataType: 'numeric',
    validator: (value: string) => {
      // Sprawdź długość
      if (value.length !== 14) return false;
      // Sprawdź czy to tylko cyfry
      if (!/^[0-9]{14}$/.test(value)) return false;
      // Sprawdź sumę kontrolną (algorytm EAN)
      return validateGTINChecksum(value);
    }
  },
  
  [STANDARD_AIS.BATCH_LOT]: {
    ai: STANDARD_AIS.BATCH_LOT,
    title: 'Batch or lot number',
    format: 'X..20',
    minLength: 1,
    maxLength: 20,
    variableLength: true,
    required: false,
    dataType: 'alphanumeric'
  },
  
  [STANDARD_AIS.SERIAL]: {
    ai: STANDARD_AIS.SERIAL,
    title: 'Serial number',
    format: 'X..20',
    minLength: 1,
    maxLength: 20,
    variableLength: true,
    required: false,
    dataType: 'alphanumeric'
  },
  
  [STANDARD_AIS.PRODUCTION_DATE]: {
    ai: STANDARD_AIS.PRODUCTION_DATE,
    title: 'Production date (YYMMDD)',
    format: 'N6',
    minLength: 6,
    maxLength: 6,
    variableLength: false,
    required: false,
    dataType: 'date',
    validator: (value: string) => {
      if (!/^[0-9]{6}$/.test(value)) return false;
      return validateDateYYMMDD(value);
    }
  },
  
  [STANDARD_AIS.EXPIRATION_DATE]: {
    ai: STANDARD_AIS.EXPIRATION_DATE,
    title: 'Expiration date (YYMMDD)',
    format: 'N6',
    minLength: 6,
    maxLength: 6,
    variableLength: false,
    required: false,
    dataType: 'date',
    validator: (value: string) => {
      if (!/^[0-9]{6}$/.test(value)) return false;
      return validateDateYYMMDD(value);
    }
  },
  
  [STANDARD_AIS.BEST_BEFORE_DATE]: {
    ai: STANDARD_AIS.BEST_BEFORE_DATE,
    title: 'Best before date (YYMMDD)',
    format: 'N6',
    minLength: 6,
    maxLength: 6,
    variableLength: false,
    required: false,
    dataType: 'date',
    validator: (value: string) => {
      if (!/^[0-9]{6}$/.test(value)) return false;
      return validateDateYYMMDD(value);
    }
  },
  
  [STANDARD_AIS.COUNT]: {
    ai: STANDARD_AIS.COUNT,
    title: 'Count of items',
    format: 'N..8',
    minLength: 1,
    maxLength: 8,
    variableLength: true,
    required: false,
    dataType: 'numeric',
    validator: (value: string) => {
      return /^[0-9]{1,8}$/.test(value) && parseInt(value) > 0;
    }
  },
  
  [STANDARD_AIS.WEIGHT_KG]: {
    ai: STANDARD_AIS.WEIGHT_KG,
    title: 'Net weight, kilograms (variable measure trade item)',
    format: 'N6',
    minLength: 6,
    maxLength: 6,
    variableLength: false,
    required: false,
    dataType: 'numeric',
    validator: (value: string) => {
      return /^[0-9]{6}$/.test(value);
    }
  }
};

/**
 * Waliduje sumę kontrolną GTIN używając algorytmu EAN
 */
function validateGTINChecksum(gtin: string): boolean {
  if (gtin.length !== 14) return false;
  
  let sum = 0;
  // Algorytm EAN-13/GTIN: pozycje parzyste * 1, nieparzyste * 3 (licząc od prawej)
  for (let i = 0; i < 13; i++) {
    const digit = parseInt(gtin[i]);
    // Odwróć logikę: pozycje nieparzyste (od lewej) to parzyste od prawej
    sum += digit * ((i % 2 === 0) ? 1 : 3);
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(gtin[13]);
}

/**
 * Waliduje datę w formacie YYMMDD
 */
function validateDateYYMMDD(dateString: string): boolean {
  if (dateString.length !== 6) return false;
  
  const year = parseInt(dateString.substring(0, 2));
  const month = parseInt(dateString.substring(2, 4));
  const day = parseInt(dateString.substring(4, 6));
  
  // Sprawdź podstawowe zakresy
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // Sprawdź dni w miesiącu
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return false;
  
  // Sprawdź luty w roku nieprzestępnym
  if (month === 2 && day === 29) {
    const fullYear = year < 50 ? 2000 + year : 1900 + year;
    const isLeapYear = (fullYear % 4 === 0 && fullYear % 100 !== 0) || (fullYear % 400 === 0);
    if (!isLeapYear) return false;
  }
  
  return true;
}

/**
 * Pobiera specyfikację dla danego AI
 */
export function getAISpecification(ai: string): AISpecification | undefined {
  return GS1_SPECIFICATIONS[ai];
}

/**
 * Sprawdza czy AI jest znane
 */
export function isKnownAI(ai: string): boolean {
  return ai in GS1_SPECIFICATIONS;
}

/**
 * Pobiera wszystkie dostępne AI
 */
export function getAllKnownAIs(): string[] {
  return Object.keys(GS1_SPECIFICATIONS);
}