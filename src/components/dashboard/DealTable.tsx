
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, ListCheck } from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

interface DealTableProps {
  deals: any[];
}

const DealTable: React.FC<DealTableProps> = ({ deals }) => {
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [displayMode, setDisplayMode] = useState<'list' | 'detail'>('list');
  
  const handleSelectDeal = (deal: any) => {
    setSelectedDeal(deal);
    setDisplayMode('detail');
  };
  
  const handleBackToList = () => {
    setDisplayMode('list');
    setSelectedDeal(null);
  };
  
  // Format currency amounts
  const formatCurrency = (amount: number | string) => {
    if (!amount) return "$0";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numAmount);
  };

  // Format date strings
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };
  
  // Extract Next Best Actions data
  const extractNextBestAction = (deal: any) => {
    try {
      if (!deal.nba) return {};
      
      const nbaData = safeJsonParse(deal.nba, {});
      
      let actionVerb = '';
      let actionSummary = '';
      let priority = '';
      let executionPlan = '';
      
      // Check if nba_action exists in the parsed data
      if (nbaData.nba_action) {
        actionVerb = nbaData.nba_action.action_verb || '';
        actionSummary = nbaData.nba_action.action_summary || '';
        priority = nbaData.nba_action.priority || '';
        executionPlan = nbaData.nba_action.execution_plan || '';
      }
      
      // Use the execution_plan field if it was pre-extracted
      if (deal.execution_plan) {
        executionPlan = deal.execution_plan;
      }
      
      return {
        actionVerb,
        actionSummary, 
        priority,
        executionPlan
      };
    } catch (e) {
      console.error("Error parsing NBA data:", e);
      return { actionVerb: '', actionSummary: '', priority: '', executionPlan: '' };
    }
  };
  
  // Render the deal detail view
  const renderDealDetail = () => {
    if (!selectedDeal) return null;
    
    const { actionVerb, actionSummary, priority, executionPlan } = extractNextBestAction(selectedDeal);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleBackToList} className="mb-4">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Deals
          </Button>
          
          <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'outline'}>
            {priority ? `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority` : 'No Priority Set'}
          </Badge>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{selectedDeal.company_name}</CardTitle>
            <CardDescription>
              {selectedDeal.deal_name} - {formatCurrency(selectedDeal.deal_amount)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Owner</p>
                <p>{selectedDeal.owner}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Close Date</p>
                <p>{formatDate(selectedDeal.close_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deal Stage</p>
                <p>{selectedDeal.deal_stage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Size</p>
                <p>{selectedDeal.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="playbook">
          <TabsList className="w-full">
            <TabsTrigger value="playbook" className="flex-1">Playbook</TabsTrigger>
            <TabsTrigger value="signals" className="flex-1">Signals</TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playbook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Best Action</CardTitle>
              </CardHeader>
              <CardContent>
                {actionVerb && (
                  <div className="mb-4">
                    <h4 className="font-medium">Action</h4>
                    <p className="text-sm mt-1">{actionVerb}</p>
                  </div>
                )}
                
                {actionSummary && (
                  <div className="mb-4">
                    <h4 className="font-medium">Summary</h4>
                    <p className="text-sm mt-1">{actionSummary}</p>
                  </div>
                )}
                
                {executionPlan && (
                  <div>
                    <h4 className="font-medium flex items-center">
                      <ListCheck className="mr-2 h-4 w-4" />
                      Execution Plan
                    </h4>
                    <div className="bg-secondary/30 p-3 rounded-md mt-2">
                      <p className="text-sm whitespace-pre-wrap">{executionPlan}</p>
                    </div>
                  </div>
                )}
                
                {!actionVerb && !actionSummary && !executionPlan && (
                  <p className="text-muted-foreground italic">No next best action available</p>
                )}
              </CardContent>
            </Card>
            
            {/* Additional cards for other playbook elements can go here */}
          </TabsContent>
          
          <TabsContent value="signals">
            {/* Signal content would go here */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm">Signal analysis data would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="actions">
            {/* Action content would go here */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm">Action tracking data would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  // Render the deals list view
  const renderDealsList = () => {
    if (deals.length === 0) {
      return <p>No deals found.</p>;
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Deal</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Next Best Action</TableHead>
            <TableHead>Close Date</TableHead>
            <TableHead></TableHead> {/* For View button */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal, index) => {
            const { actionVerb, priority } = extractNextBestAction(deal);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{deal.company_name}</TableCell>
                <TableCell>{deal.deal_name}</TableCell>
                <TableCell>{deal.owner}</TableCell>
                <TableCell>{deal.deal_stage}</TableCell>
                <TableCell>{formatCurrency(deal.deal_amount)}</TableCell>
                <TableCell>
                  {actionVerb ? (
                    <div className="flex items-center gap-2">
                      <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'outline'}>
                        {actionVerb}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(deal.close_date)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => handleSelectDeal(deal)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <div>
      {displayMode === 'list' ? renderDealsList() : renderDealDetail()}
    </div>
  );
};

export default DealTable;
