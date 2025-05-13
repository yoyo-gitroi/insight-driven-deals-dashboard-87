
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Eye } from "lucide-react";

interface DealTableProps {
  deals: any[];
}

const DealTable: React.FC<DealTableProps> = ({ deals }) => {
  const [openDrawerId, setOpenDrawerId] = React.useState<number | null>(null);

  const extractStructuredData = (deal: any) => {
    try {
      // Parse data if they are strings
      let nbaData = deal.nba;
      let actionsData = deal.actions;
      let signalData = deal.signals;
      
      if (typeof nbaData === 'string' && nbaData.trim().startsWith('{')) {
        nbaData = JSON.parse(nbaData);
      }
      
      if (typeof actionsData === 'string' && actionsData.trim().startsWith('[')) {
        actionsData = JSON.parse(actionsData);
      }
      
      if (typeof signalData === 'string' && signalData.trim().startsWith('[')) {
        signalData = JSON.parse(signalData);
      }
      
      // Find the action referenced in the NBA
      const actionRefId = nbaData?.action_reference_id;
      let targetAction = null;
      let targetSignal = null;
      
      // Find the action with matching action_id
      if (actionRefId && Array.isArray(actionsData)) {
        targetAction = actionsData.find((action: any) => action.action_id === actionRefId);
      }
      
      // Find the signal referenced by the action
      if (targetAction?.signal_reference_id && Array.isArray(signalData)) {
        targetSignal = signalData.find((signal: any) => signal.signal_id === targetAction.signal_reference_id);
      }
      
      return {
        nba: nbaData?.action_summary || deal.nba,
        action: targetAction,
        signal: targetSignal,
        priority: targetAction?.priority,
        rawData: {
          nba: nbaData,
          actions: actionsData,
          signals: signalData
        }
      };
    } catch (error) {
      console.error("Error extracting structured data:", error);
      return {
        nba: deal.nba,
        action: null,
        signal: null,
        priority: null,
        rawData: {
          nba: deal.nba,
          actions: deal.actions,
          signals: deal.signals
        }
      };
    }
  };

  const getSignalBadge = (signal: any) => {
    if (!signal) return null;
    
    // Determine badge color based on signal type
    let badgeColor = "bg-gray-500";
    let signalType = signal.signal_type || "";
    
    if (signalType.toLowerCase().includes('integration')) {
      badgeColor = "bg-amber-500";
    } else if (signalType.toLowerCase().includes('onboarding') || signalType.toLowerCase().includes('confusion')) {
      badgeColor = "bg-blue-500";
    } else if (signalType.toLowerCase().includes('expansion') || signalType.toLowerCase().includes('adoption')) {
      badgeColor = "bg-emerald-500";
    } else if (signalType.toLowerCase().includes('objection')) {
      badgeColor = "bg-red-500";
    }
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge className={`${badgeColor} cursor-pointer`}>
            {signalType}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Signal Details</h4>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <span className="font-medium">Confidence:</span>
              <span>{signal.confidence || "N/A"}</span>
              <span className="font-medium">Supporting Quote:</span>
              <p className="text-sm italic">"{signal.supporting_quote || "Not available"}"</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const getPriorityBadge = (priority: string | number) => {
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
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Deal Name</TableHead>
            <TableHead>Deal Stage</TableHead>
            <TableHead>Objections</TableHead>
            <TableHead>Next Best Action</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.length > 0 ? (
            deals.map((deal, index) => {
              const { nba, signal, priority } = extractStructuredData(deal);
              
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{deal.company_name}</TableCell>
                  <TableCell>{deal.deal_name}</TableCell>
                  <TableCell>{deal.deal_stage}</TableCell>
                  <TableCell>
                    {signal && getSignalBadge(signal)}
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2 text-sm bg-slate-50 p-2 rounded-md">
                      {nba}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(priority)}</TableCell>
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
                                        <p>{extracted.nba}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {extracted.action && (
                                    <div className="space-y-2">
                                      <h3 className="text-lg font-semibold">Action Details</h3>
                                      <div className="bg-slate-50 p-4 rounded-md space-y-3">
                                        {extracted.action.assigned_to && (
                                          <div>
                                            <span className="font-medium">Assigned to:</span> {extracted.action.assigned_to}
                                          </div>
                                        )}
                                        
                                        {extracted.action.expected_outcome && (
                                          <div>
                                            <span className="font-medium">Expected Outcome:</span> {extracted.action.expected_outcome}
                                          </div>
                                        )}
                                        
                                        {extracted.action.preferred_content_format && (
                                          <div>
                                            <span className="font-medium">Preferred Content Format:</span> {extracted.action.preferred_content_format}
                                          </div>
                                        )}
                                        
                                        {extracted.action.communication_style && (
                                          <div>
                                            <span className="font-medium">Communication Style:</span> {extracted.action.communication_style}
                                          </div>
                                        )}
                                        
                                        {extracted.action.priority && (
                                          <div>
                                            <span className="font-medium">Priority:</span> {getPriorityBadge(extracted.action.priority)}
                                          </div>
                                        )}
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
                                            <span className="font-medium">Confidence:</span> {extracted.signal.confidence}
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
