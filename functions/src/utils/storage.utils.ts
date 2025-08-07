import * as admin from 'firebase-admin';

/**
 * Downloads a file from Firebase Storage to memory
 * 
 * @param filePath - Path to the file in Firebase Storage
 * @returns Buffer containing the file data
 */
export async function downloadFileToMemory(filePath: string): Promise<Buffer> {
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);
  
  const [exists] = await file.exists();
  if (!exists) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const [buffer] = await file.download();
  return buffer;
}

/**
 * Uploads a file buffer to Firebase Storage
 * 
 * @param buffer - File data as a Buffer
 * @param destinationPath - Where to save the file in Storage
 * @param contentType - MIME type of the file
 * @returns The path where the file was saved
 */
export async function uploadFileFromBuffer(
  buffer: Buffer,
  destinationPath: string,
  contentType: string
): Promise<string> {
  const bucket = admin.storage().bucket();
  const file = bucket.file(destinationPath);
  
  await file.save(buffer, {
    metadata: {
      contentType,
      metadata: {
        convertedAt: new Date().toISOString(),
        processedBy: 'pdf-to-docx-converter',
      },
    },
  });
  
  return destinationPath;
}

/**
 * Generates a converted file path based on the original path with new directory structure
 * 
 * @param originalPath - Original file path in Storage
 * @param newExtension - New file extension (e.g., 'docx')
 * @returns Path for the converted file
 */
export function generateConvertedFilePath(
  originalPath: string,
  newExtension: string
): string {
  // Handle the new directory structure
  if (originalPath.includes('/conversions/')) {
    // For new structure: files/{userId}/conversions/{year}/{month}/{conversionType}/{uuid}-{timestamp}-{filename}
    // or: temp/conversions/{date}/{conversionType}/{uuid}/original.{ext}
    
    if (originalPath.startsWith('files/')) {
      // Permanent storage: replace extension and add converted indicator
      const pathWithoutExt = originalPath.replace(/\.[^/.]+$/, '');
      return `${pathWithoutExt}.${newExtension}`;
    } else {
      // Temporary storage: replace the filename
      const pathParts = originalPath.split('/');
      pathParts[pathParts.length - 1] = `converted.${newExtension}`;
      return pathParts.join('/');
    }
  } else {
    // Fallback for old structure
    const pathWithoutExt = originalPath.replace(/\.[^/.]+$/, '');
    return `${pathWithoutExt}-converted.${newExtension}`;
  }
}

/**
 * Validates file type based on MIME type and extension
 * 
 * @param fileName - Name of the file
 * @param contentType - MIME type of the file
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if file type is valid
 */
export function isValidFileType(
  fileName: string,
  contentType: string,
  allowedTypes: string[]
): boolean {
  // Check MIME type
  if (!allowedTypes.includes(contentType)) {
    return false;
  }
  
  // Additional extension check for security
  const extension = fileName.split('.').pop()?.toLowerCase();
  const expectedExtensions: { [key: string]: string[] } = {
    'application/pdf': ['pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'application/msword': ['doc'],
  };
  
  const validExtensions = expectedExtensions[contentType] || [];
  return extension ? validExtensions.includes(extension) : false;
}

/**
 * Gets file metadata from Firebase Storage
 * 
 * @param filePath - Path to the file in Storage
 * @returns File metadata object
 */
export async function getFileMetadata(filePath: string) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);
  
  const [metadata] = await file.getMetadata();
  return metadata;
}