
import { DiseasePredictor } from "@/components/symptoms/DiseasePredictor";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DiseasePredictorPage() {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <DiseasePredictor />
      </div>
      <HealthChatbot />
    </>
  );
}
