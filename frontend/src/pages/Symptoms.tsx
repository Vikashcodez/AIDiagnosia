import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getMedicalAnalysis, GeminiResponse } from "@/utils/geminiApi";
import { SymptomForm } from "@/components/symptoms/SymptomForm";
import { BasicAnalysis } from "@/components/symptoms/BasicAnalysis";
import { GeminiAnalysisLoading } from "@/components/symptoms/GeminiAnalysisLoading";
import { GeminiAnalysisError } from "@/components/symptoms/GeminiAnalysisError";
import { GeminiAnalysisResult } from "@/components/symptoms/GeminiAnalysisResult";
import { MedicalReportAnalysis } from "@/components/symptoms/MedicalReportAnalysis";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { DiseasePredictor } from "@/components/symptoms/DiseasePredictor";
import { WelcomePopup } from "@/components/symptoms/WelcomePopup";
import { diseases } from "@/data/diseaseData";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiResponse | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [reportAnalysis, setReportAnalysis] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Clear any login notifications when the component mounts
  useEffect(() => {
    // Remove any "just logged in" flag to prevent welcome popup
    sessionStorage.removeItem("justLoggedIn");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please enter your symptoms",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeminiAnalysis(null);
    setGeminiError(null);
    setGeminiLoading(true);

    try {
      // Get analysis from Gemini API directly
      console.log("Requesting Gemini analysis for symptoms:", symptoms);
      const geminiResult = await getMedicalAnalysis(symptoms);
      console.log("Gemini analysis result:", geminiResult);
      setGeminiAnalysis(geminiResult);
      
      // Detect disease type for historical data reference
      const symptomsLower = symptoms.toLowerCase();
      let detectedDisease = "cold"; // default
      
      if (symptomsLower.includes("fever") || symptomsLower.includes("temperature")) {
        detectedDisease = "fever";
      } else if (symptomsLower.includes("headache") || symptomsLower.includes("migraine")) {
        detectedDisease = "headache";
      }
      setSelectedDisease(detectedDisease);

      toast({
        title: "Analysis Complete",
        description: "We've analyzed your symptoms and provided recommendations.",
      });
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setGeminiError("Failed to get AI analysis. Please try again later.");
      toast({
        title: "Error",
        description: "Unable to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setGeminiLoading(false);
    }
  };

  const retryGeminiAnalysis = () => {
    setGeminiError(null);
    setGeminiLoading(true);
    getMedicalAnalysis(symptoms)
      .then(result => {
        setGeminiAnalysis(result);
        setGeminiError(null);
      })
      .catch(err => {
        console.error("Retry error:", err);
        setGeminiError("Failed to get AI analysis. Please try again later.");
      })
      .finally(() => setGeminiLoading(false));
  };

  // Callback function to receive report analysis from MedicalReportAnalysis
  const handleReportAnalysis = (analysis: string | null) => {
    setReportAnalysis(analysis);
  };

  return (
    <MedicalSidebar>
      <div className={`${isMobile ? 'px-4 py-6' : 'max-w-5xl mx-auto px-8 py-8'}`}>
        <div className="flex flex-col gap-8">
          {/* Main symptom analysis */}
          <Card className="p-6 md:p-10 bg-card border border-border rounded-xl shadow-sm animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">Symptom Analysis</h1>
            <SymptomForm
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              loading={loading || geminiLoading}
              handleSubmit={handleSubmit}
            />
            <div className="mt-4 flex flex-wrap gap-4">
              <MedicalReportAnalysis onAnalysisComplete={handleReportAnalysis} />
            </div>
          </Card>

          {/* Welcome popup */}
          <WelcomePopup />
          
          {reportAnalysis && (
            <Card className="p-4 md:p-8 bg-white/80 backdrop-blur-lg border border-medical-100 rounded-xl shadow-lg animate-fadeIn">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <span className="bg-medical-100 text-medical-600 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-medical">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v5h5" />
                    <path d="M8.5 15h7" />
                    <path d="M12 12.5v5" />
                  </svg>
                </span>
                Medical Report Analysis
              </h2>
              <div className="mt-4 prose prose-medical">
                <div className="whitespace-pre-line text-sm md:text-base text-gray-700 overflow-auto max-h-[60vh]" dangerouslySetInnerHTML={{ __html: reportAnalysis.replace(/\n/g, '<br/>') }} />
              </div>
            </Card>
          )}

          {geminiLoading ? (
            <GeminiAnalysisLoading />
          ) : geminiError ? (
            <GeminiAnalysisError 
              error={geminiError} 
              retryAnalysis={retryGeminiAnalysis}
            />
          ) : geminiAnalysis ? (
            <>
              <BasicAnalysis analysis={geminiAnalysis} />
              <GeminiAnalysisResult analysis={geminiAnalysis} />
            </>
          ) : null}

          {selectedDisease && (
            <Card className="p-4 md:p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Medical History</h2>
              <p className="text-sm md:text-base text-gray-500">No previous medical records found.</p>
            </Card>
          )}
        </div>
      </div>
      
      <HealthChatbot />
    </MedicalSidebar>
  );
}
