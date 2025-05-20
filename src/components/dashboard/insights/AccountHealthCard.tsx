
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AccountHealthCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

const AccountHealthCard: React.FC<AccountHealthCardProps> = ({
  title,
  value,
  icon,
  description = "",
  trend = "neutral"
}) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-3xl font-bold">{value}</p>
            {trend === "up" && (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
            {trend === "down" && (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            {trend === "neutral" && (
              <Minus className="h-4 w-4 text-gray-400" />
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountHealthCard;
