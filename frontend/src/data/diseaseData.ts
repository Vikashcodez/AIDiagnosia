
export interface DiseaseDataType {
  name: string;
  symptoms: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  treatments: Array<{
    name: string;
    effectiveness: number;
    color: string;
  }>;
  description: string;
}

export const diseases: Record<string, DiseaseDataType> = {
  fever: {
    name: "Fever",
    symptoms: [
      { name: "High Temperature", value: 40, color: "#FF6B6B" },
      { name: "Body Aches", value: 30, color: "#4ECDC4" },
      { name: "Fatigue", value: 30, color: "#45B7D1" },
    ],
    treatments: [
      { name: "Rest", effectiveness: 90, color: "#FF6B6B" },
      { name: "Hydration", effectiveness: 85, color: "#4ECDC4" },
      { name: "Medication", effectiveness: 75, color: "#45B7D1" },
      { name: "Cold Compress", effectiveness: 65, color: "#96CEB4" },
    ],
    description: "An elevated body temperature often indicating infection or illness."
  },
  cold: {
    name: "Common Cold",
    symptoms: [
      { name: "Runny Nose", value: 35, color: "#9b87f5" },
      { name: "Sore Throat", value: 35, color: "#7E69AB" },
      { name: "Cough", value: 30, color: "#D6BCFA" },
    ],
    treatments: [
      { name: "Rest", effectiveness: 85, color: "#9b87f5" },
      { name: "Hydration", effectiveness: 80, color: "#7E69AB" },
      { name: "Vitamin C", effectiveness: 70, color: "#D6BCFA" },
      { name: "Steam Inhalation", effectiveness: 60, color: "#8E9196" },
    ],
    description: "A viral infection affecting the upper respiratory tract."
  },
  headache: {
    name: "Migraine",
    symptoms: [
      { name: "Head Pain", value: 45, color: "#FF9F1C" },
      { name: "Sensitivity", value: 30, color: "#E71D36" },
      { name: "Nausea", value: 25, color: "#2EC4B6" },
    ],
    treatments: [
      { name: "Dark Room", effectiveness: 80, color: "#FF9F1C" },
      { name: "Pain Relief", effectiveness: 75, color: "#E71D36" },
      { name: "Hydration", effectiveness: 70, color: "#2EC4B6" },
      { name: "Rest", effectiveness: 65, color: "#011627" },
    ],
    description: "A severe throbbing pain, often accompanied by sensitivity to light and sound."
  }
};
