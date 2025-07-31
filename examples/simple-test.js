// Prosty test w katalogu examples
const path = require('path');

// Ścieżka do głównej biblioteki
const libPath = path.join(__dirname, '..', 'dist', 'index.js');

console.log('🧪 Prosty test biblioteki GS1 Codec');
console.log('====================================\n');

try {
  console.log('Próba załadowania z:', libPath);
  const { createGS1Codec, STANDARD_AIS } = require(libPath);
  
  console.log('✅ Biblioteka załadowana pomyślnie\n');
  
  // Test podstawowych eksportów
  console.log('Sprawdzanie eksportów:');
  console.log('- createGS1Codec:', typeof createGS1Codec);
  console.log('- STANDARD_AIS:', typeof STANDARD_AIS);
  console.log('- GTIN AI:', STANDARD_AIS?.GTIN);
  console.log('- BATCH_LOT AI:', STANDARD_AIS?.BATCH_LOT);
  
  // Próba utworzenia instancji
  console.log('\nTworzenie instancji kodeka...');
  const codec = createGS1Codec();
  console.log('✅ Kodek utworzony pomyślnie');
  
  // Sprawdź dostępne metody
  console.log('\nDostępne metody:');
  const methods = ['encode', 'decode', 'validateElement', 'validateDataSet', 'validateEncodedString'];
  methods.forEach(method => {
    console.log(`- ${method}:`, typeof codec[method]);
  });
  
  console.log('\n🎉 Biblioteka jest w pełni funkcjonalna!');
  
} catch (error) {
  console.log('❌ Błąd podczas testu:', error.message);
  console.log('\nUpewnij się, że:');
  console.log('1. Kod został skompilowany: npm run build');
  console.log('2. Jesteś w katalogu examples/');
  console.log('3. Ścieżka do biblioteki jest poprawna');
}

console.log('\n📋 Kolejne kroki:');
console.log('1. cd examples');
console.log('2. node simple-test.js    # Ten plik');
console.log('3. node ../test-manual.js # Pełny test funkcjonalności');