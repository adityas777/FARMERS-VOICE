import React, { useState } from 'react';
import { FarmerProfile, EligibilityResult } from './types';
import Header from './components/Header';
import ProfileInput from './components/ProfileInput';
import Dashboard from './components/Dashboard';

type View = 'profileInput' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('profileInput');
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [eligibilityResults, setEligibilityResults] = useState<EligibilityResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleProfileSubmit = (profile: FarmerProfile, results: EligibilityResult[]) => {
    setFarmerProfile(profile);
    setEligibilityResults(results);
    setView('dashboard');
    setIsLoading(false);
  };

  const handleCheckAnother = () => {
    setFarmerProfile(null);
    setEligibilityResults([]);
    setView('profileInput');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {view === 'profileInput' && (
          <ProfileInput 
            onSubmit={handleProfileSubmit} 
            setIsLoading={setIsLoading} 
            isLoading={isLoading} 
          />
        )}
        {view === 'dashboard' && farmerProfile && (
          <Dashboard
            farmerProfile={farmerProfile}
            eligibilityResults={eligibilityResults}
            onCheckAnother={handleCheckAnother}
          />
        )}
      </main>
    </div>
  );
};

export default App;