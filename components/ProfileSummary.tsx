import React from 'react';
import { FarmerProfile } from '../types';
import { ProfileIcon } from './icons/UiIcons';
import { translations } from '../translations';

interface ProfileSummaryProps {
  profile: FarmerProfile;
  language: 'en-IN' | 'hi-IN';
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile, language }) => {
  const t = translations[language];
  
  const summaryItems = [
    { label: t.state, value: profile.state },
    { label: t.district, value: profile.district },
    { label: t.landHolding, value: `${profile.landHolding} ${t.acres}` },
    { label: t.primaryCrop, value: profile.cropType },
    { label: t.category, value: profile.socialCategory },
  ];
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="p-6 bg-gray-900/50 border-b border-gray-700 relative">
        <div 
          className="absolute inset-0 bg-repeat opacity-[0.02]" 
          style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}}>
        </div>
        <div className="flex items-center space-x-4 relative">
          <div className="bg-green-900/50 p-3 rounded-full border border-green-500/30">
              <ProfileIcon />
          </div>
          <div>
              <h3 className="text-xl font-bold text-gray-100">{profile.name}</h3>
              <p className="text-sm text-gray-400">{t.farmerProfile}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ul className="space-y-1">
          {summaryItems.map((item, index) => (
              <li key={item.label} className={`flex justify-between items-center text-sm p-3 rounded-md ${index % 2 === 0 ? 'bg-gray-700/50' : 'bg-gray-800'}`}>
                  <span className="text-gray-400">{item.label}</span>
                  <span className="font-semibold text-gray-200 text-right">{item.value}</span>
              </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileSummary;