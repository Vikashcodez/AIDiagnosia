
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { FutureRiskPredictor } from "@/components/symptoms/FutureRiskPredictor";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FutureRiskPredictorPage() {
  const isMobile = useIsMobile();
  
  return (
    <MedicalSidebar>
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-[calc(100vh-60px)]">
        <div className={`${isMobile ? 'px-2 py-2' : 'max-w-5xl mx-auto py-6'}`}>
          <div className="flex flex-col gap-6">
            <FutureRiskPredictor />
          </div>
        </div>
      </div>
    </MedicalSidebar>
  );
}
