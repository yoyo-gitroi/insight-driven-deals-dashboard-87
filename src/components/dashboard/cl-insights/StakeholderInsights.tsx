
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRound, Users, AlertCircle } from "lucide-react";

interface StakeholderInsightsProps {
  stakeholderInsights: {
    "Most Influential Roles": string;
    "Sentiment Trends by Role": {
      "Directors of Analytics": string;
      "Infrastructure Leads": string;
      "Business Leads": string;
    };
    "Recurring Priorities by Persona": {
      "Directors of Analytics": string;
      "IT/Infrastructure": string;
      "Business Leaders": string;
    };
    "Missing Personas": string[];
    "Recommended Engagement": string;
  };
}

const StakeholderInsights: React.FC<StakeholderInsightsProps> = ({ stakeholderInsights }) => {
  return (
    <div className="space-y-6">
      {/* Most Influential Roles Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-indigo-600" />
            Key Stakeholders & Persona Insights
          </CardTitle>
          <CardDescription>Understanding of different personas involved in the buying process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-indigo-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-indigo-800 mb-2">Most Influential Roles</h3>
            <p className="text-indigo-700">{stakeholderInsights["Most Influential Roles"]}</p>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Trends Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis by Role</CardTitle>
          <CardDescription>How different stakeholders perceive our solution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Directors of Analytics</h3>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Champion</Badge>
            </div>
            <p className="text-sm text-gray-700">{stakeholderInsights["Sentiment Trends by Role"]["Directors of Analytics"]}</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Infrastructure Leads</h3>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Technical Evaluator</Badge>
            </div>
            <p className="text-sm text-gray-700">{stakeholderInsights["Sentiment Trends by Role"]["Infrastructure Leads"]}</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Business Leads</h3>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Decision Maker</Badge>
            </div>
            <p className="text-sm text-gray-700">{stakeholderInsights["Sentiment Trends by Role"]["Business Leads"]}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Priorities Card */}
      <Card>
        <CardHeader>
          <CardTitle>Priorities by Persona</CardTitle>
          <CardDescription>What matters most to each stakeholder group</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-blue-100 p-4 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Directors of Analytics</h3>
              <p className="text-sm text-blue-700">{stakeholderInsights["Recurring Priorities by Persona"]["Directors of Analytics"]}</p>
            </div>
            
            <div className="border border-emerald-100 p-4 rounded-lg bg-emerald-50">
              <h3 className="font-medium text-emerald-800 mb-2">IT/Infrastructure</h3>
              <p className="text-sm text-emerald-700">{stakeholderInsights["Recurring Priorities by Persona"]["IT/Infrastructure"]}</p>
            </div>
            
            <div className="border border-amber-100 p-4 rounded-lg bg-amber-50">
              <h3 className="font-medium text-amber-800 mb-2">Business Leaders</h3>
              <p className="text-sm text-amber-700">{stakeholderInsights["Recurring Priorities by Persona"]["Business Leaders"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missing Personas Card */}
      <Card>
        <CardHeader className="border-b bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Missing Personas
              </CardTitle>
              <CardDescription>Critical stakeholders missing from conversations</CardDescription>
            </div>
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {stakeholderInsights["Missing Personas"].map((persona, index) => (
              <div key={index} className="bg-red-50/50 p-3 rounded-lg border-l-2 border-red-400">
                <p className="text-gray-700">{persona}</p>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">Recommended Engagement</h3>
              <p className="text-blue-700">{stakeholderInsights["Recommended Engagement"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderInsights;
