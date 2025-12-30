
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Loader2 } from "lucide-react";

interface SymptomFormProps {
  symptoms: string;
  setSymptoms: (value: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function SymptomForm({ symptoms, setSymptoms, loading, handleSubmit }: SymptomFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Describe your symptoms</label>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Please describe your symptoms in detail (e.g., fever, headache, cough)..."
          className="min-h-[160px] resize-none text-base"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full h-12"
        variant="medical"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Stethoscope className="h-5 w-5" />
            Analyze Symptoms
          </>
        )}
      </Button>
    </form>
  );
}
