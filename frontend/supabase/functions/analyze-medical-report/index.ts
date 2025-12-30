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
    const { files } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Analyzing medical reports:', files.map((f: any) => ({ type: f.type, filename: f.filename })));

    // Build message content with images
    const messageContent: any[] = [
      {
        type: "text",
        text: `You are an expert medical AI that analyzes medical reports with extreme accuracy. Analyze the following medical report(s) thoroughly and provide a comprehensive assessment.

Your analysis MUST include ALL of these sections:

## 📋 Key Findings
List ALL important results from the report, especially any abnormal values. Be specific with numbers and ranges.

## 🔍 What These Results Mean
Explain the medical significance of each finding in simple, patient-friendly language. What does each value indicate about the patient's health?

## 💊 Medication Recommendations (OTC Only)
Suggest appropriate over-the-counter medications or supplements if applicable.
**DISCLAIMER**: These are general suggestions only. Always consult your doctor before taking any medication.

## 🏠 Care Instructions
Provide specific lifestyle, diet, and care recommendations based on the findings:
- Dietary changes
- Exercise recommendations
- Lifestyle modifications
- Follow-up testing suggestions

## ⚠️ When to See a Doctor
Clear guidance on warning signs that require immediate medical attention.

## 📊 Overall Assessment
Summarize the overall health status indicated by this report.

Be thorough, accurate, and specific to THIS report's actual contents. Do not give generic advice.`
      }
    ];

    // Add each file to the message
    for (const file of files) {
      if (file.type === "image") {
        // Add image directly for vision analysis
        messageContent.push({
          type: "image_url",
          image_url: {
            url: file.content // This is already a data URL (base64)
          }
        });
        messageContent.push({
          type: "text",
          text: `[Image file: ${file.filename}]`
        });
      } else if (file.type === "text") {
        messageContent.push({
          type: "text",
          text: `\n\n--- Content from ${file.filename} ---\n${file.content}`
        });
      } else if (file.type === "pdf") {
        // For PDFs, we inform the AI and include what we can
        messageContent.push({
          type: "text",
          text: `\n\n--- PDF file: ${file.filename} ---\n(PDF content - please analyze based on any visible text or structure)`
        });
      }
    }

    console.log('Sending request to Lovable AI Gateway with', messageContent.length, 'content items');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: messageContent
          }
        ],
        max_tokens: 4000
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
      
      return new Response(JSON.stringify({ error: 'AI service error. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;
    
    if (!textResponse) {
      console.error('Invalid API response:', data);
      return new Response(JSON.stringify({ error: 'Invalid AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Medical report analysis completed successfully');

    return new Response(JSON.stringify({ result: textResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-medical-report function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
