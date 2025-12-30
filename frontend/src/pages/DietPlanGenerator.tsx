
import { DietPlanGenerator } from "@/components/diet/DietPlanGenerator";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DietPlanGeneratorPage() {
  const isMobile = useIsMobile();
  
  return (
    <MedicalSidebar>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <DietPlanGenerator />
      </div>
      <HealthChatbot />
    </MedicalSidebar>
  );
}
