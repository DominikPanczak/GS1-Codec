/**
 * Value object reprezentujący Application Identifier (AI) w standardzie GS1
 */
export class ApplicationIdentifier {
  private readonly _value: string;
  
  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid Application Identifier: ${value}`);
    }
    this._value = value;
  }
  
  get value(): string {
    return this._value;
  }
  
  private isValid(value: string): boolean {
    // AI musi być 2-4 cyframi
    return /^[0-9]{2,4}$/.test(value);
  }
  
  equals(other: ApplicationIdentifier): boolean {
    return this._value === other._value;
  }
  
  toString(): string {
    return this._value;
  }
}

/**
 * Definicje standardowych AI zgodnie z GS1
 */
export const STANDARD_AIS = {
  // Identyfikacja produktu
  GTIN: '01',
  GTIN_OF_CONTAINED_TRADE_ITEMS: '02',
  
  // Daty
  PRODUCTION_DATE: '11',
  DUE_DATE: '12',
  PACKAGING_DATE: '13',
  BEST_BEFORE_DATE: '15',
  SELL_BY_DATE: '16',
  EXPIRATION_DATE: '17',
  
  // Miary i wagi
  WEIGHT_KG: '3100',
  WEIGHT_KG_3101: '3101',
  WEIGHT_KG_3102: '3102',
  WEIGHT_KG_3103: '3103',
  WEIGHT_KG_3104: '3104',
  WEIGHT_KG_3105: '3105',
  
  // Liczby seryjne i partie
  BATCH_LOT: '10',
  SERIAL: '21',
  
  // Ilości
  COUNT: '30',
  
  // Lokalizacja
  SHIP_TO_LOC: '410',
  BILL_TO: '411',
  PURCHASE_FROM: '412',
  SHIP_FOR_LOC: '413',
  LOC_NO: '414',
  PAY_TO: '415',
  
  // Referencje
  REF_TO_SOURCE: '251',
  GDTI: '253',
  GLN_EXTENSION: '254',
  
  // Cena
  PRICE: '8005',
  
  // Dodatkowe identyfikatory
  CPID: '8010',
  CPID_SERIAL: '8011',
  VERSION: '8012',
  
  // Dla aplikacji wewnętrznych
  INTERNAL: '90',
  INTERNAL_91: '91',
  INTERNAL_92: '92',
  INTERNAL_93: '93',
  INTERNAL_94: '94',
  INTERNAL_95: '95',
  INTERNAL_96: '96',
  INTERNAL_97: '97',
  INTERNAL_98: '98',
  INTERNAL_99: '99'
} as const;

export type StandardAI = typeof STANDARD_AIS[keyof typeof STANDARD_AIS];