
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MessageSquare, Gauge, Calendar } from "lucide-react";
import AccountHealthCard from "./AccountHealthCard";

interface IntelligenceSummaryProps {
  data: any[];
}

const IntelligenceSummary: React.FC<IntelligenceSummaryProps> = ({ data }) => {
  // Process the data to generate summary metrics
  const metrics = React.useMemo(() => {
    const totalDeals = data.length;
    
    // Count objections (signals with "Objection::" prefix)
    let objectionCount = 0;
    let opportunityCount = 0;
    let implementationCount = 0;
    
    data.forEach(deal => {
      try {
        const signalsData = typeof deal.signals === 'string' ? JSON.parse(deal.signals) : deal.signals;
        
        if (signalsData?.signals && Array.isArray(signalsData.signals)) {
          signalsData.signals.forEach((signal: any) => {
            if (signal?.signal_type) {
              if (signal.signal_type.includes("Objection::")) {
                objectionCount++;
              } else if (signal.signal_type.includes("Expansion::") || 
                        signal.signal_type.includes("Opportunity::")) {
                opportunityCount++;
              } else if (signal.signal_type.includes("Implementation::")) {
                implementationCount++;
              }
            }
          });
        }
      } catch (error) {
        console.error("Error processing signals data:", error);
      }
    });
    
    return {
      totalDeals,
      objectionCount,
      opportunityCount,
      implementationCount
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AccountHealthCard
        title="Total Deals"
        value={metrics.totalDeals}
        icon={<Calendar className="h-5 w-5 text-blue-500" />}
        description="Active accounts"
        trend="neutral"
      />
      <AccountHealthCard
        title="Objections"
        value={metrics.objectionCount}
        icon={<MessageSquare className="h-5 w-5 text-red-500" />}
        description="Across all accounts"
        trend={metrics.objectionCount > 10 ? "up" : "neutral"}
      />
      <AccountHealthCard
        title="Opportunities"
        value={metrics.opportunityCount}
        icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        description="Expansion potential"
        trend="up"
      />
      <AccountHealthCard
        title="Implementation"
        value={metrics.implementationCount}
        icon={<Gauge className="h-5 w-5 text-amber-500" />}
        description="Technical concerns"
        trend={metrics.implementationCount > 5 ? "down" : "neutral"}
      />
    </div>
  );
};

export default IntelligenceSummary;
