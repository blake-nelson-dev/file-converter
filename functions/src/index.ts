/**
 * Firebase Cloud Functions for ConvertStudio
 * 
 * This module handles file conversion operations triggered by Storage uploads
 */

import { setGlobalOptions } from "firebase-functions";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { convertPdfToDocx } from "./converters/pdfToDocx.converter";
import { 
  downloadFileToMemory, 
  uploadFileFromBuffer, 
  generateConvertedFilePath,
  isValidFileType 
} from "./utils/storage.utils";

// Type definition for Firestore update data
interface ConversionStatusUpdate {
  conversionStatus: "processing" | "completed" | "failed";
  lastUpdated: admin.firestore.FieldValue;
  convertedPath?: string;
  convertedAt?: admin.firestore.FieldValue;
  processingTime?: number;
  conversionError?: string;
}

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set global options for cost control and performance
setGlobalOptions({ 
  maxInstances: 10, // Limit concurrent executions
  timeoutSeconds: 540, // 9 minutes timeout for large files
  memory: "1GiB", // Allocate enough memory for file processing (GiB is the correct unit)
});

/**
 * Cloud Function triggered when a file is uploaded to Firebase Storage
 * 
 * This function:
 * 1. Validates the uploaded file type
 * 2. Downloads the file to memory
 * 3. Performs the conversion (currently PDF to DOCX)
 * 4. Uploads the converted file back to Storage
 * 5. Updates Firestore with conversion results
 */
export const processFileConversion = onObjectFinalized(
  {
    region: "us-central1",
    maxInstances: 10,
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const fileSize = Number(event.data.size);
    
    logger.info(`Processing file: ${filePath}`, {
      contentType,
      size: fileSize,
    });
    
    // Skip if file is not in the expected conversion paths
    if (!filePath.includes("/conversions/") || 
        (!filePath.startsWith("files/") && !filePath.startsWith("temp/"))) {
      logger.info("Skipping file - not in conversion path");
      return;
    }
    
    // Skip if file has already been converted (contains "-converted")
    if (filePath.includes("-converted")) {
      logger.info("Skipping already converted file");
      return;
    }
    
    // Validate file type - currently only supporting PDF to DOCX
    if (!isValidFileType(filePath, contentType || "", ["application/pdf"])) {
      logger.warn("Unsupported file type for conversion", { contentType });
      // Update Firestore to mark as unsupported if it's a saved file
      if (filePath.startsWith("files/")) {
        await updateConversionStatus(filePath, "failed", "Unsupported file type");
      }
      return;
    }
    
    // File size limit (10MB for now)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileSize > MAX_FILE_SIZE) {
      logger.error("File too large for conversion", { size: fileSize });
      if (filePath.startsWith("files/")) {
        await updateConversionStatus(filePath, "failed", "File too large (max 10MB)");
      }
      return;
    }
    
    try {
      // Update status to processing
      if (filePath.startsWith("files/")) {
        await updateConversionStatus(filePath, "processing");
      }
      
      // Download the PDF file to memory
      logger.info("Downloading file to memory");
      const pdfBuffer = await downloadFileToMemory(filePath);
      
      // Convert PDF to DOCX
      logger.info("Starting PDF to DOCX conversion");
      const conversionResult = await convertPdfToDocx(pdfBuffer);
      
      if (!conversionResult.success || !conversionResult.buffer) {
        throw new Error(conversionResult.error || "Conversion failed");
      }
      
      // Generate path for converted file
      const convertedPath = generateConvertedFilePath(filePath, "docx");
      
      // Upload converted file to Storage
      logger.info("Uploading converted file", { path: convertedPath });
      await uploadFileFromBuffer(
        conversionResult.buffer,
        convertedPath,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      
      // Update Firestore with success status
      if (filePath.startsWith("files/")) {
        await updateConversionStatus(
          filePath, 
          "completed", 
          undefined, 
          convertedPath,
          conversionResult.processingTime
        );
      }
      
      logger.info("Conversion completed successfully", {
        originalPath: filePath,
        convertedPath,
        processingTime: conversionResult.processingTime,
      });
      
    } catch (error) {
      logger.error("Conversion failed", error);
      
      // Update Firestore with error status
      if (filePath.startsWith("files/")) {
        await updateConversionStatus(
          filePath,
          "failed",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  }
);

/**
 * Updates the conversion status in Firestore
 * 
 * @param filePath - Original file path in Storage
 * @param status - New status to set
 * @param error - Error message if failed
 * @param convertedPath - Path to converted file if successful
 * @param processingTime - Time taken for conversion in ms
 */
async function updateConversionStatus(
  filePath: string,
  status: "processing" | "completed" | "failed",
  error?: string,
  convertedPath?: string,
  processingTime?: number
): Promise<void> {
  try {
    // Extract user ID and file ID from new path structure
    // New format: files/{userId}/conversions/{year}/{month}/{conversionType}/{uuid}-{timestamp}-{filename}
    const pathParts = filePath.split("/");
    
    if (!filePath.startsWith("files/") || pathParts.length < 7) {
      logger.warn("Invalid file path format for Firestore update", { filePath });
      return;
    }
    
    const userId = pathParts[1];
    const fileName = pathParts[pathParts.length - 1]; // Last part is the filename
    // UUID is the first 36 characters (standard UUID format)
    const fileId = fileName.substring(0, 36);
    
    const db = admin.firestore();
    const fileRef = db.collection("users").doc(userId).collection("files").doc(fileId);
    
    const updateData: ConversionStatusUpdate = {
      conversionStatus: status,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    if (status === "completed" && convertedPath) {
      updateData.convertedPath = convertedPath;
      updateData.convertedAt = admin.firestore.FieldValue.serverTimestamp();
      updateData.processingTime = processingTime || 0;
    }
    
    if (status === "failed" && error) {
      updateData.conversionError = error;
    }
    
    await fileRef.update(updateData as {[key: string]: any});
    logger.info("Firestore updated", { fileId, status, userId });
    
  } catch (error) {
    logger.error("Failed to update Firestore", error);
    // Don't throw - this is a non-critical error
  }
}
