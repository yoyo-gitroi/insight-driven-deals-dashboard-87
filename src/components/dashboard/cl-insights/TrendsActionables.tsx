
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart2, PieChart, TrendingUp } from "lucide-react";

interface TrendsActionablesProps {
  accountExecutivePerformance: any;
  upsellExpansion: any;
  contentRecommendations: any;
}

const TrendsActionables: React.FC<TrendsActionablesProps> = ({ 
  accountExecutivePerformance,
  upsellExpansion,
  contentRecommendations
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trends & Actionables</h1>
        <p className="text-sm text-gray-600">Key metrics, insights, and recommended actions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Signal Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Signal Trends Over Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Signal Trends Over Time</h3>
              <div className="aspect-[16/9] bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart2 className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">Signal trend visualization</p>
                  <p className="text-xs text-gray-400">
                    Shows Total Signals, Objections, and Buy-Ins from Jan to Jun
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Persona Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <p className="text-sm">Community Managers</p>
                  <Badge className="bg-green-500">Rising</Badge>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <p className="text-sm">Executive Directors</p>
                  <Badge className="bg-gray-300">Stable</Badge>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <p className="text-sm">Tech Implementers</p>
                  <Badge className="bg-green-500">Rising</Badge>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <p className="text-sm">Content Curators</p>
                  <Badge className="bg-green-500">Rising</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rep Scorecard and Signal Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <h3 className="font-medium mb-2">Rep Scorecard</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rep</TableHead>
                    <TableHead>Calls</TableHead>
                    <TableHead>Signal Density</TableHead>
                    <TableHead>Missed Objections</TableHead>
                    <TableHead>Missed Buy-ins</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Daniel</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell>15%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sophia</TableCell>
                    <TableCell>34</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </TableCell>
                    <TableCell>8%</TableCell>
                    <TableCell>11%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marcus</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </TableCell>
                    <TableCell>18%</TableCell>
                    <TableCell>22%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Natalie</TableCell>
                    <TableCell>19</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </TableCell>
                    <TableCell>24%</TableCell>
                    <TableCell>28%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Signal Type Distribution</h3>
              <div className="aspect-[1/1] bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">Signal types</p>
                  <div className="flex flex-col items-center text-xs text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 mr-1 rounded-sm"></div>
                      <span>Technical: 25%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                      <span>Expansion: ~50%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
                      <span>Objection: ~25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-medium mb-2">Persona Impact Analysis</h3>
              <div className="aspect-[4/3] bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">Scatter plot of persona impact</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Feature Interest Radar</h3>
              <div className="aspect-[4/3] bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-24 h-24 border-2 border-gray-300 rounded-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm text-gray-500">Radar Chart</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Analytics, Chapters, Membership, Mobile App, Integration, Management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Funnel Risk & Urgent Follow-Ups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funnel Risk Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Funnel Risk Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Objections before buy-in moments</p>
                  <p className="text-sm font-medium">38% (high impact)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "38%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Confusion about Chapters vs. Groups</p>
                  <p className="text-sm font-medium">25% (medium)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Expansion quotes never followed up</p>
                  <p className="text-sm font-medium">45% (high impact)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Interest quotes lacking CRM next step</p>
                  <p className="text-sm font-medium">28% (medium)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "28%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Urgent Follow-Ups */}
        <Card>
          <CardHeader>
            <CardTitle>Urgent Follow-Ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h3 className="font-medium">EcoReach Foundation</h3>
                  <p className="text-xs text-gray-500">Expansion - Mobile UI concerns</p>
                </div>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h3 className="font-medium">TechAlumni Network</h3>
                  <p className="text-xs text-gray-500">Committee presentation upcoming</p>
                </div>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h3 className="font-medium">GlobalLawyers Network</h3>
                  <p className="text-xs text-gray-500">Board decision pending</p>
                </div>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <div>
                  <h3 className="font-medium">VeteransBridge Alliance</h3>
                  <p className="text-xs text-gray-500">Privacy control issues</p>
                </div>
                <Badge className="bg-red-200 text-red-700">Today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Plays to Launch */}
      <Card>
        <CardHeader>
          <CardTitle>Plays to Launch or Update</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <h3 className="font-medium mb-2">Integration Accelerator</h3>
              <p className="text-sm mb-3">Fast-track integrations with pre-built connectors for Mailchimp, Zoom, and common CRMs.</p>
              <Badge className="bg-blue-500">High Priority</Badge>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-md p-4">
              <h3 className="font-medium mb-2">POC Success Framework</h3>
              <p className="text-sm mb-3">Structured approach to running POCs with clear success metrics and timelines.</p>
              <Badge className="bg-green-500">Medium Priority</Badge>
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-md p-4">
              <h3 className="font-medium mb-2">Executive Business Case</h3>
              <p className="text-sm mb-3">Toolkit for building ROI models and business cases for executive decision makers.</p>
              <Badge className="bg-purple-500">Medium Priority</Badge>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Content Recommendations</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {contentRecommendations["Case Studies"].map((study: string, idx: number) => (
                <li key={idx}>{study}</li>
              ))}
              <li>More material on plug-and-play systems to address content gaps in objection handling</li>
              <li>{contentRecommendations["New Content Ideas Tied to Portfolio Signals"]}</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Upsell Opportunities</h3>
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <h4 className="font-medium">{upsellExpansion["Most Successful Upsell Motions"]["Product"]}</h4>
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {upsellExpansion["Most Successful Upsell Motions"]["ARR lift"]} ARR Lift
                </Badge>
              </div>
              <p className="text-sm">Average Fit Score: {upsellExpansion["Most Successful Upsell Motions"]["Average Fit Score"]}/100</p>
              <p className="text-sm mt-2">Common Expansion Path: {upsellExpansion["Common Expansion Paths"]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsActionables;
