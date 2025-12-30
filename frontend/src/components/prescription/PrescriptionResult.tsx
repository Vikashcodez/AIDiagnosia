
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, AlertCircle } from "lucide-react";

interface PrescriptionResultProps {
  prescriptionData: {
    medications: string[];
    recommendations: string[];
    precautions: string[];
  };
  diagnosis: string;
}

export function PrescriptionResult({ prescriptionData, diagnosis }: PrescriptionResultProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-green-100 rounded-xl shadow-md">
      <CardHeader className="bg-green-50/50 pb-3 border-b border-green-100">
        <CardTitle className="text-xl font-bold flex items-center text-green-800">
          <Pill className="mr-2 h-5 w-5 text-medical-600" />
          Treatment Suggestions for {diagnosis}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center text-amber-800 mb-2 font-medium">
            <AlertCircle className="h-5 w-5 mr-2" />
            Medical Disclaimer
          </div>
          <p className="text-sm text-amber-700">
            This information is provided for educational purposes only and does not constitute medical advice.
            Always consult with a qualified healthcare provider before starting any treatment.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Suggested Medications</h3>
          <ul className="list-disc pl-5 space-y-1">
            {prescriptionData.medications.map((medication, index) => (
              <li key={index} className="text-gray-700">{medication}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">General Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1">
            {prescriptionData.recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Precautions</h3>
          <ul className="list-disc pl-5 space-y-1">
            {prescriptionData.precautions.map((precaution, index) => (
              <li key={index} className="text-gray-700">{precaution}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
