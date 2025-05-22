
import React from "react";
import ExecutiveSummary from "../ExecutiveSummary";

interface ExecutiveSummaryTabProps {
  executiveSummary: any;
}

const ExecutiveSummaryTab: React.FC<ExecutiveSummaryTabProps> = ({ executiveSummary }) => {
  return <ExecutiveSummary executiveSummary={executiveSummary} />;
};

export default ExecutiveSummaryTab;
