import { GS1Codec, createGS1Codec, STANDARD_AIS } from '../src/index';

/**
 * Przykłady obsługi błędów w bibliotece GS1 Codec
 */
async function errorHandlingExamples() {
  console.log('=== Przykłady obsługi błędów ===\n');
  
  const codec = createGS1Codec();
  
  // Przykład 1: Obsługa błędów kodowania
  console.log('1. Obsługa błędów kodowania\n');
  
  const invalidData = {
    [STANDARD_AIS.GTIN]: 'invalid-gtin',  // Nieprawidłowy GTIN
    [STANDARD_AIS.BATCH_LOT]: 'A'.repeat(25),  // Za długa partia
    '9999': 'unknown-ai'  // Nieznany AI
  };
  
  console.log('Próba kodowania nieprawidłowych danych...');
  const encodeResult = await codec.encode(invalidData);
  
  if (!encodeResult.success) {
    console.log('❌ Kodowanie nie powiodło się (zgodnie z oczekiwaniami)');
    console.log('Błędy:');
    encodeResult.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  } else {
    console.log('⚠️  Nieoczekiwane powodzenie kodowania');
  }
  console.log();
  
  // Przykład 2: Obsługa błędów dekodowania
  console.log('2. Obsługa błędów dekodowania\n');
  
  const invalidEncodedData = [
    'invalid-format',
    '99999999999999999999',  // Nieznany AI
    '',  // Pusty string
    '01123'  // Niepełne dane
  ];
  
  for (const data of invalidEncodedData) {
    console.log(`Próba dekodowania: "${data}"`);
    const decodeResult = await codec.decode(data);
    
    if (!decodeResult.success) {
      console.log('❌ Dekodowanie nie powiodło się (zgodnie z oczekiwaniami)');
      console.log('Błędy:');
      decodeResult.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('⚠️  Nieoczekiwane powodzenie dekodowania');
      console.log('Dane:', decodeResult.data);
    }
    console.log();
  }
  
  // Przykład 3: Graceful degradation - kontynuacja pomimo błędów
  console.log('3. Graceful degradation\n');
  
  const partiallyValidData = {
    [STANDARD_AIS.GTIN]: '01234567890128',  // Prawidłowy
    [STANDARD_AIS.BATCH_LOT]: 'LOT123',     // Prawidłowy
    [STANDARD_AIS.PRODUCTION_DATE]: '231301' // Nieprawidłowy
  };
  
  console.log('Walidacja częściowo prawidłowych danych...');
  const validation = await codec.validateDataSet(partiallyValidData);
  
  console.log(`Status walidacji: ${validation.isValid ? '✅ Prawidłowe' : '❌ Nieprawidłowe'}`);
  
  if (validation.errors.length > 0) {
    console.log('Błędy:');
    validation.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.message}`);
      if (error.field) {
        console.log(`      Pole: ${error.field}`);
      }
      if (error.value) {
        console.log(`      Wartość: ${error.value}`);
      }
    });
  }
  
  if (validation.warnings.length > 0) {
    console.log('Ostrzeżenia:');
    validation.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning.message}`);
    });
  }
  console.log();
  
  // Przykład 4: Robustność - duże ilości danych
  console.log('4. Test robustności\n');
  
  // Test z dużą ilością elementów
  const largDataSet: Record<string, string> = {};
  for (let i = 0; i < 100; i++) {
    largDataSet[STANDARD_AIS.INTERNAL + i.toString().padStart(2, '0')] = `VALUE${i}`;
  }
  
  console.log(`Testowanie dużego zestawu danych (${Object.keys(largDataSet).length} elementów)...`);
  
  try {
    const startTime = Date.now();
    const largeValidation = await codec.validateDataSet(largDataSet);
    const endTime = Date.now();
    
    console.log(`⏱️  Czas walidacji: ${endTime - startTime}ms`);
    console.log(`Status: ${largeValidation.isValid ? '✅ Prawidłowe' : '❌ Nieprawidłowe'}`);
    
    if (largeValidation.errors.length > 0) {
      console.log(`Liczba błędów: ${largeValidation.errors.length}`);
    }
    
  } catch (error) {
    console.log('❌ Błąd podczas walidacji dużego zestawu:', error);
  }
}

// Uruchom przykład
if (require.main === module) {
  errorHandlingExamples().catch(console.error);
}

export { errorHandlingExamples };