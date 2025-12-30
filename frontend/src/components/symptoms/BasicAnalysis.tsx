
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { GeminiResponse } from "@/utils/geminiApi";

interface BasicAnalysisProps {
  analysis: GeminiResponse;
}

export function BasicAnalysis({ analysis }: BasicAnalysisProps) {
  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-6 w-6 text-medical-500" />
        <h2 className="text-2xl font-bold text-gray-900">Basic Analysis Results</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Possible Condition</h3>
          <p className="text-gray-600">
            {analysis.possibleConditions && analysis.possibleConditions.length > 0 
              ? analysis.possibleConditions[0] 
              : "Analysis pending..."}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700">Recommended Treatment</h3>
          <p className="text-gray-600">
            {analysis.recommendations && analysis.recommendations.length > 0 
              ? analysis.recommendations[0] 
              : "Treatment recommendations pending..."}
          </p>
        </div>
      </div>
    </Card>
  );
}
