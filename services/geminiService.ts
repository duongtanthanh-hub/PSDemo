import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils.ts";
// FIX: Removed API_KEY import to use environment variables instead.
import { IMAGE_GENERATION_PROMPT, VIDEO_GENERATION_PROMPT } from '../constants.ts';

/**
 * Generates a single family photo by combining multiple individual photos using the Gemini AI model.
 * @param files An array of File objects, each being a photo of a family member.
 * @returns A Promise that resolves to a base64 encoded string of the generated PNG image.
 * @throws Will throw an error if the image generation fails or the API does not return an image.
 */
export const generateFamilyPhoto = async (files: File[]): Promise<string> => {
    // FIX: Initialized GoogleGenAI within the function to ensure the latest API key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const numFamilyMembers = files.length;
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

    const dynamicImagePrompt = `
- **Number of People:** You must generate exactly ${numFamilyMembers} individuals, corresponding to the number of reference photos provided.
${IMAGE_GENERATION_PROMPT}
`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                ...imageParts,
                { text: dynamicImagePrompt },
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

/**
 * A generator function that creates a short video by animating a source image using the Veo AI model.
 * It yields status updates as strings during the video generation process and finally yields the video URI.
 * @param base64Image The base64 encoded source image to animate.
 * @param imageMimeType The MIME type of the source image (e.g., 'image/png').
 * @param numFamilyMembers The exact number of people to be represented in the video, used for prompt accuracy.
 * @yields {string} A status message indicating the current stage of the video generation process.
 * @yields {{videoUri: string}} An object containing the final downloadable URI for the generated video.
 * @throws Will throw an error if the video generation fails, polling fails, or no video URI is returned.
 */
export async function* generateFamilyVideo(base64Image: string, imageMimeType: string, numFamilyMembers: number) {
    // FIX: Initialized GoogleGenAI within the function to ensure the latest API key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    yield 'Initializing video creation...';

    const dynamicVideoPrompt = `
Ensure there are exactly ${numFamilyMembers} people in the video, corresponding to the number of uploaded photos.
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