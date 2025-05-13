
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface DealTableProps {
  deals: any[];
}

const DealTable: React.FC<DealTableProps> = ({ deals }) => {
  const getSignalBadge = (signal: string) => {
    if (!signal) return null;
    
    const lowerSignal = signal.toLowerCase();
    
    if (lowerSignal.includes('integration')) {
      return <Badge className="bg-amber-500">Integration</Badge>;
    } else if (lowerSignal.includes('onboarding') || lowerSignal.includes('confusion')) {
      return <Badge className="bg-blue-500">Confusion: Onboarding</Badge>;
    } else if (lowerSignal.includes('expansion') || lowerSignal.includes('adoption')) {
      return <Badge className="bg-emerald-500">Expansion: Org-Wide Adoption</Badge>;
    } else if (lowerSignal.includes('objection')) {
      return <Badge className="bg-red-500">Objection</Badge>;
    } else {
      return <Badge>{signal}</Badge>;
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
            <TableHead>Signals</TableHead>
            <TableHead>Next Best Action</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.length > 0 ? (
            deals.map((deal, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{deal.company_name}</TableCell>
                <TableCell>{deal.deal_name}</TableCell>
                <TableCell>{deal.deal_stage}</TableCell>
                <TableCell>{getSignalBadge(deal.signals)}</TableCell>
                <TableCell>
                  <span className="line-clamp-2">{deal.nba}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">View Details</Button>
                    </SheetTrigger>
                    <SheetContent className="w-[450px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>{deal.company_name}</SheetTitle>
                        <SheetDescription>
                          {deal.deal_name} - {deal.deal_stage}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="font-semibold">Next Best Action</h4>
                          <p className="mt-1 text-sm">{deal.nba}</p>
                        </div>
                        
                        {deal.signals && (
                          <div>
                            <h4 className="font-semibold">Signals</h4>
                            <div className="mt-1">{getSignalBadge(deal.signals)}</div>
                          </div>
                        )}
                        
                        {deal.actions && (
                          <div>
                            <h4 className="font-semibold">Recommended Actions</h4>
                            <p className="mt-1 text-sm">{deal.actions}</p>
                            <Button className="mt-2 w-full">TAKE ACTION</Button>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))
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
