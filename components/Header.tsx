
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-4 px-8 bg-red-800 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold">
                    P/S Tet Reunion Video Maker
                </h1>
                <img src="https://picsum.photos/100/40?random=1" alt="P/S Logo" className="h-8 md:h-10 rounded" />
            </div>
        </header>
    );
};

export default Header;
