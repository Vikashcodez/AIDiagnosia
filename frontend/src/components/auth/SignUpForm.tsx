
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, User, Mail, Lock, Calendar, ShieldAlert, HelpCircle } from "lucide-react";
import { PasswordStrengthChecker } from "./PasswordStrengthChecker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "In what city were you born?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What street did you grow up on?",
];

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    question1: "",
    question1_ans: "",
    question2: "",
    question2_ans: "",
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

    if (!formData.question1 || !formData.question1_ans || !formData.question2 || !formData.question2_ans) {
      toast({
        title: "Security Questions Required",
        description: "Please answer both security questions",
        variant: "destructive",
      });
      return;
    }

    if (formData.question1 === formData.question2) {
      toast({
        title: "Error",
        description: "Please select two different security questions",
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

        {/* Security Questions Section */}
        <div className="pt-4 space-y-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ShieldAlert className="h-4 w-4" />
            <span className="font-medium">Security Questions (for password recovery)</span>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
              <Select
                value={formData.question1}
                onValueChange={(value) => setFormData({ ...formData, question1: value })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select first security question" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((question, index) => (
                    <SelectItem 
                      key={index} 
                      value={question}
                      disabled={question === formData.question2}
                    >
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              placeholder="Your answer"
              value={formData.question1_ans}
              onChange={(e) => setFormData({ ...formData, question1_ans: e.target.value })}
              disabled={!formData.question1}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
              <Select
                value={formData.question2}
                onValueChange={(value) => setFormData({ ...formData, question2: value })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select second security question" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((question, index) => (
                    <SelectItem 
                      key={index} 
                      value={question}
                      disabled={question === formData.question1}
                    >
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              placeholder="Your answer"
              value={formData.question2_ans}
              onChange={(e) => setFormData({ ...formData, question2_ans: e.target.value })}
              disabled={!formData.question2}
              required
            />
          </div>
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
