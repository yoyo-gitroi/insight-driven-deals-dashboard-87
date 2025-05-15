
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeJsonParse } from "@/lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from "recharts";

interface ObjectionAnalysisTabProps {
  crmData: any[];
}

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#8E9196'];

const ObjectionAnalysisTab: React.FC<ObjectionAnalysisTabProps> = ({ crmData }) => {
  const [objectionsByIndustry, setObjectionsByIndustry] = useState<any[]>([]);
  const [objectionsByTitle, setObjectionsByTitle] = useState<any[]>([]);
  const [objectionsByGeo, setObjectionsByGeo] = useState<any[]>([]);

  useEffect(() => {
    processObjectionsByIndustry();
    processObjectionsByTitle();
    processObjectionsByGeo();
  }, [crmData]);

  // Process objections by industry
  const processObjectionsByIndustry = () => {
    const objectionCounts: Record<string, number> = {};
    
    crmData.forEach(deal => {
      const industry = deal.industry || 'Unknown';
      
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        
        // Count objections from signals
        let objectionCount = 0;
        
        // Check if it's an object with a 'signals' array inside
        if (signalsData?.signals && Array.isArray(signalsData.signals)) {
          objectionCount = signalsData.signals.filter((s: any) => 
            s?.objection_analysis?.objection_type).length;
        }
        // Check if it's a direct array of signals
        else if (Array.isArray(signalsData)) {
          objectionCount = signalsData.filter((s: any) => 
            s?.objection_analysis?.objection_type).length;
        }
        // Direct single signal
        else if (signalsData?.objection_analysis?.objection_type) {
          objectionCount = 1;
        }
        
        if (objectionCount > 0) {
          objectionCounts[industry] = (objectionCounts[industry] || 0) + objectionCount;
        }
      } catch (e) {
        console.error("Error processing objections by industry:", e);
      }
    });
    
    // Convert to array format for chart
    const result = Object.entries(objectionCounts).map(([name, value]) => ({ name, value }));
    setObjectionsByIndustry(result);
  };
  
  // Process objections by contact title (seniority)
  const processObjectionsByTitle = () => {
    const objectionCounts: Record<string, number> = {};
    
    crmData.forEach(deal => {
      const title = deal.contact_title || 'Unknown';
      
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        
        // Count objections from signals
        let objectionCount = 0;
        
        // Check if it's an object with a 'signals' array inside
        if (signalsData?.signals && Array.isArray(signalsData.signals)) {
          objectionCount = signalsData.signals.filter((s: any) => 
            s?.objection_analysis?.objection_type).length;
        }
        // Check if it's a direct array of signals
        else if (Array.isArray(signalsData)) {
          objectionCount = signalsData.filter((s: any) => 
            s?.objection_analysis?.objection_type).length;
        }
        // Direct single signal
        else if (signalsData?.objection_analysis?.objection_type) {
          objectionCount = 1;
        }
        
        if (objectionCount > 0) {
          objectionCounts[title] = (objectionCounts[title] || 0) + objectionCount;
        }
      } catch (e) {
        console.error("Error processing objections by title:", e);
      }
    });
    
    // Convert to array format for chart
    const result = Object.entries(objectionCounts).map(([name, value]) => ({ name, value }));
    setObjectionsByTitle(result);
  };
  
  // Process objections by geography
  const processObjectionsByGeo = () => {
    const objectionCounts: Record<string, number> = {};
    
    crmData.forEach(deal => {
      const geo = deal.geo || 'Unknown';
      
      try {
        const signalsData = safeJsonParse(deal.signals, {});
        
        // Count objections from signals
        let objectionCount = 0;
        
        // Check if it's an object with a 'signals' array inside
        if (signalsData?.signals && Array.isArray(signalsData.signals)) {
          objectionCount = signalsData.signals.filter((s: any) => 
            s?.objection_analysis?.objection_type).length;
        }
        // Check if it's a direct array of signals
        else if (Array.isArray(signalsData)) {
          objectionCount = signalsData.filter((s: any) => 
            s?.objection_analysis?.objection_type).length;
        }
        // Direct single signal
        else if (signalsData?.objection_analysis?.objection_type) {
          objectionCount = 1;
        }
        
        if (objectionCount > 0) {
          objectionCounts[geo] = (objectionCounts[geo] || 0) + objectionCount;
        }
      } catch (e) {
        console.error("Error processing objections by geo:", e);
      }
    });
    
    // Convert to array format for chart
    const result = Object.entries(objectionCounts).map(([name, value]) => ({ name, value }));
    setObjectionsByGeo(result);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Objection Analysis Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="industry" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="industry">By Industry</TabsTrigger>
              <TabsTrigger value="title">By Contact Title</TabsTrigger>
              <TabsTrigger value="geography">By Geography</TabsTrigger>
            </TabsList>
            
            <TabsContent value="industry">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={objectionsByIndustry} 
                    layout="vertical" 
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Objections" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="title">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={objectionsByTitle} 
                      layout="vertical" 
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Number of Objections" fill="#D946EF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={objectionsByTitle}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {objectionsByTitle.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} objections`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="geography">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={objectionsByGeo} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Objections" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectionAnalysisTab;
