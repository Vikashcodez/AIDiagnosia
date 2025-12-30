import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, AlertTriangle, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  possibleConditions: string[];
  appearance: string;
  possibleCauses: string[];
  riskLevel: string;
  riskReason: string;
  homeTreatment: string[];
  medications: string[];
  prevention: string[];
  whenToSeeDoctor: string[];
}

export function BodyScanAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    setError(null);
    setAnalysis(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription("");
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image of the affected body part",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });

      // Call edge function
      const { data, error: functionError } = await supabase.functions.invoke('analyze-body-image', {
        body: { 
          imageBase64: base64Image,
          description: description.trim() || undefined
        }
      });

      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(functionError.message);
      }

      if (!data) {
        throw new Error("No response from analysis service");
      }
      
      // Check if the image was rejected
      if (data.rejected) {
        setError(data.message || "This photo does not look like a human body part. Please upload a clear picture of the affected area.");
        toast({
          title: "Invalid Image",
          description: "Please upload a clear photo of a human body part",
          variant: "destructive",
        });
        return;
      }

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Your body scan analysis is ready",
      });
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze image. Please try again.");
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel === 'low') return 'text-green-600 bg-green-50 border-green-200';
    if (lowerLevel === 'medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (lowerLevel === 'high') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-medical-100 rounded-xl shadow-lg animate-fadeIn mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="h-6 w-6 text-medical-500" />
        <h2 className="text-2xl font-bold text-gray-900">AI BodyScan Pro</h2>
      </div>
      
      <div className="mb-6 space-y-4">
        <p className="text-gray-600">
          Upload a clear photo of the affected body part and describe your symptoms for AI-powered analysis.
          <br />
          <span className="text-sm text-gray-400">
            Supported: Skin conditions, rashes, wounds, swelling, and visible physical issues
          </span>
        </p>

        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-medical-200 rounded-lg cursor-pointer bg-medical-50 hover:bg-medical-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-3 text-medical-400" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageSelect}
            />
          </label>
        ) : (
          <div className="relative w-full">
            <div className="w-full h-64 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Selected body part for analysis"
                className="max-w-full max-h-full object-contain"
                onError={() => {
                  console.error('Image failed to load');
                  setError('Failed to load image preview. Please try a different image.');
                }}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={handleClearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Symptoms (Optional)
          </label>
          <Textarea
            placeholder="Example: I have a red, itchy rash on my arm that appeared 3 days ago. It's slightly raised and has been spreading..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] resize-y"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Adding a description helps the AI provide more accurate analysis
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleAnalyze}
        className="bg-medical-500 hover:bg-medical-600 text-white w-full"
        disabled={loading || !selectedImage}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Image...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-5 w-5" />
            Analyze Body Part
          </>
        )}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-2 border border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {analysis && (
        <div className="mt-6 space-y-4">
          {/* Possible Conditions */}
          <div className="p-4 bg-medical-50 rounded-lg border border-medical-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🔍 Possible Conditions
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.possibleConditions.map((condition, idx) => (
                <li key={idx} className="text-gray-700">{condition}</li>
              ))}
            </ul>
          </div>

          {/* What it Looks Like */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              👁️ What It Looks Like
            </h3>
            <p className="text-gray-700">{analysis.appearance}</p>
          </div>

          {/* Why It Might Have Happened */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              ❓ Possible Causes
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.possibleCauses.map((cause, idx) => (
                <li key={idx} className="text-gray-700">{cause}</li>
              ))}
            </ul>
          </div>

          {/* Risk Level */}
          <div className={`p-4 rounded-lg border ${getRiskColor(analysis.riskLevel)}`}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              ⚠️ Risk Level: {analysis.riskLevel}
            </h3>
            <p>{analysis.riskReason}</p>
          </div>

          {/* Safe Home Treatment */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🏠 Safe Home Treatment
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.homeTreatment.map((treatment, idx) => (
                <li key={idx} className="text-gray-700">{treatment}</li>
              ))}
            </ul>
          </div>

          {/* Medicine Recommendations */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              💊 Safe OTC Medicine Recommendations
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.medications.map((med, idx) => (
                <li key={idx} className="text-gray-700">{med}</li>
              ))}
            </ul>
          </div>

          {/* Prevention Tips */}
          <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🛡️ Prevention Tips
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.prevention.map((tip, idx) => (
                <li key={idx} className="text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>

          {/* When to See a Doctor */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
              🏥 When to See a Doctor
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.whenToSeeDoctor.map((warning, idx) => (
                <li key={idx} className="text-red-700 font-medium">{warning}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 italic">
              <strong>Important Disclaimer:</strong> This is an AI-powered analysis and should not replace professional medical advice. 
              Always consult with a healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
