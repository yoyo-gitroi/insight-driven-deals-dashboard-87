
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { PatternTrendAnalysis, DealAccelerationRisk } from "@/utils/dataProcessor";

interface PatternAnalysisProps {
  patternData: PatternTrendAnalysis;
  riskData: DealAccelerationRisk;
}

const PatternAnalysis: React.FC<PatternAnalysisProps> = ({ patternData, riskData }) => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  
  // Pattern cards data
  const patternCards = [
    {
      type: "Integration as a Universal Obstacle",
      tag: "High",
      frequency: "95%",
      description: "Integration with fragmented, legacy, or multi-source data environments is the most common objection across nearly all accounts (Amplitude, Domo, Iron Mountain, Bigbasket, Yatra, Cognizant, Chatham Bars Inn). Consistent pain points around API limitations and manual processes.",
      actions: [
        "Standardize and refine integration playbooks (tailored to vertical e.g., Fintech vs. Retail vs. Hospitality).",
        "Provide clear, step-by-step technical documentation and proof-of-concept (POC) blueprints for common stacks.",
        "Highlight quick integration wins and reference deployments matching the customer's stack.",
        "Involve solution architects pre-sale to reduce pre-POC friction."
      ],
      common: "Very Common"
    },
    {
      type: "Product Fit & Positioning Gaps",
      tag: "New",
      frequency: "82%",
      description: "A major recurring objection is uncertainty about how the platform adapts to unique business models (complex B2B/B2C or third-party distributors at Chatham Bars Inn, precision analytics integration at Cognizant). Stakeholders struggle to see themselves in the product.",
      actions: [
        "Invest in industry-specific flows and verticalized sales collateral for distinct segments (e.g., B2B2C, mid-market hospitality, IT services).",
        "Evolve case study library with more relatable references (industry- or size-matched).",
        "In sales calls, always tie product features to specific pain points described by the customer (quantify alignment, don't assume).",
        "Offer focused pilots on one core use case first, then broaden."
      ],
      common: "Very Common"
    },
    {
      type: "Pricing & ROI Uncertainty",
      tag: "Medium",
      frequency: "75%",
      description: "Customers in mid-market and SMB (BizKFC, Chatham Bars Inn, Avocado, Hotel of Troy) express concern about cost, risk, and value for money. Some want creative packages, introductory rates, or clear proof of ROI as a precondition for adoption.",
      actions: [
        "Develop clear value-based pricing tiers for different company sizes/use cases.",
        "Document specific ROI efficiency gain statistics with before/after customer comparisons.",
        "Encourage AEs to proactively propose pilot/commercial structures that just affirm customer's plan.",
        "Provide ROI calculators or concrete benchmarks for similar deployments."
      ],
      common: "Common"
    },
    {
      type: "Security/Data Residency as a Recurrent Theme for Enterprise",
      tag: "High",
      frequency: "62%",
      description: "Large customers (Amadeus, Mastercard, Cognizant, Iron Mountain) worry about data sharing, on-prem/hybrid support, and compliance.",
      actions: [
        "Industrialize your security/compliance collateral and co-deployment models (including on-prem, single-tenant cloud, etc.).",
        "Reference highly regulated deployments upfront (e.g., Mastercard proof points).",
        "Have ready responses and architecture diagrams for CISO/CSO questions."
      ],
      common: "Common"
    },
    {
      type: "Communication and Stakeholder Buy-in/Alignment Challenges",
      tag: "Medium",
      frequency: "57%",
      description: "Objections related to internal bandwidth, team alignment (Amadeus, AstraZeneca), and competing priorities (budget cycles, internal AI projects) recur at early and mid stages.",
      actions: [
        "Equip AE/SEs with internal champion toolkits (templates for email follow-ups, business case decks for stakeholder alignment, etc.).",
        "Develop clear internal signal briefs or success plans that your champion can circulate.",
        "For larger prospects, propose a multi-stakeholder kickoff or workshop to synchronize priorities."
      ],
      common: "Occasional"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pattern Analysis Hub</h1>
        <p className="text-sm text-gray-600">Analysis of recurring patterns and trends across customer accounts</p>
      </div>

      <div className="flex items-center space-x-2 pb-2">
        <Button 
          variant={viewMode === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("card")}
        >
          Card View
        </Button>
        <Button 
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          List View
        </Button>
      </div>

      {viewMode === "card" ? (
        <div className="space-y-6">
          {patternCards.map((card, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{card.type}</CardTitle>
                <Badge className={`
                  ${card.tag === "High" ? "bg-red-500" : 
                    card.tag === "New" ? "bg-red-500" : 
                    "bg-blue-500"}
                `}>
                  {card.tag}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Frequency Score:</span>
                    <span className="text-sm ml-2">{card.frequency}</span>
                  </div>
                  <Badge variant="outline">{card.common}</Badge>
                </div>

                <p className="text-sm">{card.description}</p>

                <div>
                  <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {card.actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pattern List View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patternCards.map((card, idx) => (
                <div key={idx} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{card.type}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`
                        ${card.tag === "High" ? "bg-red-500" : 
                          card.tag === "New" ? "bg-red-500" : 
                          "bg-blue-500"}
                      `}>
                        {card.tag}
                      </Badge>
                      <span className="text-sm">{card.frequency}</span>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{card.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-Cutting Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-Cutting Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-3">
            <li className="text-sm">Update enablement and sales collateral quarterly to reflect latest market wins, integration strategies, and objections handling.</li>
            <li className="text-sm">Implement systematic post-call reviews to identify unaddressed objections and missed expansion opportunities.</li>
            <li className="text-sm">Expand the reference customer base, prioritizing verticals/segments where objections are most acute.</li>
            <li className="text-sm">Continue investing in integration/automation playbooks and surfaced case studies directly in CRM workflows.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternAnalysis;
