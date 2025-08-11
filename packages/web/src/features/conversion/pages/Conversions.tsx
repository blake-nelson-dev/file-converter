import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../../services';
import type { UserFile } from '../../../services/firestore.service';
import { useAuth } from '../../../contexts/AuthContext';
import ConversionStatus from '../components/ConversionStatus';
import FilePreview from '../components/FilePreview';
import { ConversionStatusType } from 'shared';
import { 
  SearchInput, 
  FilterSelect, 
  FilterOption, 
  StatusBadge, 
  SortButton, 
  EmptyState,
  Button 
} from '../../../shared/components';

interface FilterState {
  status: ConversionStatusType | 'all';
  search: string;
}

const statusFilterOptions: FilterOption<ConversionStatusType | 'all'>[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' }
];

const sortByOptions: FilterOption<'uploadedAt' | 'fileName' | 'conversionStatus'>[] = [
  { value: 'uploadedAt', label: 'Upload Date' },
  { value: 'fileName', label: 'File Name' },
  { value: 'conversionStatus', label: 'Status' }
];

const Conversions: React.FC = () => {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    search: ''
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [sortBy, setSortBy] = useState<'uploadedAt' | 'fileName' | 'conversionStatus'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load user files
  useEffect(() => {
    const loadFiles = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        const userFiles = await firestoreService.getUserFiles(currentUser.uid, 100);
        setFiles(userFiles);
      } catch (err) {
        console.error('Error loading files:', err);
        setError('Failed to load your files. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentUser]);

  // Filter and sort files
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files;

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(file => file.conversionStatus === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(file => 
        file.fileName.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'fileName':
          aValue = a.fileName.toLowerCase();
          bValue = b.fileName.toLowerCase();
          break;
        case 'conversionStatus':
          aValue = a.conversionStatus || 'pending';
          bValue = b.conversionStatus || 'pending';
          break;
        case 'uploadedAt':
        default:
          aValue = a.uploadedAt;
          bValue = b.uploadedAt;
          // Convert Firebase Timestamp to comparable value
          if (typeof aValue === 'object' && aValue.seconds) aValue = aValue.seconds;
          if (typeof bValue === 'object' && bValue.seconds) bValue = bValue.seconds;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [files, filters, sortBy, sortOrder]);

  const handleDeleteFile = async (fileId: string) => {
    if (!currentUser || !confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await firestoreService.softDeleteFile(currentUser.uid, fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleDownloadOriginal = async (file: UserFile) => {
    try {
      const downloadUrl = await firestoreService.getFileDownloadUrl(currentUser!.uid, file.id);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | { seconds: number; nanoseconds: number }): string => {
    const dateObj = date instanceof Date ? date : new Date(date.seconds * 1000);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusLabel = (status?: ConversionStatusType) => {
    const labels = {
      pending: 'Pending',
      processing: 'Processing', 
      completed: 'Completed',
      failed: 'Failed'
    };
    return labels[status || 'pending'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading your files...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Conversions</h1>
          <p className="mt-2 text-gray-600">Manage and track your file conversions</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchInput
              value={filters.search}
              onChange={(search) => setFilters(prev => ({ ...prev, search }))}
              placeholder="Search by filename..."
              label="Search files"
            />

            <FilterSelect
              value={filters.status}
              onChange={(status) => setFilters(prev => ({ ...prev, status }))}
              options={statusFilterOptions}
              label="Status"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <div className="flex gap-2">
                <FilterSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortByOptions}
                />
                <SortButton
                  sortOrder={sortOrder}
                  onToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedFiles.length} of {files.length} files
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Files List */}
        {filteredAndSortedFiles.length === 0 ? (
          <EmptyState
            title="No files found"
            description={
              files.length === 0 
                ? "You haven't uploaded any files yet."
                : "No files match your current filters."
            }
            action={
              files.length === 0 ? (
                <Button variant="primary" onClick={() => window.location.href = '/'}>
                  Upload Files
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredAndSortedFiles.map((file) => (
              <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{file.fileName}</h3>
                      <StatusBadge variant={file.conversionStatus || 'pending'}>
                        {getStatusLabel(file.conversionStatus)}
                      </StatusBadge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span>{file.fileType}</span>
                      <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                    </div>

                    {/* Show conversion progress for processing files */}
                    {file.conversionStatus === 'processing' && (
                      <div className="mt-4">
                        <ConversionStatus 
                          fileId={file.id} 
                          fileName={file.fileName}
                          onConversionComplete={() => {
                            // Refresh the file list when conversion completes
                            if (currentUser) {
                              firestoreService.getUserFiles(currentUser.uid, 100)
                                .then(setFiles)
                                .catch(console.error);
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* Show error message for failed conversions */}
                    {file.conversionStatus === 'failed' && file.conversionError && (
                      <div className="mt-2 text-sm text-red-600">
                        Error: {file.conversionError}
                      </div>
                    )}

                    {/* Show processing time for completed conversions */}
                    {file.conversionStatus === 'completed' && file.processingTime && (
                      <div className="mt-2 text-sm text-green-600">
                        Completed in {(file.processingTime / 1000).toFixed(1)}s
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleDownloadOriginal(file)}
                      className="inline-flex items-center"
                      title="Download original file"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Original
                    </Button>

                    {/* Download converted file button - only show if conversion is complete */}
                    {file.conversionStatus === 'completed' && file.convertedPath && (
                      <ConversionStatus 
                        fileId={file.id} 
                        fileName={file.fileName}
                        onConversionComplete={() => {}}
                      />
                    )}

                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleDeleteFile(file.id)}
                      className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50"
                      title="Delete file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <FilePreview 
            file={previewFile} 
            onClose={() => setPreviewFile(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Conversions;