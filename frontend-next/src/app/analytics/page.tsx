'use client';

import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Sun, 
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import useSWR from 'swr';
import DashboardLayout from '@/src/components/layout/DashboardLayout';
import EnergyChart from '@/src/components/ui/EnergyChart';
import { fetcher } from '@/src/lib/fetcher';

interface DistrictStats {
  districtName: string;
  totalSensors: number;
  avgConsumption: number;
  totalConsumption: number;
  solarPercentage: number;
}

export default function AnalyticsPage() {
  const { data: districtStats = [], isLoading: loading } = useSWR<DistrictStats[]>(
    '/stats/districts',
    fetcher,
    { revalidateOnFocus: false }
  );

  const totalConsumption = Array.isArray(districtStats) ? districtStats.reduce((acc, d) => acc + (d.totalConsumption || 0), 0) : 0;
  const avgSolarPercentage = districtStats.length > 0 
    ? districtStats.reduce((acc, d) => acc + d.solarPercentage, 0) / districtStats.length 
    : 0;
  const totalSensors = districtStats.reduce((acc, d) => acc + d.totalSensors, 0);

  // Sort districts by consumption for ranking
  const rankedDistricts = [...districtStats].sort((a, b) => b.totalConsumption - a.totalConsumption);

  return (
    <DashboardLayout 
      title="Analitik" 
      subtitle="Statistik dan analisis konsumsi energi"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="flex items-center text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4" /> 12%
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-3">
            {totalConsumption.toFixed(1)} <span className="text-sm text-slate-400 font-normal">kWh</span>
          </p>
          <p className="text-slate-400 text-sm">Total Konsumsi</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <span className="flex items-center text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4" /> 5%
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-3">
            {avgSolarPercentage.toFixed(1)} <span className="text-sm text-slate-400 font-normal">%</span>
          </p>
          <p className="text-slate-400 text-sm">Rata-rata Solar</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">
            {districtStats.length} <span className="text-sm text-slate-400 font-normal">distrik</span>
          </p>
          <p className="text-slate-400 text-sm">Area Terpantau</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">
            {totalSensors} <span className="text-sm text-slate-400 font-normal">sensor</span>
          </p>
          <p className="text-slate-400 text-sm">Total Sensor Aktif</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Energy Chart */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-700/50">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Konsumsi Energi Real-time</h3>
          </div>
          <div className="p-4">
            <EnergyChart />
          </div>
        </div>

        {/* District Consumption Comparison */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-700/50">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Konsumsi per Distrik</h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {rankedDistricts.slice(0, 6).map((district, index) => {
                  const maxConsumption = rankedDistricts[0]?.totalConsumption || 1;
                  const percentage = (district.totalConsumption / maxConsumption) * 100;
                  
                  return (
                    <div key={district.districtName} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-amber-500/20 text-amber-400' :
                            index === 1 ? 'bg-slate-500/20 text-slate-300' :
                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-slate-700/50 text-slate-400'
                          }`}>
                            {index + 1}
                          </span>
                          {district.districtName}
                        </span>
                        <span className="text-white font-medium">
                          {district.totalConsumption.toFixed(1)} kWh
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Solar vs Grid Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solar Percentage by District */}
        <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-700/50">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold">Persentase Energi Solar per Distrik</h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left text-slate-400 text-sm font-medium py-3 px-2">Distrik</th>
                      <th className="text-center text-slate-400 text-sm font-medium py-3 px-2">Sensor</th>
                      <th className="text-center text-slate-400 text-sm font-medium py-3 px-2">Solar %</th>
                      <th className="text-right text-slate-400 text-sm font-medium py-3 px-2">Konsumsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtStats.map((district) => (
                      <tr key={district.districtName} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                        <td className="py-3 px-2 text-white">{district.districtName}</td>
                        <td className="py-3 px-2 text-center text-slate-300">{district.totalSensors}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${district.solarPercentage}%` }}
                              />
                            </div>
                            <span className="text-amber-400 text-sm w-12 text-right">
                              {district.solarPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right text-emerald-400 font-medium">
                          {district.totalConsumption.toFixed(1)} kWh
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Energy Source Distribution */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-700/50">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Distribusi Sumber Energi</h3>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center justify-center h-48">
              {/* Simple visual representation */}
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-amber-500"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(avgSolarPercentage / 100 * 2 * Math.PI)}% ${50 - 50 * Math.cos(avgSolarPercentage / 100 * 2 * Math.PI)}%, 50% 50%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{avgSolarPercentage.toFixed(0)}%</p>
                    <p className="text-xs text-slate-400">Solar</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-slate-300">Solar ({avgSolarPercentage.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <span className="text-sm text-slate-300">Grid ({(100 - avgSolarPercentage).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
