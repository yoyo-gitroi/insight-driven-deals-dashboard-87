
import React from "react";
import ObjectionPieChart from "./ObjectionPieChart";
import { OBJECTION_COLORS, generateConfigNames } from "./objectionConstants";

interface IndustryObjectionsTabProps {
  data: any[];
}

const IndustryObjectionsTab: React.FC<IndustryObjectionsTabProps> = ({ data }) => {
  const configNames = generateConfigNames("industry");
  
  return (
    <ObjectionPieChart
      title="Number of Objections by Industry"
      data={data}
      colors={OBJECTION_COLORS}
      configNames={configNames}
    />
  );
};

export default IndustryObjectionsTab;
