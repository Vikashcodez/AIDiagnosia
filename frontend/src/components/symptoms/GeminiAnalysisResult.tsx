
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { GeminiResponse } from "@/utils/geminiApi";

interface GeminiAnalysisResultProps {
  analysis: GeminiResponse;
}

export function GeminiAnalysisResult({ analysis }: GeminiAnalysisResultProps) {
  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-medical-500" />
        <h2 className="text-2xl font-bold text-gray-900">Advanced AI Analysis</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Analysis</h3>
          <p className="text-gray-600 bg-medical-50 p-4 rounded-lg">{analysis.analysis}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Possible Conditions</h3>
          <ul className="space-y-2">
            {analysis.possibleConditions.map((condition, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-medical-500"></div>
                <span className="text-gray-600">{condition}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recommendations</h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-medical-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-medical-600 text-sm font-medium">{index + 1}</span>
                </div>
                <span className="text-gray-600">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-medical-50 rounded-lg">
          <p className="text-sm text-medical-600">
            Note: This is an AI-powered analysis and should not replace professional medical advice. 
            Please consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </Card>
  );
}
