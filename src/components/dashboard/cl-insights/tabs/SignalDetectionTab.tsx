
import React from "react";
import SignalCategories from "../SignalCategories";
import ObjectionCharts from "../../ObjectionCharts";

interface SignalDetectionTabProps {
  signalCategories: any;
  crmData: any[];
}

const SignalDetectionTab: React.FC<SignalDetectionTabProps> = ({ signalCategories, crmData }) => {
  return (
    <>
      <SignalCategories signalCategories={signalCategories} />
      
      <div className="mt-8">
        <ObjectionCharts crmData={crmData} />
      </div>
    </>
  );
};

export default SignalDetectionTab;
