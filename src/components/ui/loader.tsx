
import React from "react";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoaderComponent = ({
  size = "md",
  text = "Loading data...",
  className,
}: LoaderProps) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <Loader className={cn("animate-spin text-primary", sizeMap[size])} />
      {text && <p className="text-muted-foreground font-medium">{text}</p>}
    </div>
  );
};

export { LoaderComponent };
