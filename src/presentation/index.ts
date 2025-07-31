// Main API
export * from './gs1-codec';

// Re-export domain types for convenience
export { 
  GS1EncodeResult,
  ValidationResult,
  ValidationError,
  ValidationWarning 
} from '../domain';