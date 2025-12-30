
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Symptoms from "./pages/Symptoms";
import BodyScanPage from "./pages/BodyScan";
import DiseasePredictorPage from "./pages/DiseasePredictor";
import DietPlanGeneratorPage from "./pages/DietPlanGenerator";
import MedicalReportAnalysisPage from "./pages/MedicalReportAnalysis";
import HealthTipsPage from "./pages/HealthTips";
import PrescriptionGeneratorPage from "./pages/PrescriptionGenerator";
import MentalHealthPage from "./pages/MentalHealth";
import FutureRiskPredictorPage from "./pages/FutureRiskPredictor";
import RefundPolicy from "./pages/RefundPolicy";
import ContactSupport from "./pages/ContactSupport";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Register from "./pages/Register";


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-white min-h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/body-scan" element={<BodyScanPage />} />
              <Route path="/disease-predictor" element={<DiseasePredictorPage />} />
              <Route path="/future-risk-predictor" element={<FutureRiskPredictorPage />} />
              <Route path="/diet-plan-generator" element={<DietPlanGeneratorPage />} />
              <Route path="/medical-report-analysis" element={<MedicalReportAnalysisPage />} />
              <Route path="/health-tips" element={<HealthTipsPage />} />
              <Route path="/prescription-generator" element={<PrescriptionGeneratorPage />} />
              <Route path="/mental-health" element={<MentalHealthPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/support" element={<ContactSupport />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
