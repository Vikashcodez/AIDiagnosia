
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ShippingPolicy() {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'px-4' : 'max-w-4xl mx-auto px-6'} py-8`}>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Shipping & Delivery Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated on Sep 16 2025</p>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only. Orders are shipped within Not Applicable or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. 
        </p>
        
        <p>
          Ankit Laj Acharya is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within Not Applicable rom the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
        </p>
        
        <p>
          Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
        </p>
        
        <p>
          For any issues in utilizing our services you may contact our helpdesk on <a href="tel:9531973175" className="text-blue-600 hover:underline">9531973175</a> or <a href="mailto:ankitlajacharyapaimon@gmail.com" className="text-blue-600 hover:underline">ankitlajacharyapaimon@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
