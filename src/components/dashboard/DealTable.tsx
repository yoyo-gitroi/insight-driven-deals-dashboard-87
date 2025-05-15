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

  const extractStructuredData = (deal: any) => {
    try {
      // Parse data if they are strings
      let nbaData = deal.nba;
      let signalData = deal.signals;
      
      if (typeof nbaData === 'string' && nbaData.trim()) {
        try {
          nbaData = JSON.parse(nbaData);
        } catch (e) {
          console.error("Error parsing NBA JSON:", e);
        }
      }
      
      if (typeof signalData === 'string' && signalData.trim()) {
        try {
          signalData = JSON.parse(signalData);
        } catch (e) {
          console.error("Error parsing signals JSON:", e);
        }
      }
      
      // Extract action_reference_id and execution_plan from NBA
      let actionReferenceId = null;
      let executionPlan = null;
      
      if (nbaData && nbaData.nba_action) {
        actionReferenceId = nbaData.nba_action.action_reference_id;
        executionPlan = nbaData.nba_action.execution_plan;
      }
      
      // Find signal with matching signal_id to the action_reference_id
      let matchedSignal = null;
      if (signalData && Array.isArray(signalData) && actionReferenceId) {
        matchedSignal = signalData.find((signal: any) => signal.signal_id === actionReferenceId);
      }
      
      // If no matched signal found, try to get the signal with highest confidence as fallback
      if (!matchedSignal && signalData && Array.isArray(signalData) && signalData.length > 0) {
        // Sort signals by confidence (descending)
        const sortedSignals = [...signalData].sort((a, b) => {
          const confA = a.confidence || 0;
          const confB = b.confidence || 0;
          return confB - confA;
        });
        
        // Get the signal with highest confidence
        matchedSignal = sortedSignals[0];
      }
      
      return {
        nba: {
          executionPlan: executionPlan || "No execution plan available",
          actionReferenceId: actionReferenceId
        },
        signal: matchedSignal ? {
          signal_id: matchedSignal.signal_id,
          signal_type: matchedSignal.signal_type,
          supporting_quote: matchedSignal.supporting_quote,
          confidence: matchedSignal.confidence,
          objection_type: matchedSignal.objection_type || null
        } : null,
        rawData: {
          nba: nbaData,
          signals: signalData
        }
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        nba: {
          executionPlan: "Error extracting execution plan",
          actionReferenceId: null
        },
        signal: null,
        rawData: {
          nba: deal.nba,
          signals: deal.signals
        }
      };
    }
  };

  const getSignalBadge = (signal: any) => {
    if (!signal || !signal.signal_type) return null;
    
    // Determine badge color based on Noun Category
    let badgeColor = "bg-gray-500";
    let signalType = signal.signal_type || "";
    
    // Parse the Noun Category from [Noun Category]::[Specific Signal]
    const nounCategory = signalType.split('::')[0]?.replace('[', '').replace(']', '').trim();
    
    // Set colors based on Noun Category
    switch (nounCategory.toLowerCase()) {
      case 'objection':
        badgeColor = "bg-red-200 text-red-800"; // Light red color
        break;
      case 'confusion':
        badgeColor = "bg-yellow-200 text-yellow-800"; // Yellow color
        break;
      case 'expansion':
        badgeColor = "bg-green-200 text-green-800"; // Green color
        break;
      case 'churn':
        badgeColor = "bg-pink-200 text-pink-800"; // Pink color
        break;
      case 'persona':
      case 'mismatch':
        badgeColor = "bg-blue-200 text-blue-800";
        break;
      case 'product':
      case 'fit':
        badgeColor = "bg-emerald-200 text-emerald-800";
        break;
      case 'pricing':
      case 'roi':
        badgeColor = "bg-violet-200 text-violet-800";
        break;
      default:
        badgeColor = "bg-gray-200 text-gray-800";
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
                const extractedData = extractStructuredData(deal);
                const actualIndex = startIndex + index;
                
                return (
                  <TableRow key={actualIndex}>
                    <TableCell className="font-medium">{deal.company_name}</TableCell>
                    <TableCell>{deal.deal_name}</TableCell>
                    <TableCell>{deal.deal_stage}</TableCell>
                    <TableCell>
                      {extractedData.signal && getSignalBadge(extractedData.signal)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm bg-slate-50 p-2 rounded-md">
                        {extractedData.nba.executionPlan}
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
                                const extractedData = extractStructuredData(deal);
                                return (
                                  <>
                                    {extractedData.nba && (
                                      <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Next Best Action</h3>
                                        <div className="bg-slate-50 p-4 rounded-md">
                                          <p>{extractedData.nba.executionPlan}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {extractedData.signal && (
                                      <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Signal Details</h3>
                                        <div className="bg-slate-50 p-4 rounded-md space-y-3">
                                          {extractedData.signal.signal_type && (
                                            <div>
                                              <span className="font-medium">Signal Type:</span> {extractedData.signal.signal_type}
                                            </div>
                                          )}
                                          
                                          {extractedData.signal.confidence && (
                                            <div>
                                              <span className="font-medium">Confidence:</span> {extractedData.signal.confidence}%
                                            </div>
                                          )}
                                          
                                          {extractedData.signal.supporting_quote && (
                                            <div>
                                              <span className="font-medium">Supporting Quote:</span>
                                              <p className="italic text-sm mt-1 pl-2 border-l-2 border-gray-300">
                                                "{extractedData.signal.supporting_quote}"
                                              </p>
                                            </div>
                                          )}
                                          
                                          {extractedData.signal.objection_type && (
                                            <div>
                                              <span className="font-medium">Objection Type:</span> {extractedData.signal.objection_type}
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
