import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";
import { IMAGE_GENERATION_PROMPT, VIDEO_GENERATION_PROMPT, API_KEY } from '../constants';

export const generateFamilyPhoto = async (files: File[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const imageParts = await Promise.all(
        files.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            };
        })
    );

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                ...imageParts,
                { text: IMAGE_GENERATION_PROMPT },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart?.inlineData) {
        return imagePart.inlineData.data;
    }

    throw new Error("Image generation failed or did not return an image.");
};

export async function* generateFamilyVideo(base64Image: string, imageMimeType: string, numFamilyMembers: number) {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    yield 'Initializing video creation...';

    const dynamicVideoPrompt = `
Ensure there are exactly ${numFamilyMembers} people in the video, corresponding to the number of uploaded photos.
The people in the video should closely resemble the people in the provided image.
${VIDEO_GENERATION_PROMPT}
`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: dynamicVideoPrompt,
        image: {
            imageBytes: base64Image,
            mimeType: imageMimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    yield 'Your video request is submitted. This may take a few minutes.';

    const pollingInterval = 10000; // 10 seconds

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
            yield 'Bringing your family photo to life...';
        } catch (e) {
            console.error("Polling error:", e);
            throw e;
        }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        yield { videoUri: downloadLink };
    } else {
        throw new Error('Video generation failed or returned no URI.');
    }
}