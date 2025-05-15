
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PriorityDealsSectionProps {
  priorityDeals: any[];
}

const PriorityDealsSection: React.FC<PriorityDealsSectionProps> = ({ priorityDeals }) => {
  return (
    <Card className="mb-6 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-800">
          <span className="mr-2">High Priority Deals</span>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            {priorityDeals.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50/80">
                <TableHead className="font-medium">Company</TableHead>
                <TableHead className="font-medium">Deal Name</TableHead>
                <TableHead className="font-medium">Stage</TableHead>
                <TableHead className="font-medium text-right">Amount</TableHead>
                <TableHead className="font-medium">Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priorityDeals.map((deal, i) => (
                <TableRow key={`priority-${i}`} className="hover:bg-amber-50/60">
                  <TableCell className="font-medium">{deal.company_name}</TableCell>
                  <TableCell>{deal.deal_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white">
                      {deal.deal_stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${deal.deal_amount?.toLocaleString()}
                  </TableCell>
                  <TableCell>{deal.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityDealsSection;
