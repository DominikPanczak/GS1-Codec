import { GS1Codec, createGS1Codec, STANDARD_AIS } from '../src/index';

/**
 * Przykłady walidacji danych GS1
 */
async function validationExamples() {
  console.log('=== Przykłady walidacji danych GS1 ===\n');
  
  const codec = createGS1Codec();
  
  // Przykład 1: Walidacja pojedynczych elementów
  console.log('1. Walidacja pojedynczych elementów\n');
  
  const testCases = [
    { ai: STANDARD_AIS.GTIN, value: '01234567890128', description: 'Prawidłowy GTIN' },
    { ai: STANDARD_AIS.GTIN, value: '12345', description: 'GTIN za krótki' },
    { ai: STANDARD_AIS.GTIN, value: '01234567890123', description: 'GTIN z błędną sumą kontrolną' },
    { ai: STANDARD_AIS.BATCH_LOT, value: 'LOT123', description: 'Prawidłowy numer partii' },
    { ai: STANDARD_AIS.BATCH_LOT, value: 'A'.repeat(25), description: 'Numer partii za długi' },
    { ai: STANDARD_AIS.PRODUCTION_DATE, value: '230315', description: 'Prawidłowa data' },
    { ai: STANDARD_AIS.PRODUCTION_DATE, value: '231301', description: 'Nieprawidłowa data (miesiąc 13)' },
    { ai: STANDARD_AIS.SERIAL, value: 'SN123456', description: 'Prawidłowy numer seryjny' }
  ];
  
  for (const testCase of testCases) {
    const result = await codec.validateElement(testCase.ai, testCase.value);
    const status = result.isValid ? '✅' : '❌';
    console.log(`${status} ${testCase.description}`);
    console.log(`   AI: ${testCase.ai}, Wartość: "${testCase.value}"`);
    
    if (!result.isValid) {
      result.errors.forEach(error => {
        console.log(`   Błąd: ${error.message}`);
      });
    }
    console.log();
  }
  
  // Przykład 2: Walidacja zestawu danych
  console.log('2. Walidacja zestawu danych\n');
  
  const dataSets = [
    {
      name: 'Prawidłowy zestaw danych',
      data: {
        [STANDARD_AIS.GTIN]: '01234567890128',
        [STANDARD_AIS.BATCH_LOT]: 'LOT2023001',
        [STANDARD_AIS.PRODUCTION_DATE]: '230315'
      }
    },
    {
      name: 'Zestaw z błędami',
      data: {
        [STANDARD_AIS.GTIN]: '123', // Za krótki
        [STANDARD_AIS.BATCH_LOT]: 'A'.repeat(25), // Za długi
        [STANDARD_AIS.PRODUCTION_DATE]: '231301' // Nieprawidłowa data
      }
    },
    {
      name: 'Pusty zestaw',
      data: {}
    }
  ];
  
  for (const dataSet of dataSets) {
    console.log(`Testowanie: ${dataSet.name}`);
    const result = await codec.validateDataSet(dataSet.data);
    const status = result.isValid ? '✅' : '❌';
    console.log(`${status} ${result.isValid ? 'Prawidłowy' : 'Nieprawidłowy'}`);
    
    if (result.errors.length > 0) {
      console.log('   Błędy:');
      result.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('   Ostrzeżenia:');
      result.warnings.forEach(warning => {
        console.log(`   - ${warning.message}`);
      });
    }
    console.log();
  }
  
  // Przykład 3: Walidacja zakodowanych stringów
  console.log('3. Walidacja zakodowanych stringów\n');
  
  const encodedStrings = [
    { data: '0112345678901284', description: 'Prawidłowy zakodowany GTIN' },
    { data: '01123456789012', description: 'GTIN z nieprawidłową długością' },
    { data: 'invalid', description: 'Nieprawidłowy format' },
    { data: '', description: 'Pusty string' },
    { data: '0112345678901284' + String.fromCharCode(29) + '10LOT123', description: 'Wiele elementów z separatorem' }
  ];
  
  for (const testString of encodedStrings) {
    const result = await codec.validateEncodedString(testString.data);
    const status = result.isValid ? '✅' : '❌';
    console.log(`${status} ${testString.description}`);
    console.log(`   Dane: "${testString.data}"`);
    
    if (!result.isValid) {
      result.errors.forEach(error => {
        console.log(`   Błąd: ${error.message}`);
      });
    }
    console.log();
  }
}

// Uruchom przykład
if (require.main === module) {
  validationExamples().catch(console.error);
}

export { validationExamples };