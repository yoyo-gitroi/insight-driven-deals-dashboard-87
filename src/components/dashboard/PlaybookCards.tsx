import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const handleCopyExecutionPlan = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Execution plan copied to clipboard",
        variant: "default"
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
      
      {/* Execution Plan Modal - Improved UI */}
      <Dialog open={isExecutionModalOpen} onOpenChange={setIsExecutionModalOpen}>
        <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto p-0">
          {selectedDeal && (() => {
            const { nba, signal, rawData } = extractStructuredData(selectedDeal);
            return (
              <>
                <DialogHeader className="p-6 pb-2 border-b sticky top-0 bg-white z-10">
                  <DialogTitle className="text-xl text-indigo-700 flex items-center">
                    <span className="truncate">{selectedDeal.company_name}</span>
                    <Badge variant="outline" className="ml-2">{selectedDeal.deal_stage}</Badge>
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {selectedDeal.deal_name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="p-6 space-y-5">
                  {nba && (
                    <div className="space-y-4">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <Badge className="bg-indigo-600">{nba.action_verb || "Action"}</Badge>
                          {nba.action_title || "Execution Plan"}
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{nba.execution_plan}</p>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nba.estimated_impact && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Estimated Impact</h4>
                            <div className="bg-green-50 p-3 rounded-md border border-green-100 h-full">
                              <p className="text-gray-700 text-sm">{nba.estimated_impact}</p>
                            </div>
                          </div>
                        )}

                        {nba.estimated_effort && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Estimated Effort</h4>
                            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 h-full">
                              <p className="text-gray-700 text-sm">{nba.estimated_effort}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {signal && (
                    <div className="space-y-3 pt-4 border-t">
                      <h3 className="text-lg font-semibold text-gray-800">Signal Details</h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {signal.signal_type && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Signal Type</span>
                              <div className="mt-1">
                                <Badge variant="outline" className={
                                  signal.signal_type.toLowerCase().includes('objection::product fit') ? "bg-blue-100 text-blue-700 border-blue-200" :
                                  signal.signal_type.toLowerCase().includes('objection') ? "bg-red-100 text-red-700 border-red-200" :
                                  signal.signal_type.toLowerCase().includes('expansion') ? "bg-green-100 text-green-700 border-green-200" :
                                  "bg-gray-100 text-gray-700 border-gray-200"
                                }>
                                  {signal.signal_type}
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          {signal.confidence && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Confidence</span>
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
                        </div>
                        
                        {signal.supporting_quote && (
                          <div className="mt-4">
                            <span className="text-sm font-medium text-gray-500">Supporting Quote</span>
                            <p className="mt-1 italic text-sm pl-3 border-l-2 border-indigo-300 text-gray-600">
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
                </div>
                
                <DialogFooter className="p-6 border-t bg-gray-50">
                  <Button 
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700"
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
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaybookCards;
