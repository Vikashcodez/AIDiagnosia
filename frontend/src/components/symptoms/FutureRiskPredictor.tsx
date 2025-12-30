
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMedicalAnalysis } from "@/utils/geminiApi";

export function FutureRiskPredictor() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter your current condition or symptoms",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Use the existing Gemini API to generate the prediction
      const prompt = `Based on this medical condition or symptoms: "${input}", predict possible future health risks that might develop if left untreated or unmanaged. Format your response as follows:
      
      1. Provide 3-4 potential serious health conditions that could develop
      2. For each condition, briefly explain the connection to the current symptoms
      3. Include one practical health tip at the end
      4. Keep the response educational and informative
      
      Important: Include a clear disclaimer about consulting healthcare professionals.`;
      
      const analysis = await getMedicalAnalysis(input);
      
      // Format the response for future risks
      let riskPrediction = "## Future Health Risk Assessment\n\n";
      
      // Add potential conditions section
      riskPrediction += "### Potential Future Health Risks\n\n";
      analysis.possibleConditions.slice(0, 3).forEach((condition, index) => {
        if (condition.toLowerCase() !== "analysis unavailable" && 
            !condition.toLowerCase().includes("insufficient data")) {
          riskPrediction += `${index + 1}. **${condition}**\n`;
          riskPrediction += `   Potential progression from current symptoms if left unmanaged.\n\n`;
        }
      });
      
      // Add explanation
      riskPrediction += "### Why These Risks Matter\n\n";
      riskPrediction += analysis.analysis + "\n\n";
      
      // Add health tip
      const healthTips = [
        "Stay hydrated by drinking at least 8 glasses of water daily to support overall health.",
        "Incorporate at least 30 minutes of moderate exercise into your daily routine.",
        "Prioritize 7-9 hours of quality sleep each night to allow your body to recover.",
        "Maintain a balanced diet rich in fruits, vegetables, and whole grains.",
        "Practice stress reduction techniques like deep breathing or meditation for 10 minutes daily."
      ];
      
      const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
      riskPrediction += "### Health Tip\n\n";
      riskPrediction += randomTip + "\n\n";
      
      // Add disclaimer
      riskPrediction += "### Important Disclaimer\n\n";
      riskPrediction += "**This is an AI-generated prediction based on general medical knowledge and should NOT replace professional medical advice. The potential risks mentioned are possibilities, not certainties. Please consult a qualified healthcare provider for proper diagnosis, treatment, and personalized health advice.**";
      
      setPrediction(riskPrediction);
    } catch (err) {
      console.error("Error predicting future risks:", err);
      setError("Failed to generate risk prediction. Please try again.");
      toast({
        title: "Error",
        description: "Unable to predict future health risks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-medical-50 flex items-center justify-center">
          <Activity className="h-7 w-7 text-medical-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Future Risk Predictor</h2>
          <p className="text-sm text-gray-500">AI-powered health trajectory analysis</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-medical-50 rounded-lg p-4 border border-medical-100 mb-4">
          <p className="text-gray-700">
            Enter your current condition or symptoms to predict potential future health risks if left unmanaged.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Example: "High blood pressure and occasional chest pain"
          </p>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Please describe your current condition or symptoms..."
          className="min-h-[120px] resize-none border-gray-200 focus:border-medical-300 focus:ring focus:ring-medical-100 transition-all"
        />
      </div>
      
      <Button 
        onClick={handlePredict}
        className="bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 text-white w-full shadow-md hover:shadow-lg transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Future Risks...
          </>
        ) : (
          "Predict Future Health Risks"
        )}
      </Button>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start gap-2 border border-red-100 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {prediction && (
        <div className="mt-8 p-6 bg-gradient-to-br from-medical-50 to-blue-50 rounded-lg border border-medical-100 shadow-md">
          <h3 className="font-semibold text-xl text-medical-700 mb-4">Risk Prediction:</h3>
          <div className="whitespace-pre-line text-gray-700 prose prose-headings:font-semibold prose-headings:text-medical-700 prose-strong:text-medical-600 prose-headings:mt-4 prose-headings:mb-2">
            {prediction}
          </div>
        </div>
      )}
    </Card>
  );
}
