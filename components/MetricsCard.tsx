import React from 'react';
import { ChartIcon, ClockIcon, DocumentIcon } from './icons/UiIcons';
import { CheckCircleIcon } from './icons/ResultIcons';
import { translations } from '../translations';

interface MetricsCardProps {
  totalChecks: number;
  responseTime: string;
  schemesAnalyzed: number;
  eligibleCount: number;
  language: 'en-IN' | 'hi-IN';
}

const MetricItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4 p-3">
        <div className="bg-green-900/50 p-3 rounded-full border border-green-500/30">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-100">{value}</p>
        </div>
    </div>
);

const MetricsCard: React.FC<MetricsCardProps> = ({ totalChecks, responseTime, schemesAnalyzed, eligibleCount, language }) => {
  const t = translations[language];
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-3">{t.analysisMetrics}</h3>
      <div className="divide-y divide-gray-700/50">
        <MetricItem icon={<ChartIcon />} label={t.totalChecks} value={totalChecks} />
        <MetricItem icon={<DocumentIcon />} label={t.schemesAnalyzed} value={schemesAnalyzed} />
        <MetricItem icon={<CheckCircleIcon className="w-5 h-5 text-green-500" />} label={t.eligibleSchemesMetric} value={eligibleCount} />
        <MetricItem icon={<ClockIcon />} label={t.avgResponseTime} value={responseTime} />
      </div>
    </div>
  );
};

export default MetricsCard;