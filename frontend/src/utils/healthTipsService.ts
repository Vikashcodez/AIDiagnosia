
import { UserData } from "@/components/health-tips/HealthTipsForm";

interface HealthTip {
  title: string;
  description: string;
  frequency: string;
}

// This is a mock service that simulates an API call to get health tips
export async function generateHealthTips(userData: UserData): Promise<HealthTip[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { age, gender, region } = userData;
  const tips: HealthTip[] = [];
  
  // Age-based tips
  if (age < 18) {
    tips.push({
      title: "Regular Physical Activity",
      description: "As a young person, aim for at least 60 minutes of moderate to vigorous physical activity daily to support healthy growth and development.",
      frequency: "Daily"
    });
    tips.push({
      title: "Limited Screen Time",
      description: "Limit recreational screen time to no more than 2 hours per day to prevent digital eye strain and promote better sleep patterns.",
      frequency: "Daily monitoring"
    });
  } else if (age >= 18 && age < 40) {
    tips.push({
      title: "Regular Health Checkups",
      description: "Schedule comprehensive health checkups every 2 years to monitor your overall health and catch potential issues early.",
      frequency: "Every 2 years"
    });
    tips.push({
      title: "Mental Health Awareness",
      description: "Practice stress-reduction techniques like meditation or mindfulness for at least 10 minutes daily to maintain good mental health.",
      frequency: "Daily"
    });
  } else if (age >= 40 && age < 65) {
    tips.push({
      title: "Blood Sugar Monitoring",
      description: `At ${age} years old, you should have your blood sugar levels checked every 6 months to monitor for pre-diabetes or diabetes risk.`,
      frequency: "Every 6 months"
    });
    tips.push({
      title: "Heart Health",
      description: "Schedule regular cardiovascular assessments including blood pressure, cholesterol, and ECG to maintain heart health.",
      frequency: "Annually"
    });
  } else {
    tips.push({
      title: "Bone Density Screening",
      description: "Schedule regular bone density screenings to monitor for osteoporosis and bone health issues common in seniors.",
      frequency: "Every 2 years"
    });
    tips.push({
      title: "Cognitive Health",
      description: "Engage in mentally stimulating activities like puzzles, reading, or learning new skills to maintain cognitive function.",
      frequency: "Daily"
    });
  }
  
  // Gender-specific tips
  if (gender === "male") {
    tips.push({
      title: "Prostate Health",
      description: age >= 50 ? "Schedule regular prostate examinations to monitor prostate health and screen for potential issues." : "Be aware of family history related to prostate health for future screening decisions.",
      frequency: age >= 50 ? "Annually" : "As recommended by doctor"
    });
  } else if (gender === "female") {
    tips.push({
      title: "Breast Health",
      description: age >= 40 ? "Schedule regular mammograms and breast examinations to monitor breast health and screen for potential issues." : "Practice monthly self-examinations to become familiar with your normal breast tissue.",
      frequency: age >= 40 ? "Annually" : "Monthly self-checks"
    });
  }
  
  // Region-specific tips
  switch (region) {
    case "northAmerica":
      tips.push({
        title: "Vitamin D Supplementation",
        description: "Consider vitamin D supplements during winter months when sun exposure is limited in North America.",
        frequency: "Daily during winter"
      });
      break;
    case "europe":
      tips.push({
        title: "Seasonal Affective Disorder Prevention",
        description: "In regions with limited winter sunlight, consider light therapy to prevent seasonal affective disorder symptoms.",
        frequency: "Daily during winter months"
      });
      break;
    case "asia":
      tips.push({
        title: "Air Quality Monitoring",
        description: "In regions with air quality concerns, monitor local air quality indexes and wear appropriate protection when necessary.",
        frequency: "Daily check"
      });
      break;
    case "southAmerica":
      tips.push({
        title: "Mosquito-borne Disease Prevention",
        description: "Use insect repellent and protective clothing in regions where mosquito-borne diseases are common.",
        frequency: "Daily during high-risk seasons"
      });
      break;
    case "africa":
      tips.push({
        title: "Hydration Monitoring",
        description: "In hot climates, monitor hydration levels and aim for at least 3 liters of water daily to prevent dehydration.",
        frequency: "Daily"
      });
      break;
    case "oceania":
      tips.push({
        title: "Sun Protection",
        description: "In regions with high UV exposure, wear SPF 50+ sunscreen, protective clothing, and seek shade during peak sun hours.",
        frequency: "Daily, reapply every 2 hours when outdoors"
      });
      break;
  }
  
  return tips;
}
