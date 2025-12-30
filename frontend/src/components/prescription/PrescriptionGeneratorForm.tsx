
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pill } from "lucide-react";
import { getPrescriptionSuggestion } from "@/utils/geminiApi";
import { PrescriptionResult } from "./PrescriptionResult";

export function PrescriptionGeneratorForm() {
  const [diagnosis, setDiagnosis] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("male");
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<{
    medications: string[];
    recommendations: string[];
    precautions: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diagnosis.trim()) {
      toast({
        title: "Error",
        description: "Please enter a diagnosis",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setPrescriptionData(null);
      
      const patientInfo = {
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        allergies: allergies ? allergies.split(",").map(a => a.trim()) : []
      };
      
      const result = await getPrescriptionSuggestion(diagnosis, patientInfo);
      setPrescriptionData(result);
      
      toast({
        title: "Success",
        description: "Generated treatment suggestions for the diagnosis",
      });
    } catch (error) {
      console.error("Error generating prescription:", error);
      toast({
        title: "Error",
        description: "Failed to generate treatment suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
              Medical Diagnosis *
            </label>
            <Textarea
              id="diagnosis"
              placeholder="Enter medical diagnosis (e.g., common cold, tension headache, etc.)"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age (Optional)
              </label>
              <Input
                id="age"
                type="number"
                min="0"
                max="120"
                placeholder="Patient age"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender (Optional)
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-medical-500 focus:outline-none focus:ring-1 focus:ring-medical-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
              Allergies (Optional, comma-separated)
            </label>
            <Input
              id="allergies"
              placeholder="E.g., penicillin, aspirin, peanuts"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-medical-600 hover:bg-medical-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center">
                <Pill className="mr-2 h-5 w-5" />
                Generate Treatment Suggestions
              </span>
            )}
          </Button>
        </form>
      </Card>

      {prescriptionData && (
        <PrescriptionResult prescriptionData={prescriptionData} diagnosis={diagnosis} />
      )}
    </div>
  );
}
