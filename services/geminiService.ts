
import { GoogleGenAI, FunctionDeclaration, Type, Modality } from "@google/genai";
import { MOCK_USER_PROFILE } from "../constants";

// Get API key from environment variable
// Vite exposes env vars via process.env (defined in vite.config.ts)
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || ''; 

// Validate API key
if (!apiKey || apiKey === 'your_api_key_here' || apiKey.trim() === '') {
  console.warn('⚠️ GEMINI_API_KEY is not set. Please add your API key to .env.local file.');
  console.warn('   Get your API key from Google AI Platform.');
} else {
  console.log('✅ Gemini API Key loaded:', apiKey.substring(0, 20) + '...');
}

const ai = new GoogleGenAI({ apiKey });

// --- 1. Define Tools (PADU Database) ---

const checkPaduTool: FunctionDeclaration = {
  name: 'checkPaduDatabase',
  description: 'Access the PADU (Pangkalan Data Utama) government database to retrieve the current subsidy eligibility status.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      icNumber: {
        type: Type.STRING,
        description: 'The IC number of the citizen.'
      }
    },
  },
};

// Mock Function Implementation
const checkPaduDatabase = (icNumber?: string) => {
  console.log("🔒 Accessing PADU Database Secure Gateway...");
  // In a real app, this would be an API call. We return the mock profile.
  return {
    status: "success",
    verified: true,
    data: MOCK_USER_PROFILE,
    lastUpdated: new Date().toISOString().split('T')[0],
    message: "Data successfully retrieved from PADU."
  };
};

// --- 2. Text-to-Speech Helper ---

async function generateSpeech(text: string): Promise<string | null> {
  if (!text) return null;
  try {
    // Using gemini-2.5-flash-preview-tts for speech generation
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a clear, female voice
            },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.warn("TTS Generation Failed:", error);
    return null; // Fail gracefully without audio
  }
}

// --- 3. Main Chat Logic ---

export const generateChatResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    // Log API key status for debugging
    console.log('🔍 API Key check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      apiKeyPrefix: apiKey?.substring(0, 10) + '...'
    });
    
    // 1. Text & Reasoning Model
    const model = 'gemini-2.5-flash';
    
    // Updated instruction with DIRECT CONTEXT INJECTION
    const systemInstruction = `
      You are 'Marina', the AI Companion for the MyMadani app.

      USER CONTEXT (ALREADY VERIFIED):
      - Name: ${MOCK_USER_PROFILE.name}
      - IC Number: ${MOCK_USER_PROFILE.icNumber}
      - Household Income: RM ${MOCK_USER_PROFILE.householdIncome}
      - Children: ${MOCK_USER_PROFILE.childrenCount}
      - Address: ${MOCK_USER_PROFILE.address}
      
      CRITICAL RULES:
      1. YOU ALREADY KNOW THE USER'S DETAILS. NEVER ask for IC Name, Income, or Salary.
      2. If the user asks about eligibility, assume you have checked the system using the data above.
      3. Speak in a friendly Malaysian English (Manglish) style. Use "lah", "kan", "don't worry".
      4. Keep responses short (max 2-3 sentences) so they are easy to listen to.
      5. If the user asks to "pay" or "open QR" or "scan", confirm you are opening it.
      
      TOOLS:
      - Use 'checkPaduDatabase' only if you need to "refresh" the status, but rely on the context above first.
      - Use Google Maps for location queries.
    `;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        tools: [
          { functionDeclarations: [checkPaduTool] }, 
          { googleMaps: {} }
        ],
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    let result = await chat.sendMessage({ message: prompt });
    
    // --- Handle Function Calls (PADU) ---
    const functionCalls = result.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
       const parts = [];
       // Loop through calls (though usually just one)
       for (const call of functionCalls) {
          if (call.name === 'checkPaduDatabase') {
             // Execute mock function
             const paduData = checkPaduDatabase(call.args.icNumber as string || MOCK_USER_PROFILE.icNumber);
             
             parts.push({
                functionResponse: {
                    id: call.id, // Required for proper correlation
                    name: call.name,
                    response: { result: paduData }
                }
             });
          }
       }

       // Send function responses back to the model as a new message
       if (parts.length > 0) {
         result = await chat.sendMessage({ message: parts });
       }
    }

    const text = result.text ?? "";
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;

    // --- Determine Related Program & Action ---
    let relatedProgramId: string | undefined = undefined;
    let action: 'view' | 'payment' = 'view';

    const lowerText = text.toLowerCase();
    
    // Heuristic detection of program context for UI linking
    
    if (lowerText.includes('str') || lowerText.includes('tunai') || lowerText.includes('cash')) {
      relatedProgramId = 'str';
    } else if (lowerText.includes('sara') || lowerText.includes('asas') || lowerText.includes('groceries') || lowerText.includes('makanan')) {
      relatedProgramId = 'sara';
    } else if (lowerText.includes('budi') || lowerText.includes('petrol') || lowerText.includes('diesel') || lowerText.includes('fuel')) {
      relatedProgramId = 'budi95';
    }

    // Heuristic for Action (QR / Payment)
    if (lowerText.includes('qr') || lowerText.includes('code') || lowerText.includes('pay') || lowerText.includes('scan') || lowerText.includes('bayar')) {
        action = 'payment';
    }

    // Fallback: If no program detected but action is payment, default to STR (most common) or check prompt
    if (!relatedProgramId && action === 'payment') {
         if (prompt.toLowerCase().includes('sara') || prompt.toLowerCase().includes('groceries')) relatedProgramId = 'sara';
         else if (prompt.toLowerCase().includes('petrol') || prompt.toLowerCase().includes('budi') || prompt.toLowerCase().includes('fuel')) relatedProgramId = 'budi95';
         else relatedProgramId = 'str'; // Default to STR wallet
    }

    // --- Generate Audio for the final text ---
    const audioData = await generateSpeech(text);

    return {
      text: text,
      groundingMetadata: groundingMetadata,
      audioData: audioData, // Base64 raw PCM
      relatedProgramId: relatedProgramId,
      action: action
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    console.error("Error details:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      apiKeyPresent: !!apiKey,
      apiKeyLength: apiKey?.length
    });
    
    // Check for API key errors
    if (!apiKey || apiKey === 'your_api_key_here' || apiKey.trim() === '') {
      console.error("❌ API Key is missing!");
      return {
        text: "Sorry, API key belum setup lagi. Please add your GEMINI_API_KEY to .env.local file.",
        groundingMetadata: null,
        audioData: null,
        relatedProgramId: undefined,
        action: 'view' as 'view' | 'payment'
      };
    }
    
    // Check for authentication errors
    if (error?.message?.includes('API_KEY') || error?.status === 401 || error?.status === 403) {
      console.error("❌ API Key authentication failed!");
      return {
        text: "API key invalid atau expired. Please check your GEMINI_API_KEY in .env.local file.",
        groundingMetadata: null,
        audioData: null,
        relatedProgramId: undefined,
        action: 'view' as 'view' | 'payment'
      };
    }
    
    // Check for quota/rate limit errors (429)
    if (error?.status === 429 || error?.error?.code === 429 || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.error("❌ API Quota exceeded!");
      const retryDelay = error?.error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'))?.retryDelay || 'a few minutes';
      return {
        text: `Sorry lah, API quota sudah habis untuk hari ni. Free tier limit is 20 requests per day. Please try again tomorrow or upgrade your API plan. Wait time: ${retryDelay}`,
        groundingMetadata: null,
        audioData: null,
        relatedProgramId: undefined,
        action: 'view' as 'view' | 'payment'
      };
    }
    
    // Check for network/CORS errors
    if (error?.message?.includes('fetch') || error?.message?.includes('network') || error?.message?.includes('CORS')) {
      console.error("❌ Network/CORS error!");
      return {
        text: "Network error. Please check your internet connection and try again.",
        groundingMetadata: null,
        audioData: null,
        relatedProgramId: undefined,
        action: 'view' as 'view' | 'payment'
      };
    }
    
    // Generic error with more details (but hide technical details from user)
    const errorMessage = error?.error?.message || error?.message || 'Unknown error';
    return {
      text: `Alamak, ada error. ${errorMessage.includes('quota') ? 'API quota exceeded. Please try again later.' : 'Try again sekejap lagi okay?'}`,
      groundingMetadata: null,
      audioData: null,
      relatedProgramId: undefined,
      action: 'view' as 'view' | 'payment'
    };
  }
};
