
import { useState } from "react";
import { FileText, Upload, Trash2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

interface MedicalReportAnalysisProps {
  onAnalysisComplete?: (analysis: string | null) => void;
}

export function MedicalReportAnalysis({ onAnalysisComplete }: MedicalReportAnalysisProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: UploadedFile[] = [];
    
    for (const file of Array.from(e.target.files)) {
      if (file.type === "application/pdf" || file.type === "text/plain" || 
          file.type === "image/jpeg" || file.type === "image/png") {
        
        let preview: string | undefined;
        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }
        
        newFiles.push({
          id: crypto.randomUUID(),
          file: file,
          preview
        });
      } else {
        toast({
          title: "Unsupported file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
      }
    }
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    const file = uploadedFiles.find(f => f.id === id);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const analyzeReports = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload medical reports to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      // Process all files - convert images to base64
      const fileData = await Promise.all(
        uploadedFiles.map(async (uploadedFile) => {
          const file = uploadedFile.file;
          
          if (file.type === "text/plain") {
            const text = await file.text();
            return { type: "text", filename: file.name, content: text };
          } else if (file.type.startsWith("image/")) {
            const base64 = await fileToBase64(file);
            return { type: "image", filename: file.name, content: base64 };
          } else if (file.type === "application/pdf") {
            // For PDFs, we'll send as base64 too
            const base64 = await fileToBase64(file);
            return { type: "pdf", filename: file.name, content: base64 };
          }
          return { type: "unknown", filename: file.name, content: "" };
        })
      );

      console.log("Sending files for analysis:", fileData.map(f => ({ type: f.type, filename: f.filename })));
      
      // Call edge function for analysis
      const { data, error } = await supabase.functions.invoke('analyze-medical-report', {
        body: { files: fileData }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to analyze reports");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const analysis = data?.result || data?.analysis || "No analysis available";
      setAnalysisResult(analysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
      
      toast({
        title: "Analysis Complete",
        description: "Your medical reports have been analyzed.",
      });
    } catch (error) {
      console.error("Error analyzing medical reports:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze your medical reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="medical" 
            className="mt-4 w-full sm:w-auto"
          >
            <FileText className="mr-2" />
            Medical Report Analysis
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Medical Report Analysis</DialogTitle>
            <DialogDescription>
              Upload your medical reports for AI analysis. Supported formats: PDF, TXT, JPG, PNG.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 mt-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <FileText className="h-12 w-12 text-primary" />
                <div>
                  <p className="text-lg font-medium">Upload your medical reports</p>
                  <p className="text-sm text-muted-foreground">PDF, TXT, JPG or PNG files</p>
                </div>
                <Button asChild variant="outline">
                  <label className="cursor-pointer">
                    <Upload className="mr-2" />
                    Browse Files
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      accept=".pdf,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
              </div>
            </div>
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Uploaded Files:</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id} 
                      className="flex items-center justify-between bg-muted/50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {file.preview ? (
                          <img 
                            src={file.preview} 
                            alt={file.file.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                        <span className="text-sm truncate max-w-[200px] sm:max-w-[400px]">
                          {file.file.name}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Analyze Button */}
            <Button 
              variant="medical" 
              onClick={analyzeReports} 
              disabled={isAnalyzing || uploadedFiles.length === 0}
              className="mt-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" />
                  Analyze Reports
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analysis Results - Show outside dialog */}
      {analysisResult && (
        <Card className="p-6 mt-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-lg mb-4 text-foreground">Analysis Results:</h3>
          <div className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-line">
            {analysisResult}
          </div>
        </Card>
      )}
    </>
  );
}
