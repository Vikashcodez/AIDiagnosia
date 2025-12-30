
import React from "react";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Mail, Phone } from "lucide-react";

export default function ContactSupport() {
  const isMobile = useIsMobile();
  
  return (
    <MedicalSidebar>
      <div className={`${isMobile ? 'px-4' : 'max-w-4xl mx-auto px-6'} py-8`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Contact us</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated on May 3rd 2025</p>
        
        <div className="space-y-6 text-gray-700">
          <p>
            You may contact us using the information below:
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="p-6 border rounded-lg bg-gray-50">
              <p className="font-semibold mb-4">Merchant Legal entity name:</p>
              <p>Ankit Laj Acharya</p>
            </div>
            
            <div className="p-6 border rounded-lg bg-gray-50 flex items-center">
              <Phone className="h-5 w-5 mr-3 text-medical-500" />
              <div>
                <p className="font-semibold mb-1">Telephone No:</p>
                <a href="tel:9531973175" className="text-medical-600 hover:underline">9531973175</a>
              </div>
            </div>
            
            <div className="p-6 border rounded-lg bg-gray-50 flex items-center">
              <Mail className="h-5 w-5 mr-3 text-medical-500" />
              <div>
                <p className="font-semibold mb-1">E-Mail ID:</p>
                <a href="mailto:ankitlajacharyapaimon@gmail.com" className="text-medical-600 hover:underline">ankitlajacharyapaimon@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MedicalSidebar>
  );
}
