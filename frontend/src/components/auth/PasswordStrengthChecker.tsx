
import { useState, useEffect } from "react";

interface PasswordStrengthProps {
  password: string;
  onStrengthChange: (isStrong: boolean) => void;
}

export function PasswordStrengthChecker({ password, onStrengthChange }: PasswordStrengthProps) {
  const [strength, setStrength] = useState({
    score: 0,
    message: "",
    color: "bg-gray-200"
  });

  useEffect(() => {
    // Check password strength
    const calculateStrength = () => {
      // Empty password
      if (!password) {
        setStrength({
          score: 0,
          message: "",
          color: "bg-gray-200"
        });
        onStrengthChange(false);
        return;
      }

      // Initialize score
      let score = 0;
      
      // Check length
      if (password.length >= 8) score += 1;
      if (password.length >= 10) score += 1;
      
      // Check for uppercase
      if (/[A-Z]/.test(password)) score += 1;
      
      // Check for lowercase
      if (/[a-z]/.test(password)) score += 1;
      
      // Check for numbers
      if (/[0-9]/.test(password)) score += 1;
      
      // Check for special characters
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      // Determine strength based on score
      let message, color;
      const isStrong = score >= 4;
      
      if (score <= 1) {
        message = "Very weak";
        color = "bg-red-500";
      } else if (score <= 2) {
        message = "Weak";
        color = "bg-orange-500";
      } else if (score <= 3) {
        message = "Moderate";
        color = "bg-yellow-500";
      } else if (score <= 4) {
        message = "Strong";
        color = "bg-green-500";
      } else {
        message = "Very strong";
        color = "bg-green-600";
      }

      setStrength({ score, message, color });
      onStrengthChange(isStrong);
    };

    calculateStrength();
  }, [password, onStrengthChange]);

  return (
    <div className="mt-1 mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${strength.color}`} 
            style={{ width: `${(strength.score / 6) * 100}%` }}
          ></div>
        </div>
      </div>
      {strength.message && (
        <p className={`text-xs ${
          strength.score <= 2 ? "text-red-500" : 
          strength.score <= 3 ? "text-yellow-600" : "text-green-600"
        }`}>
          {strength.message} password
        </p>
      )}
    </div>
  );
}
