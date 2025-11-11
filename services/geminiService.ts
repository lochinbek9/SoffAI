import { GoogleGenAI, Modality } from "@google/genai";
import { Section, UploadedFile, FilterOptions } from '../types';

if (!process.env.API_KEY) {
    // This is a fallback; the key should be provided by the environment.
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

// Function to get a fresh AI instance, crucial for Veo's key selection mechanism
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (section: Section): string => {
    switch (section) {
        case Section.Presentation: return "You are an expert in creating engaging and structured presentation outlines. Generate content suitable for slides, with clear headings and bullet points.";
        case Section.Research: return "You are a research assistant. Generate well-structured, academic content for a research paper, including an introduction, methodology, findings, and conclusion. Use a formal tone.";
        case Section.Thesis: return "You are an academic advisor helping to write a thesis. Generate a detailed, in-depth analysis on the given topic, with a strong theoretical framework and clear arguments.";
        case Section.Article: return "You are a professional writer and editor. Generate a well-written, engaging article on the topic provided. The tone should be accessible to a general audience.";
        case Section.Independent: return "You are a knowledgeable tutor. Generate a comprehensive overview for an independent study paper on the given topic, covering key concepts, historical context, and important figures or events.";
        case Section.Search: return "You are a helpful AI assistant that provides accurate and up-to-date information based on Google Search results.";
        default: return "You are a helpful AI assistant.";
    }
};

const fileToGenerativePart = (file: UploadedFile) => ({
    inlineData: { data: file.data.split(',')[1], mimeType: file.type },
});

const createPromptWithFilters = (prompt: string, section: Section, filters: FilterOptions): string => {
    let instruction = `Topic: "${prompt}". Please generate content for a "${section}".`;
    const filterDetails = Object.entries(filters)
        .map(([key, value]) => {
            if (!value) return null;
            if (key === 'slides') return `It should have approximately ${value} slides.`;
            if (key === 'tone') return `The tone should be ${value}.`;
            if (key === 'length') return `The length should be ${value}.`;
            return null;
        })
        .filter(Boolean);

    if (filterDetails.length > 0) {
        instruction += " " + filterDetails.join(" ");
    }
    return instruction;
};

const generateTextOrSearch = async (prompt: string, section: Section, files: UploadedFile[], filters: FilterOptions) => {
    const ai = getAI();
    const fullPrompt = createPromptWithFilters(prompt, section, filters);
    const contents = files.length > 0
        ? { parts: [{ text: fullPrompt }, ...files.map(fileToGenerativePart)] }
        : fullPrompt;

    const isSearch = section === Section.Search;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: getSystemInstruction(section),
            tools: isSearch ? [{ googleSearch: {} }] : undefined,
        }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return {
        type: isSearch ? 'text' : 'text',
        content: response.text,
        sources: sources || [],
    };
};

const generateTTS = async (prompt: string, filters: FilterOptions) => {
    if (!prompt) throw new Error("Nutq sintezi uchun matn kiritilmagan.");
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: (filters.voice as string) || 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio ma'lumotlarini olib bo'lmadi.");
    
    return { type: 'audio', content: base64Audio };
};

const generateVideo = async (prompt: string, files: UploadedFile[], filters: FilterOptions) => {
    const ai = getAI();
    const imagePart = files.length > 0 ? {
        imageBytes: files[0].data.split(',')[1],
        mimeType: files[0].type,
    } : undefined;

    const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: imagePart,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: (filters.aspectRatio as '16:9' | '9:16') || '16:9'
        }
    });

    return { type: 'video_operation', operation };
};

export const runGeneration = async (prompt: string, section: Section, files: UploadedFile[] = [], filters: FilterOptions = {}): Promise<any> => {
    try {
        switch (section) {
            case Section.TTS:
                return await generateTTS(prompt, filters);
            case Section.Video:
                return await generateVideo(prompt, files, filters);
            case Section.Search:
            case Section.Presentation:
            case Section.Research:
            case Section.Thesis:
            case Section.Article:
            case Section.Independent:
                return await generateTextOrSearch(prompt, section, files, filters);
            default:
                throw new Error("Noma'lum bo'lim tanlandi.");
        }
    } catch (error: any) {
        console.error(`Error in section "${section}":`, error);
        if (error.message.includes("API key not valid")) {
             throw new Error("API kaliti yaroqsiz. Iltimos, sozlamalarni tekshiring.");
        }
         if (error.message.includes("Requested entity was not found")) {
             throw new Error("Video yaratish uchun ruxsat topilmadi. Iltimos, boshqa API kalitini tanlang.");
        }
        throw new Error("Tarkib yaratishda kutilmagan xatolik yuz berdi.");
    }
};
