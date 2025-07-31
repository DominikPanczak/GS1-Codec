import { basicExample } from './basic-usage';
import { validationExamples } from './validation-examples';
import { errorHandlingExamples } from './error-handling';

/**
 * Uruchamia wszystkie przykłady
 */
async function runAllExamples() {
  console.log('🚀 Uruchamianie wszystkich przykładów GS1 Codec\n');
  console.log('=' .repeat(60));
  
  try {
    await basicExample();
    console.log('\n' + '='.repeat(60));
    
    await validationExamples();
    console.log('\n' + '='.repeat(60));
    
    await errorHandlingExamples();
    console.log('\n' + '='.repeat(60));
    
    console.log('\n✅ Wszystkie przykłady zostały wykonane pomyślnie!');
    
  } catch (error) {
    console.error('\n❌ Wystąpił błąd podczas wykonywania przykładów:', error);
    process.exit(1);
  }
}

// Uruchom wszystkie przykłady
if (require.main === module) {
  runAllExamples();
}

export { runAllExamples };