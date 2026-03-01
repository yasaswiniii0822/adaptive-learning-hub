import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert Indian education AI tutor. Given a student profile, generate personalized course recommendations.

IMPORTANT: You must respond with ONLY a valid JSON array of course recommendation objects. No markdown, no explanation, no code fences.

Each object must have exactly these fields:
- "id": unique string (e.g. "rec-0-1")
- "title": course title string
- "description": 2-3 sentence description
- "difficulty": one of "beginner", "intermediate", "advanced"
- "estimatedWeeks": number (2-12)
- "resourceType": one of "video", "article", "quiz", "interactive", "course"
- "subject": the subject name string
- "links": array of 1-2 relevant resource URLs (use real educational sites like ncert.nic.in, khanacademy.org)
- "priority": one of "high", "medium", "low"
- "progress": 0
- "status": "not_started"
- "weeklyPlan": array of strings like "Week 1: ..."

Rules for recommendations:
- Generate 1-2 recommendations per subject the student selected
- If quiz score < 40: focus on fundamentals, use "beginner" difficulty, "high" priority
- If quiz score 40-70: balanced approach, "intermediate" difficulty, "medium" priority  
- If quiz score > 70: advanced content, "advanced" difficulty, "low" priority
- If goals include "jee_neet" and subject is Physics/Chemistry/Mathematics, add an extra advanced problem-solving course
- Match resourceType to the student's learningStyle (video→video, text→article, interactive→interactive)
- Adjust estimatedWeeks based on pace (slow: 8-12, normal: 5-8, fast: 2-5)
- Include the student's board (CBSE/ICSE/State) and class in course titles
- weeklyPlan should have one entry per week`;

    const userPrompt = `Student Profile:
- Name: ${profile.name}
- Class: ${profile.class}
- Board: ${profile.board}
- Subjects: ${profile.subjects?.join(", ")}
- Goals: ${profile.goals?.join(", ")}
- Learning Style: ${profile.learningStyle}
- Pace: ${profile.pace}
- Hours per Week: ${profile.hoursPerWeek}
- Quiz Score: ${profile.quizScore ?? 50}%

Generate personalized course recommendations for this student.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to generate recommendations" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the AI response - strip markdown fences if present
    let recommendations;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      recommendations = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse recommendations", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
