
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDUSTRY_PATTERNS, SIGNAL_TYPES } from "../../objections/objectionConstants";

const IndustryPatternMatrix = () => {
  const signalTypes = Object.keys(SIGNAL_TYPES);
  
  // Generate sample intensity data (in a real app, this would come from data)
  const generateIntensityMap = () => {
    const result: Record<string, Record<string, number>> = {};
    
    Object.keys(INDUSTRY_PATTERNS).forEach(industry => {
      result[industry] = {};
      signalTypes.forEach(signal => {
        // Generate a random intensity between 1-10
        result[industry][signal] = Math.floor(Math.random() * 10) + 1;
      });
    });
    
    return result;
  };
  
  const intensityMap = generateIntensityMap();
  
  // Function to get cell background color based on intensity
  const getCellColor = (intensity: number, baseColor: string) => {
    const opacity = (intensity / 10) * 0.9; // Max opacity 0.9
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">Industry Pattern Matrix</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">Industry</th>
                {signalTypes.map(signal => (
                  <th key={signal} className="px-2 py-2 text-center text-sm font-medium text-gray-500">
                    {signal}
                  </th>
                ))}
                <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">Primary Focus</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(INDUSTRY_PATTERNS).map(([industry, data]) => (
                <tr key={industry} className="border-t">
                  <td className="px-2 py-3 text-sm font-medium">{industry}</td>
                  {signalTypes.map(signal => {
                    const intensity = intensityMap[industry][signal];
                    const signalColor = SIGNAL_TYPES[signal as keyof typeof SIGNAL_TYPES]?.color || '#6366f1';
                    
                    return (
                      <td key={signal} className="px-2 py-3 text-center">
                        <div 
                          className="w-8 h-8 rounded-md flex items-center justify-center mx-auto text-white text-xs font-medium"
                          style={{ backgroundColor: getCellColor(intensity, signalColor) }}
                        >
                          {intensity}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-2 py-3 text-sm">
                    <div 
                      className="px-2 py-1 rounded-md text-sm"
                      style={{ backgroundColor: `${data.color}20`, color: data.color }}
                    >
                      {data.focus}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryPatternMatrix;
