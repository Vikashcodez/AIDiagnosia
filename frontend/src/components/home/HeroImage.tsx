
import React from "react";

export function HeroImage() {
  return (
    <div className="rounded-2xl overflow-hidden h-full w-full flex items-center justify-center bg-gradient-to-r from-medical-50 to-blue-50">
      <div className="relative w-full h-full">
        <img 
          src="/lovable-uploads/ca9647e6-448b-4b44-86fc-20a2287f2b76.png" 
          alt="Doctor with medical icons" 
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
}
