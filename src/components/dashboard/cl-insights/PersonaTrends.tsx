
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface PersonaTrendsProps {
  personaInsights: any;
  accountExecutivePerformance: any;
}

const PersonaTrends: React.FC<PersonaTrendsProps> = ({ personaInsights, accountExecutivePerformance }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ICP Evolution & Persona Trends</h1>
        <p className="text-sm text-gray-600">Understanding how the buying center is changing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Emerging Personas */}
        <Card>
          <CardHeader>
            <CardTitle>Top Emerging Personas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-600">Community Managers</h3>
                <p className="text-sm text-gray-600">Now decision-makers, not just implementers. Involved earlier in the sales process and bringing technical concerns.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Chapter/Regional Admins</h3>
                <p className="text-sm text-gray-600">Driving purchasing for multi-location networks; focused on distributed management capabilities.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Mentorship Program Directors</h3>
                <p className="text-sm text-gray-600">Increasingly active in evaluating mentoring workflows. Concerned with algorithm vs manual matching.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Content Curators</h3>
                <p className="text-sm text-gray-600">Focused on contributing knowledge repositories. Key influencers in Resource Library discussions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Persona Drift */}
        <Card>
          <CardHeader>
            <CardTitle>Persona Drift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-600">Technical Implementers</h3>
                <p className="text-sm text-gray-600">→ Now enter at Discovery, not just onboarding</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Board Members</h3>
                <p className="text-sm text-gray-600">→ Participating earlier in evaluations</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Volunteer Leaders</h3>
                <p className="text-sm text-gray-600">→ Showing up in demos, flagging capacity concerns</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Content Curators</h3>
                <p className="text-sm text-gray-600">→ Becoming primary contacts for knowledge bases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Persona Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Persona Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Persona</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Calls</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Top Objection</TableHead>
                <TableHead>Expansion</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Community Manager</TableCell>
                <TableCell>Implementer & Decision Maker</TableCell>
                <TableCell>25</TableCell>
                <TableCell>78</TableCell>
                <TableCell>Implementation Timeline</TableCell>
                <TableCell>12</TableCell>
                <TableCell className="text-green-600">↑ Rising</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Executive Director</TableCell>
                <TableCell>Decision Maker</TableCell>
                <TableCell>18</TableCell>
                <TableCell>56</TableCell>
                <TableCell>Member Adoption</TableCell>
                <TableCell>9</TableCell>
                <TableCell className="text-gray-500">→ Stable</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Technical Implementer</TableCell>
                <TableCell>Influencer</TableCell>
                <TableCell>14</TableCell>
                <TableCell>42</TableCell>
                <TableCell>Data Migration</TableCell>
                <TableCell>3</TableCell>
                <TableCell className="text-green-600">↑ Rising</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chapter Leader</TableCell>
                <TableCell>Influencer & User</TableCell>
                <TableCell>10</TableCell>
                <TableCell>32</TableCell>
                <TableCell>Distributed Admin</TableCell>
                <TableCell>8</TableCell>
                <TableCell className="text-green-600">↑ Rising</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mentorship Program Director</TableCell>
                <TableCell className="text-xs bg-yellow-100 rounded px-1 py-0.5">Emerging</TableCell>
                <TableCell>7</TableCell>
                <TableCell>23</TableCell>
                <TableCell>Workflow Complexity</TableCell>
                <TableCell>6</TableCell>
                <TableCell className="text-green-600">↑ Rising</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Content Curator</TableCell>
                <TableCell className="text-xs bg-yellow-100 rounded px-1 py-0.5">Emerging</TableCell>
                <TableCell>6</TableCell>
                <TableCell>19</TableCell>
                <TableCell>Knowledge Repository</TableCell>
                <TableCell>5</TableCell>
                <TableCell className="text-green-600">↑ Rising</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* New Stakeholders by Segment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Stakeholders by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Education</h3>
                <ul className="text-sm space-y-1">
                  <li>• Alumni Committees</li>
                  <li>• Career Services Directors</li>
                  <li>• Student Life Coordinators</li>
                  <li>• Advancement Officers</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Associations</h3>
                <ul className="text-sm space-y-1">
                  <li>• Chapter Leads</li>
                  <li>• Membership Directors</li>
                  <li>• Event Coordinators</li>
                  <li>• Regional Representatives</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Nonprofits</h3>
                <ul className="text-sm space-y-1">
                  <li>• Grant Writers</li>
                  <li>• Volunteer Coordinators</li>
                  <li>• Program Directors</li>
                  <li>• Field Operations Managers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Persona → Objection Map */}
        <Card>
          <CardHeader>
            <CardTitle>Persona → Objection Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-600">Community Manager</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">Implementation Timeline</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Resource Constraints</Badge>
                  <Badge className="bg-gray-100 text-gray-800">User Adoption</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Executive Director</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">Member Adoption</Badge>
                  <Badge className="bg-blue-100 text-blue-800">ROI Justification</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Privacy Controls</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Technical Implementer</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">Data Migration</Badge>
                  <Badge className="bg-blue-100 text-blue-800">API Friction</Badge>
                  <Badge className="bg-blue-100 text-blue-800">App Quality</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Financial Decision Maker</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">ROI Justification</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Nonprofit Pricing</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Budget Timeline</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Chapter Leader</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">Distributed Admin</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Volunteer Training</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Mobile Access</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">Mentorship Program Director</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">Algorithm Complexity</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Self-Match Options</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Integration</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonaTrends;
