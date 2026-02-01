
import { GoogleGenAI, Modality } from "@google/genai";
import { Beat } from "../types";

/**
 * Check if the AI service is ready to be used.
 * Standardizes on the required process.env.API_KEY access.
 */
export const isAiLive = () => {
  const apiKey = process.env.API_KEY;
  return !!apiKey && apiKey !== "YOUR_ACTUAL_API_KEY_HERE" && apiKey.length > 10;
};

/**
 * Uses Gemini to match user prompts with available beats in the catalog.
 */
export const matchBeatsWithAI = async (userPrompt: string, beats: Beat[]) => {
  if (!isAiLive()) {
    // Fallback logic for demo mode
    await new Promise(resolve => setTimeout(resolve, 800));
    const prompt = userPrompt.toLowerCase();
    const suggested = beats.filter(b => 
      prompt.includes(b.genre.toLowerCase()) || 
      b.mood.some(m => prompt.includes(m.toLowerCase())) ||
      prompt.includes(b.title.toLowerCase())
    ).slice(0, 3);

    const ids = suggested.map(s => s.id);
    return `[GTL CORE] AI is in Demo Mode. Based on your vibe: "${userPrompt}", I've found these matches. \n\nIDs: [${ids.join(', ')}]`;
  }

  // Mandatory: Use process.env.API_KEY directly in the constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const beatContext = beats.map(b => `${b.id}: ${b.title} (${b.genre}, ${b.mood.join(', ')}, ${b.bpm} BPM) - ${b.description}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User request: "${userPrompt}". Beats: ${beatContext}. Recommend up to 3. End with IDs: [ID1, ID2].`,
      config: {
        temperature: 0.7,
        systemInstruction: "You are the head A&R for GTL Records. All beats are by BYTEBEATZ44."
      }
    });
    return response.text;
  } catch (err: any) {
    if (err.message?.includes('401')) throw new Error("AUTH_FAILED");
    throw err;
  }
};

/**
 * Generates lyric hooks and verses for a selected beat.
 */
export const generateLyricHooks = async (beatTitle: string, beatDescription: string) => {
  if (!isAiLive()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `(GTL DEMO BARS)\n\n[Hook]\nYeah, we moving through the city in the blacked out whip\nGTL Records, yeah we never gonna slip...`;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a hook and verse for a song called "${beatTitle}". ${beatDescription ? `Vibe: ${beatDescription}` : ''}`,
    config: { systemInstruction: "You are a songwriter for GTL Records." }
  });
  return response.text;
};

/**
 * Converts text lyrics into audio using Gemini TTS.
 */
export const speakLyrics = async (text: string, voice: string = 'Kore'): Promise<string> => {
  if (!isAiLive()) throw new Error("TTS_UNAVAILABLE_IN_DEMO");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Speak this lyrics: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice }
        }
      }
    },
  });
  
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
};
