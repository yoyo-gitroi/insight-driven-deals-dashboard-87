
import React from "react";
import ObjectionPieChart from "./ObjectionPieChart";
import { OBJECTION_COLORS, generateConfigNames } from "./objectionConstants";

interface TitleObjectionsTabProps {
  data: any[];
}

const TitleObjectionsTab: React.FC<TitleObjectionsTabProps> = ({ data }) => {
  const configNames = generateConfigNames("title");
  
  return (
    <ObjectionPieChart
      title="Number of Objections by Contact Title"
      data={data}
      colors={OBJECTION_COLORS}
      configNames={configNames}
    />
  );
};

export default TitleObjectionsTab;
