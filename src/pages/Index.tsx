
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowRight, BarChart2, Activity, Check, Database } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <div className="flex-1 flex flex-col px-6">
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto pt-24 pb-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                Intelligent Go-to-Market Platform
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Optimize your GTM strategy with <span className="text-blue-600">advanced AI</span> insights
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Turn your CRM data into actionable intelligence that drives sales performance and increases revenue.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-100">
              <AspectRatio ratio={16/9}>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center p-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full h-4/5 border border-white/30">
                    <div className="grid grid-cols-3 gap-3 h-full">
                      <div className="col-span-2 bg-white/30 rounded-md border border-white/30"></div>
                      <div className="space-y-3">
                        <div className="h-1/2 bg-white/30 rounded-md border border-white/30"></div>
                        <div className="h-1/2 bg-white/30 rounded-md border border-white/30"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-16 bg-gray-50 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Platform Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Our AI-powered platform transforms your CRM data into actionable insights</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Signal Analysis</h3>
                <p className="text-gray-600">Detect buying signals and objections from customer interactions automatically.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Performance Insights</h3>
                <p className="text-gray-600">Visualize team performance metrics and identify areas for improvement.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Action Recommendations</h3>
                <p className="text-gray-600">Get AI-driven next steps to move deals forward and increase win rates.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 max-w-6xl mx-auto w-full">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 md:p-12 shadow-lg text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to transform your sales data?</h2>
                <p className="text-blue-50 mb-6">Upload your CRM export and start getting AI-powered insights immediately.</p>
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Now
                    <Database className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-medium">No coding or setup required</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-medium">Secure data processing</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-medium">Instant analytics visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
