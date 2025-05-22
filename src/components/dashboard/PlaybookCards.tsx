
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { safeJsonParse } from "@/lib/utils";

interface PlaybookCardsProps {
  deals: any[];
  developerMode: boolean;
}

const PlaybookCards: React.FC<PlaybookCardsProps> = ({ deals, developerMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isExecutionSheetOpen, setIsExecutionSheetOpen] = useState(false);
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
        setIsExecutionSheetOpen(false);
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
      console.log("Extracting structured data from deal:", deal);
      
      // Parse data if they are strings
      let nbaData = deal.nba;
      let signalData = deal.signals;
      let actionData = deal.actions;
      
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

      if (typeof actionData === 'string' && actionData?.trim()) {
        try {
          actionData = JSON.parse(actionData);
        } catch (e) {
          console.error("Error parsing actions JSON:", e);
        }
      }
      
      // Extract primary signal (with highest confidence)
      let primarySignal = null;
      if (signalData && signalData.signals && Array.isArray(signalData.signals)) {
        const sortedSignals = [...signalData.signals].sort((a, b) => {
          const confA = a.signal_score || 0;
          const confB = b.signal_score || 0;
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
          signals: signalData,
          actions: actionData
        }
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        signal: null,
        nba: null,
        rawData: {
          nba: deal.nba,
          signals: deal.signals,
          actions: deal.actions
        }
      };
    }
  };

  const getSignalTypeColor = (signalType: string) => {
    if (!signalType) return "border-gray-300";
    
    const signalLower = signalType.toLowerCase();
    
    if (signalLower.includes('objection::product fit')) return "border-l-[#2196F3]"; // Blue for Product Fit
    if (signalLower.includes('objection')) return "border-l-[#FF6B6B]"; // Red for other objections
    if (signalLower.includes('expansion')) return "border-l-[#4CAF50]"; // Green
    if (signalLower.includes('discovery')) return "border-l-[#2196F3]"; // Blue
    if (signalLower.includes('technical')) return "border-l-[#9C27B0]"; // Purple
    if (signalLower.includes('financial')) return "border-l-[#FF9800]"; // Orange
    if (signalLower.includes('integration')) return "border-l-[#9C27B0]"; // Purple for Integration
    if (signalLower.includes('confusion')) return "border-l-[#FFC107]"; // Amber
    
    return "border-l-gray-300";
  };

  const formatRecommendedAction = (action: string) => {
    if (!action) return [];
    
    // Split by periods, newlines, or bullet points
    let points = action.split(/[.\n•]+/).filter(point => point.trim().length > 0);
    
    // If we didn't get multiple points, try to create points from the text
    if (points.length <= 1) {
      const sentences = action.match(/[^.!?]+[.!?]+/g) || [action];
      points = sentences.map(s => s.trim()).filter(s => s.length > 0);
    }
    
    return points;
  };

  const handleCopyExecutionPlan = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Execution plan copied to clipboard",
      });
    });
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
  
  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {currentDeals.length > 0 ? (
          currentDeals.map((deal, index) => {
            console.log("Rendering deal:", deal);
            const { signal, nba, rawData } = extractStructuredData(deal);
            const signalType = signal?.signal_type || "";
            const actionTitle = nba?.action_title || "No action available";
            
            const companyName = deal.company_name || deal['Company Name'] || "Unknown Company";
            const dealName = deal.deal_name || deal['Deal Name'] || "Unknown Deal";
            const dealStage = deal.deal_stage || deal['Deal Stage'] || "Unknown";
            
            // Create bullet points from the action title or execution plan
            const actionPoints = nba?.execution_plan ? 
              formatRecommendedAction(nba.execution_plan) : 
              formatRecommendedAction(actionTitle);
            
            return (
              <Card 
                key={index} 
                className={`overflow-hidden border-l-4 ${getSignalTypeColor(signalType)} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <CardHeader className="pb-2 bg-gray-50">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1 font-medium text-sm text-gray-700">Company</div>
                    <div className="col-span-1 font-medium text-sm text-gray-700">Deal Name</div>
                    <div className="col-span-1 font-medium text-sm text-gray-700">Deal Stage</div>
                    <div className="col-span-1 font-medium text-sm text-gray-700">Signal</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1 text-sm truncate">{companyName}</div>
                    <div className="col-span-1 text-sm truncate">{dealName}</div>
                    <div className="col-span-1 text-sm truncate">{dealStage}</div>
                    <div className="col-span-1 text-sm truncate">
                      {signal && <Badge variant="outline">{signalType}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  {/* Recommended Action Section */}
                  <div className="mb-4">
                    <h3 className="font-medium text-sm mb-2">RECOMMENDED ACTION</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      {actionPoints.slice(0, 3).map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                      {actionPoints.length > 3 && <li>...</li>}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setIsExecutionSheetOpen(true);
                      }}
                    >
                      Execute Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8 col-span-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-600">No deals found. Select an Account Executive or ensure data is loaded correctly.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Execution Sheet - Sliding in from right */}
      <Sheet open={isExecutionSheetOpen} onOpenChange={setIsExecutionSheetOpen}>
        <SheetContent className="w-[90%] sm:max-w-[600px] overflow-y-auto">
          {selectedDeal && (() => {
            const { nba, signal, rawData } = extractStructuredData(selectedDeal);
            const companyName = selectedDeal.company_name || selectedDeal['Company Name'] || "Unknown Company";
            const dealStage = selectedDeal.deal_stage || selectedDeal['Deal Stage'] || "Unknown";
            const dealName = selectedDeal.deal_name || selectedDeal['Deal Name'] || "Unknown Deal";
            
            const actionPoints = nba?.execution_plan ? 
              formatRecommendedAction(nba.execution_plan) : 
              [];
              
            return (
              <div className="space-y-6">
                <SheetHeader>
                  <SheetTitle className="text-xl">{companyName}</SheetTitle>
                  <SheetDescription className="flex items-center space-x-2">
                    <span>{dealName}</span>
                    <Badge variant="outline">{dealStage}</Badge>
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6">
                  {/* Recommended Action */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Recommended Action</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <ul className="list-disc pl-6 space-y-2">
                        {actionPoints.length > 0 ? (
                          actionPoints.map((point, i) => (
                            <li key={i} className="text-gray-700">{point}</li>
                          ))
                        ) : (
                          <li className="text-gray-500">No specific actions available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Impact and Effort */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nba?.estimated_impact && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Estimated Impact</h4>
                        <div className="bg-green-50 p-3 rounded-md border border-green-100">
                          <p className="text-gray-700">{nba.estimated_impact}</p>
                        </div>
                      </div>
                    )}

                    {nba?.estimated_effort && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Estimated Effort</h4>
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                          <p className="text-gray-700">{nba.estimated_effort}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Signal Details */}
                  {signal && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">Signal Details</h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
                        {signal.signal_type && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 block mb-1">Signal Type</span>
                            <Badge variant="outline">{signal.signal_type}</Badge>
                          </div>
                        )}
                        
                        {signal.confidence && (
                          <div>
                            <span className="text-sm font-medium text-gray-500 block mb-1">Confidence</span>
                            <div className="flex items-center">
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
                            <span className="text-sm font-medium text-gray-500 block mb-1">Supporting Quote</span>
                            <p className="italic text-sm pl-3 border-l-2 border-indigo-300 text-gray-600">
                              "{signal.supporting_quote}"
                            </p>
                            {signal.raised_by && (
                              <p className="text-xs text-gray-500 mt-1">— {signal.raised_by}{signal.raised_by_role ? `, ${signal.raised_by_role}` : ''}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <div className="pt-4">
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
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PlaybookCards;
