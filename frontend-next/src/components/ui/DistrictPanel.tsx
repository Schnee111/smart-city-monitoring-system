'use client';

import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Building2, Home, Factory, MapPin, Globe } from 'lucide-react';
import { fetcher } from '@/src/lib/fetcher';
import { useDashboardStore } from '@/src/lib/store';
import { DistrictProfile } from '@/src/types';

export default function DistrictPanel() {
  const { selectedDistrict, setSelectedDistrict } = useDashboardStore();
  
  const { data: districts, isLoading } = useSWR<DistrictProfile[]>(
    '/api/v1/stats/districts',
    fetcher
  );

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'industrial':
        return 'text-orange-400 bg-orange-500/20';
      case 'residential':
        return 'text-blue-400 bg-blue-500/20';
      case 'commercial':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'industrial':
        return <Factory className="w-5 h-5 text-orange-400" />;
      case 'residential':
        return <Home className="w-5 h-5 text-blue-400" />;
      case 'commercial':
        return <Building2 className="w-5 h-5 text-purple-400" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-emerald-400" />
        Distrik
      </h3>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-700/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
          {/* All Districts Option */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedDistrict(null)}
            className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
              selectedDistrict === null
                ? 'bg-emerald-500/15 border border-emerald-500/30'
                : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedDistrict === null ? 'bg-emerald-500/20' : 'bg-slate-600/50'
            }`}>
              <Globe className={`w-5 h-5 ${selectedDistrict === null ? 'text-emerald-400' : 'text-slate-400'}`} />
            </div>
            <div className="text-left">
              <p className={`font-medium ${selectedDistrict === null ? 'text-emerald-400' : 'text-white'}`}>
                Semua Distrik
              </p>
              <p className="text-slate-400 text-xs">
                {districts?.length || 0} distrik
              </p>
            </div>
          </motion.button>

          {districts?.map((district) => (
            <motion.button
              key={district.districtName}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedDistrict(district.districtName)}
              className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                selectedDistrict === district.districtName
                  ? 'bg-emerald-500/15 border border-emerald-500/30'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedDistrict === district.districtName ? 'bg-emerald-500/20' : 'bg-slate-600/50'
              }`}>
                {getCategoryIcon(district.category)}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium ${selectedDistrict === district.districtName ? 'text-emerald-400' : 'text-white'}`}>
                  {district.districtName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(district.category)}`}>
                    {district.category}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {(district.population / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
