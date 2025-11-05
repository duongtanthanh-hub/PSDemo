import React, { useState } from 'react';
import { UploadedFile } from '../types';

interface ImageUploaderProps {
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
}

const MAX_FILES = 5;

const ImageUploader: React.FC<ImageUploaderProps> = ({ files, onFilesChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const isDisabled = files.length >= MAX_FILES;

    const handleFileChange = (newFiles: FileList) => {
        if (isDisabled) return;

        const filesToProcess = Array.from(newFiles).slice(0, MAX_FILES - files.length);

        const fileArray = filesToProcess
            .filter(file => file.type.startsWith('image/'))
            .map(file => ({
                id: `${file.name}-${file.lastModified}`,
                file,
                preview: URL.createObjectURL(file),
            }));
        onFilesChange([...files, ...fileArray]);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDisabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (!isDisabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
        }
    };

    const removeFile = (id: string) => {
        const newFiles = files.filter(f => f.id !== id);
        onFilesChange(newFiles);
    };

    return (
        <div className="w-full">
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-4 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            >
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files)}
                    disabled={isDisabled}
                />
                <label htmlFor="file-upload" className={isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <div className="flex flex-col items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <p className={`mt-2 text-sm ${isDisabled ? 'text-gray-500' : 'text-gray-600'}`}>
                            <span className={`font-semibold ${isDisabled ? 'text-gray-500' : 'text-red-600'}`}>
                                {isDisabled ? `Maximum ${MAX_FILES} files reached` : 'Click to upload'}
                            </span>
                            {!isDisabled && ' or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">Up to {MAX_FILES} images (PNG, JPG, etc.)</p>
                    </div>
                </label>
            </div>
            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map(uploadedFile => (
                        <div key={uploadedFile.id} className="relative group">
                            <img src={uploadedFile.preview} alt="preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
                            <button
                                onClick={() => removeFile(uploadedFile.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;