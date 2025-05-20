
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Loader, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface PlaybookCardsProps {
  deals: any[];
  developerMode: boolean;
}

const PlaybookCards: React.FC<PlaybookCardsProps> = ({ deals, developerMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
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
        setIsExecutionModalOpen(false);
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
      let actionData = deal.actions;
      
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

      if (typeof actionData === 'string' && actionData.trim()) {
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

  const getPriorityBadge = (priority: string) => {
    if (!priority) return null;
    
    const priorityLower = priority.toLowerCase();
    
    if (priorityLower === 'high') {
      return <Badge className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/80">HIGH</Badge>;
    }
    if (priorityLower === 'medium') {
      return <Badge className="bg-[#FFC107] hover:bg-[#FFC107]/80">MEDIUM</Badge>;
    }
    if (priorityLower === 'low') {
      return <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50]/80">LOW</Badge>;
    }
    
    return null;
  };

  const getSignalTypeBadge = (signalType: string) => {
    if (!signalType) return "SIGNAL";
    
    // Format the signal type for display
    const formattedType = signalType.toUpperCase();
    return formattedType;
  };

  const getDetectionFunction = (signal: any) => {
    if (!signal) return "detect_signal()";

    const signalType = signal.signal_type || "";
    
    if (signalType.toLowerCase().includes('integration')) {
      return "detect_integration_concerns()";
    } else if (signalType.toLowerCase().includes('objection')) {
      return "detect_customer_objection()";
    } else if (signalType.toLowerCase().includes('expansion')) {
      return "detect_expansion_opportunity()";
    } else if (signalType.toLowerCase().includes('technical')) {
      return "detect_technical_concern()";
    } else if (signalType.toLowerCase().includes('financial')) {
      return "detect_financial_concern()";
    } else if (signalType.toLowerCase().includes('confusion')) {
      return "detect_customer_confusion()";
    }
    
    return "detect_signal()";
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
            const { signal, nba, rawData } = extractStructuredData(deal);
            const signalType = signal?.signal_type || "";
            const customerQuote = signal?.supporting_quote || signal?.supporting_quote_customer || "";
            const signalRaisedBy = signal?.raised_by || "Customer";
            const signalRaisedByRole = signal?.raised_by_role || "Representative";
            const actionVerb = nba?.action_verb || "ACTION";
            const actionTitle = nba?.action_title || "No action available";
            const actionPriority = nba?.priority || "medium";
            const detectionFunction = getDetectionFunction(signal);
            
            return (
              <Card 
                key={index} 
                className={`overflow-hidden border-l-4 ${getSignalTypeColor(signalType)} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <CardHeader className="pb-2 bg-gray-50">
                  <div className="font-bold text-base text-[#212121]">{deal.company_name}</div>
                  <div className="text-sm text-gray-600">Deal Stage: {deal.deal_stage || "Unknown"}</div>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-4">
                  {/* Signal Section */}
                  <div className="bg-white p-4 rounded-md border border-gray-100">
                    <div className="font-semibold text-sm mb-2 flex items-center">
                      <Badge variant="outline" className="mr-2">{getSignalTypeBadge(signalType)}</Badge>
                    </div>
                    
                    {customerQuote && (
                      <div className="mb-2">
                        <p className="text-sm italic text-[#424242] bg-gray-50 p-3 rounded-md border-l-2 border-gray-200">"{customerQuote}"</p>
                        <p className="text-xs text-[#757575] mt-1">— {signalRaisedBy}, {signalRaisedByRole}</p>
                      </div>
                    )}
                    
                    <div className="font-mono text-xs text-[#616161] mt-2 bg-gray-50 p-1 rounded inline-block">{detectionFunction}</div>
                  </div>
                  
                  {/* Recommended Action Section */}
                  <div className="bg-white p-4 rounded-md border border-gray-100">
                    <div className="font-semibold text-sm mb-2">RECOMMENDED ACTION</div>
                    <div className="font-medium text-sm mb-3">{actionVerb}: {actionTitle}</div>
                    
                    <div className="flex items-center justify-between">
                      <div>{getPriorityBadge(actionPriority)}</div>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setIsExecutionModalOpen(true);
                        }}
                      >
                        Execute Action
                      </Button>
                    </div>
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
      
      {/* Execution Plan Modal */}
      <Drawer open={isExecutionModalOpen} onOpenChange={(open) => {
        if (!open) setIsExecutionModalOpen(false);
      }}>
        <DrawerContent className="w-full max-w-[900px] mx-auto">
          <div className="mx-auto w-full">
            {selectedDeal && (() => {
              const { nba, signal, rawData } = extractStructuredData(selectedDeal);
              return (
                <>
                  <DrawerHeader className="border-b">
                    <DrawerTitle className="text-xl text-indigo-700">{selectedDeal.company_name}</DrawerTitle>
                    <DrawerDescription className="flex items-center">
                      <span className="mr-2">{selectedDeal.deal_name}</span>
                      <Badge variant="outline" className="ml-auto">{selectedDeal.deal_stage}</Badge>
                    </DrawerDescription>
                  </DrawerHeader>
                  
                  <div className="p-6 w-full max-w-[900px] space-y-6 overflow-y-auto">
                    {nba && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                            <Badge className="mr-2 bg-indigo-600">{nba.action_verb || "Action"}</Badge>
                            Execution Plan
                          </h3>
                          <div className="bg-gray-50 p-5 rounded-md border border-gray-100 relative">
                            <p className="text-gray-700 whitespace-pre-line">{nba.execution_plan}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="absolute top-2 right-2"
                              onClick={() => handleCopyExecutionPlan(nba.execution_plan)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {nba.estimated_impact && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Estimated Impact</h3>
                            <div className="bg-green-50 p-5 rounded-md border border-green-100">
                              <p className="text-gray-700">{nba.estimated_impact}</p>
                            </div>
                          </div>
                        )}

                        {nba.estimated_effort && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Estimated Effort</h3>
                            <div className="bg-blue-50 p-5 rounded-md border border-blue-100">
                              <p className="text-gray-700">{nba.estimated_effort}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {signal && (
                      <div className="space-y-2 mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Signal Details</h3>
                        <div className="bg-gray-50 p-5 rounded-md border border-gray-100 space-y-4">
                          {signal.signal_type && (
                            <div className="flex items-start">
                              <span className="font-medium text-gray-700 w-1/4">Signal Type:</span> 
                              <Badge variant="outline" className={
                                signal.signal_type.toLowerCase().includes('objection::product fit') ? "bg-blue-100 text-blue-700" :
                                signal.signal_type.toLowerCase().includes('objection') ? "bg-red-100 text-red-700" :
                                signal.signal_type.toLowerCase().includes('expansion') ? "bg-green-100 text-green-700" :
                                "bg-gray-100"
                              }>
                                {signal.signal_type}
                              </Badge>
                            </div>
                          )}
                          
                          {signal.confidence && (
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 w-1/4">Confidence:</span>
                              <div className="w-3/4">
                                <div className="flex items-center">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div 
                                      className="bg-indigo-600 h-2.5 rounded-full" 
                                      style={{ width: `${signal.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span>{signal.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {signal.supporting_quote && (
                            <div className="flex items-start">
                              <span className="font-medium text-gray-700 w-1/4">Insight Quote:</span>
                              <div className="w-3/4">
                                <p className="italic text-sm pl-3 border-l-2 border-gray-300 text-gray-600">
                                  "{signal.supporting_quote}"
                                </p>
                                {signal.raised_by && (
                                  <p className="text-xs text-gray-500 mt-1">— {signal.raised_by}{signal.raised_by_role ? `, ${signal.raised_by_role}` : ''}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>  
                    )}
                  </div>
                  
                  <DrawerFooter className="border-t bg-gray-50">
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleTakeAction(selectedDeal)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          PROCESSING ACTION...
                        </>
                      ) : (
                        "EXECUTE ACTION"
                      )}
                    </Button>
                  </DrawerFooter>
                </>
              );
            })()}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PlaybookCards;
