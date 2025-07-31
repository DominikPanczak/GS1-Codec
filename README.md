# GS1 Codec Library

Biblioteka TypeScript do kodowania i dekodowania danych GS1 z walidacją zgodną ze standardem. Implementuje architekturę onion dla czystego rozdzielenia warstw i łatwego testowania.

## Funkcjonalności

- ✅ **Kodowanie danych GS1** - konwersja danych do formatu GS1
- ✅ **Dekodowanie danych GS1** - parsowanie zakodowanych stringów GS1
- ✅ **Walidacja danych** - sprawdzanie zgodności ze standardem GS1
- ✅ **Obsługa błędów** - szczegółowe informacje o błędach walidacji
- ✅ **Architektura onion** - czysta architektura z oddzielonymi warstwami
- ✅ **TypeScript** - pełne wsparcie typów
- ✅ **Node.js** - gotowe do użycia w aplikacjach Node.js

## Instalacja

```bash
npm install gs1-codec
```

## Szybki start

```typescript
import { createGS1Codec, STANDARD_AIS } from 'gs1-codec';

const codec = createGS1Codec();

// Przygotuj dane
const data = {
  [STANDARD_AIS.GTIN]: '01234567890128',
  [STANDARD_AIS.BATCH_LOT]: 'LOT2023001',
  [STANDARD_AIS.PRODUCTION_DATE]: '230315'
};

// Kodowanie
const encodeResult = await codec.encode(data);
if (encodeResult.success) {
  console.log('Zakodowane:', encodeResult.encodedData);
}

// Dekodowanie
const decodeResult = await codec.decode(encodeResult.encodedData);
if (decodeResult.success) {
  console.log('Zdekodowane:', decodeResult.data);
}
```

## API

### GS1Codec

Główna klasa API dla kodeka GS1.

#### Metody

##### `encode(data: Record<string, string>): Promise<GS1EncodeResult>`

Koduje dane do formatu GS1 z walidacją.

```typescript
const result = await codec.encode({
  [STANDARD_AIS.GTIN]: '01234567890128',
  [STANDARD_AIS.BATCH_LOT]: 'LOT123'
});
```

##### `decode(encodedData: string): Promise<GS1DecodeResultFlat>`

Dekoduje string GS1 do danych z walidacją.

```typescript
const result = await codec.decode('0101234567890128' + String.fromCharCode(29) + '10LOT123');
```

##### `validateElement(ai: string, value: string): Promise<ValidationResult>`

Waliduje pojedynczy element danych GS1.

```typescript
const result = await codec.validateElement(STANDARD_AIS.GTIN, '01234567890128');
```

##### `validateDataSet(data: Record<string, string>): Promise<ValidationResult>`

Waliduje zestaw danych GS1.

```typescript
const result = await codec.validateDataSet({
  [STANDARD_AIS.GTIN]: '01234567890128'
});
```

##### `validateEncodedString(encodedData: string): Promise<ValidationResult>`

Waliduje zakodowany string GS1.

```typescript
const result = await codec.validateEncodedString('0101234567890128');
```

## Obsługiwane Application Identifiers (AI)

Biblioteka obsługuje następujące standardowe AI:

- **01** - GTIN (Global Trade Item Number)
- **10** - Batch/Lot Number
- **11** - Production Date
- **15** - Best Before Date
- **17** - Expiration Date
- **21** - Serial Number
- **30** - Count of Items
- **3100-3105** - Weight (kg)
- **410-415** - Location codes
- **8005** - Price
- **90-99** - Internal use

## Walidacja

Biblioteka automatycznie waliduje:

- ✅ Długość wartości (min/max)
- ✅ Typ danych (numeryczne/alfanumeryczne)
- ✅ Sumy kontrolne (np. dla GTIN)
- ✅ Format dat (YYMMDD)
- ✅ Strukturę zakodowanych danych

## Architektura

Projekt implementuje architekturę onion z następującymi warstwami:

```
src/
├── domain/           # Warstwa domeny - entitety, value objects, specyfikacje
├── application/      # Warstwa aplikacji - use cases
├── infrastructure/   # Warstwa infrastruktury - implementacje serwisów
└── presentation/     # Warstwa prezentacji - publiczne API
```

## Przykłady

Zobacz katalog `examples/` dla szczegółowych przykładów użycia:

- `basic-usage.ts` - podstawowe kodowanie/dekodowanie
- `validation-examples.ts` - przykłady walidacji
- `error-handling.ts` - obsługa błędów

### Uruchomienie przykładów

```bash
# Zainstaluj zależności
npm install

# Skompiluj kod
npm run build

# Uruchom wszystkie przykłady
cd examples
npm install
npm run all
```

## Rozwój

### Instalacja zależności

```bash
npm install
```

### Kompilacja

```bash
npm run build
```

### Testy

```bash
npm test
```

### Watch mode

```bash
npm run dev
```

## 📚 Referencje i standardy

Biblioteka implementuje następujące standardy GS1:

### Oficjalne specyfikacje GS1:
- **[GS1 General Specifications](https://www.gs1.org/standards/barcodes-epcrfid-id-keys/gs1-general-specifications)** - główny dokument standardu
- **[GS1 General Specifications PDF](https://www.gs1.org/docs/barcodes/GS1_General_Specifications.pdf)** - pełna dokumentacja (650+ stron)
- **[Application Identifiers](https://www.gs1.org/standards/id-keys/application-identifiers)** - tabele wszystkich AI
- **[GS1-128 Barcode Standard](https://www.gs1.org/standards/barcodes/gs1-128)** - standard kodów kreskowych
- **[GTIN Standard](https://www.gs1.org/standards/id-keys/gtin)** - Global Trade Item Number

### Implementowane sekcje:
- **Section 3** - Application Identifiers (AI)
- **Section 5.1** - Reguły formatowania danych
- **Section 7.9** - Symbologia GS1-128
- **Appendix A** - Tabela wszystkich AI

### Standardy ISO:
- **ISO/IEC 15424** - Data Matrix
- **ISO/IEC 15417** - Code 128
- **ISO/IEC 15420** - EAN/UPC

### Zgodność:
Biblioteka jest zgodna z **GS1 General Specifications v23.0+** w zakresie podstawowych Application Identifiers i reguł formatowania.

## Licencja

MIT

## Wkład

Zachęcamy do wkładu! Proszę:

1. Forkuj repozytorium
2. Stwórz branch dla nowej funkcjonalności
3. Dodaj testy
4. Wyślij pull request

## Wsparcie

Jeśli napotkasz problemy lub masz pytania:

1. Sprawdź istniejące issues
2. Stwórz nowe issue z szczegółowym opisem
3. Dołącz przykład kodu reprodukującego problem