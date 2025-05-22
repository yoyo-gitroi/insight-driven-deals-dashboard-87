import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader, ChevronRight, Filter, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { safeJsonParse } from "@/lib/utils";

interface PlaybookCardsProps {
  deals: any[];
  developerMode: boolean;
}

const PlaybookCards: React.FC<PlaybookCardsProps> = ({ deals, developerMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterSignalType, setFilterSignalType] = useState<string>("all");
  const itemsPerPage = 5;
  
  // Unique deal stages for filtering
  const dealStages = ["all", ...Array.from(new Set(deals.map(deal => deal.deal_stage || "Unknown")))];
  
  // Extract signal types for filtering
  const signalTypes = ["all"];
  deals.forEach(deal => {
    try {
      const signalData = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
      if (signalData && signalData.signals && Array.isArray(signalData.signals)) {
        signalData.signals.forEach((signal: any) => {
          if (signal.signal_type && !signalTypes.includes(signal.signal_type)) {
            signalTypes.push(signal.signal_type);
          }
        });
      }
    } catch (e) {
      console.error("Error parsing signals:", e);
    }
  });
  
  // Filter deals based on selected filters
  const filteredDeals = deals.filter(deal => {
    if (filterStage !== "all" && deal.deal_stage !== filterStage) {
      return false;
    }
    
    if (filterSignalType !== "all") {
      try {
        const signalData = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
        if (!signalData || !signalData.signals || !Array.isArray(signalData.signals)) {
          return false;
        }
        
        const hasSignalType = signalData.signals.some(
          (signal: any) => signal.signal_type === filterSignalType
        );
        
        if (!hasSignalType) {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeals = filteredDeals.slice(startIndex, endIndex);
  
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
        setIsActionSheetOpen(false);
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
      
      if (typeof nbaData === 'string' && nbaData?.trim()) {
        try {
          nbaData = JSON.parse(nbaData);
        } catch (e) {
          console.error("Error parsing NBA JSON:", e);
        }
      }
      
      if (typeof signalData === 'string' && signalData?.trim()) {
        try {
          signalData = JSON.parse(signalData);
        } catch (e) {
          console.error("Error parsing signals JSON:", e);
        }
      }
      
      // Extract primary signal (with highest confidence)
      let primarySignal = null;
      if (signalData && signalData.signals && Array.isArray(signalData.signals)) {
        const sortedSignals = [...signalData.signals].sort((a, b) => {
          const confA = a.signal_score || a.confidence || 0;
          const confB = b.signal_score || b.confidence || 0;
          return confB - confA;
        });
        
        if (sortedSignals.length > 0) {
          primarySignal = sortedSignals[0];
        }
      }

      // Extract NBA action
      let nbaAction = null;
      if (nbaData && nbaData.nba_action) {
        nbaAction = nbaData.nba_action;
      }

      return {
        signal: primarySignal,
        nba: nbaAction,
        rawData: {
          nba: nbaData,
          signals: signalData
        }
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        signal: null,
        nba: null,
        rawData: {
          nba: deal.nba,
          signals: deal.signals
        }
      };
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
          
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            let pageNum;
            
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
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

  const getRecommendedActionBullets = (nba: any) => {
    if (!nba || !nba.execution_plan) return [];
    
    // Try to split the execution plan into bullet points
    const text = nba.execution_plan;
    
    // Split by number patterns like "1.", "Step 1:", etc.
    const bulletRegex = /(?:^|\n)(?:\d+\.|\d+\)|\*|\-|Step \d+:)\s*/;
    const bullets = text.split(bulletRegex).filter(Boolean).map(item => item.trim());
    
    // If we couldn't split into meaningful bullets, return whole text
    if (bullets.length <= 1) {
      return [text];
    }
    
    return bullets;
  };
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-lg shadow-sm mb-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Deal Stage" />
            </SelectTrigger>
            <SelectContent>
              {dealStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === "all" ? "All Stages" : stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterSignalType} onValueChange={setFilterSignalType}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Signal Type" />
            </SelectTrigger>
            <SelectContent>
              {signalTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Signal Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {currentDeals.length > 0 ? (
          currentDeals.map((deal, index) => {
            const { signal, nba } = extractStructuredData(deal);
            const companyName = deal.company_name || "Unknown Company";
            const dealName = deal.deal_name || "Unknown Deal";
            const dealStage = deal.deal_stage || "Unknown Stage";
            
            // Generate recommended action bullets
            const actionBullets = getRecommendedActionBullets(nba);
            
            return (
              <Card 
                key={index} 
                className="overflow-hidden border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
              >
                <CardHeader className="p-4 pb-2 bg-gray-50 border-b">
                  <div className="font-bold text-lg text-gray-900">{companyName}</div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Deal Name</p>
                      <p className="text-base text-gray-900 truncate">{dealName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Deal Stage</p>
                      <p className="text-base text-gray-900">{dealStage}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Signal</p>
                    {signal && signal.signal_type ? (
                      <Badge className="mb-2 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                        {signal.signal_type}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">No signal detected</span>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">RECOMMENDED ACTION</p>
                    {actionBullets.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        {actionBullets.map((bullet, i) => (
                          <li key={i} className={i >= 2 ? "hidden sm:block" : ""}>
                            {bullet}
                          </li>
                        ))}
                        {actionBullets.length > 2 && (
                          <li className="text-blue-600 sm:hidden">+ {actionBullets.length - 2} more steps...</li>
                        )}
                      </ul>
                    ) : (
                      <span className="text-gray-500 text-sm">No recommended action</span>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="default" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setIsActionSheetOpen(true);
                      }}
                    >
                      Execute Action
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8 col-span-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-600">No deals found. Try adjusting your filters or ensure data is loaded correctly.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Action Sheet */}
      <Sheet open={isActionSheetOpen} onOpenChange={setIsActionSheetOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          {selectedDeal && (() => {
            const { signal, nba } = extractStructuredData(selectedDeal);
            const companyName = selectedDeal.company_name || "Unknown Company";
            const dealName = selectedDeal.deal_name || "Unknown Deal";
            const actionBullets = getRecommendedActionBullets(nba);
            
            return (
              <div className="h-full flex flex-col">
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="text-xl">{companyName}</SheetTitle>
                  <SheetDescription>{dealName}</SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto space-y-6">
                  {/* Recommended Action Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. Recommended Action</h3>
                    {actionBullets.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {actionBullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No recommended action available</p>
                    )}
                  </div>
                  
                  {/* Impact and Effort */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">2. Impact and Effort</h3>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Estimated Impact</h4>
                        <p className="text-sm text-gray-700">
                          {nba?.estimated_impact || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Estimated Effort</h4>
                        <p className="text-sm text-gray-700">
                          {nba?.estimated_effort || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Signal Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">3. Signal Details</h3>
                    
                    <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">4. Signal Type</h4>
                        {signal && signal.signal_type ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                            {signal.signal_type}
                          </Badge>
                        ) : (
                          <p className="text-sm text-gray-500">Not available</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">5. Confidence</h4>
                        {signal && (signal.confidence || signal.signal_score) ? (
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${signal.confidence || signal.signal_score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{signal.confidence || signal.signal_score}%</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Not available</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Example Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">6. Execution Example</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-700">
                        The account executive will send a tailored follow-up email to Jarrett Garcia summarizing—step-by-step—how Bicycle.ai's AI Business Analyst and Data Analyst work together to contextualize and join structured tables, including schema ingestion, query code generation, and human-in-the-loop review/editability. Attach or link to a high-level one-pager or knowledge base article if available. Update CRM with details of technical objection and educational content sent.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t mt-6 pt-4">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleTakeAction(selectedDeal)}
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
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PlaybookCards;
