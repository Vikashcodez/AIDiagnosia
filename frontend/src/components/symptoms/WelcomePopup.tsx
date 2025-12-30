import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileBarChart2, Heart, FileText, Book, MessageSquare, Activity, FileCog } from "lucide-react";

export function WelcomePopup() {
  // Always keep popup closed
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // No need to show the popup anymore
  useEffect(() => {
    // Mark as seen to prevent future popups
    localStorage.setItem("hasSeenWelcome", "true");
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  // Keep features array for potential future use
  const features = [
    {
      icon: FileBarChart2,
      title: "Disease Predictor",
      description: "Predict potential diseases based on your symptoms."
    },
    {
      icon: Activity,
      title: "Future Risk Predictor",
      description: "Identify potential future health risks."
    },
    {
      icon: FileText,
      title: "Medical Report Analysis",
      description: "Translate medical reports into simple language."
    },
    {
      icon: Heart,
      title: "Diet Plan Generator",
      description: "Get personalized diet plans based on your health."
    },
    {
      icon: FileCog,
      title: "Prescription Generator",
      description: "Generate medication recommendations."
    },
    {
      icon: MessageSquare,
      title: "Mental Health Support",
      description: "Access AI-powered mental health guidance."
    },
    {
      icon: Book,
      title: "Health Tips",
      description: "Access resources to understand your health better."
    }
  ];

  const WelcomeContent = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 mt-4">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
              <div className="bg-medical-100 p-2 rounded-md">
                <feature.icon className="h-5 w-5 text-medical-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Return empty fragments since we don't want to show the popup
  return <></>;
}
