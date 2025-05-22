
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIGNAL_TYPES } from "../../objections/objectionConstants";
import { Badge } from "@/components/ui/badge";

const SignalFrequencyHeatmap = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">Signal Frequency Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {Object.entries(SIGNAL_TYPES).map(([type, data]) => (
            <div 
              key={type}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: `${data.color}15` }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: data.color }}
                ></div>
                <span className="font-medium">{type}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  className="bg-white text-gray-700 border shadow-sm"
                >
                  {data.frequency}
                </Badge>
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: data.color }}
                >
                  {data.impact} Impact
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalFrequencyHeatmap;
