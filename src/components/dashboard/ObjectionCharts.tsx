
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useObjectionData } from "@/hooks/useObjectionData";
import IndustryObjectionsTab from "./objections/IndustryObjectionsTab";
import TitleObjectionsTab from "./objections/TitleObjectionsTab";
import GeoObjectionsTab from "./objections/GeoObjectionsTab";

interface ObjectionChartsProps {
  crmData: any[];
}

const ObjectionCharts: React.FC<ObjectionChartsProps> = ({ crmData }) => {
  const { industryObjections, titleObjections, geoObjections } = useObjectionData(crmData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Signal Detection: Objection Analysis</h2>
      
      <Tabs defaultValue="industry" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="industry">By Industry</TabsTrigger>
          <TabsTrigger value="title">By Contact Title</TabsTrigger>
          <TabsTrigger value="geography">By Geography</TabsTrigger>
        </TabsList>
        
        {/* Industry Tab */}
        <TabsContent value="industry" className="space-y-6">
          <IndustryObjectionsTab data={industryObjections} />
        </TabsContent>
        
        {/* Contact Title Tab */}
        <TabsContent value="title" className="space-y-6">
          <TitleObjectionsTab data={titleObjections} />
        </TabsContent>
        
        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <GeoObjectionsTab data={geoObjections} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObjectionCharts;
