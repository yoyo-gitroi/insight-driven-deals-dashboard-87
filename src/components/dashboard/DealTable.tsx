
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface DealTableProps {
  deals: any[];
}

const DealTable: React.FC<DealTableProps> = ({ deals }) => {
  const [openDrawerId, setOpenDrawerId] = React.useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Calculate pagination
  const totalPages = Math.ceil(deals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeals = deals.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to safely parse JSON data
  const safeJsonParse = (jsonString: string, defaultValue: any = {}) => {
    if (!jsonString) return defaultValue;
    
    try {
      if (typeof jsonString === 'object') return jsonString;
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return defaultValue;
    }
  };

  // Extract the signal data by matching signal_id with action_reference_id
  const extractSignalByActionReference = (deal: any) => {
    try {
      const nbaData = safeJsonParse(deal.nba);
      const signalsData = safeJsonParse(deal.signals);
      
      // Extract action_reference_id from NBA
      const actionReferenceId = nbaData?.nba_action?.action_reference_id;
      
      if (!actionReferenceId || !signalsData) {
        console.log("Missing action_reference_id or signals data");
        return null;
      }
      
      console.log("Action Reference ID:", actionReferenceId);
      console.log("Signals Data:", signalsData);
      
      // Find matching signal
      let matchingSignal = null;
      
      // Check if signalsData is an array with signals property
      if (signalsData.signals && Array.isArray(signalsData.signals)) {
        matchingSignal = signalsData.signals.find((signal: any) => 
          signal.signal_id === actionReferenceId
        );
      }
      // Check if signalsData is a direct array
      else if (Array.isArray(signalsData)) {
        matchingSignal = signalsData.find((signal: any) => 
          signal.signal_id === actionReferenceId
        );
      }
      // Check if signalsData is a single signal object
      else if (signalsData.signal_id) {
        if (signalsData.signal_id === actionReferenceId) {
          matchingSignal = signalsData;
        }
      }
      
      if (matchingSignal) {
        console.log("Found matching signal:", matchingSignal);
      } else {
        console.log("No matching signal found");
      }
      
      return matchingSignal;
    } catch (error) {
      console.error("Error extracting signal by action reference:", error);
      return null;
    }
  };

  const extractStructuredData = (deal: any) => {
    try {
      // Parse data if they are strings
      let nbaData = deal.nba;
      
      if (typeof nbaData === 'string' && nbaData.trim()) {
        try {
          nbaData = JSON.parse(nbaData);
        } catch (e) {
          console.error("Error parsing NBA JSON:", e);
        }
      }
      
      // Extract action_summary from NBA
      let executionPlan = null;
      
      if (nbaData && nbaData.nba_action) {
        executionPlan = nbaData.nba_action.execution_plan;
      }
      
      // Extract signal data using the action_reference_id
      const signalData = extractSignalByActionReference(deal);
      
      return {
        nba: executionPlan || (typeof nbaData === 'string' ? nbaData : JSON.stringify(nbaData)),
        signal: signalData,
        rawData: {
          nba: nbaData
        }
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        nba: deal.nba,
        signal: null,
        rawData: {
          nba: deal.nba
        }
      };
    }
  };

  const getSignalBadge = (signal: any) => {
    if (!signal || !signal.signal_type) {
      console.log("No signal type found");
      return null;
    }
    
    // Determine badge color based on signal type
    let badgeColor = "bg-gray-500";
    let signalType = signal.signal_type || "";
    
    console.log("Signal type for badge:", signalType);
    
    // Extract the Noun Category from [Noun Category]::[Specific Signal]
    const nounCategory = signalType.split("::")[0]?.replace("[", "").replace("]", "").trim();
    console.log("Extracted noun category:", nounCategory);
    
    // Set color based on noun category
    if (nounCategory?.toLowerCase() === 'objection') {
      badgeColor = "bg-red-200 text-red-800"; // Light red for Objection
    } else if (nounCategory?.toLowerCase() === 'confusion') {
      badgeColor = "bg-yellow-200 text-yellow-800"; // Yellow for Confusion
    } else if (nounCategory?.toLowerCase() === 'expansion') {
      badgeColor = "bg-green-200 text-green-800"; // Green for Expansion
    } else if (nounCategory?.toLowerCase() === 'churn') {
      badgeColor = "bg-pink-200 text-pink-800"; // Pink for Churn
    } else if (nounCategory?.toLowerCase().includes('integration')) {
      badgeColor = "bg-amber-500";
    } else if (nounCategory?.toLowerCase().includes('persona') || nounCategory?.toLowerCase().includes('mismatch')) {
      badgeColor = "bg-blue-500";
    } else if (nounCategory?.toLowerCase().includes('product') || nounCategory?.toLowerCase().includes('fit')) {
      badgeColor = "bg-emerald-500";
    } else if (nounCategory?.toLowerCase().includes('pricing') || nounCategory?.toLowerCase().includes('roi')) {
      badgeColor = "bg-violet-500";
    }
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge className={`${badgeColor} cursor-pointer`}>
            {signalType}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 z-50">
          <div className="space-y-2">
            <h4 className="font-semibold">Signal Details</h4>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <span className="font-medium">Type:</span>
              <span>{signalType}</span>
              <span className="font-medium">Confidence:</span>
              <span>{signal.confidence || "N/A"}%</span>
              <span className="font-medium">Supporting Quote:</span>
              <p className="text-sm italic">"{signal.supporting_quote || "Not available"}"</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  // Format NBA text to show the execution_plan
  const formatNBA = (nbaText: string) => {
    if (!nbaText) return "No execution plan available";
    
    try {
      // If it's a JSON string, try to parse it
      if (typeof nbaText === 'string' && (nbaText.startsWith('{') || nbaText.startsWith('['))) {
        const parsed = JSON.parse(nbaText);
        if (parsed && typeof parsed === 'object') {
          if (parsed.nba_action && parsed.nba_action.execution_plan) {
            return parsed.nba_action.execution_plan;
          }
        }
      }
      
      // Return the text as is if it's already the execution plan
      return nbaText;
    } catch (e) {
      console.error("Error formatting NBA:", e);
      return nbaText;
    }
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {/* Generate page numbers */}
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            // Logic to show pages around current page
            let pageNum;
            
            if (totalPages <= 5) {
              // If 5 or fewer pages, show all
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // If near the start, show first 5 pages
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // If near the end, show last 5 pages
              pageNum = totalPages - 4 + i;
            } else {
              // Otherwise show 2 pages before and 2 pages after current
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  isActive={currentPage === pageNum}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Deal Name</TableHead>
              <TableHead>Deal Stage</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead>Next Best Action</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDeals.length > 0 ? (
              currentDeals.map((deal, index) => {
                const { nba, signal } = extractStructuredData(deal);
                const actualIndex = startIndex + index;
                
                return (
                  <TableRow key={actualIndex}>
                    <TableCell className="font-medium">{deal.company_name}</TableCell>
                    <TableCell>{deal.deal_name}</TableCell>
                    <TableCell>{deal.deal_stage}</TableCell>
                    <TableCell>
                      {signal ? getSignalBadge(signal) : <Badge className="bg-gray-300">No Signal</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm bg-slate-50 p-2 rounded-md max-h-none overflow-y-auto">
                        {formatNBA(nba)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setOpenDrawerId(actualIndex)}
                        className="inline-flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      
                      <Drawer open={openDrawerId === actualIndex} onOpenChange={(open) => {
                        if (!open) setOpenDrawerId(null);
                      }}>
                        <DrawerContent className="max-w-lg mx-auto">
                          <div className="mx-auto w-full max-w-lg">
                            <DrawerHeader>
                              <DrawerTitle className="text-xl">{deal.company_name}</DrawerTitle>
                              <DrawerDescription>{deal.deal_name} - {deal.deal_stage}</DrawerDescription>
                            </DrawerHeader>
                            
                            <div className="p-6 space-y-6">
                              {(() => {
                                const extracted = extractStructuredData(deal);
                                return (
                                  <>
                                    {extracted.nba && (
                                      <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Next Best Action</h3>
                                        <div className="bg-slate-50 p-4 rounded-md">
                                          <p>{formatNBA(extracted.nba)}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {extracted.signal && (
                                      <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Signal Details</h3>
                                        <div className="bg-slate-50 p-4 rounded-md space-y-3">
                                          {extracted.signal.signal_type && (
                                            <div>
                                              <span className="font-medium">Signal Type:</span> {extracted.signal.signal_type}
                                            </div>
                                          )}
                                          
                                          {extracted.signal.confidence && (
                                            <div>
                                              <span className="font-medium">Confidence:</span> {extracted.signal.confidence}%
                                            </div>
                                          )}
                                          
                                          {extracted.signal.supporting_quote && (
                                            <div>
                                              <span className="font-medium">Supporting Quote:</span>
                                              <p className="italic text-sm mt-1 pl-2 border-l-2 border-gray-300">
                                                "{extracted.signal.supporting_quote}"
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                            
                            <DrawerFooter>
                              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">TAKE ACTION</Button>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No deals found. Select an Account Executive or ensure data is loaded correctly.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination component */}
      {renderPagination()}
    </div>
  );
};

export default DealTable;
