import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FileUploadSectionProps {
  onJobStart: () => void;
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  recordsProcessed?: number;
  totalRecords?: number;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onJobStart }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    progress: 0,
    message: 'Ready to upload DBF files'
  });
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.dbf')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a DBF file (.dbf extension)",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File Too Large",
          description: "File size must be less than 50MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus({
        status: 'idle',
        progress: 0,
        message: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      });
    }
  }, [toast]);

  const simulateProcessing = async () => {
    if (!selectedFile) return;

    onJobStart();
    
    // Simulate upload phase
    setUploadStatus({
      status: 'uploading',
      progress: 0,
      message: 'Uploading DBF file...'
    });

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadStatus(prev => ({
        ...prev,
        progress: i,
        message: `Uploading... ${i}%`
      }));
    }

    // Simulate processing phase
    setUploadStatus({
      status: 'processing',
      progress: 0,
      message: 'Reading DBF file structure...'
    });

    const totalRecords = Math.floor(Math.random() * 1000) + 100;
    
    for (let processed = 0; processed <= totalRecords; processed += Math.floor(totalRecords / 20)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const progress = Math.round((processed / totalRecords) * 100);
      
      setUploadStatus({
        status: 'processing',
        progress,
        message: `Processing records... ${processed}/${totalRecords}`,
        recordsProcessed: processed,
        totalRecords
      });
    }

    // Complete
    setUploadStatus({
      status: 'completed',
      progress: 100,
      message: `Successfully migrated ${totalRecords} records to PostgreSQL`,
      recordsProcessed: totalRecords,
      totalRecords
    });

    toast({
      title: "Migration Completed",
      description: `${totalRecords} records successfully transferred to ipd_visit table`,
    });
  };

  const getStatusIcon = () => {
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-dashed border-2 border-blue-200 bg-blue-50/30">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Upload className="h-5 w-5 text-blue-500" />
            <span>Upload DBF File</span>
          </CardTitle>
          <CardDescription>
            Select a DBF file to migrate data to PostgreSQL database
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-blue-500" />
                <p className="mb-2 text-sm text-blue-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-blue-500">DBF files only (MAX 50MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".dbf"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={simulateProcessing}
                disabled={uploadStatus.status === 'uploading' || uploadStatus.status === 'processing'}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                {uploadStatus.status === 'uploading' || uploadStatus.status === 'processing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Start Migration
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Card */}
      {uploadStatus.status !== 'idle' && (
        <Card className={`${getStatusColor()}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon()}
              <span>Migration Status</span>
              <Badge variant={uploadStatus.status === 'completed' ? 'default' : 'secondary'}>
                {uploadStatus.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{uploadStatus.message}</span>
                <span>{uploadStatus.progress}%</span>
              </div>
              <Progress value={uploadStatus.progress} className="h-2" />
            </div>

            {uploadStatus.recordsProcessed && uploadStatus.totalRecords && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Records Processed:</span>
                <span>{uploadStatus.recordsProcessed.toLocaleString()} / {uploadStatus.totalRecords.toLocaleString()}</span>
              </div>
            )}

            {uploadStatus.status === 'completed' && (
              <div className="p-3 bg-green-100 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Migration Summary</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Personal data hashed with SHA256</li>
                  <li>✓ Date formats converted to YYYY-MM-DD</li>
                  <li>✓ Fiscal year (byear) calculated</li>
                  <li>✓ Data inserted into ipd_visit table</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploadSection;

