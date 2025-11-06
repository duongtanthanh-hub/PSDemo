import React, { useState } from 'react';
import { generateFamilyPhoto } from '../services/geminiService.js';
import { PS_LOGO_BASE64 } from '../constants.js';
import ImageUploader from './ImageUploader.jsx';
import Loader from './Loader.jsx';
import { UploadedFile } from '../types.js';

/**
 * Adds a P/S logo watermark to a base64 encoded image.
 * This function uses the Canvas API to draw the main image and then overlay the logo
 * in the bottom-right corner.
 * @param base64Image The base64 string of the source image (without the data URI prefix).
 * @returns A Promise that resolves to the base64 string of the watermarked image (as a PNG).
 *          Returns the original image if any part of the process fails.
 */
const addWatermark = (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
        const mainImage = new Image();
        mainImage.src = `data:image/png;base64,${base64Image}`;
        mainImage.onload = () => {
            const logoImage = new Image();
            logoImage.src = PS_LOGO_BASE64;
            logoImage.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = mainImage.width;
                canvas.height = mainImage.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(base64Image); // fallback if context is not available
                    return;
                }

                ctx.drawImage(mainImage, 0, 0);

                const logoWidth = mainImage.width * 0.15;
                const logoHeight = logoImage.height * (logoWidth / logoImage.width);
                const margin = mainImage.width * 0.02;
                const x = mainImage.width - logoWidth - margin;
                const y = mainImage.height - logoHeight - margin;

                ctx.globalAlpha = 0.8;
                ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
                ctx.globalAlpha = 1.0;

                const watermarkedBase64 = canvas.toDataURL('image/png').split(',')[1];
                resolve(watermarkedBase64);
            };
            logoImage.onerror = () => resolve(base64Image); // fallback if logo fails to load
        };
        mainImage.onerror = () => resolve(base64Image); // fallback if main image fails to load
    });
};

interface Step1Props {
    onPhotoGenerated: (base64Image: string, mimeType: string, numFiles: number) => void;
}

const Step1: React.FC<Step1Props> = ({ onPhotoGenerated }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = async () => {
        if (files.length === 0) {
            setError('Please upload at least one image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const uploadedFiles = files.map(f => f.file);
            const resultBase64 = await generateFamilyPhoto(uploadedFiles);
            const watermarkedImage = await addWatermark(resultBase64);
            const mimeType = files[0]?.file.type || 'image/png';
            onPhotoGenerated(watermarkedImage, mimeType, uploadedFiles.length);
        } catch (e: any) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image generation.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#002B5B]">Step 1: Create Your Tet Family Photo</h2>
                <p className="mt-2 text-gray-600">Upload individual photos of your family members (up to 5). Our AI will bring them together in one festive picture!</p>
            </div>

            {isLoading ? (
                <Loader message="Crafting your family portrait..." />
            ) : (
                <>
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}
                    <ImageUploader files={files} onFilesChange={setFiles} />
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleGenerateClick}
                            disabled={files.length === 0}
                            className="px-8 py-3 bg-[#002B5B] text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            Generate Photo
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Step1;