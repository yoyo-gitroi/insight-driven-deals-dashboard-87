
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SECTION_COLORS } from "../objections/objectionConstants";

interface DealAccelerationProps {
  dealAcceleration: {
    "Acceleration Opportunities"?: string[] | any[];
    "Risk Factors"?: {
      risk_type?: string;
      early_warning_signs?: string;
      mitigation_playbooks?: string;
    }[] | any[];
    "Prioritization Framework"?: string;
  };
}

const DealAcceleration: React.FC<DealAccelerationProps> = ({ dealAcceleration }) => {
  // Handle different data formats and provide fallbacks
  const accelerationOpportunities = dealAcceleration["Acceleration Opportunities"] || [];
  const accelerationOppsArray = Array.isArray(accelerationOpportunities) 
    ? accelerationOpportunities 
    : [];
  
  const riskFactors = dealAcceleration["Risk Factors"] || [];
  const riskFactorsArray = Array.isArray(riskFactors) 
    ? riskFactors 
    : [];
  
  // Check if risk factors have the structured format or are simple strings
  const hasStructuredRisks = riskFactorsArray.length > 0 && 
    typeof riskFactorsArray[0] === 'object' && 
    riskFactorsArray[0] !== null;

  return (
    <div className="space-y-6">
      {/* Acceleration Opportunities Card */}
      <Card className="border-l-4" style={{ borderLeftColor: SECTION_COLORS.acceleration }}>
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                Deal Acceleration Opportunities
              </CardTitle>
              <CardDescription>Actions to speed up deal progression</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {accelerationOppsArray.length > 0 ? (
              <ol className="space-y-3">
                {accelerationOppsArray.map((opportunity, index) => {
                  // Check if opportunity is a string or an object
                  const opportunityText = typeof opportunity === 'string' 
                    ? opportunity
                    : opportunity.opportunity 
                      ? `${opportunity.opportunity} - ${opportunity.impact ? `Impact: ${opportunity.impact}` : ''} ${opportunity.next_steps ? `Next steps: ${opportunity.next_steps}` : ''}`
                      : JSON.stringify(opportunity);
                  
                  return (
                    <li key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{opportunityText}</p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-gray-500 italic">No specific acceleration opportunities identified</p>
            )}

            {dealAcceleration["Prioritization Framework"] && (
              <div className="mt-6 p-4 border border-green-100 rounded-lg bg-green-50/50">
                <h3 className="text-md font-medium mb-2">Prioritization Framework</h3>
                <p className="text-gray-700">{dealAcceleration["Prioritization Framework"]}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Card */}
      <Card>
        <CardHeader className="bg-red-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Deal Risk Factors
              </CardTitle>
              <CardDescription>Critical issues that may slow or endanger deals</CardDescription>
            </div>
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              Requires Attention
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {hasStructuredRisks ? (
            <div className="space-y-4">
              {riskFactorsArray.map((risk, index) => (
                <div key={index} className="border border-red-100 rounded-lg overflow-hidden">
                  <div className="bg-red-50 p-3 border-b border-red-100">
                    <h3 className="font-medium text-red-800">{risk.risk_type}</h3>
                  </div>
                  <div className="p-3 space-y-3">
                    {risk.early_warning_signs && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">Early Warning Signs:</h4>
                        <p className="text-sm text-gray-700">{risk.early_warning_signs}</p>
                      </div>
                    )}
                    
                    {risk.mitigation_playbooks && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">Mitigation Strategy:</h4>
                        <p className="text-sm text-gray-700">{risk.mitigation_playbooks}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {riskFactorsArray.map((risk, index) => (
                <div key={index} className="bg-red-50/50 p-3 rounded-lg border-l-2 border-red-400">
                  <p className="text-gray-700">{typeof risk === 'string' ? risk : JSON.stringify(risk)}</p>
                </div>
              ))}
            </div>
          )}

          {riskFactorsArray.length === 0 && (
            <p className="text-gray-500 italic">No specific risk factors identified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DealAcceleration;
