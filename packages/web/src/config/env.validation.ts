/**
 * Environment Variable Validation and Type Safety
 * 
 * This module ensures all required environment variables are present
 * and provides type-safe access throughout the application
 */

interface EnvironmentConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  features: {
    useEmulators: boolean;
    environment: 'development' | 'staging' | 'production';
    enableAnonymousUploads: boolean;
    maxFileSizeMB: number;
    enableBatchUploads: boolean;
  };
  conversion: {
    supportedInputFormats: string[];
    supportedOutputFormats: string[];
    timeoutSeconds: number;
  };
  security: {
    enableRateLimiting: boolean;
    maxConversionsPerHour: number;
    requireEmailVerification: boolean;
  };
  storage: {
    tempFileTTLHours: number;
    maxStoragePerUserGB: number;
  };
}

/**
 * Validates that a required environment variable exists
 * @param key - The environment variable key
 * @param defaultValue - Optional default value if not required
 * @returns The environment variable value
 * @throws Error if required variable is missing
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  
  // If no value and no default was provided (undefined), it's required and missing
  if (value === undefined && defaultValue === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please check your .env file and ensure it contains ${key}.`
    );
  }
  
  // Return the value if it exists, otherwise the default (which could be empty string)
  return value !== undefined ? value : (defaultValue || '');
}

/**
 * Parses a boolean environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default boolean value
 * @returns The parsed boolean value
 */
function getEnvBool(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === true;
}

/**
 * Parses a number environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default number value
 * @returns The parsed number value
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parses a comma-separated list environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default array value
 * @returns The parsed array value
 */
function getEnvArray(key: string, defaultValue: string[]): string[] {
  const value = import.meta.env[key];
  if (!value) return defaultValue;
  return value.split(',').map((item: string) => item.trim());
}

/**
 * Validates and returns the complete environment configuration
 * This function is called once at app initialization
 */
export function validateEnvironment(): EnvironmentConfig {
  try {
    const config: EnvironmentConfig = {
      firebase: {
        apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
        authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
        projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
        storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
        appId: getEnvVar('VITE_FIREBASE_APP_ID'),
        measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', ''), // Optional - for Analytics
      },
      features: {
        useEmulators: getEnvBool('VITE_USE_FIREBASE_EMULATORS', false),
        environment: (getEnvVar('VITE_ENVIRONMENT', 'development') as 'development' | 'staging' | 'production'),
        enableAnonymousUploads: getEnvBool('VITE_ENABLE_ANONYMOUS_UPLOADS', true),
        maxFileSizeMB: getEnvNumber('VITE_MAX_FILE_SIZE_MB', 10),
        enableBatchUploads: getEnvBool('VITE_ENABLE_BATCH_UPLOADS', true),
      },
      conversion: {
        supportedInputFormats: getEnvArray('VITE_SUPPORTED_INPUT_FORMATS', ['pdf']),
        supportedOutputFormats: getEnvArray('VITE_SUPPORTED_OUTPUT_FORMATS', ['docx']),
        timeoutSeconds: getEnvNumber('VITE_CONVERSION_TIMEOUT_SECONDS', 540),
      },
      security: {
        enableRateLimiting: getEnvBool('VITE_ENABLE_RATE_LIMITING', true),
        maxConversionsPerHour: getEnvNumber('VITE_MAX_CONVERSIONS_PER_HOUR', 100),
        requireEmailVerification: getEnvBool('VITE_REQUIRE_EMAIL_VERIFICATION', false),
      },
      storage: {
        tempFileTTLHours: getEnvNumber('VITE_TEMP_FILE_TTL_HOURS', 1),
        maxStoragePerUserGB: getEnvNumber('VITE_MAX_STORAGE_PER_USER_GB', 5),
      },
    };
    
    // Log configuration in development (without sensitive data)
    if (config.features.environment === 'development') {
      console.info('Environment configuration loaded:', {
        environment: config.features.environment,
        useEmulators: config.features.useEmulators,
        projectId: config.firebase.projectId,
        features: config.features,
      });
    }
    
    return config;
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
}

/**
 * Singleton instance of validated environment configuration
 * Use this throughout the application for type-safe environment access
 */
export const env = validateEnvironment();

/**
 * Helper function to check if we're in development mode
 */
export const isDevelopment = () => env.features.environment === 'development';

/**
 * Helper function to check if we're in production mode
 */
export const isProduction = () => env.features.environment === 'production';

/**
 * Helper function to check if emulators should be used
 */
export const shouldUseEmulators = () => env.features.useEmulators && isDevelopment();