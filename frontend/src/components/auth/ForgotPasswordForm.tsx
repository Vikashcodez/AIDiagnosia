import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowLeft, HelpCircle } from "lucide-react";

const API_URL = "http://localhost:5000/api/auth";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState({ question1: "", question2: "" });
  const [answers, setAnswers] = useState({ answer1: "", answer2: "" });
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/security-questions?email=${email}`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions);
        setStep(2);
        toast({
          title: "Security Questions Retrieved",
          description: "Please answer your security questions",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "User not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrieve security questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-security-answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          answer1: answers.answer1,
          answer2: answers.answer2,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        setResetToken(data.resetToken);
        setStep(3);
        toast({
          title: "Verified",
          description: "Please enter your new password",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Incorrect security answers",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify security answers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Password reset successfully. Please login.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Security Questions"}
          {step === 3 && "Reset Password"}
        </h2>
        <p className="text-gray-500">
          {step === 1 && "Enter your email to continue"}
          {step === 2 && "Answer your security questions"}
          {step === 3 && "Enter your new password"}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-medical-500 hover:bg-medical-600 text-white"
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleAnswersSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <HelpCircle className="h-4 w-4 mt-1 flex-shrink-0" />
              <p className="font-medium">{questions.question1}</p>
            </div>
            <Input
              type="text"
              placeholder="Your answer"
              value={answers.answer1}
              onChange={(e) => setAnswers({ ...answers, answer1: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <HelpCircle className="h-4 w-4 mt-1 flex-shrink-0" />
              <p className="font-medium">{questions.question2}</p>
            </div>
            <Input
              type="text"
              placeholder="Your answer"
              value={answers.answer2}
              onChange={(e) => setAnswers({ ...answers, answer2: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-medical-500 hover:bg-medical-600 text-white"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Answers"}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-medical-500 hover:bg-medical-600 text-white"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}

      <div className="text-center">
        <button
          onClick={() => navigate("/login")}
          className="text-medical-600 hover:text-medical-700 text-sm transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>
      </div>
    </Card>
  );
}
