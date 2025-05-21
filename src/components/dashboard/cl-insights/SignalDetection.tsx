
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SignalDetectionProps {
  signalCategories: any;
  stakeholderInsights: any;
}

const SignalDetection: React.FC<SignalDetectionProps> = ({ signalCategories, stakeholderInsights }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Signal Detection Overview</h1>
        <p className="text-sm text-gray-600">Critical GTM signals extracted and clustered across accounts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Signals */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Expansion Signals */}
              <div>
                <h3 className="font-medium text-blue-600">Expansion Signals</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• "We'll add membership later" — detect_expansion_signal()</li>
                  <li className="text-sm">• Multi-language needs — detect_global_scaling()</li>
                  <li className="text-sm">• Cross-chapter workflows — map_module_to_need("Distributed Admin")</li>
                </ul>
              </div>
              
              {/* Top Personas */}
              <div>
                <h3 className="font-medium text-blue-600">Top Personas</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• Community Managers</li>
                  <li className="text-sm">• Executive Directors</li>
                  <li className="text-sm">• Chapter Leads</li>
                  <li className="text-sm">• Technical Implementers</li>
                </ul>
              </div>
              
              {/* Technical Objections */}
              <div>
                <h3 className="font-medium text-blue-600">Technical Objections</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• Offline app needed for field workers</li>
                  <li className="text-sm">• Data migration from fragmented systems</li>
                  <li className="text-sm">• Integration with Zoom, Mailchimp, legacy CRMs</li>
                </ul>
              </div>
              
              {/* Pitch Confusion */}
              <div>
                <h3 className="font-medium text-blue-600">Pitch Confusion</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• Difference between Groups vs. Chapters</li>
                  <li className="text-sm">• Mentorship module (self-match vs. algorithm)</li>
                  <li className="text-sm">• Resource Library vs. Content Module</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Secondary Signals */}
        <Card>
          <CardHeader>
            <CardTitle>Secondary Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Feature Interest */}
              <div>
                <h3 className="font-medium text-blue-600">Feature Interest</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• Mentorship algorithms</li>
                  <li className="text-sm">• Offline app capabilities</li>
                  <li className="text-sm">• Multilingual UI</li>
                  <li className="text-sm">• Chapter management tools</li>
                </ul>
              </div>
              
              {/* Integration Pain */}
              <div>
                <h3 className="font-medium text-blue-600">Integration Pain</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• Zoom video conferencing</li>
                  <li className="text-sm">• Mailchimp email marketing</li>
                  <li className="text-sm">• Stripe payment processing</li>
                  <li className="text-sm">• Legacy CRM systems</li>
                </ul>
              </div>
              
              {/* Self-Diagnosis Quotes */}
              <div>
                <h3 className="font-medium text-blue-600">Self-Diagnosis Quotes</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• "Our tools are cobbled together"</li>
                  <li className="text-sm">• "This is too manual for where we are"</li>
                  <li className="text-sm">• "We've outgrown our current solution"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Signal Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">Signal Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Expansion Signal */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-green-100 px-3 py-2 flex justify-between items-center">
              <Badge className="bg-green-500">Expansion Signal</Badge>
              <span className="text-xs text-gray-600">Evaluation</span>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium mb-2">"We'll roll this out to the APAC team next quarter."</p>
              <p className="text-xs text-gray-500 mb-3">— CIO</p>
              <div className="text-xs text-blue-600 font-mono">detect_expansion_opportunity()</div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-blue-600">→ Expansion Follow-Up Kit</p>
              </div>
            </div>
          </div>
          
          {/* Tech Objection */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-red-100 px-3 py-2 flex justify-between items-center">
              <Badge className="bg-red-500">Tech Objection</Badge>
              <span className="text-xs text-gray-600">Discovery</span>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium mb-2">"Researchers are in remote locations with limited connectivity."</p>
              <p className="text-xs text-gray-500 mb-3">— Research Director</p>
              <div className="text-xs text-blue-600 font-mono">detect_connectivity_concern()</div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-blue-600">→ Mobile/Offline Capabilities</p>
              </div>
            </div>
          </div>
          
          {/* Buy-In */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-blue-100 px-3 py-2 flex justify-between items-center">
              <Badge className="bg-blue-500">Buy-In</Badge>
              <span className="text-xs text-gray-600">Demo</span>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium mb-2">"That would streamline our chapter operations significantly."</p>
              <p className="text-xs text-gray-500 mb-3">— Chapter Coordinator</p>
              <div className="text-xs text-blue-600 font-mono">flag_enthusiasm()</div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-blue-600">→ Chapter Admin One-Sheet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reps Are Missing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Reps Are Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Multi-language needs</h3>
                  <Badge className="bg-red-500">High</Badge>
                </div>
                <p className="text-xs text-gray-500">Frequency: 16 instances</p>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Content contribution workflows</h3>
                  <Badge className="bg-yellow-500">Medium</Badge>
                </div>
                <p className="text-xs text-gray-500">Frequency: 12 instances</p>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Granular privacy control discussion</h3>
                  <Badge className="bg-red-500">High</Badge>
                </div>
                <p className="text-xs text-gray-500">Frequency: 14 instances</p>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Onboarding strategy articulation</h3>
                  <Badge className="bg-yellow-500">Medium</Badge>
                </div>
                <p className="text-xs text-gray-500">Frequency: 15 instances</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Meta-Diagnostics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Meta-Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Quote-to-Signal Ratio</h3>
                <p className="text-sm">3.2 quotes per Expansion Signal (strong), 4.8 per Technical Objection (weak)</p>
                <div className="mt-4">
                  <div className="text-center bg-blue-100 py-2 rounded-md">
                    <span className="text-2xl font-bold text-blue-700">3.2:1</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Buyer Journey Gaps</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Weak onboarding discussion</li>
                  <li>No visibility into success metrics</li>
                  <li>Under-addressed adoption strategy</li>
                </ul>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <span className="text-xs w-24">Discovery</span>
                    <div className="w-full bg-blue-200 h-3 rounded-full">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs w-24">Technical validation</span>
                    <div className="w-full bg-blue-200 h-3 rounded-full">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs w-24">Commercial Process</span>
                    <div className="w-full bg-blue-200 h-3 rounded-full">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs w-24">Implementation</span>
                    <div className="w-full bg-blue-200 h-3 rounded-full">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignalDetection;
