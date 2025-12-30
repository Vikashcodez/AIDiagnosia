
import React, { useState } from "react";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { HealthTipsForm, UserData } from "@/components/health-tips/HealthTipsForm";
import { HealthTipsDisplay } from "@/components/health-tips/HealthTipsDisplay";
import { HealthChatbot } from "@/components/symptoms/HealthChatbot";
import { useIsMobile } from "@/hooks/use-mobile";
import { generateHealthTips } from "@/utils/healthTipsService";
import { useToast } from "@/hooks/use-toast";

export default function HealthTipsPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [healthTips, setHealthTips] = useState([]);
  const [userData, setUserData] = useState({
    age: 30,
    gender: "male",
    region: "northAmerica"
  });
  
  const handleSubmit = async (formData: UserData) => {
    setIsLoading(true);
    try {
      const tips = await generateHealthTips(formData);
      setHealthTips(tips);
      setUserData(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate health tips. Please try again.",
        variant: "destructive",
      });
      console.error("Health tips error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MedicalSidebar>
      <div className={`${isMobile ? 'px-1' : 'max-w-4xl mx-auto'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Personalized Health Tips</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          Get personalized health tips based on your age, lifestyle, and health goals. Our AI will generate recommendations 
          to help you maintain or improve your health.
        </p>
        <HealthTipsForm onSubmit={handleSubmit} isLoading={isLoading} />
        {healthTips.length > 0 && (
          <div className="mt-8">
            <HealthTipsDisplay tips={healthTips} userData={userData} />
          </div>
        )}
      </div>
      <HealthChatbot />
    </MedicalSidebar>
  );
}
