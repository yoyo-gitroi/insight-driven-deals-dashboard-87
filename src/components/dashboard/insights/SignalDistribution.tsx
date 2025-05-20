
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SignalDistributionProps {
  data: any[];
}

const SignalDistribution: React.FC<SignalDistributionProps> = ({ data }) => {
  // Process the data to generate signal distribution
  const signalData = React.useMemo(() => {
    const signalCounts: Record<string, number> = {
      "Objections": 0,
      "Opportunities": 0,
      "Confusion Points": 0,
      "External Factors": 0
    };
    
    data.forEach(deal => {
      try {
        const signalsData = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
        
        if (signalsData?.signals && Array.isArray(signalsData.signals)) {
          signalsData.signals.forEach((signal: any) => {
            if (signal?.signal_type) {
              const signalType = signal.signal_type.toLowerCase();
              
              if (signalType.includes('objection')) {
                signalCounts["Objections"]++;
              } else if (signalType.includes('opportunity') || signalType.includes('expansion')) {
                signalCounts["Opportunities"]++;
              } else if (signalType.includes('confusion')) {
                signalCounts["Confusion Points"]++;
              } else if (signalType.includes('external')) {
                signalCounts["External Factors"]++;
              }
            }
            
            // Also check for objection_analysis which indicates an objection
            else if (signal?.objection_analysis) {
              signalCounts["Objections"]++;
            }
          });
        }
      } catch (error) {
        console.error("Error processing signals data:", error);
      }
    });
    
    return Object.entries(signalCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [data]);
  
  const COLORS = ["#FF5252", "#4CAF50", "#7E57C2", "#FF9800"];
  
  // Find the largest segment for highlighting
  const largestSegment = React.useMemo(() => {
    if (signalData.length === 0) return null;
    return signalData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  }, [signalData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Signal Distribution</CardTitle>
        <CardDescription>
          Distribution of detected signal types across accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={signalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {signalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {largestSegment && (
          <div className="mt-4 text-sm bg-blue-50 p-3 rounded border border-blue-100">
            <strong>Key Insight:</strong> {largestSegment.name} represent the largest signal type ({largestSegment.value} occurrences), 
            suggesting that teams should focus on addressing these concerns first.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalDistribution;
