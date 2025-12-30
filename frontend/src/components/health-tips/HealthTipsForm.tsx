
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface HealthTipsFormProps {
  onSubmit: (userData: UserData) => void;
  isLoading: boolean;
}

export interface UserData {
  age: number;
  gender: string;
  region: string;
}

export function HealthTipsForm({ onSubmit, isLoading }: HealthTipsFormProps) {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>("male");
  const [region, setRegion] = useState<string>("northAmerica");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!age || age < 1 || age > 120) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age between 1 and 120",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      age,
      gender,
      region
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="1"
          max="120"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value) || 0)}
          placeholder="Enter your age"
          className="w-full"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="region">Region</Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger id="region">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="northAmerica">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
            <SelectItem value="southAmerica">South America</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
            <SelectItem value="oceania">Oceania</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Generating Tips..." : "Get Personalized Health Tips"}
      </Button>
    </form>
  );
}
