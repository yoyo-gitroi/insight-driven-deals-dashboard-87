
import { useState, useEffect } from "react";
import { safeJsonParse } from "@/lib/utils";

export const useObjectionData = (crmData: any[]) => {
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

  return {
    industryObjections,
    titleObjections,
    geoObjections
  };
};
