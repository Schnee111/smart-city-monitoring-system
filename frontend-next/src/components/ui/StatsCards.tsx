'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { Zap, Sun, Radio, Gauge, TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { fetcher } from '@/src/lib/fetcher';
import { formatKwh, formatNumber } from '@/src/lib/formatters';
import { DistrictStats, Sensor } from '@/src/types';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, subValue, trend, color, iconColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 
            trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-slate-700/50 text-slate-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
             <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-slate-400 text-sm">{label}</p>
        <motion.p
          key={String(value)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mt-1"
        >
          {value}
        </motion.p>
        {subValue && (
          <p className="text-slate-500 text-xs mt-1">{subValue}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function StatsCards() {
  // Fetch city-wide stats with polling every 5 seconds
  const { data: stats } = useSWR<DistrictStats>(
    '/api/v1/stats',
    fetcher,
    { refreshInterval: 5000 }
  );

  // Fetch all sensors for count
  const { data: sensors } = useSWR<Sensor[]>(
    '/api/v1/sensors',
    fetcher,
    { refreshInterval: 10000 }
  );

  const activeSensors = sensors?.filter(s => s.status === 'Active').length || 0;
  const totalSensors = sensors?.length || 0;
  const solarSensors = sensors?.filter(s => s.energySource === 'Solar').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Zap}
        label="Total Konsumsi Hari Ini"
        value={stats ? formatKwh(stats.totalKwh) : '0 kWh'}
        subValue="Semua distrik"
        trend="up"
        color="bg-gradient-to-br from-amber-500/20 to-orange-500/20"
        iconColor="text-amber-400"
      />
      
      <StatCard
        icon={Sun}
        label="Rasio Energi Solar"
        value={stats ? `${formatNumber(stats.solarRatio)}%` : '0%'}
        subValue={`${solarSensors} sensor solar`}
        trend="up"
        color="bg-gradient-to-br from-yellow-500/20 to-amber-500/20"
        iconColor="text-yellow-400"
      />
      
      <StatCard
        icon={Radio}
        label="Sensor Aktif"
        value={`${activeSensors}/${totalSensors}`}
        subValue="Online sekarang"
        trend="neutral"
        color="bg-gradient-to-br from-emerald-500/20 to-green-500/20"
        iconColor="text-emerald-400"
      />
      
      <StatCard
        icon={Gauge}
        label="Rata-rata Tegangan"
        value={stats ? `${formatNumber(stats.avgVoltage)} V` : '0 V'}
        subValue="Rata-rata kota"
        trend="neutral"
        color="bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
        iconColor="text-blue-400"
      />
    </div>
  );
}
