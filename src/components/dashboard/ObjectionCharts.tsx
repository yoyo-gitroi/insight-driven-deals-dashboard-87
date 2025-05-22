
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeJsonParse } from "@/lib/utils";
import ObjectionPieChart from "./objections/ObjectionPieChart";

interface ObjectionChartsProps {
  crmData: any[];
}

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196', '#6E59A5', '#FEC6A1', '#E5DEFF'];

const ObjectionCharts: React.FC<ObjectionChartsProps> = ({ crmData }) => {
  const [industryObjections, setIndustryObjections] = useState<any[]>([]);
  const [titleObjections, setTitleObjections] = useState<any[]>([]);
  const [geoObjections, setGeoObjections] = useState<any[]>([]);

  useEffect(() => {
    processObjectionsByAttribute();
  }, [crmData]);

  const countObjectionsInDeals = (deals: any[]): number => {
    let objectionCount = 0;
    
    deals.forEach(deal => {
      try {
        const signalsData = safeJsonParse(deal.signals);
        
        if (signalsData?.signals && Array.isArray(signalsData.signals)) {
          // Count objections in signals array
          objectionCount += signalsData.signals.filter((signal: any) => 
            signal.signal_type?.toLowerCase().includes('objection')
          ).length;
        } else if (Array.isArray(signalsData)) {
          // Count objections if signals is a direct array
          objectionCount += signalsData.filter((signal: any) => 
            signal.signal_type?.toLowerCase().includes('objection')
          ).length;
        } else if (signalsData?.signal_type?.toLowerCase().includes('objection')) {
          // Count single objection
          objectionCount += 1;
        }
      } catch (e) {
        console.error("Error processing signals data for objections:", e);
      }
    });
    
    return objectionCount;
  };

  const processObjectionsByAttribute = () => {
    // Process by industry
    const industryMap = new Map<string, any[]>();
    // Process by contact title
    const titleMap = new Map<string, any[]>();
    // Process by geography
    const geoMap = new Map<string, any[]>();
    
    // Group deals by each attribute
    crmData.forEach(deal => {
      const industry = deal.industry || 'Unknown';
      const title = deal.contact_title || 'Unknown';
      const geo = deal.geo || 'Unknown';
      
      if (!industryMap.has(industry)) {
        industryMap.set(industry, []);
      }
      industryMap.get(industry)!.push(deal);
      
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title)!.push(deal);
      
      if (!geoMap.has(geo)) {
        geoMap.set(geo, []);
      }
      geoMap.get(geo)!.push(deal);
    });
    
    // Count objections for each industry
    const industryData = Array.from(industryMap.entries()).map(([industry, deals]) => ({
      name: industry,
      value: countObjectionsInDeals(deals)
    })).filter(item => item.value > 0);
    
    // Count objections for each title
    const titleData = Array.from(titleMap.entries()).map(([title, deals]) => ({
      name: title,
      value: countObjectionsInDeals(deals)
    })).filter(item => item.value > 0);
    
    // Count objections for each geo
    const geoData = Array.from(geoMap.entries()).map(([geo, deals]) => ({
      name: geo,
      value: countObjectionsInDeals(deals)
    })).filter(item => item.value > 0);
    
    // Sort data by value in descending order
    setIndustryObjections(industryData.sort((a, b) => b.value - a.value));
    setTitleObjections(titleData.sort((a, b) => b.value - a.value));
    setGeoObjections(geoData.sort((a, b) => b.value - a.value));
    
    console.log("Industry objections:", industryData);
    console.log("Title objections:", titleData);
    console.log("Geo objections:", geoData);
  };

  // Generate config names for each chart type
  const industryConfigNames = Array.from({ length: 9 }, (_, i) => `industry${i + 1}`);
  const titleConfigNames = Array.from({ length: 9 }, (_, i) => `title${i + 1}`);
  const geoConfigNames = Array.from({ length: 9 }, (_, i) => `geo${i + 1}`);

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
          <ObjectionPieChart
            title="Number of Objections by Industry"
            data={industryObjections}
            colors={COLORS}
            configNames={industryConfigNames}
          />
        </TabsContent>
        
        {/* Contact Title Tab */}
        <TabsContent value="title" className="space-y-6">
          <ObjectionPieChart
            title="Number of Objections by Contact Title"
            data={titleObjections}
            colors={COLORS}
            configNames={titleConfigNames}
          />
        </TabsContent>
        
        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <ObjectionPieChart
            title="Number of Objections by Geography"
            data={geoObjections}
            colors={COLORS}
            configNames={geoConfigNames}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObjectionCharts;
