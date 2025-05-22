
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from "lucide-react";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ObjectionPieChartProps {
  title: string;
  data: any[];
  colors: string[];
  configNames: string[];
}

const ObjectionPieChart: React.FC<ObjectionPieChartProps> = ({ 
  title, 
  data, 
  colors,
  configNames
}) => {
  // Build the config object dynamically
  const chartConfig: Record<string, { color: string }> = {};
  configNames.forEach((name, index) => {
    chartConfig[name] = { color: colors[index % colors.length] };
  });

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-t-2 border-t-primary/20">
      <CardHeader className="bg-muted/40 pb-4">
        <CardTitle className="flex items-center gap-2 text-primary/90">
          <ChartPie className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96 pt-6">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  wrapperClassName="bg-background/95 border shadow-lg rounded-md p-2" 
                />
                <ChartLegend content={<ChartLegendContent className="mt-6" />} />
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <ChartPie className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No objection data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectionPieChart;
