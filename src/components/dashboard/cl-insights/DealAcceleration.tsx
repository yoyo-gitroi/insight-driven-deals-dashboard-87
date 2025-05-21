
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle } from "lucide-react";

interface Opportunity {
  opportunity: string;
  impact: string;
  next_steps: string;
}

interface RiskFactor {
  risk_type: string;
  early_warning_signs: string;
  mitigation_playbooks: string;
}

interface DealAccelerationProps {
  dealAcceleration: {
    "Top 4 Acceleration Opportunities": Opportunity[];
    "Top 4 Risk Factors": RiskFactor[];
    "Prioritization Framework": string;
  };
}

const DealAcceleration: React.FC<DealAccelerationProps> = ({ dealAcceleration }) => {
  // Helper function to determine badge color based on impact level
  const getImpactBadgeColor = (impact: string) => {
    switch(impact.toLowerCase()) {
      case "high": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Deal Acceleration Opportunities
              </CardTitle>
              <CardDescription>Key strategies to speed up deal cycles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Next Steps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealAcceleration["Top 4 Acceleration Opportunities"].map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.opportunity}</TableCell>
                  <TableCell>
                    <Badge className={getImpactBadgeColor(item.impact)}>
                      {item.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.next_steps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-red-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Risk Factors
              </CardTitle>
              <CardDescription>Potential obstacles to deal success</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {dealAcceleration["Top 4 Risk Factors"].map((risk, index) => (
              <div key={index} className="border border-red-100 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-2 border-b border-red-100">
                  <h3 className="font-medium text-red-800">{risk.risk_type}</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Early Warning Signs</div>
                    <p className="text-sm text-gray-600">{risk.early_warning_signs}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Mitigation Playbook</div>
                    <p className="text-sm text-gray-600">{risk.mitigation_playbooks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Prioritization Framework</h3>
            <p className="text-blue-700">{dealAcceleration["Prioritization Framework"]}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealAcceleration;
