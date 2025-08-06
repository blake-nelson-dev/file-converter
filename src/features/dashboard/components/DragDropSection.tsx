import React, { useState, useCallback } from 'react';
import { storageService } from '../../../services';
import type { FileUploadResult } from '../../../services';
import { useAuth } from '../../../contexts/AuthContext';

interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  result?: FileUploadResult;
  error?: string;
}

interface CompletedFile {
  fileName: string;
  downloadURL: string;
  uploadedAt: Date;
}

// Internal Components
const StorageToggle: React.FC<{
  saveToAccount: boolean;
  onToggle: (value: boolean) => void;
}> = ({ saveToAccount, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div>
      <h4 className="text-sm font-medium text-gray-900">Storage Preference</h4>
      <p className="text-xs text-gray-500 mt-1">
        {saveToAccount 
          ? 'Files will be saved to your account permanently' 
          : 'Files will be deleted after conversion (1 hour)'}
      </p>
    </div>
    <button
      onClick={() => onToggle(!saveToAccount)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        saveToAccount ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      aria-label="Toggle storage preference"
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        saveToAccount ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  </div>
);

const CompletedFiles: React.FC<{
  completedFiles: CompletedFile[];
}> = ({ completedFiles }) => (
  <div className="mt-6 p-4 bg-green-50 rounded-lg">
    <h4 className="text-sm font-medium text-green-900 mb-3">Completed Uploads ({completedFiles.length})</h4>
    <ul className="space-y-2">
      {completedFiles.map((file, index) => (
        <li key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-700">{file.fileName}</span>
          </div>
          <a 
            href={file.downloadURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View file
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const FileUploadProgress: React.FC<{
  uploadStates: FileUploadState[];
  isUploading: boolean;
  onClear: () => void;
}> = ({ uploadStates, isUploading, onClear }) => (
  <div className="mt-6">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Upload Progress:</h4>
    <ul className="space-y-3">
      {uploadStates.map((state, index) => (
        <li key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">{state.file.name}</span>
            <span className="text-xs text-gray-500">
              {state.status === 'completed' && '✓ Uploaded'}
              {state.status === 'uploading' && `${state.progress.toFixed(0)}%`}
              {state.status === 'error' && '✗ Failed'}
              {state.status === 'pending' && 'Waiting...'}
            </span>
          </div>
          {state.status === 'uploading' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          )}
          {state.error && (
            <p className="text-xs text-red-600 mt-1">{state.error}</p>
          )}
          {state.result && (
            <a 
              href={state.result.downloadURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
            >
              View uploaded file
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const DragDropSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [saveToAccount, setSaveToAccount] = useState(true);
  const [uploadStates, setUploadStates] = useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [completedFiles, setCompletedFiles] = useState<CompletedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  }, []);

  const uploadFiles = async () => {
    if (!currentUser) {
      alert('Please sign in to upload files');
      return;
    }

    setIsUploading(true);
    // Clear upload states when starting new upload (this hides completed files)
    setUploadStates([]);
    
    const newUploadStates: FileUploadState[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    setUploadStates(newUploadStates);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      setUploadStates(prev => prev.map((state, index) => 
        index === i ? { ...state, status: 'uploading' as const } : state
      ));

      try {
        const result = await storageService.uploadFile(file, {
          saveToAccount,
          onProgress: (progress) => {
            setUploadStates(prev => prev.map((state, index) => 
              index === i ? { ...state, progress } : state
            ));
          },
          onError: (error) => {
            setUploadStates(prev => prev.map((state, index) => 
              index === i ? { 
                ...state, 
                status: 'error' as const, 
                error: error.message 
              } : state
            ));
          }
        });

        setUploadStates(prev => prev.map((state, index) => 
          index === i ? { 
            ...state, 
            status: 'completed' as const, 
            progress: 100,
            result 
          } : state
        ));

        // Add to completed files
        setCompletedFiles(prev => [...prev, {
          fileName: file.name,
          downloadURL: result.downloadURL,
          uploadedAt: new Date()
        }]);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setIsUploading(false);
    // Clear the files array after upload completes so drag-drop works again
    setFiles([]);
    // Immediately show completed files
    setUploadStates([]);
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadStates([]);
  };

  return (
    <section className="px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-6">
          Quick Convert
        </h2>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
          `}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="File upload"
          />
          
          <svg
            className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            {isDragging ? 'Drop your files here' : 'Drag & drop your files here'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            or <span className="text-blue-600 font-medium">browse</span> to choose files
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Supports all major file formats • Max 100MB per file
          </p>
        </div>

        {files.length > 0 && !uploadStates.length && (
          <div className="mt-6 space-y-4">
            <StorageToggle 
              saveToAccount={saveToAccount} 
              onToggle={setSaveToAccount} 
            />

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selected files:</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={uploadFiles}
                disabled={!currentUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {currentUser ? 'Upload Files' : 'Sign in to Upload'}
              </button>
              <button
                onClick={clearFiles}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {uploadStates.length > 0 && (
          <FileUploadProgress 
            uploadStates={uploadStates}
            isUploading={isUploading}
            onClear={clearFiles}
          />
        )}

        {completedFiles.length > 0 && uploadStates.length === 0 && (
          <CompletedFiles completedFiles={completedFiles} />
        )}
      </div>
    </section>
  );
};

export default DragDropSection;