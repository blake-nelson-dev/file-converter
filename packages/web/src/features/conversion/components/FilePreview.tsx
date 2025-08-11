import React, { useState } from 'react';

interface FilePreviewProps {
  file: File;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isText = file.type.startsWith('text/');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex justify-center p-4">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="max-h-96 max-w-full object-contain rounded-lg shadow-md"
            onError={() => setError('Failed to load image')}
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">PDF Preview</p>
          <p className="text-sm text-gray-400">PDF files cannot be previewed in browser</p>
          <p className="text-xs text-gray-400 mt-2">File will be processed for conversion</p>
        </div>
      );
    }

    if (isText && file.size < 1024 * 1024) { // Only preview text files under 1MB
      const reader = new FileReader();
      const [textContent, setTextContent] = useState<string>('');

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content.substring(0, 1000)); // Limit to first 1000 characters
      };
      reader.readAsText(file);

      return (
        <div className="p-4">
          <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap">
            {textContent}
            {file.size > 1000 && '...'}
          </pre>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
        <p className="text-lg font-medium">File Preview</p>
        <p className="text-sm text-gray-400">Preview not available for this file type</p>
        <p className="text-xs text-gray-400 mt-1">{file.type || 'Unknown type'}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900 truncate">{file.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>{formatFileSize(file.size)}</span>
              <span>{file.type || 'Unknown type'}</span>
              <span>Modified: {new Date(file.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content */}
        <div className="max-h-96 overflow-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : (
            renderPreview()
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;