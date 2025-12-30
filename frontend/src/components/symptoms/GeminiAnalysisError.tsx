
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles } from "lucide-react";
import { GeminiResponse } from "@/utils/geminiApi";

interface GeminiAnalysisErrorProps {
  error: string;
  retryAnalysis: () => void;
}

export function GeminiAnalysisError({ error, retryAnalysis }: GeminiAnalysisErrorProps) {
  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <h2 className="text-2xl font-bold text-gray-900">AI Analysis Error</h2>
      </div>
      <p className="text-gray-600">{error}</p>
      <Button 
        className="mt-4 bg-medical-500 hover:bg-medical-600 text-white"
        onClick={retryAnalysis}
      >
        <Sparkles className="mr-2 h-5 w-5" /> Retry AI Analysis
      </Button>
    </Card>
  );
}
