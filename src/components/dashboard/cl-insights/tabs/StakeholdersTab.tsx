
import React from "react";
import StakeholderInsights from "../StakeholderInsights";

interface StakeholdersTabProps {
  stakeholderInsights: any;
}

const StakeholdersTab: React.FC<StakeholdersTabProps> = ({ stakeholderInsights }) => {
  return <StakeholderInsights stakeholderInsights={stakeholderInsights} />;
};

export default StakeholdersTab;
