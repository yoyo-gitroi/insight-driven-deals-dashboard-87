
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
      
      if (typeof nbaData === 'string' && nbaData.trim()) {
        try {
          nbaData = JSON.parse(nbaData);
        } catch (e) {
          console.error("Error parsing NBA JSON:", e);
        }
      }
      
      if (typeof actionsData === 'string' && actionsData.trim()) {
        try {
          actionsData = JSON.parse(actionsData);
        } catch (e) {
          console.error("Error parsing actions JSON:", e);
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
      let actionReferenceId = null;
      
      if (nbaData && nbaData.nba_action) {
        actionSummary = nbaData.nba_action.action_summary;
        actionReferenceId = nbaData.nba_action.action_reference_id;
      }
      
      // Find action with matching reference ID
      let targetAction = null;
      if (actionReferenceId && actionsData && actionsData.actions) {
        targetAction = actionsData.actions.find(
          (action: any) => action.signal_reference_id === actionReferenceId
        );
      }
      
      // NEW: Find signal with highest confidence
      let highestConfidenceSignal = null;
      if (signalData && signalData.signals && Array.isArray(signalData.signals)) {
        // Sort signals by confidence (descending)
        const sortedSignals = [...signalData.signals].sort((a, b) => {
          const confA = a.confidence || 0;
          const confB = b.confidence || 0;
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
          signalType = highestConfidenceSignal.objection_analysis.objection_type || signalType;
          confidence = highestConfidenceSignal.objection_analysis.confidence_in_resolution || confidence;
          supportingQuote = highestConfidenceSignal.objection_analysis.objection_quote || supportingQuote;
        } else if (highestConfidenceSignal.persona_misalignment) {
          signalType = highestConfidenceSignal.persona_misalignment.signal_type || signalType;
          confidence = highestConfidenceSignal.persona_misalignment.confidence || confidence;
          supportingQuote = highestConfidenceSignal.persona_misalignment.supporting_quote || supportingQuote;
        } else if (highestConfidenceSignal.churn_risk) {
          signalType = highestConfidenceSignal.churn_risk.signal_type || signalType;
          confidence = highestConfidenceSignal.churn_risk.confidence || confidence;
          supportingQuote = highestConfidenceSignal.churn_risk.supporting_quote || supportingQuote;
        }
      }
      
      return {
        nba: actionSummary || (typeof nbaData === 'string' ? nbaData : JSON.stringify(nbaData)),
        action: targetAction,
        signal: {
          signal_type: signalType,
          confidence: confidence,
          supporting_quote: supportingQuote
        },
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
        rawData: {
          nba: deal.nba,
          actions: deal.actions,
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
    
    // Extract the main signal type if it contains delimiters like ::
    let displaySignalType = signalType;
    if (signalType.includes("::")) {
      displaySignalType = signalType.split("::")?.[1] || signalType;
    }
    
    if (signalType.toLowerCase().includes('integration')) {
      badgeColor = "bg-amber-500";
    } else if (signalType.toLowerCase().includes('persona') || signalType.toLowerCase().includes('mismatch')) {
      badgeColor = "bg-blue-500";
    } else if (signalType.toLowerCase().includes('product') || signalType.toLowerCase().includes('fit')) {
      badgeColor = "bg-emerald-500";
    } else if (signalType.toLowerCase().includes('objection') || signalType.toLowerCase().includes('churn')) {
      badgeColor = "bg-red-500";
    } else if (signalType.toLowerCase().includes('pricing') || signalType.toLowerCase().includes('roi')) {
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

  // Format NBA text to make it more readable
  const formatNBA = (nbaText: string) => {
    if (!nbaText) return "No action available";
    
    try {
      // If it's a JSON string, try to parse it
      if (typeof nbaText === 'string' && (nbaText.startsWith('{') || nbaText.startsWith('['))) {
        const parsed = JSON.parse(nbaText);
        if (parsed && typeof parsed === 'object') {
          if (parsed.nba_action && parsed.nba_action.action_summary) {
            return parsed.nba_action.action_summary;
          }
        }
      }
      
      // If the text is longer than 150 characters, truncate it
      if (nbaText.length > 150) {
        return nbaText.substring(0, 147) + "...";
      }
      
      return nbaText;
    } catch (e) {
      console.error("Error formatting NBA:", e);
      return nbaText;
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
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.length > 0 ? (
            deals.map((deal, index) => {
              const { nba, signal } = extractStructuredData(deal);
              
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
                      {formatNBA(nba)}
                    </div>
                  </TableCell>
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
                                        <p>{formatNBA(extracted.nba)}</p>
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
  );
};

export default DealTable;

