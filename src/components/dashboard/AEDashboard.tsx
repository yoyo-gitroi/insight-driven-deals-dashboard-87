
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DealTable from "./DealTable";
import PlaybookCards from "./PlaybookCards";
import AEInsights from "./AEInsights";

interface AEDashboardProps {
  crmData: any[];
  aeList: string[];
  selectedAE: string;
  setSelectedAE: (ae: string) => void;
  developerMode: boolean;
  viewMode: "table" | "cards";
}

const AEDashboard = ({
  crmData,
  aeList,
  selectedAE,
  setSelectedAE,
  developerMode,
  viewMode
}: AEDashboardProps) => {
  const [activeTab, setActiveTab] = useState("playbook");

  const filteredDeals = selectedAE === "all"
    ? crmData
    : crmData.filter((deal) => deal.owner === selectedAE);

  const handleAEChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAE(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-xl font-medium mb-2 sm:mb-0">Account Executive Dashboard</h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="ae-select" className="text-sm font-medium">
                Select AE:
              </label>
              <select
                id="ae-select"
                value={selectedAE}
                onChange={handleAEChange}
                className="border rounded p-1"
              >
                <option value="all">All AEs</option>
                {aeList.map((ae) => (
                  <option key={ae} value={ae}>
                    {ae}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Tabs defaultValue="playbook" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="playbook">Playbook</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="playbook">
              {viewMode === "cards" ? (
                <PlaybookCards deals={filteredDeals} developerMode={developerMode} />
              ) : (
                <DealTable deals={filteredDeals} developerMode={developerMode} />
              )}
            </TabsContent>
            <TabsContent value="insights">
              <AEInsights crmData={filteredDeals} selectedAE={selectedAE} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AEDashboard;
