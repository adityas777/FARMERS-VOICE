import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6 6 0 006-6h-4.5m-4.5 0H6a6 6 0 006 6v-6M12 18.375a6 6 0 01-6-6v-6h12v6a6 6 0 01-6 6z" />
            </svg>
            <div>
                <h1 className="text-2xl font-bold text-gray-100">Niti-Setu</h1>
                <p className="text-sm text-gray-400">Agricultural Scheme Eligibility Engine</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;