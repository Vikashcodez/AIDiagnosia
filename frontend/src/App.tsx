import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/authcontext";
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
import { MedicalSidebar } from "@/components/sidebar/MedicalSidebar";
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
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-white min-h-screen">
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes (No Authentication Required) */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/support" element={<ContactSupport />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />

                {/* Protected Routes with Sidebar (Requires Authentication) */}
               
                
                <Route path="/symptoms" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <Symptoms />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/body-scan" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <BodyScanPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/disease-predictor" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <DiseasePredictorPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/future-risk-predictor" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <FutureRiskPredictorPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/diet-plan-generator" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <DietPlanGeneratorPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/medical-report-analysis" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <MedicalReportAnalysisPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/health-tips" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <HealthTipsPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/prescription-generator" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <PrescriptionGeneratorPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />
                
                <Route path="/mental-health" element={
                  <PrivateRoute>
                    <MedicalSidebar>
                      <MentalHealthPage />
                    </MedicalSidebar>
                  </PrivateRoute>
                } />

                {/* Admin Routes (Requires Admin Authentication) */}
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;