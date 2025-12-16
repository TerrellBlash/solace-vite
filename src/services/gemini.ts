
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCompanionResponse = async (history: { role: string; text: string }[], newMessage: string, useThinking = false) => {
  try {
    // Feature: Fast AI responses (Flash Lite) OR Thinking (Pro)
    // using gemini-2.5-flash-lite for lowest latency as requested
    const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';
    
    const systemInstruction = `You are a compassionate, gentle, and supportive grief companion. 
    Your goal is to listen, validate feelings, and offer gentle comfort. 
    Keep responses warm, human, and concise (under 3 sentences unless asked for more).
    Never offer medical advice. Use a soothing tone. 
    Address the user with care.`;

    const config: any = {
      systemInstruction: systemInstruction,
    };

    // Feature: Think more when needed
    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const chat = ai.chats.create({
      model: model,
      config: config,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessageStream({
      message: newMessage
    });

    return result;

  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
};

export const editPhoto = async (imageBase64: string, prompt: string) => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/jpeg';
    const data = matches ? matches[2] : imageBase64;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt }
        ]
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

// Feature: Control image aspect ratios
export const generateImage = async (prompt: string, aspectRatio: string = '1:1') => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio as any,
                }
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Gen Error", e);
        throw e;
    }
}

// Feature: Animate images with Veo
export const generateVideoFromImage = async (imageBase64: string, prompt: string = "Animate this image gently and naturally") => {
    try {
        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches ? matches[1] : 'image/png';
        const data = matches ? matches[2] : imageBase64;

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: data,
                mimeType: mimeType
            },
            config: {
                numberOfVideos: 1,
                aspectRatio: '9:16', 
                resolution: '720p'
            }
        });
        
        // Polling
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
             const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
             const videoBlob = await videoRes.blob();
             return URL.createObjectURL(videoBlob);
        }
        return null;

    } catch (e) {
        console.error("Veo Error", e);
        throw e;
    }
}

// Feature: Transcribe audio
export const transcribeAudio = async (audioBase64: string) => {
  try {
    const model = 'gemini-2.5-flash';
    // Remove header if present to get raw base64
    const base64Data = audioBase64.split(',')[1] || audioBase64;
    
    // Determine mimeType from base64 header if possible, default to audio/wav or let Gemini handle it
    let mimeType = 'audio/webm';
    if (audioBase64.includes('audio/mp4')) mimeType = 'audio/mp4';
    if (audioBase64.includes('audio/wav')) mimeType = 'audio/wav';

    const result = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: "Transcribe the spoken audio exactly." }
        ]
      }
    });
    return result.response.text;
  } catch (e) {
    console.error("Transcription error", e);
    return null;
  }
}

// Feature: Generate speech (TTS)
export const generateSpeech = async (text: string) => {
  try {
    const model = 'gemini-2.5-flash-preview-tts';
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text }]
      },
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });
    
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (e) {
    console.error("TTS error", e);
    return null;
  }
}
