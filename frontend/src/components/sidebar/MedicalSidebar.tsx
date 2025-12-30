
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Shield, FileText, Apple, FileSearch, Calendar, Pill, Brain, Activity, Menu, LogIn, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";

export function MedicalSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const navigate = useNavigate();

  // Close sidebar when route changes on mobile
  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // For mobile, we use a drawer component
  if (isMobile) {
    return (
      <div className="flex w-full min-h-screen bg-background">
        <div className="flex-1 bg-background">
          <div className="flex items-center justify-between h-[60px] px-4 border-b border-border bg-background">
            <div className="flex items-center">
              <Drawer open={openMobile} onOpenChange={setOpenMobile}>
                <DrawerTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="mr-2 size-9"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh] rounded-t-xl bg-background">
                  <div className="mt-2 flex justify-center">
                    <div className="h-1 w-12 rounded-full bg-border"></div>
                  </div>
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h1 className="text-lg font-semibold text-foreground">MediAssist</h1>
                    </div>
                  </div>
                  {/* Wrap sidebar components in SidebarProvider for mobile */}
                  <SidebarProvider>
                    <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/symptoms"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Symptom Analysis"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/symptoms" className="flex items-center gap-3 px-3 py-2">
                              <FileText className="h-5 w-5" />
                              <span className="text-sm">Symptom Analysis</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/body-scan"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="AI BodyScan Pro"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/body-scan" className="flex items-center gap-3 px-3 py-2">
                              <Camera className="h-5 w-5" />
                              <span className="text-sm">AI BodyScan Pro</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/disease-predictor"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Disease Predictor"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/disease-predictor" className="flex items-center gap-3 px-3 py-2">
                              <Shield className="h-5 w-5" />
                              <span className="text-sm">Symptom-to-Disease</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/future-risk-predictor"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Future Risk Predictor"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/future-risk-predictor" className="flex items-center gap-3 px-3 py-2">
                              <Activity className="h-5 w-5" />
                              <span className="text-sm">Future Risk Predictor</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/medical-report-analysis"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Medical Report Analysis"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/medical-report-analysis" className="flex items-center gap-3 px-3 py-2">
                              <FileSearch className="h-5 w-5" />
                              <span className="text-sm">Report Analysis</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/diet-plan-generator"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Diet Plan Generator"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/diet-plan-generator" className="flex items-center gap-3 px-3 py-2">
                              <Apple className="h-5 w-5" />
                              <span className="text-sm">Diet Plan Generator</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/health-tips"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Personalized Health Tips"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/health-tips" className="flex items-center gap-3 px-3 py-2">
                              <Calendar className="h-5 w-5" />
                              <span className="text-sm">Health Tips</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/prescription-generator"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Prescription Generator"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/prescription-generator" className="flex items-center gap-3 px-3 py-2">
                              <Pill className="h-5 w-5" />
                              <span className="text-sm">Prescription Generator</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === "/mental-health"}
                            className="hover:bg-accent transition-colors data-[active=true]:bg-accent"
                            tooltip="Mental Health Q&A"
                            onClick={() => { handleNavigate(); setOpenMobile(false); }}
                          >
                            <Link to="/mental-health" className="flex items-center gap-3 px-3 py-2">
                              <Brain className="h-5 w-5" />
                              <span className="text-sm">Mental Health Q&A</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </div>
                  </SidebarProvider>
                  <DrawerClose className="absolute top-3 right-3">
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Close</span>
                      &times;
                    </Button>
                  </DrawerClose>
                </DrawerContent>
              </Drawer>
              <div className="font-medium text-foreground">
                {location.pathname === "/symptoms" && "Symptom Analysis"}
                {location.pathname === "/body-scan" && "AI BodyScan Pro"}
                {location.pathname === "/disease-predictor" && "Symptom-to-Disease Prediction"}
                {location.pathname === "/future-risk-predictor" && "Future Risk Predictor"}
                {location.pathname === "/medical-report-analysis" && "Medical Report Analysis"}
                {location.pathname === "/diet-plan-generator" && "Diet Plan Generator"}
                {location.pathname === "/health-tips" && "Personalized Health Tips"}
                {location.pathname === "/prescription-generator" && "Prescription Generator"}
                {location.pathname === "/mental-health" && "Mental Health Q&A"}
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              variant="outline" 
              size="icon" 
              className="size-9"
            >
              <LogIn className="h-5 w-5" />
            </Button>
          </div>
          <div className="bg-background">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version with sidebar
  return (
    <SidebarProvider defaultOpen={!isMobile} open={!isMobile || openMobile} onOpenChange={setOpenMobile}>
      <div className="flex w-full min-h-screen bg-background">
        <Sidebar className="border-r border-border bg-background">
          <SidebarHeader className="py-6 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">MediAssist</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-3 mb-2">Medical Services</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/symptoms"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Symptom Analysis"
                      onClick={handleNavigate}
                    >
                      <Link to="/symptoms" className="flex items-center gap-3 px-3 py-2">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Symptom Analysis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/body-scan"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="AI BodyScan Pro"
                      onClick={handleNavigate}
                    >
                      <Link to="/body-scan" className="flex items-center gap-3 px-3 py-2">
                        <Camera className="h-5 w-5" />
                        <span className="text-sm">AI BodyScan Pro</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/disease-predictor"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Disease Predictor"
                      onClick={handleNavigate}
                    >
                      <Link to="/disease-predictor" className="flex items-center gap-3 px-3 py-2">
                        <Shield className="h-5 w-5" />
                        <span className="text-sm">Symptom-to-Disease</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/future-risk-predictor"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Future Risk Predictor"
                      onClick={handleNavigate}
                    >
                      <Link to="/future-risk-predictor" className="flex items-center gap-3 px-3 py-2">
                        <Activity className="h-5 w-5" />
                        <span className="text-sm">Future Risk Predictor</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/medical-report-analysis"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Medical Report Analysis"
                      onClick={handleNavigate}
                    >
                      <Link to="/medical-report-analysis" className="flex items-center gap-3 px-3 py-2">
                        <FileSearch className="h-5 w-5" />
                        <span className="text-sm">Report Analysis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/diet-plan-generator"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Diet Plan Generator"
                      onClick={handleNavigate}
                    >
                      <Link to="/diet-plan-generator" className="flex items-center gap-3 px-3 py-2">
                        <Apple className="h-5 w-5" />
                        <span className="text-sm">Diet Plan Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/health-tips"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Personalized Health Tips"
                      onClick={handleNavigate}
                    >
                      <Link to="/health-tips" className="flex items-center gap-3 px-3 py-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">Health Tips</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/prescription-generator"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Prescription Generator"
                      onClick={handleNavigate}
                    >
                      <Link to="/prescription-generator" className="flex items-center gap-3 px-3 py-2">
                        <Pill className="h-5 w-5" />
                        <span className="text-sm">Prescription Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/mental-health"}
                      className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      tooltip="Mental Health Q&A"
                      onClick={handleNavigate}
                    >
                      <Link to="/mental-health" className="flex items-center gap-3 px-3 py-2">
                        <Brain className="h-5 w-5" />
                        <span className="text-sm">Mental Health Q&A</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 bg-background">
          <div className="flex items-center justify-between h-[60px] px-6 border-b border-border bg-background">
            <div className="flex items-center">
              <div className="font-medium text-foreground">
                {location.pathname === "/symptoms" && "Symptom Analysis"}
                {location.pathname === "/body-scan" && "AI BodyScan Pro"}
                {location.pathname === "/disease-predictor" && "Symptom-to-Disease Prediction"}
                {location.pathname === "/future-risk-predictor" && "Future Risk Predictor"}
                {location.pathname === "/medical-report-analysis" && "Medical Report Analysis"}
                {location.pathname === "/diet-plan-generator" && "Diet Plan Generator"}
                {location.pathname === "/health-tips" && "Personalized Health Tips"}
                {location.pathname === "/prescription-generator" && "Prescription Generator"}
                {location.pathname === "/mental-health" && "Mental Health Q&A"}
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              variant="outline" 
              size="icon" 
              className="size-9"
            >
              <LogIn className="h-5 w-5" />
            </Button>
          </div>
          <div className="bg-background">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
