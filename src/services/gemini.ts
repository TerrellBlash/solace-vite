import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client only if API key exists
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCompanionResponse = async (history: { role: string; text: string }[], newMessage: string, useThinking = false) => {
  if (!ai) {
    return {
      async *[Symbol.asyncIterator]() {
        yield { text: () => "I'm here to listen. The AI companion will be fully available soon. For now, know that you're not alone. 💛" };
      }
    };
  }
  try {
    const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';
    
    const systemInstruction = `You are a compassionate, gentle, and supportive grief companion. 
    Your goal is to listen, validate feelings, and offer gentle comfort. 
    Keep responses warm, human, and concise (under 3 sentences unless asked for more).
    Never offer medical advice. Use a soothing tone. 
    Address the user with care.`;

    const config: any = { systemInstruction };
    if (useThinking) config.thinkingConfig = { thinkingBudget: 32768 };

    const chat = ai.chats.create({
      model,
      config,
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    return await chat.sendMessageStream({ message: newMessage });
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
};

export const editPhoto = async (imageBase64: string, prompt: string) => {
  if (!ai) return null;
  try {
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/jpeg';
    const data = matches ? matches[2] : imageBase64;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { mimeType, data } }, { text: prompt }] }
    });
    const candidates = response.candidates;
    if (candidates?.[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, aspectRatio: string = '1:1') => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (e) {
    console.error("Image Gen Error", e);
    throw e;
  }
};

export const generateVideoFromImage = async (imageBase64: string, prompt: string = "Animate this image gently and naturally") => {
  if (!ai) return null;
  try {
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/png';
    const data = matches ? matches[2] : imageBase64;
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: { imageBytes: data, mimeType },
      config: { numberOfVideos: 1, aspectRatio: '9:16', resolution: '720p' }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
      return URL.createObjectURL(await videoRes.blob());
    }
    return null;
  } catch (e) {
    console.error("Veo Error", e);
    throw e;
  }
};

export const transcribeAudio = async (audioBase64: string) => {
  if (!ai) return null;
  try {
    const base64Data = audioBase64.split(',')[1] || audioBase64;
    let mimeType = 'audio/webm';
    if (audioBase64.includes('audio/mp4')) mimeType = 'audio/mp4';
    if (audioBase64.includes('audio/wav')) mimeType = 'audio/wav';
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ inlineData: { mimeType, data: base64Data } }, { text: "Transcribe the spoken audio exactly." }] }
    });
    return result.response.text;
  } catch (e) {
    console.error("Transcription error", e);
    return null;
  }
};

export const generateSpeech = async (text: string) => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: { parts: [{ text }] },
      config: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
    });
    const candidates = response.candidates;
    if (candidates?.[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("TTS error", e);
    return null;
  }
};
