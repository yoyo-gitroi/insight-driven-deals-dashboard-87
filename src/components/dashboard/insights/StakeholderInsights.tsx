
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

interface StakeholderInsightsProps {
  deals: any[];
}

interface Stakeholder {
  name: string;
  role: string;
  sentiment: "Champion" | "Neutral" | "Detractor";
  influence_level: "High" | "Medium" | "Low";
}

const StakeholderInsights: React.FC<StakeholderInsightsProps> = ({ deals }) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  
  useEffect(() => {
    // Sample stakeholder data - in a real app, extract this from the deals
    const extractedStakeholders: Stakeholder[] = [
      { 
        name: "Romain Debordeaux", 
        role: "VP Data & Info Systems", 
        sentiment: "Champion", 
        influence_level: "High" 
      },
      { 
        name: "Fabrice Johnson", 
        role: "Head of Analytics", 
        sentiment: "Neutral", 
        influence_level: "Medium" 
      },
      { 
        name: "Sarah Wilson", 
        role: "CTO", 
        sentiment: "Champion", 
        influence_level: "High" 
      },
      { 
        name: "Thomas Lee", 
        role: "Data Engineer", 
        sentiment: "Detractor", 
        influence_level: "Low" 
      }
    ];
    
    setStakeholders(extractedStakeholders);
    
    // Aggregate sentiment data
    const sentimentCounts = extractedStakeholders.reduce((acc: Record<string, number>, curr) => {
      acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
      return acc;
    }, {});
    
    const sentimentChartData = [
      { name: "Champion", value: sentimentCounts["Champion"] || 0, color: "#4CAF50" },
      { name: "Neutral", value: sentimentCounts["Neutral"] || 0, color: "#2196F3" },
      { name: "Detractor", value: sentimentCounts["Detractor"] || 0, color: "#FF6B6B" }
    ];
    
    setSentimentData(sentimentChartData);
  }, [deals]);
  
  const renderSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Champion":
        return <Badge className="bg-green-500">Champion</Badge>;
      case "Neutral":
        return <Badge className="bg-blue-500">Neutral</Badge>;
      case "Detractor":
        return <Badge className="bg-red-500">Detractor</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const renderInfluenceBadge = (influence: string) => {
    switch (influence) {
      case "High":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">High Influence</Badge>;
      case "Medium":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Medium Influence</Badge>;
      case "Low":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Low Influence</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sentiment chart */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Stakeholder Sentiment
          </CardTitle>
          <CardDescription>
            Distribution of stakeholder sentiment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Stakeholder list */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Key Stakeholders
          </CardTitle>
          <CardDescription>
            Key decision makers and influencers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stakeholders.map((stakeholder, index) => (
              <div key={index} className="flex flex-col p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{stakeholder.name}</h3>
                    <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                  </div>
                  <div className="flex gap-2">
                    {renderSentimentBadge(stakeholder.sentiment)}
                  </div>
                </div>
                <div className="mt-2">
                  {renderInfluenceBadge(stakeholder.influence_level)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderInsights;
