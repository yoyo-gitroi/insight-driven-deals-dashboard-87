
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
import { PieChart, Pie, Cell } from "recharts";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartPie className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        {data.length > 0 ? (
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
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent className="mt-6" />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No objection data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectionPieChart;
