import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerRoadmap } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    plan: { type: Type.STRING, enum: ["Basic", "Pro", "Premium"] },
    summary: { type: Type.STRING },
    skillGapAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          projects: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeEstimate: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["pending", "in-progress", "completed"] }
        },
        required: ["title", "description", "skills", "tasks", "projects", "timeEstimate", "status"]
      }
    },
    actionPlan: {
      type: Type.OBJECT,
      properties: {
        daily: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              task: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              timeRequired: { type: Type.STRING },
              outcome: { type: Type.STRING },
              completed: { type: Type.BOOLEAN }
            },
            required: ["id", "task", "difficulty", "timeRequired", "outcome", "completed"]
          }
        },
        weekly: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              task: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              timeRequired: { type: Type.STRING },
              outcome: { type: Type.STRING },
              completed: { type: Type.BOOLEAN }
            },
            required: ["id", "task", "difficulty", "timeRequired", "outcome", "completed"]
          }
        },
        monthly: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              task: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              timeRequired: { type: Type.STRING },
              outcome: { type: Type.STRING },
              completed: { type: Type.BOOLEAN }
            },
            required: ["id", "task", "difficulty", "timeRequired", "outcome", "completed"]
          }
        }
      },
      required: ["daily", "weekly", "monthly"]
    },
    resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          link: { type: Type.STRING },
          type: { type: Type.STRING }
        },
        required: ["title", "link", "type"]
      }
    },
    realityCheck: { type: Type.STRING },
    nextStep: { type: Type.STRING },
    projects: { type: Type.ARRAY, items: { type: Type.STRING } },
    resumeGuidance: { type: Type.STRING },
    portfolioStrategy: { type: Type.STRING },
    networkingStrategy: { type: Type.STRING },
    interviewPrep: {
      type: Type.OBJECT,
      properties: {
        questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        strategy: { type: Type.STRING }
      }
    },
    personalBranding: { type: Type.STRING },
    incomeRoadmap: { type: Type.STRING },
    accountabilityPrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["plan", "summary", "skillGapAnalysis", "strengths", "phases", "actionPlan", "resources", "realityCheck", "nextStep"]
};

export async function generateCareerRoadmap(profile: UserProfile): Promise<CareerRoadmap> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
  }

  const prompt = `
    You are an expert Career Strategist and AI Career Coach.
    Generate a highly personalized career roadmap for a user on the ${profile.plan.toUpperCase()} plan.

    User Profile:
    - Career Goal: ${profile.careerGoal}
    - Current Level: ${profile.level}
    - Existing Skills: ${profile.currentSkills}
    - Education: ${profile.education}
    - Daily Availability: ${profile.hoursPerDay} hours/day
    - Timeline: ${profile.timeline}
    - Constraints: ${profile.constraints}

    STRICT PLAN-BASED RULES:
    1. BASIC: 3-4 phases, simple roadmap, basic action steps. No deep personalization.
    2. PRO: 5 phases, skill gap analysis, weekly/monthly planning, 2-3 project ideas, resume/portfolio guidance, 7-day action plan.
    3. PREMIUM: 5 phases, deep personalization, salary/market strategy, industry insights, networking, interview prep (mock questions), 30-60-90 day plan, personal branding, income roadmap, accountability prompts, 24-hour action plan.

    Provide the output in JSON format matching the structure of the CareerRoadmap interface.
    Ensure all required fields in the schema are populated.
    For the plan field, use exactly one of: "Basic", "Pro", "Premium".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    // Clean potential markdown formatting if any (though responseMimeType should handle it)
    const cleanJson = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}

export async function chatWithCoach(
  message: string,
  history: { role: 'user' | 'model', text: string }[],
  profile: UserProfile,
  currentRoadmap: CareerRoadmap
): Promise<{ message: string, updatedRoadmap?: Partial<CareerRoadmap> }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = `
    You are the user's AI Career Coach. 
    The user is on the ${profile.plan.toUpperCase()} plan.
    
    Current Career Goal: ${profile.careerGoal}
    Current Roadmap Summary: ${currentRoadmap.summary}
    
    User Message: ${message}
    
    Instructions:
    1. Provide personalized feedback and answer follow-up questions.
    2. If the user mentions new constraints, progress, or changes in their situation, you can dynamically adjust their roadmap.
    3. If you adjust the roadmap, include the updated fields in the 'updatedRoadmap' property of the JSON response.
    4. Keep the tone professional, encouraging, and strategic.
    
    Response Format: JSON
    {
      "message": "Your text response to the user",
      "updatedRoadmap": { ... any fields from the CareerRoadmap interface that need updating ... }
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
          updatedRoadmap: roadmapSchema
        },
        required: ["message"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI returned an empty response.");
  }

  const cleanJson = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleanJson);
}
