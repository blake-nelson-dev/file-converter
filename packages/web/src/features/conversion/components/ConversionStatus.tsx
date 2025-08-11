import React, { useEffect, useState } from 'react';
import { firestoreService } from '../../../services';
import type { UserFile } from '../../../services/firestore.service';
import { useAuth } from '../../../contexts/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';

interface ConversionStatusProps {
  fileId: string;
  fileName: string;
  onConversionComplete?: (file: UserFile) => void;
}

const ConversionStatus: React.FC<ConversionStatusProps> = ({ 
  fileId, 
  fileName, 
  onConversionComplete 
}) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState<UserFile | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !fileId) return;

    // Set up real-time listener for file updates
    const fileDoc = doc(db, 'users', currentUser.uid, 'files', fileId);
    const unsubscribe = onSnapshot(fileDoc, async (snapshot) => {
      if (snapshot.exists()) {
        const fileData = {
          id: snapshot.id,
          ...snapshot.data()
        } as UserFile;
        
        setFile(fileData);

        // If conversion is complete, get download URL
        if (fileData.conversionStatus === 'completed' && fileData.convertedPath) {
          try {
            const url = await firestoreService.getDownloadUrlFromPath(fileData.convertedPath);
            setDownloadUrl(url);
            onConversionComplete?.(fileData);
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        }
      }
    }, (error) => {
      console.error('Error listening to file updates:', error);
    });

    return () => unsubscribe();
  }, [currentUser, fileId, onConversionComplete]);

  const getStatusIcon = () => {
    switch (file?.conversionStatus) {
      case 'pending':
        return (
          <svg className="w-5 h-5 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (file?.conversionStatus) {
      case 'pending':
        return 'Waiting to start conversion...';
      case 'processing':
        return 'Converting file...';
      case 'completed':
        return `Conversion complete! ${file.processingTime ? `(${(file.processingTime / 1000).toFixed(1)}s)` : ''}`;
      case 'failed':
        return `Conversion failed: ${file.conversionError || 'Unknown error'}`;
      default:
        return 'Preparing conversion...';
    }
  };

  const getStatusColor = () => {
    switch (file?.conversionStatus) {
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{fileName}</h4>
            <p className="text-xs text-gray-600 mt-1">{getStatusText()}</p>
          </div>
        </div>
        
        {file?.conversionStatus === 'completed' && downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download
          </a>
        )}
      </div>

      {file?.conversionStatus === 'processing' && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionStatus;