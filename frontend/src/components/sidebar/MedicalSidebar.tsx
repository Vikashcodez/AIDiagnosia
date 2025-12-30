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
} from "@/components/ui/sidebar";
import { Shield, FileText, Apple, FileSearch, Calendar, Pill, Brain, Activity, Menu, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useAuth } from "./../../context/authcontext";
import UserAvatar from "../UserAvatar"; // Only import this one

export function MedicalSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const { user, isLoading } = useAuth();

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const navItems = [
    { path: "/symptoms", icon: FileText, label: "Symptom Analysis", sidebarLabel: "Symptom Analysis" },
    { path: "/body-scan", icon: Camera, label: "AI BodyScan Pro", sidebarLabel: "AI BodyScan Pro" },
    { path: "/disease-predictor", icon: Shield, label: "Symptom-to-Disease", sidebarLabel: "Symptom-to-Disease Prediction" },
    { path: "/future-risk-predictor", icon: Activity, label: "Future Risk Predictor", sidebarLabel: "Future Risk Predictor" },
    { path: "/medical-report-analysis", icon: FileSearch, label: "Report Analysis", sidebarLabel: "Medical Report Analysis" },
    { path: "/diet-plan-generator", icon: Apple, label: "Diet Plan Generator", sidebarLabel: "Diet Plan Generator" },
    { path: "/health-tips", icon: Calendar, label: "Health Tips", sidebarLabel: "Personalized Health Tips" },
    { path: "/prescription-generator", icon: Pill, label: "Prescription Generator", sidebarLabel: "Prescription Generator" },
    { path: "/mental-health", icon: Brain, label: "Mental Health Q&A", sidebarLabel: "Mental Health Q&A" },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen bg-background">
        <div className="flex-1 bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // For mobile, we use a drawer component
  if (isMobile) {
    const currentPage = navItems.find(item => item.path === location.pathname)?.sidebarLabel || "";

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
                  <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                    <div className="mb-6">
                      {user ? (
                        <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-accent/50">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setOpenMobile(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                            location.pathname === item.path
                              ? 'bg-accent text-foreground'
                              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <DrawerClose className="absolute top-3 right-3">
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Close</span>
                      &times;
                    </Button>
                  </DrawerClose>
                </DrawerContent>
              </Drawer>
              <div className="font-medium text-foreground">
                {currentPage}
              </div>
            </div>
            
            {/* Show UserAvatar for mobile - it will adapt based on props */}
            {user ? (
              <UserAvatar isMobile={true} />
            ) : (
              <Button 
                asChild
                variant="outline" 
                size="icon" 
                className="size-9"
              >
                <Link to="/login">
                  <span className="sr-only">Login</span>
                  <span className="text-sm font-medium">Login</span>
                </Link>
              </Button>
            )}
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
    <SidebarProvider defaultOpen={true}>
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
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-3 mb-2">
                Medical Services
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.path}
                        className="hover:bg-accent transition-colors data-[active=true]:bg-accent data-[active=true]:text-foreground"
                        tooltip={item.label}
                        onClick={handleNavigate}
                      >
                        <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 bg-background">
          <div className="flex items-center justify-between h-[60px] px-6 border-b border-border bg-background">
            <div className="flex items-center">
              <div className="font-medium text-foreground">
                {navItems.find(item => item.path === location.pathname)?.sidebarLabel || "Dashboard"}
              </div>
            </div>
            
            {/* Show UserAvatar for desktop */}
            {user ? (
              <UserAvatar isMobile={false} />
            ) : (
              <Button 
                asChild
                variant="outline"
                size="default"
              >
                <Link to="/login" className="flex items-center gap-2">
                  <span className="text-sm font-medium">Login / Register</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="bg-background">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}