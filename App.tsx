import React, { useState } from 'react';
import { AppStep } from './types';
import Header from './components/Header';
import Step1 from './components/Step1';
import Step2 from './components/Step2';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>(AppStep.CREATE_PHOTO);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string>('');
    const [numFamilyMembers, setNumFamilyMembers] = useState<number>(0);

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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-100 text-gray-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
                {step === AppStep.CREATE_PHOTO && <Step1 onPhotoGenerated={handlePhotoGenerated} />}
                {step === AppStep.CREATE_VIDEO && generatedImage && (
                    <Step2 
                        generatedImage={generatedImage} 
                        imageMimeType={imageMimeType} 
                        onStartOver={handleStartOver}
                        numFamilyMembers={numFamilyMembers} 
                    />
                )}
            </main>
        </div>
    );
};

export default App;