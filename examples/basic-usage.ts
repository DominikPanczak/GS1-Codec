import { GS1Codec, createGS1Codec, STANDARD_AIS } from '../src/index';

/**
 * Podstawowy przykład użycia biblioteki GS1 Codec
 */
async function basicExample() {
  console.log('=== Podstawowy przykład użycia GS1 Codec ===\n');
  
  // Stwórz instancję kodeka
  const codec = createGS1Codec();
  
  // Przygotuj dane do zakodowania
  const productData = {
    [STANDARD_AIS.GTIN]: '01234567890128',           // GTIN produktu
    [STANDARD_AIS.BATCH_LOT]: 'LOT2023001',         // Numer partii
    [STANDARD_AIS.PRODUCTION_DATE]: '230315',       // Data produkcji (15 marca 2023)
    [STANDARD_AIS.EXPIRATION_DATE]: '250315',       // Data ważności (15 marca 2025)
    [STANDARD_AIS.SERIAL]: 'SN123456789'            // Numer seryjny
  };
  
  console.log('Dane wejściowe:');
  console.log(JSON.stringify(productData, null, 2));
  console.log();
  
  try {
    // 1. Walidacja danych przed kodowaniem
    console.log('1. Walidacja danych...');
    const validation = await codec.validateDataSet(productData);
    
    if (!validation.isValid) {
      console.log('❌ Błędy walidacji:');
      validation.errors.forEach(error => console.log(`   - ${error.message}`));
      return;
    }
    console.log('✅ Dane są prawidłowe');
    console.log();
    
    // 2. Kodowanie danych
    console.log('2. Kodowanie danych...');
    const encodeResult = await codec.encode(productData);
    
    if (!encodeResult.success) {
      console.log('❌ Błędy kodowania:');
      encodeResult.errors.forEach(error => console.log(`   - ${error}`));
      return;
    }
    
    console.log('✅ Kodowanie udane!');
    console.log(`Zakodowane dane: ${encodeResult.encodedData}`);
    console.log(`Długość: ${encodeResult.encodedData.length} znaków`);
    console.log();
    
    // 3. Dekodowanie danych
    console.log('3. Dekodowanie danych...');
    const decodeResult = await codec.decode(encodeResult.encodedData);
    
    if (!decodeResult.success) {
      console.log('❌ Błędy dekodowania:');
      decodeResult.errors.forEach(error => console.log(`   - ${error}`));
      return;
    }
    
    console.log('✅ Dekodowanie udane!');
    console.log('Zdekodowane dane:');
    console.log(JSON.stringify(decodeResult.data, null, 2));
    console.log();
    
    // 4. Porównanie danych
    console.log('4. Porównanie danych...');
    const isEqual = JSON.stringify(productData) === JSON.stringify(decodeResult.data);
    console.log(isEqual ? '✅ Dane identyczne!' : '❌ Dane różnią się!');
    
  } catch (error) {
    console.error('❌ Wystąpił nieoczekiwany błąd:', error);
  }
}

// Uruchom przykład
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample };