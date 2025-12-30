
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface HealthTip {
  title: string;
  description: string;
  frequency: string;
}

interface HealthTipsDisplayProps {
  tips: HealthTip[];
  userData: {
    age: number;
    gender: string;
    region: string;
  };
}

export function HealthTipsDisplay({ tips, userData }: HealthTipsDisplayProps) {
  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male": return "Male";
      case "female": return "Female";
      default: return "Other";
    }
  };

  const getRegionLabel = (region: string) => {
    switch (region) {
      case "northAmerica": return "North America";
      case "europe": return "Europe";
      case "asia": return "Asia";
      case "southAmerica": return "South America";
      case "africa": return "Africa";
      case "oceania": return "Oceania";
      default: return region;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-medical-600" />
            Personalized Health Tips
          </CardTitle>
          <CardDescription>
            Based on: Age: {userData.age} | Gender: {getGenderLabel(userData.gender)} | Region: {getRegionLabel(userData.region)}
          </CardDescription>
        </CardHeader>
      </Card>

      {tips.map((tip, index) => (
        <Card key={index} className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-medical-700">{tip.title}</CardTitle>
            <CardDescription className="text-xs text-medical-500">
              Recommended frequency: {tip.frequency}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{tip.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
