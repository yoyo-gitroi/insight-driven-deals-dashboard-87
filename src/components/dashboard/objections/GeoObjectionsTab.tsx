
import React from "react";
import ObjectionPieChart from "./ObjectionPieChart";
import { OBJECTION_COLORS, generateConfigNames } from "./objectionConstants";

interface GeoObjectionsTabProps {
  data: any[];
}

const GeoObjectionsTab: React.FC<GeoObjectionsTabProps> = ({ data }) => {
  const configNames = generateConfigNames("geo");
  
  return (
    <ObjectionPieChart
      title="Number of Objections by Geography"
      data={data}
      colors={OBJECTION_COLORS}
      configNames={configNames}
    />
  );
};

export default GeoObjectionsTab;
