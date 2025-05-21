
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import type { PatternTrendAnalysis, PrimarySignalCategories, UpsellExpansion } from "@/utils/dataProcessor";

interface TrendsActionablesProps {
  patternData: PatternTrendAnalysis;
  primarySignals: PrimarySignalCategories;
  upsellData: UpsellExpansion;
}

const TrendsActionables: React.FC<TrendsActionablesProps> = ({ patternData, primarySignals, upsellData }) => {
  // Example data for the charts
  const signalTrendsData = [
    { name: 'Jan', 'Total Signals': 35, 'Objections': 25, 'Buy-Ins': 10 },
    { name: 'Feb', 'Total Signals': 45, 'Objections': 22, 'Buy-Ins': 23 },
    { name: 'Mar', 'Total Signals': 55, 'Objections': 20, 'Buy-Ins': 35 },
    { name: 'Apr', 'Total Signals': 65, 'Objections': 18, 'Buy-Ins': 47 },
    { name: 'May', 'Total Signals': 75, 'Objections': 20, 'Buy-Ins': 55 },
    { name: 'Jun', 'Total Signals': 80, 'Objections': 18, 'Buy-Ins': 62 },
  ];

  const signalTypeData = [
    { name: 'Technical', value: 25 },
    { name: 'Expansion', value: 50 },
    { name: 'Objection', value: 25 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  const signalStageData = [
    { name: 'Discovery', 'Expansion Signals': 8, 'Objections': 12, 'Buy-In Signals': 5 },
    { name: 'Demo', 'Expansion Signals': 12, 'Objections': 8, 'Buy-In Signals': 10 },
    { name: 'Evaluation', 'Expansion Signals': 18, 'Objections': 16, 'Buy-In Signals': 12 },
    { name: 'Negotiation', 'Expansion Signals': 5, 'Objections': 10, 'Buy-In Signals': 8 },
  ];

  const repScorecard = [
    { name: 'Daniel', calls: 8, signalDensity: 4.2, missedObjections: 1, missedBuyIns: 1 },
    { name: 'Sophia', calls: 5, signalDensity: 3.5, missedObjections: 3, missedBuyIns: 2 },
    { name: 'Marcus', calls: 7, signalDensity: 4.1, missedObjections: 1, missedBuyIns: 0 },
    { name: 'Natalie', calls: 4, signalDensity: 3.8, missedObjections: 2, missedBuyIns: 1 },
  ];

  const personaImpactData = [
    { x: 20, y: 70, z: 10, name: 'Community Manager' },
    { x: 35, y: 45, z: 12, name: 'Executive Director' },
    { x: 50, y: 80, z: 8, name: 'Technical Implementer' },
    { x: 70, y: 60, z: 15, name: 'Chapter Leader' },
    { x: 25, y: 90, z: 5, name: 'Membership Director' },
  ];

  const featureInterestData = [
    { subject: 'Analytics', A: 90, fullMark: 100 },
    { subject: 'Chapters', A: 75, fullMark: 100 },
    { subject: 'Membership', A: 85, fullMark: 100 },
    { subject: 'Mobile App', A: 65, fullMark: 100 },
    { subject: 'Integration', A: 95, fullMark: 100 },
    { subject: 'Management', A: 70, fullMark: 100 },
  ];

  // Urgent Follow-Ups and Plays to Launch
  const urgentFollowUps = [
    { org: 'EcoReach Foundation', type: 'Expansion', status: 'Middle VPs concern', today: true },
    { org: 'TechAlumni Network', type: 'Committee', status: 'Presentation upcoming', today: true },
    { org: 'GlobalLawyers Network', type: 'Board', status: 'Decision pending', today: true },
    { org: 'VeteransBridge Alliance', type: 'Privacy', status: 'Control issues', today: true },
  ];

  const playsToLaunch = [
    { name: 'Multi-Chapter Management Guide', focus: 'Scale', priority: 'High' },
    { name: 'Mobile Offline Experience', focus: 'Updates', priority: 'High' },
    { name: 'Committee Presentation Template', focus: 'Decks', priority: 'Medium' },
    { name: 'Nonprofit Implementation Roadmap', focus: 'Scope', priority: 'High' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trends & Actionables</h1>
        <p className="text-sm text-gray-600">Actionable dashboards for CRO prioritization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Signal Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Signal Trends Over Time */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Signal Trends Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={signalTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Total Signals" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="Objections" stroke="#FF8042" strokeWidth={2} />
                  <Line type="monotone" dataKey="Buy-Ins" stroke="#00C49F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rep Scorecard */}
            <div>
              <h3 className="text-lg font-medium mb-3">Rep Scorecard</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rep</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calls</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal Density</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missed Objections</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missed Buy-Ins</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {repScorecard.map((rep, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{rep.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{rep.calls}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600" 
                                style={{ width: `${(rep.signalDensity / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{rep.signalDensity}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{rep.missedObjections}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">{rep.missedBuyIns}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signal Type Distribution */}
            <div>
              <h3 className="text-lg font-medium mb-3">Signal Type Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={signalTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {signalTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Signal Distribution by Sales Stage */}
            <div>
              <h3 className="text-lg font-medium mb-3">Signal Distribution by Sales Stage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={signalStageData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Expansion Signals" fill="#00C49F" />
                    <Bar dataKey="Objections" fill="#FF8042" />
                    <Bar dataKey="Buy-In Signals" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Persona Impact Analysis */}
            <div>
              <h3 className="text-lg font-medium mb-3">Persona Impact Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      name="Influence" 
                      unit="%" 
                      type="number" 
                      domain={[0, 80]} 
                      label={{ value: 'Influence %', position: 'bottom', offset: 0 }}
                    />
                    <YAxis 
                      dataKey="y" 
                      name="Impact" 
                      unit="%" 
                      domain={[0, 100]} 
                      label={{ value: 'Impact %', angle: -90, position: 'left' }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Personas" data={personaImpactData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Feature Interest Radar */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Feature Interest Radar</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={featureInterestData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Feature Interest" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urgent Follow-Ups */}
        <Card>
          <CardHeader>
            <CardTitle>Urgent Follow-Ups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentFollowUps.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.org}</p>
                  <p className="text-xs text-gray-600">{item.type} - {item.status}</p>
                </div>
                {item.today && (
                  <Badge className="bg-red-500">Today</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Plays to Launch or Update */}
        <Card>
          <CardHeader>
            <CardTitle>Plays to Launch or Update</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {playsToLaunch.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Focus: {item.focus}</p>
                </div>
                <Badge 
                  className={
                    item.priority === 'High' 
                      ? 'bg-red-500' 
                      : item.priority === 'Medium' 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-500'
                  }
                >
                  {item.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendsActionables;
