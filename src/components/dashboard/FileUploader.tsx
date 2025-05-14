
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, Upload, FileCheck, AlertOctagon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileProcessed: (data: any[]) => void;
}

const FileUploader = ({ onFileProcessed }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    if (!file) {
      setError("No file selected");
      setIsProcessing(false);
      return;
    }

    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!validTypes.includes(file.type)) {
      setError("Please select an Excel (.xlsx) or CSV file");
      setIsProcessing(false);
      toast({
        title: "Invalid file format",
        description: "Please upload an Excel or CSV file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large (max 20MB)");
      setIsProcessing(false);
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Handle empty file
        if (!jsonData || jsonData.length === 0) {
          setError("The file contains no data");
          setIsProcessing(false);
          toast({
            title: "Empty file",
            description: "The uploaded file contains no data",
            variant: "destructive"
          });
          return;
        }

        // Success
        onFileProcessed(jsonData);
        setIsProcessing(false);
      } catch (err) {
        console.error("Error processing file:", err);
        setError("Failed to process the file");
        setIsProcessing(false);
        toast({
          title: "Processing error",
          description: "Failed to read the file contents",
          variant: "destructive"
        });
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file");
      setIsProcessing(false);
      toast({
        title: "File read error",
        description: "Failed to read the file contents",
        variant: "destructive"
      });
    };

    reader.readAsBinaryString(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center w-full rounded-lg transition-all duration-300 ${
          isDragOver 
          ? 'bg-blue-50 border-blue-400' 
          : error 
            ? 'bg-red-50 border-red-200' 
            : fileName 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-gray-50 border-gray-200'
        } cursor-pointer min-h-[200px] relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInputChange}
          accept=".xlsx,.csv"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {isProcessing ? (
            <>
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-blue-700 font-medium">Processing your file...</p>
            </>
          ) : fileName ? (
            <>
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-medium">File selected:</p>
              <p className="text-emerald-600">{fileName}</p>
              <Button 
                variant="outline" 
                className="mt-4 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName(null);
                  setError(null);
                }}
              >
                Choose Different File
              </Button>
            </>
          ) : error ? (
            <>
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertOctagon className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                }}
              >
                Try Again
              </Button>
            </>
          ) : (
            <>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & Drop your CRM data file here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Or click to select file
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Select File
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
