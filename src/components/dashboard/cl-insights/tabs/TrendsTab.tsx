
import React from "react";
import TrendAnalysis from "../TrendAnalysis";

interface TrendsTabProps {
  trendAnalysis: any;
  upsellExpansion: any;
}

const TrendsTab: React.FC<TrendsTabProps> = ({ trendAnalysis, upsellExpansion }) => {
  return <TrendAnalysis trendAnalysis={trendAnalysis} upsellExpansion={upsellExpansion} />;
};

export default TrendsTab;
