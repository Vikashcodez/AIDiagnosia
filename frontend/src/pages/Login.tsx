import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Brain, Shield, ActivitySquare } from "lucide-react";
import { useAuth } from "@/context/authcontext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setLoading(false);
    }
    // Note: The AuthContext handles the navigation and sets loading state
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Features */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Medical Technology"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">AI Healthcare System</h1>
          <p className="text-blue-600 mb-12">
            Advanced medical diagnosis and patient management system
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700 mb-1">Smart Diagnosis</h3>
                <p className="text-blue-600">AI-powered symptom analysis and diagnosis</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700 mb-1">Secure Platform</h3>
                <p className="text-blue-600">End-to-end encrypted patient data security</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ActivitySquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700 mb-1">Patient Management</h3>
                <p className="text-blue-600">Comprehensive patient records and tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
            alt="Technology Background"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <Card className="w-full max-w-md p-8 space-y-6 relative z-10 bg-white/90 backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Create Account
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}