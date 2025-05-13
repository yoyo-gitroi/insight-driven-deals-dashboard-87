
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DealTableProps {
  deals: any[];
}

const DealTable: React.FC<DealTableProps> = ({ deals }) => {
  const [openDrawerId, setOpenDrawerId] = React.useState<number | null>(null);

  const getSignalBadge = (signal: any) => {
    if (!signal) return null;
    
    // Check if signal is a string (old format) or an object (new format)
    if (typeof signal === 'string') {
      const lowerSignal = signal.toLowerCase();
      
      if (lowerSignal.includes('integration')) {
        return (
          <Badge className="bg-amber-500">Integration</Badge>
        );
      } else if (lowerSignal.includes('onboarding') || lowerSignal.includes('confusion')) {
        return (
          <Badge className="bg-blue-500">Confusion: Onboarding</Badge>
        );
      } else if (lowerSignal.includes('expansion') || lowerSignal.includes('adoption')) {
        return (
          <Badge className="bg-emerald-500">Expansion: Org-Wide Adoption</Badge>
        );
      } else if (lowerSignal.includes('objection')) {
        return (
          <Badge className="bg-red-500">Objection</Badge>
        );
      } else {
        return <Badge>{signal}</Badge>;
      }
    } else if (signal.signal_type) {
      // New structured format
      let badgeColor = "bg-gray-500";
      
      if (signal.signal_type.toLowerCase().includes('integration')) {
        badgeColor = "bg-amber-500";
      } else if (signal.signal_type.toLowerCase().includes('onboarding') || signal.signal_type.toLowerCase().includes('confusion')) {
        badgeColor = "bg-blue-500";
      } else if (signal.signal_type.toLowerCase().includes('expansion') || signal.signal_type.toLowerCase().includes('adoption')) {
        badgeColor = "bg-emerald-500";
      } else if (signal.signal_type.toLowerCase().includes('objection')) {
        badgeColor = "bg-red-500";
      }
      
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge className={badgeColor + " cursor-pointer"}>
              {signal.signal_type}
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
    }
    
    return null;
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

  const extractStructuredData = (deal: any) => {
    try {
      // Try to parse NBA if it's a JSON string
      let nbaData = deal.nba;
      let actionsData = deal.actions;
      let signalData = deal.signals;
      
      // Parse if these are strings containing JSON
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
                  <TableCell>{getSignalBadge(signal || deal.signals)}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2">{nba}</span>
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
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Next Best Action</h3>
                                    <div className="bg-slate-50 p-4 rounded-md">
                                      <p>{extracted.nba}</p>
                                    </div>
                                  </div>
                                  
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
