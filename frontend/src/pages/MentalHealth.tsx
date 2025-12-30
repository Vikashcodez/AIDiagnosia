
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { MentalHealthChatbot } from "@/components/mental-health/MentalHealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MentalHealthPage() {
  const isMobile = useIsMobile();
  
  return (
    <MedicalSidebar>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Mental Health Q&A</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          Talk to our AI assistant about stress, anxiety, sleep problems, or any other mental health concerns.
          Get personalized suggestions for managing your mental well-being. Remember that this is not a 
          substitute for professional mental health care.
        </p>
        <MentalHealthChatbot />
      </div>
    </MedicalSidebar>
  );
}
