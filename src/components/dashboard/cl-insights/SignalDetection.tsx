
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PrimarySignalCategories, StakeholderPersonaInsights } from "@/utils/dataProcessor";

interface SignalDetectionProps {
  primarySignals: PrimarySignalCategories;
  stakeholders: StakeholderPersonaInsights;
}

const SignalDetection: React.FC<SignalDetectionProps> = ({ primarySignals, stakeholders }) => {
  // Example signal cards data
  const signalCards = [
    {
      type: "Expansion Signal",
      quote: "We'll roll this out to the APAC team next quarter.",
      speaker: "CIO",
      function: "detect_expansion_opportunity()",
      stage: "Evaluation",
      color: "border-green-500",
      badgeColor: "bg-green-100 text-green-800 hover:bg-green-100",
      kit: "Expansion Follow-Up Kit"
    },
    {
      type: "Tech Objection",
      quote: "Researchers are in remote locations with limited connectivity.",
      speaker: "Research Director",
      function: "detect_connectivity_concern()",
      stage: "Discovery",
      color: "border-purple-500",
      badgeColor: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      kit: "Mobile-Offline Capabilities"
    },
    {
      type: "Buy-In",
      quote: "That would streamline our chapter operations significantly.",
      speaker: "Chapter Coordinator",
      function: "flag_enthusiasm()",
      stage: "Demo",
      color: "border-blue-500",
      badgeColor: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      kit: "Chapter Admin One-Sheet"
    },
    {
      type: "Financial Objection",
      quote: "Our budget cycle won't allow for a purchase until next fiscal year.",
      speaker: "Financial Decision Maker",
      function: "detect_budget_timing()",
      stage: "Negotiation",
      color: "border-red-500",
      badgeColor: "bg-red-100 text-red-800 hover:bg-red-100",
      kit: "Flexible Payment Options"
    }
  ];

  // "Reps Are Missing" section data
  const repsMissing = [
    { need: "Multi-language needs", frequency: "16 instances", priority: "High" },
    { need: "Content contribution workflows", frequency: "12 instances", priority: "Medium" },
    { need: "Granular privacy control discussion", frequency: "14 instances", priority: "High" },
    { need: "Onboarding strategy articulation", frequency: "15 instances", priority: "Medium" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Signal Detection Overview</h1>
        <p className="text-sm text-gray-600">Critical GTM signals extracted and clustered across accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Signals Section */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Expansion Signals</h3>
              <ul className="space-y-1">
                <li className="flex gap-2 text-sm">• "We'll add membership later" → <span className="text-gray-600">detect_expansion_signal()</span></li>
                <li className="flex gap-2 text-sm">• Multi-language needs → <span className="text-gray-600">detect_global_scaling()</span></li>
                <li className="flex gap-2 text-sm">• Cross-chapter workflows → <span className="text-gray-600">map_module_to_needs("Distributed Admin")</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Top Personas</h3>
              <ul className="space-y-1">
                <li className="text-sm">• Community Managers</li>
                <li className="text-sm">• Executive Directors</li>
                <li className="text-sm">• Chapter Leads</li>
                <li className="text-sm">• Technical Implementers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Technical Objections</h3>
              <ul className="space-y-1">
                <li className="text-sm">• Offline app needed for field workers</li>
                <li className="text-sm">• Data migration from fragmented systems</li>
                <li className="text-sm">• Integration with Zoom, Mailchimp, legacy CRMs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Pitch Confusion</h3>
              <ul className="space-y-1">
                <li className="text-sm">• Difference between Groups vs. Chapters</li>
                <li className="text-sm">• Mentorship module (self-match vs. algorithm)</li>
                <li className="text-sm">• Resource Library vs. Content Module</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Signals Section */}
        <Card>
          <CardHeader>
            <CardTitle>Secondary Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Feature Interest</h3>
              <ul className="space-y-1">
                <li className="text-sm">• Membership algorithms</li>
                <li className="text-sm">• Offline app capabilities</li>
                <li className="text-sm">• Multilingual UI</li>
                <li className="text-sm">• Chapter management tools</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Integration Pain</h3>
              <ul className="space-y-1">
                <li className="text-sm">• Zoom video conferencing</li>
                <li className="text-sm">• Mailchimp email marketing</li>
                <li className="text-sm">• Stripe payment processing</li>
                <li className="text-sm">• Legacy CRM systems</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Self-Diagnosis Quotes</h3>
              <ul className="space-y-1">
                <li className="text-sm">• "Our tools are cobbled together"</li>
                <li className="text-sm">• "This is too manual for where we are"</li>
                <li className="text-sm">• "We've outgrown our current solution"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signal Cards */}
      <div>
        <h2 className="text-lg font-medium mb-3">Signal Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signalCards.map((card, index) => (
            <div key={index} className={`border-l-4 ${card.color} p-3 rounded bg-white shadow`}>
              <div className="flex items-center justify-between">
                <Badge className={`mb-2 ${card.badgeColor}`}>{card.type}</Badge>
                <Badge variant="outline">{card.stage}</Badge>
              </div>
              <p className="italic text-sm mb-2">"{card.quote}"</p>
              <p className="text-xs text-gray-600">— {card.speaker}</p>
              <div className="mt-2 bg-gray-50 p-1 rounded text-xs font-mono">{card.function}</div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-blue-600">→ {card.kit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reps Are Missing */}
      <Card>
        <CardHeader>
          <CardTitle>Reps Are Missing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {repsMissing.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.need}</h3>
                  <p className="text-sm text-gray-500">Frequency: {item.frequency}</p>
                </div>
                <Badge className={item.priority === "High" ? "bg-red-500" : "bg-yellow-500"}>
                  {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta-Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle>Meta-Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Quote-to-Signal Ratio</h3>
              <p className="text-sm">3.2 quotes per Expansion Signal (strong), 4.8 per Technical Objection (weak)</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Buyer Journey Gaps</h3>
              <ul className="space-y-1 text-sm list-disc pl-5">
                <li>Weak onboarding discussion</li>
                <li>No visibility into success metrics</li>
                <li>Under-addressed adoption strategy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Language Resonance</h3>
              <p className="text-sm">"Engagement", "Streamline", and "Knowledge Sharing" = high resonance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalDetection;
