
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface FileUploaderProps {
  onFileProcessed: (crmData: any[], transcriptData: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const processExcelFile = (file: File) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        
        // Assuming the first sheet is "CRM Data" and the second sheet is "Sheet1" (transcripts)
        const crmSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes("crm")) || workbook.SheetNames[0];
        const transcriptSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes("sheet1")) || workbook.SheetNames[1];
        
        if (!crmSheetName || !transcriptSheetName) {
          throw new Error("Required sheets not found in Excel file");
        }
        
        // Process CRM data
        const crmSheet = XLSX.utils.sheet_to_json(workbook.Sheets[crmSheetName], {
          header: "A",
          raw: false
        });
        
        // Convert header row to lowercase and replace spaces with underscores
        const crmData = crmSheet.slice(1).map((row: any) => {
          const processedRow: { [key: string]: any } = {};
          Object.keys(row).forEach(key => {
            const headerKey = (crmSheet[0][key] || "")
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "");
            if (headerKey) {
              processedRow[headerKey] = row[key];
            }
          });
          return processedRow;
        });
        
        // Process transcript data
        const transcriptSheet = XLSX.utils.sheet_to_json(workbook.Sheets[transcriptSheetName], {
          header: "A",
          raw: false
        });
        
        // Convert header row to lowercase and replace spaces with underscores
        const transcriptData = transcriptSheet.slice(1).map((row: any) => {
          const processedRow: { [key: string]: any } = {};
          Object.keys(row).forEach(key => {
            const headerKey = (transcriptSheet[0][key] || "")
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "");
            if (headerKey) {
              processedRow[headerKey] = row[key];
            }
          });
          return processedRow;
        });
        
        onFileProcessed(crmData, transcriptData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing file:", error);
        setIsLoading(false);
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel") {
        setFileName(file.name);
        processExcelFile(file);
      } else {
        alert("Please upload an Excel file (.xlsx or .xls)");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <input 
        type="file" 
        id="excelFile" 
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <label 
        htmlFor="excelFile" 
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <div className="mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          Excel file with CRM and Transcript data (.xlsx)
        </p>
      </label>
      
      {fileName && (
        <div className="mt-4 text-sm">
          Selected file: <span className="font-medium">{fileName}</span>
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Processing...</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
