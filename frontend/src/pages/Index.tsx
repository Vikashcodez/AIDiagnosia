import { Button } from "@/components/ui/button";
import { 
  Brain, 
  FileText, 
  Shield, 
  MessageSquare, 
  Heart, 
  Activity, 
  Scan, 
  Apple,
  Pill,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/home/Footer";
import heroDoctor from "@/assets/hero-doctor-realistic.png";

const Index = () => {
  const medicalServices = [
    {
      icon: Brain,
      title: "Symptom Analysis",
      description: "AI-powered analysis of your symptoms to identify possible conditions and get personalized health insights.",
      link: "/symptoms",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Activity,
      title: "Disease Predictor",
      description: "Advanced machine learning algorithms predict potential diseases based on your symptoms.",
      link: "/disease-predictor",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Future Risk Predictor",
      description: "Identify potential future health risks based on your current conditions and lifestyle.",
      link: "/future-risk-predictor",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Scan,
      title: "AI BodyScan Pro",
      description: "Upload photos of skin conditions or physical issues for instant AI-powered analysis.",
      link: "/body-scan",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: FileText,
      title: "Medical Report Analysis",
      description: "Complex medical terminology translated into easy-to-understand language instantly.",
      link: "/medical-report-analysis",
      color: "from-indigo-500 to-violet-500"
    },
    {
      icon: Apple,
      title: "Diet Plan Generator",
      description: "Personalized diet plans based on your health conditions and nutritional needs.",
      link: "/diet-plan-generator",
      color: "from-green-500 to-lime-500"
    },
    {
      icon: Pill,
      title: "Prescription Generator",
      description: "Generate medication recommendations based on your diagnosed conditions.",
      link: "/prescription-generator",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Mental Health Q&A",
      description: "24/7 access to AI-powered mental health guidance, support, and resources.",
      link: "/mental-health",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Lightbulb,
      title: "Health Tips",
      description: "Comprehensive resources and personalized tips to improve your well-being.",
      link: "/health-tips",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const benefits = [
    "Instant AI-powered analysis",
    "24/7 availability",
    "Privacy-first approach",
    "Medical-grade accuracy"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.08),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Healthcare</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                AI-Powered Medical
                <span className="text-primary block mt-2">Analysis</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Get instant insights and simplified explanations for your medical reports using cutting-edge AI technology.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
                  <Link to="/symptoms">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50">
                  <img 
                    src={heroDoctor}
                    alt="AI Doctor Assistant" 
                    className="w-full max-w-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mx-auto">
              <Heart className="h-4 w-4" />
              <span>Our Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Medical Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-powered healthcare tools designed to give you accurate insights and peace of mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalServices.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="group h-full p-6 bg-card hover:bg-card/80 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  <span>Why AIDiagnosia</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose AIDiagnosia?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Experience the future of medical analysis with our cutting-edge AI features
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "99% Accuracy Rate", desc: "Our AI models are trained on millions of medical records" },
                  { title: "Instant Results", desc: "Get analysis results in seconds, not hours" },
                  { title: "Privacy Guaranteed", desc: "Your medical data is encrypted and never shared" },
                  { title: "24/7 Availability", desc: "Access healthcare insights anytime, anywhere" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-xl" />
              <Card className="relative p-8 bg-gradient-to-br from-card to-muted/50 border-border/50">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "1M+", label: "Analyses Done" },
                    { value: "50K+", label: "Happy Users" },
                    { value: "99%", label: "Accuracy" },
                    { value: "24/7", label: "Available" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust AIDiagnosia for their healthcare insights. Start your journey to better health today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
              <Link to="/symptoms">
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
