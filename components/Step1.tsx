import React, { useState } from 'react';
import { UploadedFile } from '../types.ts';
import { generateFamilyPhoto } from '../services/geminiService.ts';
import ImageUploader from './ImageUploader.tsx';
import Loader from './Loader.tsx';

interface Step1Props {
    onPhotoGenerated: (base64Image: string, mimeType: string, numFiles: number) => void;
}

const Step1: React.FC<Step1Props> = ({ onPhotoGenerated }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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
            const mimeType = files[0]?.file.type || 'image/png';
            onPhotoGenerated(resultBase64, mimeType, uploadedFiles.length);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during image generation.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-red-100">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-red-800">Step 1: Create Your Tet Family Photo</h2>
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
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
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