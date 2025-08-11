export interface ConversionJob {
  userId: string;
  fileId: string;
  originalPath: string;
  originalName: string;
  inputFormat: string;
  outputFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  convertedPath?: string;
  startedAt?: Date;
  completedAt?: Date;
  fileSize: number;
  isAnonymous: boolean;
}

export interface ConversionResult {
  success: boolean;
  convertedPath?: string;
  error?: string;
  processingTime?: number;
}