import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    // We use a fallback trigger to warn if key is missing, avoiding startup crash as requested
    if (!key) {
      console.warn("GEMINI_API_KEY is missing! Using placeholder to prevent crash during start.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "PLACEHOLDER_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Chat & Assistant endpoint with conversation memory
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history, mode, commandMode, language, extraContext } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt" });
      return;
    }

    const ai = getAiClient();
    
    // Build a solid system prompt reflecting VIJETA AI's goals and modes
    const systemInstruction = `You are VIJETA AI – ₹1 CHANGE LIFE MASTER SYSTEM.

IDENTITY:
You are VIJETA AI. Your purpose is to help people by providing information, awareness, campaign support, educational guidance, social mission support, and communication support.
MISSION SUPPORT:
You strictly support the '₹1 Change Life' mission. This mission works to bring massive social development by encouraging citizens to voluntarily save/contribute just ₹1 daily to a transparent public fund.
Explain:
- '₹1 Change Life' mission purpose and massive local impact.
- Social awareness & community participation.
- Volunteer recruitment and guidance.
- Running awareness campaigns.
- Public benefit and social development ideas.

VOICE MODE EXPECTATIONS:
- Support voice input/responses.
- Respond politely and naturally, like a human advisor.
- Support English and Hindi languages, or mixed language (Hinglish/Latin script).

COMMAND MODES:
- SHORT MODE (Active when commandMode is 'short'): Provide concise, powerful answers under 3-4 sentences.
- DETAIL MODE (Active when commandMode is 'detail'): Provide highly structured, comprehensive answers with headers, step-by-step guidance, and bullet points.

CONTENT CREATOR SYSTEM:
Generate high-impact content customized for the requested media:
- YouTube Title, Description, and video Script.
- Instagram captures and tags.
- Facebook posts.
- WhatsApp message chains.
- Poster texts.
- Campaign slogans.
- Social media content & awareness texts.

FAQ SYSTEM domains:
Answer queries regarding:
- ₹1 Change Life mechanics (Transparency, Collection, Utilization).
- Running local awareness campaigns.
- Formulating public benefit concepts or social development ideas.
- Government public welfare programs & basic tax/budget awareness.
- Social educational guidance.

COMMUNICATION RULES:
- Speak politely.
- Explain clearly.
- Give highly practical, realistic answers.
- Avoid false information at all costs. Be balanced.
- Encourage education, self-help, and social responsibility.

CURRENT APPLICATION CONFIGURATION:
- Mode Active: ${mode ? mode.toUpperCase() : 'GENERAL'}
- Command Mode Limit: ${commandMode === 'short' ? 'SHORT ANSWER SYSTEM (concise, compact)' : 'DETAIL ANSWER SYSTEM (analytical, detailed)'}
- Output Language Preference: ${language ? language.toUpperCase() : 'MIXED/HINDI/ENGLISH'}
- Contextual Info: ${extraContext ? JSON.stringify(extraContext) : 'None'}`;

    // Format history for GoogleGenAI SDK format (contents parts)
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }
    
    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const isKeyPlaceholder = !process.env.GEMINI_API_KEY;
    if (isKeyPlaceholder) {
      // Mock response if no API key is set yet, so app is fully testable and doesn't break
      let mockReply = "";
      if (language === 'hindi') {
        mockReply = `[मॉक प्रतिक्रिया - कृपया सेटिंग्स में API कुंजी जोड़ें] स्वागत है! मैं विजेता एआई हूँ। ₹1 चेंज लाइफ मिशन हमारे समाज को मजबूत करने का एक बेहतरीन तरीका है। क्या आप एक नया जागरूकता अभियान शुरू करना चाहते हैं?`;
      } else {
        mockReply = `[Mock Response - Please add API Key in Secrets] Hello! This is VIJETA AI. The ₹1 Change Life mission is an incredible way to build community infrastructure and foster social responsibility. I am ready to help you plan posters, calculate social impact, or structure campaigns!`;
      }
      res.json({ text: mockReply });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in server.ts:", error);
    res.status(500).json({ error: error.message || "Internal server error occurred while invoking Gemini." });
  }
});

// 2. Custom Impact Analytics and Allocation Idea Helper (Returns a static layout template or dynamically acts)
app.post('/api/analytics', (req, res) => {
  const { population, days } = req.body;
  if (!population) {
    res.status(400).json({ error: "Missing population value" });
    return;
  }
  const count = Number(population) || 1000;
  const period = Number(days) || 30;
  
  const totalAmount = count * 1 * period;
  
  // Calculate default budget allocation ideas based on mission goals
  const allocation = {
    education: Math.round(totalAmount * 0.35),
    healthcare: Math.round(totalAmount * 0.30),
    communityWelfare: Math.round(totalAmount * 0.20),
    emergencyAid: Math.round(totalAmount * 0.15)
  };

  res.json({
    population: count,
    days: period,
    totalCollected: totalAmount,
    allocations: allocation,
    impactMetrics: {
      mealsProvided: Math.floor(totalAmount / 30),
      scholarshipsSupported: Math.floor(totalAmount / 2500),
      medicalCampsSupported: Math.floor(totalAmount / 15000),
      drinkingWaterWellsRecon: Math.floor(totalAmount / 50000)
    }
  });
});

// Dynamic Vite Asset Middleware serving React client details in development mode
let isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    console.log("Vite development server mode active");
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const serverListener = app.listen(PORT, "0.0.0.0", () => {
  console.log(`VIJETA AI Dev server running on http://localhost:${PORT}`);
});
