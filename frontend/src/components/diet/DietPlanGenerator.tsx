
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Apple, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMedicalAnalysis } from "@/utils/geminiApi";
import { useIsMobile } from "@/hooks/use-mobile";

export function DietPlanGenerator() {
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleGenerateDiet = async () => {
    if (!condition.trim()) {
      toast({
        title: "Error",
        description: "Please enter your health condition or goal",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setDietPlan(null);

    try {
      // Customize query to focus on diet recommendations
      const dietQuery = `Generate diet recommendations for: ${condition}`;
      const analysis = await getMedicalAnalysis(dietQuery);
      
      // Format the diet plan
      let planText = `Diet Plan for: ${condition}\n\n`;
      
      // Include main analysis as dietary advice
      planText += `${analysis.analysis}\n\n`;
      
      // Convert recommendations to diet plan
      planText += "Recommended Diet Plan:\n";
      analysis.recommendations.forEach((rec) => {
        planText += `- ${rec}\n`;
      });
      
      // Add foods list based on possible conditions
      planText += "\nFoods to Include:\n";
      analysis.possibleConditions.slice(0, 5).forEach((food) => {
        planText += `- ${food}\n`;
      });
      
      // Add disclaimer
      planText += "\nIMPORTANT: This is an AI-generated diet plan and should be reviewed by a healthcare or nutrition professional. Always consult with a healthcare provider before making significant dietary changes.";
      
      setDietPlan(planText);
    } catch (err) {
      console.error("Error generating diet plan:", err);
      setError("Failed to generate diet plan. Please try again.");
      toast({
        title: "Error",
        description: "Unable to generate diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`p-4 md:p-8 bg-white border border-medical-100 rounded-xl shadow-lg animate-fadeIn ${isMobile ? "mx-1" : ""}`}>
      <div className="flex items-center gap-3 mb-6">
        <Apple className="h-6 w-6 text-medical-500" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Diet Plan Generator</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-sm md:text-base text-gray-600 mb-4">
          Enter your health condition or goal, and our AI will create a personalized diet plan.
          <br />
          <span className="text-xs md:text-sm text-gray-400">Example: "I have diabetes" or "I want to lose weight"</span>
        </p>
        <Textarea
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="Please describe your health condition or goal..."
          className="min-h-[100px] md:min-h-[120px] resize-none w-full bg-white"
        />
      </div>
      
      <Button 
        onClick={handleGenerateDiet}
        className="bg-medical-500 hover:bg-medical-600 text-white w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Diet Plan...
          </>
        ) : (
          "Generate Diet Plan"
        )}
      </Button>
      
      {error && (
        <div className="mt-4 p-3 md:p-4 bg-red-50 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-red-700">{error}</p>
        </div>
      )}
      
      {dietPlan && (
        <div className="mt-6 p-3 md:p-4 bg-white rounded-lg border border-medical-100">
          <h3 className="font-semibold text-gray-700 mb-2">Your Personalized Diet Plan:</h3>
          <div className="whitespace-pre-line text-sm md:text-base text-gray-600 overflow-auto max-h-[60vh]">
            {dietPlan}
          </div>
        </div>
      )}
    </Card>
  );
}
