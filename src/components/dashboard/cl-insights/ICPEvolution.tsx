
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AccountExecutivePerformance, StakeholderPersonaInsights } from "@/utils/dataProcessor";

interface ICPEvolutionProps {
  aeData: AccountExecutivePerformance;
  personaData: StakeholderPersonaInsights;
}

const ICPEvolution: React.FC<ICPEvolutionProps> = ({ aeData, personaData }) => {
  // Top personas data (static but could be generated from your data)
  const topPersonas = [
    {
      title: "Community Managers",
      description: "Now decision makers, not just implementers. Involved earlier in the sales process and bringing technical concerns."
    },
    {
      title: "Chapter/Regional Admins",
      description: "Driving purchasing for multi-location networks; focused on distributed management capabilities."
    },
    {
      title: "Mentorship Program Directors",
      description: "Increasingly active in evaluating mentoring workflows. Concerned with algorithm vs manual matching."
    },
    {
      title: "Content Curators",
      description: "Focused on centralizing knowledge repositories. Key influencers in Resource Library discussions."
    }
  ];

  // Persona drift data
  const personaDrift = [
    {
      role: "Technical Implementers",
      change: "Now enter at Discovery, not just onboarding"
    },
    {
      role: "Board Members",
      change: "Participating earlier in evaluations"
    },
    {
      role: "Volunteer Leaders",
      change: "Showing up in demos, flagging capacity concerns"
    },
    {
      role: "Content Curators",
      change: "Becoming primary contacts for knowledge bases"
    }
  ];

  // Persona analysis table data
  const personaAnalysis = [
    {
      persona: "Community Manager",
      role: "Implementer & Decision Maker",
      calls: 25,
      signals: 78,
      topObjection: "Implementation Timeline",
      expansion: 12,
      trend: "Rising"
    },
    {
      persona: "Executive Director",
      role: "Decision Maker",
      calls: 18,
      signals: 56,
      topObjection: "Member Adoption",
      expansion: 9,
      trend: "Stable"
    },
    {
      persona: "Technical Implementer",
      role: "Influencer",
      calls: 14,
      signals: 42,
      topObjection: "Data Migration",
      expansion: 3,
      trend: "Rising"
    },
    {
      persona: "Chapter Leader",
      role: "Influencer & User",
      calls: 10,
      signals: 32,
      topObjection: "Distributed Admin",
      expansion: 8,
      trend: "Rising"
    },
    {
      persona: "Membership Program Director",
      role: "Evaluator",
      calls: 7,
      signals: 23,
      topObjection: "Workflow Complexity",
      expansion: 6,
      trend: "Rising"
    },
    {
      persona: "Content Curator",
      role: "User & Influencer",
      calls: 6,
      signals: 19,
      topObjection: "Knowledge Repository",
      expansion: 5,
      trend: "Rising"
    }
  ];

  // New stakeholders by segment
  const newStakeholders = {
    Education: [
      "Alumni Committees",
      "Career Services Directors",
      "Student Life Coordinators",
      "Advancement Officers"
    ],
    Associations: [
      "Chapter Leads",
      "Membership Directors",
      "Event Coordinators",
      "Regional Representatives"
    ],
    Nonprofits: [
      "Grant Writers",
      "Volunteer Coordinators",
      "Program Directors",
      "Field Operations Managers"
    ]
  };

  // Persona objection map
  const personaObjectionMap = [
    {
      persona: "Community Manager",
      objections: ["Implementation Timeline", "Resource Constraints", "User Adoption"]
    },
    {
      persona: "Executive Director",
      objections: ["Member Adoption", "ROI Justification", "Privacy Controls"]
    },
    {
      persona: "Technical Implementer",
      objections: ["Data Migration", "API Friction", "App Quality"]
    },
    {
      persona: "Financial Decision Maker",
      objections: ["ROI Justification", "Nonprofit Pricing", "Budget Timeline"]
    },
    {
      persona: "Chapter Leader",
      objections: ["Distributed Admin", "Volunteer Training", "Mobile Access"]
    },
    {
      persona: "Mentorship Program Director",
      objections: ["Algorithm Complexity", "Self-Match Options", "Integration"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ICP Evolution & Persona Trends</h1>
        <p className="text-sm text-gray-600">Understanding how Hivebrite's buying center is changing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Emerging Personas */}
        <Card>
          <CardHeader>
            <CardTitle>Top Emerging Personas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPersonas.map((persona, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="text-blue-600 font-medium">{persona.title}</h3>
                <p className="text-sm">{persona.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Persona Drift */}
        <Card>
          <CardHeader>
            <CardTitle>Persona Drift</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personaDrift.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="font-medium">{item.role}</h3>
                <p className="text-sm text-gray-600">→ {item.change}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Persona Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Persona Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {personaAnalysis.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.persona}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.calls}</TableCell>
                    <TableCell>{item.signals}</TableCell>
                    <TableCell>{item.topObjection}</TableCell>
                    <TableCell>{item.expansion}</TableCell>
                    <TableCell>
                      {item.trend === "Rising" ? (
                        <span className="text-green-600">↑ {item.trend}</span>
                      ) : (
                        <span>→ {item.trend}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Stakeholders by Segment */}
        <Card>
          <CardHeader>
            <CardTitle>New Stakeholders by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(newStakeholders).map(([segment, stakeholders]) => (
                <div key={segment}>
                  <h3 className="font-medium mb-2">{segment}</h3>
                  <ul className="space-y-1">
                    {stakeholders.map((stakeholder, idx) => (
                      <li key={idx} className="text-sm">• {stakeholder}</li>
                    ))}
                  </ul>
                </div>
              ))}
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
              {personaObjectionMap.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-blue-600 font-medium">{item.persona}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.objections.map((objection, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-100">
                        {objection}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ICPEvolution;
