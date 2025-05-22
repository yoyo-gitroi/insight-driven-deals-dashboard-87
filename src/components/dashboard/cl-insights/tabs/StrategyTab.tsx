
import React from "react";
import DealAcceleration from "../DealAcceleration";
import StrategicActions from "../StrategicActions";

interface StrategyTabProps {
  dealAcceleration: any;
  strategicActions: any;
  contentRecommendations: any;
}

const StrategyTab: React.FC<StrategyTabProps> = ({ 
  dealAcceleration, 
  strategicActions, 
  contentRecommendations 
}) => {
  return (
    <>
      <DealAcceleration dealAcceleration={dealAcceleration} />
      <StrategicActions 
        strategicActions={strategicActions} 
        contentRecommendations={contentRecommendations} 
      />
    </>
  );
};

export default StrategyTab;
