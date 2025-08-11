import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import type { Timestamp, FieldValue } from 'firebase/firestore';
import { db, storage } from '../config/firebase.config';
import { ref, getDownloadURL } from 'firebase/storage';
import type { 
  ClientFileMetadata, 
  ConversionStatusUpdate, 
  UserFile,
  CreateFileInput,
  ConversionStatusType 
} from 'shared';

// Re-export types for backward compatibility
export type { ClientFileMetadata as FileMetadata, UserFile };

class FirestoreService {
  /**
   * Creates a file metadata document for saved files (saveToAccount = true)
   * @param userId - User ID
   * @param fileData - File metadata to save
   * @returns Document ID
   */
  async createFileDocument(userId: string, fileData: CreateFileInput): Promise<string> {
    try {
      // Use UUID as the document ID for consistent tracking
      const fileDoc = doc(db, 'users', userId, 'files', fileData.uuid);
      
      const docData: Omit<ClientFileMetadata, 'uploadedAt'> & { uploadedAt: FieldValue } = {
        ...fileData,
        uploadedAt: serverTimestamp(),
        status: 'active'
      };

      await setDoc(fileDoc, docData);
      return fileData.uuid;
    } catch (error) {
      console.error('Error creating file document:', error);
      throw error;
    }
  }

  /**
   * Gets all files for a user
   * @param userId - User ID
   * @param limitCount - Maximum number of files to return
   * @returns Array of user files
   */
  async getUserFiles(userId: string, limitCount: number = 50): Promise<UserFile[]> {
    try {
      const filesCollection = collection(db, 'users', userId, 'files');
      const q = query(
        filesCollection,
        where('status', '==', 'active'),
        orderBy('uploadedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserFile));
    } catch (error) {
      console.error('Error getting user files:', error);
      throw error;
    }
  }

  /**
   * Soft deletes a file (marks as deleted but keeps the record)
   * @param userId - User ID
   * @param fileId - File document ID
   */
  async softDeleteFile(userId: string, fileId: string): Promise<void> {
    try {
      const fileDoc = doc(db, 'users', userId, 'files', fileId);
      await setDoc(fileDoc, { status: 'deleted' }, { merge: true });
    } catch (error) {
      console.error('Error soft deleting file:', error);
      throw error;
    }
  }

  /**
   * Permanently deletes a file document
   * @param userId - User ID
   * @param fileId - File document ID
   */
  async hardDeleteFile(userId: string, fileId: string): Promise<void> {
    try {
      const fileDoc = doc(db, 'users', userId, 'files', fileId);
      await deleteDoc(fileDoc);
    } catch (error) {
      console.error('Error hard deleting file:', error);
      throw error;
    }
  }

  /**
   * Gets a secure download URL for a file on demand
   * @param userId - User ID
   * @param fileId - File document ID
   * @returns Download URL
   */
  async getFileDownloadUrl(userId: string, fileId: string): Promise<string> {
    try {
      // Get file metadata from Firestore
      const fileDoc = doc(db, 'users', userId, 'files', fileId);
      const fileSnapshot = await getDoc(fileDoc);
      
      if (!fileSnapshot.exists()) {
        throw new Error('File not found');
      }

      const fileData = fileSnapshot.data() as ClientFileMetadata;
      
      // Check if file is active
      if (fileData.status !== 'active') {
        throw new Error('File has been deleted');
      }

      // Generate fresh download URL from storage path
      const storageRef = ref(storage, fileData.storagePath);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
  }

  /**
   * Gets a secure download URL directly from storage path
   * Use this for temporary files that don't have Firestore records
   * @param storagePath - Path to file in storage
   * @returns Download URL
   */
  async getDownloadUrlFromPath(storagePath: string): Promise<string> {
    try {
      const storageRef = ref(storage, storagePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error generating download URL from path:', error);
      throw error;
    }
  }

  /**
   * Gets a single file document by ID
   * @param userId - User ID
   * @param fileId - File document ID
   * @returns File metadata
   */
  async getFileById(userId: string, fileId: string): Promise<UserFile | null> {
    try {
      const fileDoc = doc(db, 'users', userId, 'files', fileId);
      const fileSnapshot = await getDoc(fileDoc);
      
      if (!fileSnapshot.exists()) {
        return null;
      }

      return {
        id: fileSnapshot.id,
        ...fileSnapshot.data()
      } as UserFile;
    } catch (error) {
      console.error('Error getting file by ID:', error);
      throw error;
    }
  }

  /**
   * Updates the conversion status of a file
   * @param userId - User ID
   * @param fileId - File document ID
   * @param status - New conversion status
   * @param additionalData - Additional data to update
   */
  async updateConversionStatus(
    userId: string, 
    fileId: string, 
    status: ConversionStatusType,
    additionalData?: {
      conversionError?: string;
      convertedPath?: string;
      processingTime?: number;
    }
  ): Promise<void> {
    try {
      const fileDoc = doc(db, 'users', userId, 'files', fileId);
      const updateData: ConversionStatusUpdate = {
        conversionStatus: status,
        lastUpdated: serverTimestamp()
      };

      if (status === 'completed' && additionalData?.convertedPath) {
        updateData.convertedPath = additionalData.convertedPath;
        updateData.convertedAt = serverTimestamp();
        if (additionalData.processingTime) {
          updateData.processingTime = additionalData.processingTime;
        }
      }

      if (status === 'failed' && additionalData?.conversionError) {
        updateData.conversionError = additionalData.conversionError;
      }

      await setDoc(fileDoc, updateData as Partial<ClientFileMetadata>, { merge: true });
    } catch (error) {
      console.error('Error updating conversion status:', error);
      throw error;
    }
  }

  /**
   * Gets files with their conversion status
   * @param userId - User ID
   * @param conversionStatus - Optional filter by conversion status
   * @returns Array of user files with conversion status
   */
  async getUserFilesWithConversionStatus(
    userId: string, 
    conversionStatus?: ConversionStatusType
  ): Promise<UserFile[]> {
    try {
      const filesCollection = collection(db, 'users', userId, 'files');
      let q;

      if (conversionStatus) {
        q = query(
          filesCollection,
          where('status', '==', 'active'),
          where('conversionStatus', '==', conversionStatus),
          orderBy('uploadedAt', 'desc'),
          limit(50)
        );
      } else {
        q = query(
          filesCollection,
          where('status', '==', 'active'),
          orderBy('uploadedAt', 'desc'),
          limit(50)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserFile));
    } catch (error) {
      console.error('Error getting user files with conversion status:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();