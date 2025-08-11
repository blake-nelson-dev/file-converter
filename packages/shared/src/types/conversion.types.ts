// Base types for conversion status
export type ConversionStatusType = 'pending' | 'processing' | 'completed' | 'failed';

export type ConversionType = 'pdf-to-docx' | 'docx-to-pdf' | 'image-conversion';

export type FileStatusType = 'active' | 'deleted';

// Generic interfaces for flexibility across frontend and backend
export interface BaseFileMetadata {
  readonly uuid: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly fileType: string;
  readonly storagePath: string;
  readonly status: FileStatusType;
  readonly conversionStatus?: ConversionStatusType;
  readonly conversionError?: string;
  readonly convertedPath?: string;
  readonly processingTime?: number;
}

// Frontend-specific file metadata (using Firebase web SDK types)
export interface ClientFileMetadata extends BaseFileMetadata {
  readonly uploadedAt: Date | { seconds: number; nanoseconds: number }; // Firebase Timestamp
  readonly convertedAt?: Date | { seconds: number; nanoseconds: number };
}

// Backend-specific file metadata (using Firebase Admin SDK types)
export interface ServerFileMetadata extends BaseFileMetadata {
  readonly uploadedAt: Date;
  readonly convertedAt?: Date;
}

// For file documents with Firestore document ID
export interface UserFile extends ClientFileMetadata {
  readonly id: string;
}

// Update payloads for type safety
export interface ConversionStatusUpdate {
  conversionStatus: ConversionStatusType;
  lastUpdated: unknown; // Firebase FieldValue - varies by SDK
  convertedPath?: string;
  convertedAt?: unknown; // Firebase FieldValue
  processingTime?: number;
  conversionError?: string;
}

// Input types for creating files
export interface CreateFileInput {
  readonly fileName: string;
  readonly fileSize: number;
  readonly fileType: string;
  readonly storagePath: string;
  readonly uuid: string;
  readonly conversionStatus?: ConversionStatusType;
}

// Validation helpers
export const SUPPORTED_CONVERSION_TYPES: readonly ConversionType[] = [
  'pdf-to-docx',
  'docx-to-pdf', 
  'image-conversion'
] as const;

export const CONVERSION_STATUSES: readonly ConversionStatusType[] = [
  'pending',
  'processing', 
  'completed',
  'failed'
] as const;

// Type guards for runtime validation
export const isConversionStatus = (value: string): value is ConversionStatusType => {
  return CONVERSION_STATUSES.includes(value as ConversionStatusType);
};

export const isConversionType = (value: string): value is ConversionType => {
  return SUPPORTED_CONVERSION_TYPES.includes(value as ConversionType);
};