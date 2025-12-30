import { BodyScanAnalyzer } from "@/components/symptoms/BodyScanAnalyzer";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BodyScanPage() {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <BodyScanAnalyzer />
      </div>
      <HealthChatbot />
    </>
  );
}
