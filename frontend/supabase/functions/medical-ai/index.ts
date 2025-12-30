import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, symptoms, diagnosis, reportContent, patientInfo } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Medical AI request type:', type);

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'symptom-analysis':
        systemPrompt = `You are an expert medical AI assistant with extensive knowledge of symptoms, diseases, and treatments. Provide thorough, accurate medical analysis.

IMPORTANT: You must provide UNIQUE, SPECIFIC analysis for each set of symptoms. Never give generic or repetitive responses.

Respond with ONLY valid JSON in this exact format:
{
  "analysis": "Detailed analysis of the specific symptoms provided, explaining what they could indicate and why",
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3", "Specific recommendation 4", "Specific recommendation 5"],
  "possibleConditions": ["Most likely condition", "Second possibility", "Third possibility", "Fourth possibility", "Fifth possibility"]
}

Guidelines:
- Analyze the exact symptoms provided
- Consider symptom combinations and patterns
- Provide specific, actionable recommendations
- List conditions from most to least likely
- Include home remedies, lifestyle changes, and when to seek care
- Be comprehensive but clear`;

        userPrompt = `Analyze these symptoms thoroughly and provide a detailed medical assessment:

Symptoms: "${symptoms}"

Provide specific analysis for THESE EXACT symptoms. Consider:
1. What conditions typically present with these symptoms
2. How the symptoms relate to each other
3. What the patient should do immediately
4. What lifestyle changes could help
5. When they should see a doctor

Be specific and thorough. Do not give generic advice.`;
        break;

      case 'prescription':
        let patientDetails = '';
        if (patientInfo) {
          if (patientInfo.age) patientDetails += `Age: ${patientInfo.age}. `;
          if (patientInfo.gender) patientDetails += `Gender: ${patientInfo.gender}. `;
          if (patientInfo.allergies?.length > 0) patientDetails += `Allergies: ${patientInfo.allergies.join(", ")}. `;
        }

        systemPrompt = `You are an expert medical AI providing treatment recommendations. Provide detailed, specific treatment plans.

IMPORTANT: Tailor recommendations to the specific diagnosis and patient information provided.

Respond with ONLY valid JSON in this exact format:
{
  "medications": ["Medication 1 with specific dosage and frequency", "Medication 2 with dosage", "Medication 3 with dosage"],
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3", "Specific recommendation 4"],
  "precautions": ["Important precaution 1", "Precaution 2", "Precaution 3", "Precaution 4"]
}

Guidelines:
- Only recommend OTC medications (no prescription drugs)
- Include specific dosages and timing
- Consider patient's age, gender, and allergies if provided
- Provide practical, actionable recommendations
- Include important safety precautions`;

        userPrompt = `Create a detailed treatment plan for this diagnosis:

Diagnosis: "${diagnosis}"
${patientDetails ? `Patient Information: ${patientDetails}` : ''}

Provide:
1. Specific OTC medications with exact dosages
2. Practical lifestyle and care recommendations
3. Important safety precautions and warnings

Be thorough and specific to this diagnosis.`;
        break;

      case 'report-analysis':
        systemPrompt = `You are an expert medical AI that analyzes medical reports. Provide comprehensive, detailed analysis.

Guidelines:
- Identify all abnormal values and explain their significance
- Provide context for the findings
- Give clear, actionable recommendations
- Use patient-friendly language while being medically accurate`;

        userPrompt = `Analyze this medical report and provide a comprehensive assessment:

${reportContent}

Your analysis MUST include:
1. **Key Findings**: List all important results, especially abnormal values
2. **What These Mean**: Explain the significance of each finding
3. **Medication Recommendations**: Suggest OTC medications if appropriate (with disclaimer)
4. **Care Instructions**: Specific lifestyle, diet, and follow-up recommendations
5. **When to See a Doctor**: Clear guidance on warning signs

Be thorough and specific to THIS report's actual contents.`;
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid request type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Service is busy. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service quota exceeded.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI service error. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;
    
    if (!textResponse) {
      console.error('Invalid API response');
      return new Response(JSON.stringify({ error: 'Invalid AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('AI response received for type:', type);

    // For report analysis, return text directly
    if (type === 'report-analysis') {
      return new Response(JSON.stringify({ result: textResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For other types, parse JSON
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Could not extract JSON');
        return new Response(JSON.stringify({ error: 'Invalid response format' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const result = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in medical-ai function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
