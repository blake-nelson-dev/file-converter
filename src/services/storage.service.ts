import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import type { UploadTaskSnapshot } from 'firebase/storage';
import { auth, storage } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { firestoreService } from './firestore.service';

export interface UploadOptions {
  saveToAccount: boolean;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onComplete?: (downloadURL: string) => void;
}

export interface FileUploadResult {
  downloadURL: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
}

class StorageService {
  private storage = storage;

  /**
   * Generates a secure storage path using UUID
   * @param fileName - Original file name
   * @param saveToAccount - Whether to save permanently or temporarily
   * @returns Object with storage path and uuid
   */
  private generateStoragePath(fileName: string, saveToAccount: boolean): { path: string; uuid: string } {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated to upload files');

    // Generate secure UUID for this upload
    const uuid = uuidv4();

    if (saveToAccount) {
      // Permanent storage: /files/{userId}/{uuid}-{fileName}
      return {
        path: `files/${user.uid}/${uuid}-${fileName}`,
        uuid
      };
    } else {
      // Temporary storage: /temp/{uuid}/{anonymizedFileName}
      // Fully anonymous - no user ID included
      // Anonymize filename but keep extension for processing
      const fileExtension = fileName.includes('.') 
        ? fileName.substring(fileName.lastIndexOf('.')) 
        : '';
      const anonymizedFileName = `file${fileExtension}`;
      
      return {
        path: `temp/${uuid}/${anonymizedFileName}`,
        uuid
      };
    }
  }

  /**
   * Uploads a file to Firebase Storage
   * @param file - File to upload
   * @param options - Upload options including storage preference
   * @returns Promise with upload result
   */
  async uploadFile(
    file: File, 
    options: UploadOptions
  ): Promise<FileUploadResult> {
    try {
      const { path: storagePath, uuid } = this.generateStoragePath(file.name, options.saveToAccount);
      const storageRef = ref(this.storage, storagePath);
      
      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Return a promise that tracks the upload
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            // Calculate and report progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (options.onProgress) {
              options.onProgress(progress);
            }
          },
          (error) => {
            // Handle upload errors
            if (options.onError) {
              options.onError(error);
            }
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              const result: FileUploadResult = {
                downloadURL,
                storagePath,
                fileName: file.name,
                fileSize: file.size
              };

              // Create Firestore document if saving to account
              if (options.saveToAccount && auth.currentUser) {
                try {
                  await firestoreService.createFileDocument(auth.currentUser.uid, {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type || 'unknown',
                    storagePath,
                    uuid
                    // downloadURL removed - will be generated on demand
                  });
                } catch (firestoreError) {
                  console.error('Failed to create Firestore document:', firestoreError);
                  // Continue even if Firestore fails - file is already uploaded
                }
              }

              if (options.onComplete) {
                options.onComplete(downloadURL);
              }

              resolve(result);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      if (options.onError && error instanceof Error) {
        options.onError(error);
      }
      throw error;
    }
  }

  /**
   * Generates a download URL for a file in storage
   * @param storagePath - Path to the file in storage
   * @returns Promise with download URL
   */
  async getFileDownloadURL(storagePath: string): Promise<string> {
    const storageRef = ref(this.storage, storagePath);
    return getDownloadURL(storageRef);
  }

  /**
   * Deletes a file from storage
   * @param storagePath - Path to the file in storage
   * @returns Promise that resolves when file is deleted
   */
  async deleteFile(storagePath: string): Promise<void> {
    const storageRef = ref(this.storage, storagePath);
    return deleteObject(storageRef);
  }

  /**
   * Checks if the current user is authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}

// Export a singleton instance
export const storageService = new StorageService();