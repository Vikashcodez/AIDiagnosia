
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Loader2, AlertTriangle } from "lucide-react";
import { getMedicalAnalysis, GeminiResponse } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

export function DiseasePredictor() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please enter your symptoms",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const analysis = await getMedicalAnalysis(symptoms);
      
      // Format the prediction
      let predictionText = "Based on the symptoms described, here are possible conditions:\n\n";
      analysis.possibleConditions.forEach((condition, index) => {
        if (condition.toLowerCase() !== "analysis unavailable" && 
            !condition.toLowerCase().includes("insufficient data")) {
          predictionText += `- ${condition}\n`;
        }
      });
      
      // Add recommendations
      predictionText += "\nRecommendations:\n";
      analysis.recommendations.forEach((rec, index) => {
        if (index < 3) { // Limit to top 3 recommendations
          predictionText += `- ${rec}\n`;
        }
      });
      
      // Add disclaimer
      predictionText += "\nIMPORTANT: This is an AI-powered prediction and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.";
      
      setPrediction(predictionText);
    } catch (err) {
      console.error("Error predicting disease:", err);
      setError("Failed to analyze symptoms. Please try again.");
      toast({
        title: "Error",
        description: "Unable to predict disease. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-medical-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-medical-500" />
        <h2 className="text-2xl font-bold text-gray-900">Symptom-to-Disease Prediction</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-4">
          Enter your symptoms below, and our AI will suggest possible conditions.
          <br />
          <span className="text-sm text-gray-400">Example: "Fever, cough, and fatigue"</span>
        </p>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Please describe your symptoms in detail..."
          className="min-h-[120px] resize-none"
        />
      </div>
      
      <Button 
        onClick={handlePredict}
        className="bg-medical-500 hover:bg-medical-600 text-white w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Symptoms...
          </>
        ) : (
          "Predict Possible Conditions"
        )}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {prediction && (
        <div className="mt-6 p-4 bg-medical-50 rounded-lg border border-medical-100">
          <h3 className="font-semibold text-gray-700 mb-2">Prediction Result:</h3>
          <div className="whitespace-pre-line text-gray-600">
            {prediction}
          </div>
        </div>
      )}
    </Card>
  );
}
