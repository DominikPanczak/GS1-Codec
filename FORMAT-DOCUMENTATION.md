# 📋 Format danych wyjściowych GS1 Codec

## 🎯 **Ogólny format**

```
AI₁ + Wartość₁ + [Separator] + AI₂ + Wartość₂ + [Separator] + AI₃ + Wartość₃ + ...
```

## 📊 **Konkretne przykłady**

### 1. **Pojedynczy element (GTIN)**
```
Wejście: { "01": "01234567890120" }
Wyjście: "0101234567890120"
         ^^  ^^^^^^^^^^^^^^
         AI  GTIN (14 cyfr)
```

### 2. **Wiele elementów**
```
Wejście: {
  "01": "01234567890120",  // GTIN
  "10": "LOT123",          // Numer partii
  "11": "230315"           // Data produkcji
}

Wyjście: "0101234567890120\u001D10LOT123\u001D11230315"
         ^^  ^^^^^^^^^^^^^^ ^^^^ ^^^^^^^^ ^^^^ ^^^^^^^^
         |   |              |    |        |    |
         AI  GTIN(14)       GS   Partia   AI   Data(6)
```

### 3. **Z separatorami wizualnymi**
```
01 01234567890120 [GS] 10 LOT123 [GS] 11 230315
│  │              │    │  │      │    │  │
│  └─ GTIN        │    │  └─ Lot │    │  └─ YYMMDD
│                 │    │        │    │
└─ AI GTIN        │    └─ AI Lot │    └─ AI Date
                  │             │
                  └─ Separator  └─ Separator
```

## 🔧 **Specyfikacja techniczna**

### **Application Identifiers (AI)**
- **Format**: 2-4 cyfry
- **Przykłady**: `01`, `10`, `11`, `17`, `21`, `3100`, `410`

### **Wartości**
- **Numeryczne**: Tylko cyfry 0-9
- **Alfanumeryczne**: Litery, cyfry, niektóre znaki specjalne
- **Długość**: Stała lub zmienna (zależnie od AI)

### **Separatory**
- **Separator GS**: ASCII 29 (`\u001D`)
- **Kiedy używany**: Po elementach o **zmiennej długości**
- **Kiedy NIE używany**: Po elementach o **stałej długości**

## 📏 **Reguły długości**

| AI | Opis | Długość | Typ | Separator po |
|----|------|---------|-----|--------------|
| `01` | GTIN | 14 (stała) | Numeryczny | ❌ NIE |
| `10` | Batch/Lot | 1-20 (zmienna) | Alfanumeryczny | ✅ TAK |
| `11` | Production Date | 6 (stała) | Numeryczny | ❌ NIE |
| `17` | Expiration Date | 6 (stała) | Numeryczny | ❌ NIE |
| `21` | Serial Number | 1-20 (zmienna) | Alfanumeryczny | ✅ TAK |
| `30` | Count | 1-8 (zmienna) | Numeryczny | ✅ TAK |

## 🔍 **Przykłady rzeczywiste**

### **Produkt spożywczy**
```javascript
{
  "01": "07622210995311",  // GTIN produktu
  "17": "251231",          // Ważny do 31.12.2025
  "10": "A1B2C3"           // Numer partii
}
```
**Wyjście**: `"0107622210995311172512310A1B2C3"`

### **Produkt farmaceutyczny**
```javascript
{
  "01": "00012345678905",  // GTIN leku
  "17": "240630",          // Ważny do 30.06.2024
  "21": "SN123456789",     // Numer seryjny
  "10": "LOT2024001"       // Numer partii
}
```
**Wyjście**: `"00012345678905172406"` + GS + `"21SN123456789"` + GS + `"10LOT2024001"`

## 📚 **Referencje standardów**

Format danych wyjściowych jest zgodny z oficjalnymi specyfikacjami GS1:

- **[GS1 General Specifications](https://www.gs1.org/docs/barcodes/GS1_General_Specifications.pdf)** - Section 5.1 (Data Formatting Rules)
- **[Application Identifiers](https://www.gs1.org/standards/id-keys/application-identifiers)** - Definicje wszystkich AI
- **[GS1-128 Standard](https://www.gs1.org/standards/barcodes/gs1-128)** - Reguły separatorów FNC1

## ⚙️ **Implementacja w kodzie**

```javascript
const { createGS1Codec, STANDARD_AIS } = require('gs1-codec');

const codec = createGS1Codec();

// Kodowanie
const result = await codec.encode({
  [STANDARD_AIS.GTIN]: "01234567890120",
  [STANDARD_AIS.BATCH_LOT]: "LOT123",
  [STANDARD_AIS.PRODUCTION_DATE]: "230315"
});

console.log(result.encodedData);
// Wynik: "0101234567890120\u001D10LOT123\u001D11230315"

// Dekodowanie
const decoded = await codec.decode(result.encodedData);
console.log(decoded.data);
// Wynik: { "01": "01234567890120", "10": "LOT123", "11": "230315" }
```

## 🎨 **Format dla różnych zastosowań**

### **Kod kreskowy (GS1-128)**
- Użyj separatorów FNC1 zamiast GS
- Format binarny dla drukarek

### **QR Code (GS1 DataMatrix)**  
- Ten sam format tekstowy
- Kompresja w QR code

### **Tekstowy (plain)**
- Dokładnie tak jak pokazano powyżej
- Gotowy do transmisji/przechowywania