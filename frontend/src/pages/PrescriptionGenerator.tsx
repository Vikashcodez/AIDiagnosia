
import { PrescriptionGeneratorForm } from "@/components/prescription/PrescriptionGeneratorForm";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PrescriptionGeneratorPage() {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Prescription Generator</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          Enter a medical diagnosis to receive basic treatment suggestions. Please note that these are 
          general recommendations only and should not replace professional medical advice.
        </p>
        <PrescriptionGeneratorForm />
      </div>
      <HealthChatbot />
    </>
  );
}
