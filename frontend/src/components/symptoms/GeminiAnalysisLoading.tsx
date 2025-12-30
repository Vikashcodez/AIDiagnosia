
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function GeminiAnalysisLoading() {
  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-16 w-16 text-medical-500 animate-spin mb-6" />
        <h2 className="text-2xl font-semibold text-gray-700">Fetching AI-Powered Analysis...</h2>
        <p className="text-gray-500 mt-3">This might take a few moments</p>
        <p className="text-gray-400 text-sm mt-6 max-w-md text-center">
          Our AI is analyzing your symptoms and searching for relevant medical information to provide you with personalized recommendations.
        </p>
      </div>
    </Card>
  );
}
