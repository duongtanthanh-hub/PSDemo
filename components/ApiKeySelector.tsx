
import React, { useState, useEffect } from 'react';

// FIX: Removed duplicate global declaration for window.aistudio to resolve TypeScript errors.
// The type is expected to be provided by the execution environment.

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    const [keyNeeded, setKeyNeeded] = useState(false);
    const [checkingKey, setCheckingKey] = useState(true);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                try {
                    const hasKey = await window.aistudio.hasSelectedApiKey();
                    if (!hasKey) {
                        setKeyNeeded(true);
                    } else {
                        onKeySelected();
                    }
                } catch (e) {
                    console.error("Error checking for API key:", e);
                    setKeyNeeded(true);
                }
            } else {
                 console.warn("AISTUDIO methods not available. Assuming key is present for local dev.");
                 onKeySelected();
            }
            setCheckingKey(false);
        };
        checkKey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions
            setKeyNeeded(false);
            onKeySelected();
        } else {
            alert("API Key selection is not available in this environment.");
        }
    };
    
    if (checkingKey) {
        return <p className="text-center text-gray-600">Checking API key status...</p>;
    }

    if (keyNeeded) {
        return (
            <div className="text-center p-6 border-2 border-yellow-400 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800">API Key Required for Video Generation</h3>
                <p className="mt-2 text-yellow-700">
                    The video generation feature (Veo) requires a Google AI API key. Please select a key to continue. Billing may apply. 
                    For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-bold">billing documentation</a>.
                </p>
                <button
                    onClick={handleSelectKey}
                    className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                >
                    Select API Key
                </button>
            </div>
        );
    }

    return null;
};

export default ApiKeySelector;