
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, PieChart } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI-Powered GTM Platform</h1>
        <p className="text-xl text-muted-foreground">
          Leverage AI to transform your sales data into actionable insights
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              AE Dashboard
            </CardTitle>
            <CardDescription>
              View individual performance and deal-level insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Upload your CRM data and get AI-generated insights for account executives.
              Track deal progress, objection handling, and recommended next steps.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard" className="w-full">
              <Button className="w-full">Go to AE Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Manager/CRO Dashboard
            </CardTitle>
            <CardDescription>
              Executive-level view of pipeline and team performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Get a holistic view of your sales organization with strategic insights,
              market analysis, and predictive forecasting for leadership decisions.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/manager-dashboard" className="w-full">
              <Button className="w-full">Go to Manager Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
