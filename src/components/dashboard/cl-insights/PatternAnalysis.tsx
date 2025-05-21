
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PatternAnalysisProps {
  patternAnalysis: any;
  riskData: any;
}

const PatternAnalysis: React.FC<PatternAnalysisProps> = ({ patternAnalysis, riskData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pattern Analysis Hub</h1>
        <p className="text-sm text-gray-600">Analysis of recurring patterns and trends across customer accounts</p>
      </div>
      
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="card">Card View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Integration as a Universal Obstacle */}
            <Card>
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Integration as a Universal Obstacle</CardTitle>
                  <Badge className="bg-red-500">High</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">
                  Integration with fragmented, legacy, or multi-source data environments is the most common objection across nearly all accounts. Frequently encountered with Enterprise, Finance, and Healthcare.
                </p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Frequency Score:</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                    <span className="ml-2 text-sm">95%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Standardize and refine integration playbooks (aligned to vertical fix). Prioritize big players.</li>
                    <li>Provide clear, step-by-step technical documentation and proof-of-concept (POC) blueprints for common stacks.</li>
                    <li>Highlight quick integration wins and reference deployments matching the customer's stack.</li>
                    <li>Involve solution architects pre-sale to reduce pre-POC friction.</li>
                  </ul>
                </div>
                <div className="flex justify-end mt-3">
                  <Badge variant="outline" className="text-gray-500">Very Common</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Product Fit & Positioning Gaps */}
            <Card>
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Product Fit & Positioning Gaps</CardTitle>
                  <Badge className="bg-red-500">High</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">
                  A major recurring objection is uncertainty about how the platform adapts to unique business models (complex B2B/B2C at IronMountain, SaaS/physical product mix like OnSiteKiosk). Stakeholders struggling to fit for usage.
                </p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Frequency Score:</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                    <span className="ml-2 text-sm">82%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Segment demo flows and vertically-align sales collateral for distinct segments (e.g., B2B/B2C, medical/IT services).</li>
                    <li>Enrich case study library with more detailed references (industry- or size-matched).</li>
                    <li>In sales calls, always tie product features to specific pain points described by the customer (quantify alignment, don't assume).</li>
                    <li>Offer focused pilots on one core use case first, then broaden.</li>
                  </ul>
                </div>
                <div className="flex justify-end mt-3">
                  <Badge variant="outline" className="text-gray-500">Very Common</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Pricing & ROI Uncertainty */}
            <Card>
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Pricing & ROI Uncertainty</CardTitle>
                  <Badge className="bg-blue-500">Medium</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">
                  Customers in mid-market and SMB (GoToFTA, Chatham Bars Inn, Avocado, Hotel of Troy) express concern about cost, risk, and value for money. Some want creative packages, introductory rates, or clear proof of ROI as a precondition for adoption.
                </p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Frequency Score:</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <span className="ml-2 text-sm">75%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Develop clear value-based pricing tiers for different company size/use cases.</li>
                    <li>Standardize ROI calculators for efficiency with defined formulas.</li>
                    <li>Encourage AEs to proactively propose pilot/commercial structures (not just affirm customer's plan).</li>
                    <li>Provide ROI calculators or concrete benchmarks for similar deployments.</li>
                  </ul>
                </div>
                <div className="flex justify-end mt-3">
                  <Badge variant="outline" className="text-gray-500">Common</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Security/Data Residency */}
            <Card>
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Security/Data Residency as a Recurrent Theme for Enterprise</CardTitle>
                  <Badge className="bg-red-500">High</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">
                  Large customers (Amadeus, Mastercard, CognizantI, Iron Mountain) worry about data sharing, on-prem/hybrid support, and compliance.
                </p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Frequency Score:</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                    <span className="ml-2 text-sm">62%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Industrialize your security/compliance collateral and co-deployment models (including on-prem, single-tenant cloud, etc.).</li>
                    <li>Reference highly regulated deployments upfront (e.g., Mastercard proof points).</li>
                    <li>Have ready responses and architecture diagrams for CISO/CSO questions.</li>
                  </ul>
                </div>
                <div className="flex justify-end mt-3">
                  <Badge variant="outline" className="text-gray-500">Common</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Cross-Cutting Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Cross-Cutting Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li className="text-sm">Update enablement and sales collateral quarterly to reflect latest market wins, integration strategies, and objections handling.</li>
                <li className="text-sm">Implement systematic post-call reviews to identify unaddressed objections and missed expansion opportunities.</li>
                <li className="text-sm">Expand the reference customer base, prioritizing verticals/segments where objections are most acute.</li>
                <li className="text-sm">Continue investing in integration/automation playbooks and surfaced case studies directly in CRM workflows.</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-gray-500">List view is available but not displayed in this prototype.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternAnalysis;
