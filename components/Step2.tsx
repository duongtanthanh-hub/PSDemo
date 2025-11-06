import React, { useState, useEffect, useRef } from 'react';
import { generateFamilyVideo } from '../services/geminiService.ts';
// FIX: Removed API_KEY import to use environment variables instead.
import { VIDEO_LOADING_MESSAGES } from '../constants.ts';
import Loader from './Loader.tsx';

interface Step2Props {
    generatedImage: string;
    imageMimeType: string;
    onStartOver: () => void;
    numFamilyMembers: number;
}

const Step2: React.FC<Step2Props> = ({ generatedImage, imageMimeType, onStartOver, numFamilyMembers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
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
            const videoGenerator = generateFamilyVideo(generatedImage, imageMimeType, numFamilyMembers);
            for await (const update of videoGenerator) {
                if (typeof update === 'string') {
                    setLoadingMessage(update);
                } else if (typeof update === 'object' && update.videoUri) {
                    setLoadingMessage('Fetching your video...');
                    // FIX: Used environment variable for API key when fetching the video.
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
        } catch (e) {
            console.error(e);
            let errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during video generation.';
            if (typeof errorMessage === 'string' && (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota'))) {
                errorMessage = 'You have exceeded your API quota. Please check your plan and billing details. You may need to refresh the page to select a different API key.';
            } else if (typeof errorMessage === 'string' && errorMessage.includes('Requested entity was not found')) {
                errorMessage = 'The API key is invalid or not found. Please refresh the page to select a different API key.';
            }
            setError(errorMessage);
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#002B5B]">Step 2: Animate Your Family Photo</h2>
                <p className="mt-2 text-gray-600">Let's bring your family portrait to life with subtle motion and festive sounds!</p>
            </div>

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