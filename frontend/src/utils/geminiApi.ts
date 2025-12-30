/**
 * Medical AI API utility functions
 * Uses Lovable AI edge functions for accurate results
 */

import { supabase } from "@/integrations/supabase/client";

export interface GeminiResponse {
  analysis: string;
  recommendations: string[];
  possibleConditions: string[];
}

export interface PrescriptionResponse {
  medications: string[];
  recommendations: string[];
  precautions: string[];
}

/**
 * Get medical analysis from AI
 */
export async function getMedicalAnalysis(symptoms: string): Promise<GeminiResponse> {
  try {
    console.log("Requesting medical analysis for symptoms:", symptoms);
    
    const { data, error } = await supabase.functions.invoke('medical-ai', {
      body: { 
        type: 'symptom-analysis',
        symptoms 
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      return getFallbackAnalysis(symptoms);
    }

    if (!data?.result) {
      console.error("No result in response");
      return getFallbackAnalysis(symptoms);
    }

    return {
      analysis: data.result.analysis || "Analysis unavailable",
      recommendations: Array.isArray(data.result.recommendations) ? data.result.recommendations : ["Please consult with a healthcare professional."],
      possibleConditions: Array.isArray(data.result.possibleConditions) ? data.result.possibleConditions : ["Analysis unavailable"]
    };
  } catch (error) {
    console.error("Error getting medical analysis:", error);
    return getFallbackAnalysis(symptoms);
  }
}

/**
 * Get medical report analysis from AI
 */
export async function getMedicalReportAnalysis(reportContent: string): Promise<string> {
  try {
    console.log("Requesting medical report analysis");
    
    const { data, error } = await supabase.functions.invoke('medical-ai', {
      body: { 
        type: 'report-analysis',
        reportContent 
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      return "Failed to analyze medical reports. Please try again.";
    }

    return data?.result || "Analysis unavailable. Please try again.";
  } catch (error) {
    console.error("Error getting report analysis:", error);
    return "Failed to analyze medical reports. Please try again.";
  }
}

/**
 * Generate prescription suggestions based on diagnosis
 */
export async function getPrescriptionSuggestion(
  diagnosis: string, 
  patientInfo?: { 
    age?: number;
    gender?: string;
    allergies?: string[];
  }
): Promise<PrescriptionResponse> {
  try {
    console.log("Requesting prescription suggestion for:", diagnosis);
    
    const { data, error } = await supabase.functions.invoke('medical-ai', {
      body: { 
        type: 'prescription',
        diagnosis,
        patientInfo
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      return getFallbackPrescription(diagnosis);
    }

    if (!data?.result) {
      console.error("No result in response");
      return getFallbackPrescription(diagnosis);
    }

    return {
      medications: Array.isArray(data.result.medications) ? data.result.medications : ["Please consult a healthcare professional."],
      recommendations: Array.isArray(data.result.recommendations) ? data.result.recommendations : ["Rest and stay hydrated."],
      precautions: Array.isArray(data.result.precautions) ? data.result.precautions : ["Consult a doctor if symptoms worsen."]
    };
  } catch (error) {
    console.error("Error getting prescription suggestion:", error);
    return getFallbackPrescription(diagnosis);
  }
}

/**
 * Get disease prediction analysis
 */
export async function getDiseaseAnalysis(symptoms: string[]): Promise<GeminiResponse> {
  const symptomText = symptoms.join(', ');
  return getMedicalAnalysis(`I have the following symptoms: ${symptomText}`);
}

/**
 * Get future health risk analysis
 */
export async function getFutureRiskAnalysis(
  medicalHistory: string,
  lifestyle: string,
  familyHistory: string
): Promise<GeminiResponse> {
  const prompt = `
    Based on the following information, analyze potential future health risks:
    
    Medical History: ${medicalHistory}
    Lifestyle Factors: ${lifestyle}
    Family Medical History: ${familyHistory}
    
    Provide a comprehensive risk assessment.
  `;
  return getMedicalAnalysis(prompt);
}

/**
 * Get diet plan suggestion
 */
export async function getDietPlanSuggestion(
  healthGoals: string,
  restrictions: string,
  preferences: string
): Promise<GeminiResponse> {
  const prompt = `
    Create a personalized diet plan based on:
    
    Health Goals: ${healthGoals}
    Dietary Restrictions: ${restrictions}
    Food Preferences: ${preferences}
    
    Provide specific meal suggestions and nutritional advice.
  `;
  return getMedicalAnalysis(prompt);
}

/**
 * Get mental health support response
 */
export async function getMentalHealthResponse(userMessage: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('medical-ai', {
      body: { 
        type: 'symptom-analysis',
        symptoms: `Mental health concern: ${userMessage}`
      }
    });

    if (error || !data?.result) {
      return "I understand you're going through a difficult time. While I'm here to listen and provide support, please consider reaching out to a mental health professional who can provide personalized guidance. Would you like to share more about what you're experiencing?";
    }

    return data.result.analysis || "I'm here to support you. Please share more about how you're feeling.";
  } catch (error) {
    console.error("Error getting mental health response:", error);
    return "I'm here to listen and support you. Please feel free to share what's on your mind.";
  }
}

// Fallback functions for when AI is unavailable

function getFallbackAnalysis(symptoms: string): GeminiResponse {
  const symptomsLower = symptoms.toLowerCase();
  
  if (symptomsLower.includes('headache') || symptomsLower.includes('head pain')) {
    return {
      analysis: "Headaches can result from various causes including stress, dehydration, lack of sleep, eye strain, or tension. Monitor frequency and intensity of symptoms.",
      recommendations: [
        "Rest in a quiet, dark room",
        "Stay hydrated - drink plenty of water",
        "Apply a cold or warm compress to your forehead",
        "Practice relaxation techniques",
        "Ensure adequate sleep (7-8 hours)"
      ],
      possibleConditions: [
        "Tension headache",
        "Migraine",
        "Dehydration headache",
        "Sinus headache",
        "Eye strain headache"
      ]
    };
  }
  
  if (symptomsLower.includes('fever') || symptomsLower.includes('temperature')) {
    return {
      analysis: "Fever is typically a sign that your body is fighting an infection. It's important to monitor temperature and stay hydrated.",
      recommendations: [
        "Rest and get plenty of sleep",
        "Drink plenty of fluids to prevent dehydration",
        "Take over-the-counter fever reducers if needed",
        "Use a light blanket if you have chills",
        "Monitor your temperature regularly"
      ],
      possibleConditions: [
        "Viral infection",
        "Bacterial infection",
        "Flu (Influenza)",
        "Common cold",
        "Inflammatory condition"
      ]
    };
  }
  
  if (symptomsLower.includes('stomach') || symptomsLower.includes('nausea') || symptomsLower.includes('vomit')) {
    return {
      analysis: "Digestive symptoms can be caused by various factors including food-related issues, infections, or stress. Monitor for dehydration.",
      recommendations: [
        "Stay hydrated with clear fluids",
        "Eat bland foods (BRAT diet: bananas, rice, applesauce, toast)",
        "Avoid dairy, fatty, and spicy foods",
        "Rest and avoid strenuous activity",
        "Try ginger tea for nausea relief"
      ],
      possibleConditions: [
        "Food poisoning",
        "Gastroenteritis (stomach flu)",
        "Acid reflux/GERD",
        "Indigestion",
        "Stress-related digestive issues"
      ]
    };
  }
  
  return {
    analysis: "Based on the symptoms described, it's important to monitor your condition and note any changes. If symptoms persist or worsen, please consult a healthcare professional.",
    recommendations: [
      "Monitor your symptoms and track any changes",
      "Rest and allow your body to recover",
      "Stay well hydrated",
      "Maintain a healthy diet",
      "Consult a healthcare professional if symptoms persist"
    ],
    possibleConditions: [
      "Various conditions possible - further evaluation needed",
      "Please provide more specific symptoms for accurate analysis",
      "Consider consulting a healthcare provider for proper diagnosis"
    ]
  };
}

function getFallbackPrescription(diagnosis: string): PrescriptionResponse {
  const diagnosisLower = diagnosis.toLowerCase();
  
  if (diagnosisLower.includes('cold') || diagnosisLower.includes('flu')) {
    return {
      medications: [
        "Paracetamol (Acetaminophen) 500mg - 1-2 tablets every 4-6 hours as needed",
        "Antihistamine (Cetirizine 10mg) - 1 tablet daily for congestion",
        "Throat lozenges - As needed for sore throat"
      ],
      recommendations: [
        "Get plenty of rest (8-10 hours sleep)",
        "Drink warm fluids like herbal tea with honey",
        "Use a humidifier to ease congestion",
        "Gargle with warm salt water for sore throat"
      ],
      precautions: [
        "Seek medical attention if fever exceeds 103°F (39.4°C)",
        "Watch for difficulty breathing",
        "Don't exceed recommended medication dosages",
        "Avoid alcohol while taking medications"
      ]
    };
  }
  
  if (diagnosisLower.includes('headache') || diagnosisLower.includes('migraine')) {
    return {
      medications: [
        "Ibuprofen 400mg - 1 tablet every 6-8 hours with food",
        "Paracetamol 500mg - 1-2 tablets every 4-6 hours as alternative",
        "Caffeine (in moderation) - Can enhance pain relief"
      ],
      recommendations: [
        "Rest in a quiet, dark room",
        "Apply cold compress to forehead",
        "Practice stress management techniques",
        "Maintain regular sleep schedule"
      ],
      precautions: [
        "Seek emergency care for sudden severe headache",
        "Don't overuse pain medications (can cause rebound headaches)",
        "Monitor for vision changes or confusion",
        "Take ibuprofen with food to prevent stomach upset"
      ]
    };
  }
  
  return {
    medications: [
      "Consult a healthcare professional for specific medication advice",
      "Over-the-counter pain relievers may help with discomfort",
      "Follow all medication instructions carefully"
    ],
    recommendations: [
      "Rest and allow your body to recover",
      "Stay hydrated with water and clear fluids",
      "Eat a balanced, nutritious diet",
      "Monitor symptoms and note any changes"
    ],
    precautions: [
      "This information is not a substitute for professional medical advice",
      "Seek medical attention if symptoms worsen",
      "Inform your doctor of all medications you're taking",
      "Follow up with a healthcare provider for proper evaluation"
    ]
  };
}
