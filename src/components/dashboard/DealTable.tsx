import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Eye, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface DealTableProps {
  deals: any[];
  developerMode: boolean;
}

const DealTable: React.FC<DealTableProps> = ({ deals, developerMode }) => {
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [openSignalId, setOpenSignalId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  
  // Calculate pagination
  const totalPages = Math.ceil(deals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeals = deals.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTakeAction = async (deal: any) => {
    setIsLoading(true);
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000);
  
    try {
      const payload = {
        company: deal.company_name
      };
  
      const response = await fetch("https://aryabhatta-labs.app.n8n.cloud/webhook/e7290720-e974-4673-a659-7b8e107913e9", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
  
      clearTimeout(timeoutId);
  
      if (response.ok) {
        toast({
          title: "Action Complete",
          description: `Action executed successfully for ${deal.company_name}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Action Failed",
          description: "There was an error processing your request",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
  
      if (error.name === "AbortError") {
        toast({
          title: "Timeout",
          description: "The request took too long and was aborted.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to execute action. Please try again.",
          variant: "destructive"
        });
        console.error("API call error:", error);
      }
    } finally {
      setIsLoading(false);
    }
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
      
      // Extract action_summary from NBA
      let actionSummary = null;
      let executionPlan = null;
      let actionTitle = null;
      
      if (nbaData && nbaData.nba_action) {
        actionSummary = nbaData.nba_action.action_summary;
        executionPlan = nbaData.nba_action.execution_plan;
        actionTitle = nbaData.nba_action.action_title;
      }
      
      // Find signal with highest confidence
      let highestConfidenceSignal = null;
      if (signalData && signalData.signals && Array.isArray(signalData.signals)) {
        // Sort signals by confidence (descending)
        const sortedSignals = [...signalData.signals].sort((a, b) => {
          const confA = a.signal_score || 0;
          const confB = b.signal_score || 0;
          return confB - confA;
        });
        
        // Get the signal with highest confidence
        if (sortedSignals.length > 0) {
          highestConfidenceSignal = sortedSignals[0];
        }
      }
      
      // Get signal information
      let signalType = null;
      let confidence = null;
      let supportingQuote = null;
      
      if (highestConfidenceSignal) {
        signalType = highestConfidenceSignal.signal_type;
        confidence = highestConfidenceSignal.confidence;
        supportingQuote = highestConfidenceSignal.supporting_quote;
        
        // If objection_analysis exists, use it for more detailed info
        if (highestConfidenceSignal.objection_analysis) {
          confidence = highestConfidenceSignal.objection_analysis.confidence_in_resolution || confidence;
          supportingQuote = highestConfidenceSignal.objection_analysis.objection_quote || supportingQuote;
        } else if (highestConfidenceSignal.persona_misalignment) {
          confidence = highestConfidenceSignal.persona_misalignment.confidence || confidence;
          supportingQuote = highestConfidenceSignal.persona_misalignment.supporting_quote || supportingQuote;
        } else if (highestConfidenceSignal.churn_risk) {
          confidence = highestConfidenceSignal.churn_risk.confidence || confidence;
          supportingQuote = highestConfidenceSignal.churn_risk.supporting_quote || supportingQuote;
        }
      }
      
      return {
        nba: {
          actionSummary,
          executionPlan,
          actionTitle
        },
        signal: {
          signal_type: signalType,
          confidence: confidence,
          supporting_quote: supportingQuote
        },
        rawData: {
          nba: nbaData,
          signals: signalData
        }
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        nba: {
          actionSummary: null,
          executionPlan: null,
          actionTitle: null
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
    
    // Determine badge color based on signal type
    let badgeColor = "bg-gray-500";
    let signalType = signal.signal_type || "";
    
    // Don't strip the signal type delimiter anymore - show full signal type
    let displaySignalType = signalType;
    
    if (signalType.toLowerCase().includes('integration')) {
      badgeColor = "bg-amber-500";
    } else if (signalType.toLowerCase().includes('externalcontext') ) {
      badgeColor = "bg-blue-500";
    } else if (signalType.toLowerCase().includes('churn')) {
      badgeColor = "bg-emerald-500";
    } else if (signalType.toLowerCase().includes('objection')) {
      badgeColor = "bg-red-500";
    } else if (signalType.toLowerCase().includes('pricing')) {
      badgeColor = "bg-violet-500";
    } else if (signalType.toLowerCase().includes('confusion')) {
      badgeColor = "bg-orange-500";
    } else if (signalType.toLowerCase().includes('expansion')) {
      badgeColor = "bg-green-600";
    }
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge className={`${badgeColor} cursor-pointer`}>
            {displaySignalType}
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDeals.length > 0 ? (
              currentDeals.map((deal, index) => {
                const idxGlobal = startIndex + index;
                const { nba, signal, rawData } = extractStructuredData(deal);
                const actualIndex = startIndex + index;
                
                return (
                  <TableRow key={actualIndex} className="overflow-visible">
                    <TableCell className="font-medium">{deal.company_name}</TableCell>
                    <TableCell>{deal.deal_name}</TableCell>
                    <TableCell>{deal.deal_stage}</TableCell>
                    <TableCell className="relative">
                      {signal && developerMode ? (
                        <div>
                          <Badge 
                            className="cursor-pointer"
                            onClick={() => setOpenSignalId(idxGlobal)}
                          >
                            {signal.signal_type}
                          </Badge>

                          <Dialog 
                            open={openSignalId === idxGlobal}
                            onOpenChange={(open) => setOpenSignalId(open ? idxGlobal : null)}
                          >
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Raw Signals JSON</DialogTitle>
                                <DialogDescription>
                                  Signals for {deal.company_name}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="p-4">
                                <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-[600px]">
                                  {JSON.stringify(rawData.signals, null, 2)}
                                </pre>
                              </div>

                              <DialogFooter className="flex justify-between">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      JSON.stringify(rawData.signals, null, 2)
                                    )
                                  }
                                >
                                  Copy
                                </Button>
                                <Button
                                  variant="default"
                                  onClick={() => setOpenSignalId(null)}
                                >
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        getSignalBadge(signal)
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm ">
                          {nba.actionTitle }
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setOpenDialogId(actualIndex)}
                          className="flex items-center whitespace-nowrap"
                        >
                          Execute Action
                        </Button>
                      </div>
                      
                      <Dialog 
                        open={openDialogId === actualIndex} 
                        onOpenChange={(open) => {
                          if (!open) setOpenDialogId(null);
                        }}
                      >
                        <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{deal.company_name}</DialogTitle>
                            <DialogDescription>{deal.deal_name} - {deal.deal_stage}</DialogDescription>
                          </DialogHeader>
                          
                          <div className="p-4 space-y-6">
                            {(() => {
                              return (
                                <>
                                  {rawData.nba && rawData.nba.nba_action && (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold">Next Best Action</h3>
                                      
                                      <div>
                                        <div className="font-medium mb-1">Recommended Action</div>
                                        <div className="bg-slate-50 p-4 rounded-md">
                                          <p>{rawData.nba.nba_action.action_title}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="font-medium mb-1">Execution Plan</div>
                                        <div className="bg-slate-50 p-4 rounded-md">
                                          <p className="whitespace-pre-line">{rawData.nba.nba_action.execution_plan}</p>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <div className="font-medium mb-1">Estimated Impact</div>
                                          <div className="bg-green-50 p-4 rounded-md">
                                            <p>{rawData.nba.nba_action.estimated_impact}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <div className="font-medium mb-1">Estimated Effort</div>
                                          <div className="bg-blue-50 p-4 rounded-md">
                                            <p>{rawData.nba.nba_action.estimated_effort}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {signal && (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold">Signal Details</h3>
                                      <div className="bg-slate-50 p-4 rounded-md space-y-3">
                                        {signal.signal_type && (
                                          <div>
                                            <span className="font-medium">Signal Type:</span> 
                                            <Badge variant="outline" className="ml-2">
                                              {signal.signal_type}
                                            </Badge>
                                          </div>
                                        )}
                                        
                                        {signal.confidence && (
                                          <div>
                                            <span className="font-medium">Confidence:</span> 
                                            <div className="mt-1 flex items-center">
                                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                <div 
                                                  className="bg-indigo-600 h-2 rounded-full" 
                                                  style={{ width: `${signal.confidence}%` }}
                                                ></div>
                                              </div>
                                              <span className="text-sm">{signal.confidence}%</span>
                                            </div>
                                          </div>
                                        )}
                                        
                                        {signal.supporting_quote && (
                                          <div>
                                            <span className="font-medium">Insight Quote:</span>
                                            <p className="italic text-sm mt-1 pl-2 border-l-2 border-gray-300">
                                              "{signal.supporting_quote}"
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
                          
                          <DialogFooter>
                            <Button 
                              className="w-full bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleTakeAction(deal)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Execute Action"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
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
