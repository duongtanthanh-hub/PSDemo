import React from 'react';

const Loader = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white/20 backdrop-blur-sm rounded-lg">
            <div className="w-16 h-16 border-4 border-t-4 border-[#002B5B] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-[#002B5B] text-center">{message}</p>
        </div>
    );
};

export default Loader;