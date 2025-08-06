import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  storagePath: string;
  downloadURL: string;
  uploadedAt: Timestamp | Date;
  uuid: string;
  status: 'active' | 'deleted';
}

export interface UserFile extends FileMetadata {
  id: string;
}

class FirestoreService {
  /**
   * Creates a file metadata document for saved files (saveToAccount = true)
   * @param userId - User ID
   * @param fileData - File metadata to save
   * @returns Document ID
   */
  async createFileDocument(userId: string, fileData: Omit<FileMetadata, 'uploadedAt' | 'status'>): Promise<string> {
    try {
      const filesCollection = collection(db, 'users', userId, 'files');
      
      const docData: FileMetadata = {
        ...fileData,
        uploadedAt: serverTimestamp() as Timestamp,
        status: 'active'
      };

      const docRef = await addDoc(filesCollection, docData);
      return docRef.id;
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
}

export const firestoreService = new FirestoreService();