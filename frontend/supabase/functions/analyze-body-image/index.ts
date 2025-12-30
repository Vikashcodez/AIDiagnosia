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
    const { imageBase64, description } = await req.json();
    
    if (!imageBase64) {
      console.error('No image provided');
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Calling Lovable AI Gateway for body scan analysis...');
    console.log('Image size (base64 length):', imageBase64.length);
    console.log('Description provided:', description ? 'Yes' : 'No');

    const systemPrompt = `You are AI BodyScan Pro, an advanced medical image analysis system powered by cutting-edge AI. Your job is to analyze photos of human body parts and provide detailed, accurate medical assessments.

CRITICAL RULES:

1. REJECTION RULES - If the image shows:
   - Walls, paper, clothes, furniture, or non-body objects
   - Animals (dogs, cats, etc.)
   - Random objects or unclear images
   - Anything that is NOT clearly a human body part
   
   Then respond with ONLY this JSON:
   {"rejected": true, "message": "⚠️ This photo does not appear to show a human body part. Please upload a clear picture of the affected area (skin, hand, foot, etc.)."}

2. VALID BODY PART ANALYSIS - If the image clearly shows a human body part, provide a DETAILED and ACCURATE analysis. You MUST:
   - Examine the image thoroughly
   - Consider the user's description if provided
   - Give specific, actionable medical guidance
   - Provide multiple possible conditions ranked by likelihood
   - Give comprehensive treatment recommendations

Respond with this JSON structure:
{
  "rejected": false,
  "possibleConditions": ["Most likely condition with confidence", "Second possibility", "Third possibility"],
  "appearance": "Detailed description of what you observe - color, texture, size, pattern, distribution, borders, etc.",
  "possibleCauses": ["Primary cause", "Secondary cause", "Other potential triggers"],
  "riskLevel": "Low|Medium|High",
  "riskReason": "Specific explanation of why this risk level was assigned",
  "homeTreatment": ["Specific treatment step 1", "Treatment step 2", "Treatment step 3", "Treatment step 4"],
  "medications": ["Specific OTC medication with dosage", "Alternative medication", "Topical treatment"],
  "prevention": ["Prevention tip 1", "Prevention tip 2", "Prevention tip 3"],
  "whenToSeeDoctor": ["Red flag symptom 1", "Red flag symptom 2", "Time-based guidance"]
}

IMPORTANT GUIDELINES:
- Be thorough and detailed in your analysis
- Provide specific medication names with dosages (only OTC: Clotrimazole, Hydrocortisone 1%, Calamine, Cetirizine, Ibuprofen, etc.)
- Never suggest prescription drugs, antibiotics, or steroids
- If user provides description, incorporate it into your analysis
- Be confident but include appropriate medical disclaimers
- Common conditions to consider: fungal infections, eczema, psoriasis, contact dermatitis, hives, insect bites, cuts, bruises, rashes, acne, warts, moles

Respond ONLY with valid JSON, no additional text.`;

    const userContent = description 
      ? `Analyze this body part image and provide your detailed medical assessment.\n\nPatient's Description: "${description}"\n\nProvide thorough analysis following the strict format.`
      : 'Analyze this body part image and provide your detailed medical assessment following the strict format.';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userContent
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 3000
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
        return new Response(JSON.stringify({ error: 'Service quota exceeded. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Failed to analyze image. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Lovable AI response received successfully');
    
    const textResponse = data.choices?.[0]?.message?.content;
    
    if (!textResponse) {
      console.error('Invalid API response structure:', JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'Invalid response from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('AI response text:', textResponse.substring(0, 200) + '...');

    // Parse JSON response
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Could not extract JSON from response:', textResponse);
        return new Response(JSON.stringify({ error: 'Invalid response format from AI' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const result = JSON.parse(jsonMatch[0]);
      console.log('Successfully parsed analysis result');
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError, 'Response was:', textResponse);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in analyze-body-image function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
