import React, { useState } from 'react';
import { AppStep } from './types.ts';
import Header from './components/Header.tsx';
import Step1 from './components/Step1.tsx';
import Step2 from './components/Step2.tsx';
import ApiKeySelector from './components/ApiKeySelector.tsx';

const App: React.FC = () => {
    // Manages the current step of the application (1 for photo creation, 2 for video creation).
    const [step, setStep] = useState<AppStep>(AppStep.CREATE_PHOTO);
    // Stores the base64 string of the AI-generated family photo.
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    // Stores the MIME type of the generated image.
    const [imageMimeType, setImageMimeType] = useState<string>('');
    // Stores the number of family members from the uploaded files to ensure consistency.
    const [numFamilyMembers, setNumFamilyMembers] = useState<number>(0);
    // Tracks whether the user has successfully selected an API key.
    const [isKeySelected, setIsKeySelected] = useState(false);

    const handleKeySelected = () => {
        setIsKeySelected(true);
    };

    const handlePhotoGenerated = (base64Image: string, mimeType: string, numFiles: number) => {
        setGeneratedImage(base64Image);
        setImageMimeType(mimeType);
        setNumFamilyMembers(numFiles);
        setStep(AppStep.CREATE_VIDEO);
    };

    const handleStartOver = () => {
        setGeneratedImage(null);
        setImageMimeType('');
        setNumFamilyMembers(0);
        setStep(AppStep.CREATE_PHOTO);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 text-gray-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
                {!isKeySelected ? (
                    <div className="w-full max-w-2xl">
                         <ApiKeySelector onKeySelected={handleKeySelected} />
                    </div>
                ) : step === AppStep.CREATE_PHOTO ? (
                    <Step1 onPhotoGenerated={handlePhotoGenerated} />
                ) : (
                    generatedImage && (
                    <Step2 
                        generatedImage={generatedImage} 
                        imageMimeType={imageMimeType} 
                        onStartOver={handleStartOver}
                        numFamilyMembers={numFamilyMembers} 
                    />
                )
                )}
            </main>
        </div>
    );
};

export default App;