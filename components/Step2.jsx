import React, { useState, useEffect, useRef } from 'react';
import { generateFamilyVideo } from '../services/geminiService.js';
import { VIDEO_LOADING_MESSAGES } from '../constants.js';
import Loader from './Loader.jsx';

interface Step2Props {
    generatedImage: string;
    imageMimeType: string;
    onStartOver: () => void;
    numFamilyMembers: number;
}

const Step2: React.FC<Step2Props> = ({ generatedImage, imageMimeType, onStartOver, numFamilyMembers }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const messageIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading && !videoUrl) {
            messageIntervalRef.current = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = VIDEO_LOADING_MESSAGES.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % VIDEO_LOADING_MESSAGES.length;
                    return VIDEO_LOADING_MESSAGES[nextIndex];
                });
            }, 4000);
        } else {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        }
        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [isLoading, videoUrl]);

    const handleGenerateVideo = async () => {
        setIsLoading(true);
        setError(null);
        setLoadingMessage('Initializing video creation...');

        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await window.aistudio.openSelectKey();
                // Assume success and proceed. The service will use the new key.
            }

            const videoGenerator = generateFamilyVideo(generatedImage, imageMimeType, numFamilyMembers);
            for await (const update of videoGenerator) {
                if (typeof update === 'string') {
                    setLoadingMessage(update);
                } else if (typeof update === 'object' && update.videoUri) {
                    setLoadingMessage('Fetching your video...');
                    const fullUri = `${update.videoUri}&key=${process.env.API_KEY}`;
                    const videoResponse = await fetch(fullUri);
                    if (!videoResponse.ok) {
                        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
                    }
                    const videoBlob = await videoResponse.blob();
                    const videoObjectUrl = URL.createObjectURL(videoBlob);
                    setVideoUrl(videoObjectUrl);
                    setIsLoading(false);
                    break;
                }
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during video generation.';
            
            if (errorMessage.includes("API key selection error")) {
                setError("There was an issue with your API key. Please try generating the video again to re-select your key.");
            } else if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
                setError('You have exceeded your API quota. Please check your plan and billing details.');
            } else if (errorMessage.includes('API key not valid')) {
                setError('The API key is invalid. Please try generating the video again to re-select your key.');
            } else {
                setError(errorMessage);
            }
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#002B5B]">Step 2: Animate Your Family Photo</h2>
                <p className="mt-2 text-gray-600">Let's bring your family portrait to life with subtle motion and festive sounds!</p>
            </div>

            <p className="text-center text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                Video generation uses the Veo model, which is a paid feature. Please ensure you have selected an API key with billing enabled.
                For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">billing documentation</a>.
            </p>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}

            <div className="flex flex-col items-center">
                {isLoading ? (
                    <Loader message={loadingMessage} />
                ) : videoUrl ? (
                    <div className="w-full">
                        <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg shadow-lg" />
                    </div>
                ) : (
                    <img src={`data:${imageMimeType};base64,${generatedImage}`} alt="Generated family portrait" className="rounded-lg shadow-lg max-w-full max-h-[50vh]" />
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                     {!isLoading && !videoUrl && (
                        <button
                            onClick={handleGenerateVideo}
                            className="px-8 py-3 bg-[#002B5B] text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
                        >
                            Generate 8s Video
                        </button>
                    )}
                    <button
                        onClick={onStartOver}
                        className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-300 transition-colors"
                    >
                        {videoUrl ? 'Create Another' : 'Start Over'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2;