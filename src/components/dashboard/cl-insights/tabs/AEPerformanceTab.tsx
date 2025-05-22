
import React from "react";
import AEPerformance from "../AEPerformance";

interface AEPerformanceTabProps {
  aePerformance: any;
}

const AEPerformanceTab: React.FC<AEPerformanceTabProps> = ({ aePerformance }) => {
  return <AEPerformance aePerformance={aePerformance} />;
};

export default AEPerformanceTab;
