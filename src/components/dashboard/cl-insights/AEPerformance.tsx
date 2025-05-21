
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, AlertCircle, Calendar } from "lucide-react";

interface AE {
  ae_name: string;
  win_rate: string;
  average_deal_size: string;
  average_cycle_time: string;
}

interface AEPerformanceProps {
  aePerformance: {
    "Top 3 AEs by Win Rate": AE[];
    "Bottom 3 AEs by Win Rate": AE[];
    "Training Needs Identified": string[];
  };
}

const AEPerformance: React.FC<AEPerformanceProps> = ({ aePerformance }) => {
  return (
    <div className="space-y-6">
      {/* Top Performers Table */}
      <Card className="border-green-100">
        <CardHeader className="border-b border-green-100 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Top Performers</CardTitle>
              <CardDescription>Account executives with highest win rates</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="bg-green-50/50">
              <TableRow>
                <TableHead>Account Executive</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Avg. Deal Size</TableHead>
                <TableHead>Avg. Cycle Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aePerformance["Top 3 AEs by Win Rate"].map((ae, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ae.ae_name}</TableCell>
                  <TableCell className="text-green-600 font-medium">{ae.win_rate}</TableCell>
                  <TableCell>{ae.average_deal_size}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    {ae.average_cycle_time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Performers Table */}
      <Card className="border-red-100">
        <CardHeader className="border-b border-red-100 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-red-800">Performance Improvement Needed</CardTitle>
              <CardDescription>Account executives requiring additional support</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="bg-red-50/50">
              <TableRow>
                <TableHead>Account Executive</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Avg. Deal Size</TableHead>
                <TableHead>Avg. Cycle Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aePerformance["Bottom 3 AEs by Win Rate"].map((ae, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ae.ae_name}</TableCell>
                  <TableCell className="text-red-600 font-medium">{ae.win_rate}</TableCell>
                  <TableCell>{ae.average_deal_size}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    {ae.average_cycle_time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Training Needs Card */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Development Needs</CardTitle>
          <CardDescription>Based on performance analysis and conversation signals</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {aePerformance["Training Needs Identified"].map((need, index) => (
              <li key={index} className="flex items-start gap-2 border-l-2 border-blue-400 pl-3 py-1">
                <p>{need}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AEPerformance;
