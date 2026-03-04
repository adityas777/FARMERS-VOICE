
import React from 'react';

export const MicIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export const StopCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
    </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75v-2.25a3.375 3.375 0 0 0-3.375-3.375h-3.75a3.375 3.375 0 0 0-3.375 3.375v2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 14.25v2.25a3.375 3.375 0 0 1-3.375 3.375h-3.75a3.375 3.375 0 0 1-3.375-3.375v-2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12.75h3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 14.25v-4.5a.75.75 0 0 1 .75-.75h.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25v-4.5a.75.75 0 0 0-.75-.75h-.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 9.75a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 9.75a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75Z" />
    </svg>
);
