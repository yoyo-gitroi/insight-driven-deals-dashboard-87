
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPie } from "lucide-react";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { safeJsonParse } from "@/lib/utils";

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">CRO Dashboard: Objection Analysis</h2>
      
      <Tabs defaultValue="industry" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="industry">By Industry</TabsTrigger>
          <TabsTrigger value="title">By Contact Title</TabsTrigger>
          <TabsTrigger value="geography">By Geography</TabsTrigger>
        </TabsList>
        
        {/* Industry Tab */}
        <TabsContent value="industry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                Number of Objections by Industry
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {industryObjections.length > 0 ? (
                <ChartContainer
                  config={{
                    industry1: { color: COLORS[0] },
                    industry2: { color: COLORS[1] },
                    industry3: { color: COLORS[2] },
                    industry4: { color: COLORS[3] },
                    industry5: { color: COLORS[4] },
                    industry6: { color: COLORS[5] },
                    industry7: { color: COLORS[6] },
                    industry8: { color: COLORS[7] },
                    industry9: { color: COLORS[8] },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={industryObjections}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {industryObjections.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent className="mt-6" />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No objection data available for industries</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Title Tab */}
        <TabsContent value="title" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                Number of Objections by Contact Title
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {titleObjections.length > 0 ? (
                <ChartContainer
                  config={{
                    title1: { color: COLORS[0] },
                    title2: { color: COLORS[1] },
                    title3: { color: COLORS[2] },
                    title4: { color: COLORS[3] },
                    title5: { color: COLORS[4] },
                    title6: { color: COLORS[5] },
                    title7: { color: COLORS[6] },
                    title8: { color: COLORS[7] },
                    title9: { color: COLORS[8] },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={titleObjections}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {titleObjections.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent className="mt-6" />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No objection data available for contact titles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                Number of Objections by Geography
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {geoObjections.length > 0 ? (
                <ChartContainer
                  config={{
                    geo1: { color: COLORS[0] },
                    geo2: { color: COLORS[1] },
                    geo3: { color: COLORS[2] },
                    geo4: { color: COLORS[3] },
                    geo5: { color: COLORS[4] },
                    geo6: { color: COLORS[5] },
                    geo7: { color: COLORS[6] },
                    geo8: { color: COLORS[7] },
                    geo9: { color: COLORS[8] },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={geoObjections}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {geoObjections.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent className="mt-6" />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No objection data available for geographies</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObjectionCharts;
