import React from 'react';
import { PS_LOGO_BASE64 } from '../constants.ts';

const Header: React.FC = () => {
    return (
        <header className="py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="flex items-center space-x-2">
                    <img src={PS_LOGO_BASE64} alt="Logo" className="h-8 w-8" />
                    <h1 className="text-2xl font-bold text-[#002B5B]">P/S Tet Reunion Video Maker</h1>
                </div>
                <img 
                    src="https://assets.unileversolutions.com/v1/120341483.png" 
                    alt="Unilever Logo" 
                    className="h-8"
                />
            </div>
        </header>
    );
};

export default Header;
