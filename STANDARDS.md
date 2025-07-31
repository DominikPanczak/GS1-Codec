# 📋 Standardy i specyfikacje GS1

## 🎯 Implementowane standardy

Biblioteka **gs1-codec** implementuje oficjalne standardy GS1 zgodnie z następującymi dokumentami:

## 📖 Oficjalne specyfikacje GS1

### 1. **GS1 General Specifications** ⭐
- **Link**: https://www.gs1.org/standards/barcodes-epcrfid-id-keys/gs1-general-specifications
- **PDF**: https://www.gs1.org/docs/barcodes/GS1_General_Specifications.pdf
- **Wersja**: v23.0+ (aktualizowana rocznie)
- **Rozmiar**: 650+ stron
- **Status**: Główny dokument referencyjny

### 2. **Application Identifiers (AI)**
- **Link**: https://www.gs1.org/standards/id-keys/application-identifiers
- **Opis**: Kompletna tabela wszystkich 200+ Application Identifiers
- **Użycie**: Definicje AI zaimplementowanych w bibliotece

### 3. **GS1-128 Barcode Standard**
- **Link**: https://www.gs1.org/standards/barcodes/gs1-128
- **Opis**: Standard kodów kreskowych liniowych
- **Użycie**: Reguły separatorów FNC1 i formatowania

### 4. **GTIN (Global Trade Item Number)**
- **Link**: https://www.gs1.org/standards/id-keys/gtin
- **Opis**: Globalne identyfikatory produktów
- **Użycie**: Algorytm walidacji sumy kontrolnej

## 🔧 Dodatkowe zasoby

### Implementation Guidelines
- **Link**: https://www.gs1.org/standards/implementation-guidelines
- **Opis**: Praktyczne wskazówki implementacji

### Validation Tools
- **Link**: https://www.gs1.org/services/check-digit-calculator
- **Opis**: Narzędzia online do walidacji

### Developer Resources
- **Link**: https://www.gs1.org/standards/development-resources
- **Opis**: Zasoby dla programistów

## 📐 Standardy ISO wspierające GS1

### ISO/IEC 15424 - Data Matrix
- Symbologia 2D dla GS1 DataMatrix
- Zastosowanie w kodach QR

### ISO/IEC 15417 - Code 128
- Podstawa dla GS1-128
- Encoding symboli i znaków kontrolnych

### ISO/IEC 15420 - EAN/UPC
- Standardy kodów kreskowych EAN-13, UPC-A
- Algorytmy sum kontrolnych

## ✅ Zgodność implementacji

### Zaimplementowane sekcje GS1 General Specifications:

#### **Section 3 - Application Identifiers**
- ✅ Definicje podstawowych AI (01, 10, 11, 17, 21, 30, 3100-3105)
- ✅ Reguły długości (stała vs zmienna)
- ✅ Typy danych (numeryczne, alfanumeryczne, daty)

#### **Section 5.1 - Data Formatting Rules**
- ✅ Separatory FNC1 (ASCII 29)
- ✅ Kolejność AI (sortowanie rosnące)
- ✅ Reguły umieszczania separatorów

#### **Section 7.9 - GS1-128 Symbology**
- ✅ Struktura danych wyjściowych
- ✅ Group Separator między elementami zmiennej długości
- ✅ Brak separatorów po elementach stałej długości

#### **Appendix A - AI Table**
- ✅ Podstawowe AI zgodnie z tabelą
- ⚠️ Nie wszystkie 200+ AI (implementuje ~15 najczęściej używanych)

### Algorytmy walidacji:

#### **GTIN-14 Checksum (EAN-13)**
- ✅ Algorytm zgodny z ISO/IEC 15420
- ✅ Walidacja sum kontrolnych
- ✅ Obsługa GTIN-8, GTIN-12, GTIN-13, GTIN-14

#### **Format dat YYMMDD**
- ✅ Walidacja zakresu miesięcy (01-12)
- ✅ Walidacja dni w miesiącu
- ✅ Obsługa lat przestępnych

## 🔍 Zakres zgodności

### ✅ **Pełna zgodność:**
- Struktura Application Identifiers
- Reguły formatowania danych wyjściowych
- Algorytmy walidacji GTIN
- Separatory FNC1/Group Separator
- Formaty dat YYMMDD

### ⚠️ **Częściowa zgodność:**
- **Kompletność AI**: Implementuje podstawowe AI, nie wszystkie 200+
- **Specjalne przypadki**: Niektóre AI mają dodatkowe reguły biznesowe
- **Rozszerzenia branżowe**: Specyfikacje dla konkretnych branż

### 🔄 **Do weryfikacji:**
- Zgodność z najnowszymi aktualizacjami GS1
- Specyficzne wymagania branżowe
- Lokalne adaptacje standardu

## 📅 Aktualizacje standardów

GS1 General Specifications są aktualizowane **rocznie**. Biblioteka została stworzona na podstawie wersji **v23.0+**.

### Zalecane działania:
1. **Przed produkcją**: Sprawdź najnowszą wersję specyfikacji
2. **Specyficzne AI**: Zweryfikuj wymagania dla konkretnych Application Identifiers
3. **Branża**: Sprawdź dodatkowe wymagania dla swojej branży

## 🎯 Zastosowania produkcyjne

Biblioteka jest **gotowa do użycia produkcyjnego** dla:
- ✅ Podstawowych zastosowań GS1
- ✅ Kodów kreskowych GS1-128
- ✅ Kodów QR z danymi GS1
- ✅ Systemów inwentaryzacji
- ✅ Logistyki i łańcucha dostaw

### Wymaga dodatkowej weryfikacji dla:
- ⚠️ Specjalistycznych branż (farmacja, żywność)
- ⚠️ Zaawansowanych AI z dodatkowymi regułami
- ⚠️ Integracji z systemami legacy

---

**📞 Kontakt**: W przypadku pytań dotyczących zgodności ze standardami, skonsultuj się z oficjalną dokumentacją GS1 lub lokalnym przedstawicielem GS1.