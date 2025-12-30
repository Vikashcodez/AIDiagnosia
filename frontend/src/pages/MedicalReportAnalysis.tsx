
import { MedicalReportAnalysis } from "@/components/symptoms/MedicalReportAnalysis";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MedicalReportAnalysisPage() {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Medical Report Analysis</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          Upload your medical reports for AI-powered analysis. Our system can help interpret lab results, 
          diagnostic reports, and other medical documents to provide insights and recommendations.
        </p>
        <MedicalReportAnalysis />
      </div>
      <HealthChatbot />
    </>
  );
}
