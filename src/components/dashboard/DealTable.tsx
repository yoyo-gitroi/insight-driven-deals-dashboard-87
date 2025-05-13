
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AlertCircle, Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DealTableProps {
  deals: any[];
}

const DealTable: React.FC<DealTableProps> = ({ deals }) => {
  const [openDrawerId, setOpenDrawerId] = React.useState<number | null>(null);

  // Function to get the correct signal for a deal based on the explanation provided
  const getSignalForDeal = (deal: any) => {
    try {
      let nbaData = typeof deal.nba === 'string' 
        ? JSON.parse(deal.nba) 
        : deal.nba;
      
      let actionsData = typeof deal.actions === 'string' 
        ? JSON.parse(deal.actions) 
        : deal.actions;
      
      let signalsData = typeof deal.signals === 'string' 
        ? JSON.parse(deal.signals) 
        : deal.signals;
      
      // Step 1: Find action_reference_id from NBA
      const actionRefId = nbaData?.action_reference_id;
      if (!actionRefId || !Array.isArray(actionsData)) return null;
      
      // Step 2: Find the action with that ID
      const matchedAction = actionsData.find((action: any) => action.action_id === actionRefId);
      if (!matchedAction) return null;
      
      // Step 3: Find the signal using signal_reference_id from the matched action
      const signalRefId = matchedAction.signal_reference_id;
      if (!signalRefId || !Array.isArray(signalsData)) return null;
      
      // Step 4: Get the signal with the matching signal_id
      const matchedSignal = signalsData.find((signal: any) => signal.signal_id === signalRefId);
      return matchedSignal;
    } catch (error) {
      console.error("Error extracting signal for deal:", error);
      return null;
    }
  };

  const getSignalBadge = (deal: any) => {
    const signal = getSignalForDeal(deal);
    if (!signal) return null;
    
    let badgeColor = "bg-gray-500";
    
    if (signal.signal_type?.toLowerCase().includes('integration')) {
      badgeColor = "bg-amber-500";
    } else if (signal.signal_type?.toLowerCase().includes('onboarding') || signal.signal_type?.toLowerCase().includes('confusion')) {
      badgeColor = "bg-blue-500";
    } else if (signal.signal_type?.toLowerCase().includes('expansion') || signal.signal_type?.toLowerCase().includes('adoption')) {
      badgeColor = "bg-emerald-500";
    } else if (signal.signal_type?.toLowerCase().includes('objection')) {
      badgeColor = "bg-red-500";
    }
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge className={`${badgeColor} cursor-pointer hover:bg-opacity-80`}>
            {signal.signal_type || "Unknown"}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4 bg-white shadow-lg rounded-md border">
          <div className="space-y-3">
            <h4 className="font-semibold text-base">Signal Details</h4>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <span className="font-medium">Confidence:</span>
              <span>{signal.confidence || "N/A"}</span>
              {signal.supporting_quote && (
                <>
                  <span className="font-medium">Supporting Quote:</span>
                  <p className="text-sm italic bg-slate-50 p-2 rounded">"{signal.supporting_quote}"</p>
                </>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const getPriorityFromDeal = (deal: any) => {
    try {
      let nbaData = typeof deal.nba === 'string' 
        ? JSON.parse(deal.nba) 
        : deal.nba;
      
      let actionsData = typeof deal.actions === 'string' 
        ? JSON.parse(deal.actions) 
        : deal.actions;
      
      // Find the action referenced in the NBA
      const actionRefId = nbaData?.action_reference_id;
      if (!actionRefId || !Array.isArray(actionsData)) return null;
      
      const targetAction = actionsData.find((action: any) => action.action_id === actionRefId);
      return targetAction?.priority;
    } catch (error) {
      console.error("Error extracting priority:", error);
      return null;
    }
  };

  const getPriorityBadge = (deal: any) => {
    const priority = getPriorityFromDeal(deal);
    if (!priority) return null;
    
    let badgeColor = "bg-gray-500";
    let badgeText = priority;
    
    if (typeof priority === 'string') {
      const lowerPriority = priority.toLowerCase();
      
      if (lowerPriority.includes('high') || lowerPriority === 'p1') {
        badgeColor = "bg-red-500";
        badgeText = "High";
      } else if (lowerPriority.includes('medium') || lowerPriority === 'p2') {
        badgeColor = "bg-amber-500";
        badgeText = "Medium";
      } else if (lowerPriority.includes('low') || lowerPriority === 'p3') {
        badgeColor = "bg-green-500";
        badgeText = "Low";
      }
    } else if (typeof priority === 'number') {
      if (priority === 1) {
        badgeColor = "bg-red-500";
        badgeText = "High";
      } else if (priority === 2) {
        badgeColor = "bg-amber-500";
        badgeText = "Medium";
      } else if (priority === 3) {
        badgeColor = "bg-green-500";
        badgeText = "Low";
      }
    }
    
    return <Badge className={badgeColor}>{badgeText}</Badge>;
  };

  const getNbaContent = (deal: any) => {
    try {
      const nbaData = typeof deal.nba === 'string' 
        ? JSON.parse(deal.nba) 
        : deal.nba;
      
      return nbaData?.action_summary || deal.nba;
    } catch {
      return deal.nba;
    }
  };

  const extractStructuredData = (deal: any) => {
    try {
      // Try to parse data if it's in string format
      let nbaData = typeof deal.nba === 'string' && deal.nba.trim().startsWith('{') 
        ? JSON.parse(deal.nba) 
        : deal.nba;
      
      let actionsData = typeof deal.actions === 'string' && deal.actions.trim().startsWith('[') 
        ? JSON.parse(deal.actions) 
        : deal.actions;
      
      let signalsData = typeof deal.signals === 'string' && deal.signals.trim().startsWith('[') 
        ? JSON.parse(deal.signals) 
        : deal.signals;
      
      // Find the action referenced in the NBA
      const actionRefId = nbaData?.action_reference_id;
      let targetAction = null;
      let targetSignal = null;
      
      if (actionRefId && Array.isArray(actionsData)) {
        targetAction = actionsData.find((action: any) => action.action_id === actionRefId);
      }
      
      // Find the signal referenced by the action
      if (targetAction?.signal_reference_id && Array.isArray(signalsData)) {
        targetSignal = signalsData.find((signal: any) => signal.signal_id === targetAction.signal_reference_id);
      }
      
      return {
        nba: nbaData,
        action: targetAction,
        signal: targetSignal,
        priority: targetAction?.priority,
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        nba: deal.nba,
        action: null,
        signal: null,
        priority: null
      };
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Deal Name</TableHead>
            <TableHead>Deal Stage</TableHead>
            <TableHead>Objections</TableHead>
            <TableHead className="w-1/4">Next Best Action</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.length > 0 ? (
            deals.map((deal, index) => {
              const nbaContent = getNbaContent(deal);
              
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{deal.company_name}</TableCell>
                  <TableCell>{deal.deal_name}</TableCell>
                  <TableCell>{deal.deal_stage}</TableCell>
                  <TableCell>{getSignalBadge(deal)}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="line-clamp-3 text-sm">{nbaContent}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(deal)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setOpenDrawerId(index)}
                      className="inline-flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    
                    <Drawer open={openDrawerId === index} onOpenChange={(open) => {
                      if (!open) setOpenDrawerId(null);
                    }}>
                      <DrawerContent className="max-w-md mx-auto">
                        <div className="mx-auto w-full max-w-md">
                          <DrawerHeader className="border-b pb-4">
                            <DrawerTitle className="text-xl">{deal.company_name}</DrawerTitle>
                            <DrawerDescription>{deal.deal_name} - {deal.deal_stage}</DrawerDescription>
                          </DrawerHeader>
                          <div className="p-6 space-y-6">
                            {(() => {
                              const extracted = extractStructuredData(deal);
                              return (
                                <>
                                  <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-800">Next Best Action</h3>
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p>{extracted.nba?.action_summary || nbaContent}</p>
                                    </div>
                                  </div>
                                  
                                  {extracted.signal && (
                                    <div className="space-y-3">
                                      <h3 className="text-lg font-semibold text-gray-800">Why</h3>
                                      <div className="bg-slate-50 p-4 rounded-md space-y-3">
                                        {extracted.signal.supporting_quote && (
                                          <div>
                                            <p className="text-sm">{extracted.signal.supporting_quote}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {extracted.action && (
                                    <>
                                      {extracted.action.assigned_to && (
                                        <div className="space-y-2">
                                          <h3 className="text-lg font-semibold text-gray-800">Assigned To:</h3>
                                          <div className="bg-slate-50 p-4 rounded-md">
                                            <p>{extracted.action.assigned_to}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {extracted.action.expected_outcome && (
                                        <div className="space-y-2">
                                          <h3 className="text-lg font-semibold text-gray-800">Expected Outcome:</h3>
                                          <div className="bg-slate-50 p-4 rounded-md">
                                            <p>{extracted.action.expected_outcome}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {extracted.action.preferred_content_format && (
                                        <div className="space-y-2">
                                          <h3 className="text-lg font-semibold text-gray-800">Preferred Content Format:</h3>
                                          <div className="bg-slate-50 p-4 rounded-md">
                                            <p>{extracted.action.preferred_content_format}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {extracted.action.communication_style && (
                                        <div className="space-y-2">
                                          <h3 className="text-lg font-semibold text-gray-800">Communication Style:</h3>
                                          <div className="bg-slate-50 p-4 rounded-md">
                                            <p>{extracted.action.communication_style}</p>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                          <DrawerFooter className="border-t pt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              TAKE ACTION
                            </Button>
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
              <TableCell colSpan={7} className="text-center py-8">
                No deals found. Select an Account Executive or ensure data is loaded correctly.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealTable;
