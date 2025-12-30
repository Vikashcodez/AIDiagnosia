
import React from "react";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RefundPolicy() {
  const isMobile = useIsMobile();
  
  return (
    <MedicalSidebar>
      <div className={`${isMobile ? 'px-4' : 'max-w-4xl mx-auto px-6'} py-8`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Cancellation & Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated on May 3rd 2025</p>
        
        <div className="space-y-6 text-gray-700">
          <p>
            Ankit Laj Acharya believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
          </p>
          
          <p>
            Cancellations will be considered only if the request is made within 7 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
          </p>
          
          <p>
            Ankit Laj Acharya does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
          </p>
          
          <p>
            In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 7 days of receipt of the products.
          </p>
          
          <p>
            In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
          </p>
          
          <p>
            In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
          </p>
          
          <p>
            In case of any Refunds approved by the Ankit Laj Acharya, it'll take 1-2 days for the refund to be processed to the end customer.
          </p>
        </div>
      </div>
    </MedicalSidebar>
  );
}
