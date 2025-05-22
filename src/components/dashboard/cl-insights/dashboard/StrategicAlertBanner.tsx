
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader } from "lucide-react";

interface StrategicAlertBannerProps {
  redFlags: string[];
  isLoading?: boolean;
}

const StrategicAlertBanner: React.FC<StrategicAlertBannerProps> = ({ 
  redFlags = [], 
  isLoading = false 
}) => {
  return (
    <Card className="shadow-md border-red-100">
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Strategic Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-4">
        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader className="h-5 w-5 text-red-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Loading alerts...</p>
            </div>
          ) : (
            <>
              {Array.isArray(redFlags) && redFlags.length > 0 ? (
                redFlags.map((flag, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded-lg border-l-2 border-red-500 text-sm">
                    <p className="text-gray-800">{flag}</p>
                  </div>
                ))
              ) : (
                <div className="bg-red-50 p-3 rounded-lg text-sm text-center">
                  <p className="text-gray-600">No critical alerts at this time</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicAlertBanner;
