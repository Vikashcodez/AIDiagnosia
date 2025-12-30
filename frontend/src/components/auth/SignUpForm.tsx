
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, User, Mail, Lock, Calendar, ShieldAlert } from "lucide-react";
import { PasswordStrengthChecker } from "./PasswordStrengthChecker";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordStrong) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual signup logic
    toast({
      title: "Account created",
      description: "Please log in with your new account",
    });
    navigate("/login");
  };

  const handlePasswordStrengthChange = (isStrong: boolean) => {
    setIsPasswordStrong(isStrong);
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
        <p className="text-gray-500">Enter your details to get started</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="pl-10"
            required
          />
        </div>
        <div className="space-y-1">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10"
              required
            />
          </div>
          <PasswordStrengthChecker 
            password={formData.password}
            onStrengthChange={handlePasswordStrengthChange}
          />
          <div className="text-xs text-gray-500 flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1" />
            <span>Use at least 8 characters with uppercase, lowercase, number & special character</span>
          </div>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="pl-10"
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-medical-500 hover:bg-medical-600 text-white"
          disabled={!isPasswordStrong && formData.password.length > 0}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Create Account
        </Button>
      </form>
      <div className="text-center">
        <button
          onClick={() => navigate("/login")}
          className="text-medical-600 hover:text-medical-700 text-sm transition-colors"
        >
          Already have an account? Log in
        </button>
      </div>
    </Card>
  );
}
