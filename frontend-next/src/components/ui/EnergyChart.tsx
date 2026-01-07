'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { fetcher } from '@/src/lib/fetcher';
import { useDashboardStore } from '@/src/lib/store';
import { EnergyReading } from '@/src/types';

export default function EnergyChart() {
  const { selectedSensor } = useDashboardStore();

  // Fetch energy history with polling
  const { data: readings } = useSWR<EnergyReading[]>(
    selectedSensor 
      ? `/energy/history/${selectedSensor.sensorId}`
      : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  // Format data for chart
  const chartData = useMemo(() => {
    if (!readings || readings.length === 0) {
      // Generate dummy data if no readings
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        kwh: Math.random() * 10 + 2,
        voltage: Math.floor(Math.random() * 20) + 210,
      }));
    }

    return readings.slice(0, 50).reverse().map((r) => ({
      time: new Date(r.recordedAt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      kwh: r.kwhUsage,
      voltage: r.voltage,
    }));
  }, [readings]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Tren Penggunaan Energi
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            {selectedSensor 
              ? `Sensor: ${selectedSensor.sensorId.slice(0, 8)}...`
              : 'Data simulasi (pilih sensor untuk data real)'}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-slate-400 text-xs">kWh</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <span className="text-slate-400 text-xs">Voltage</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="time" 
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="kwh"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorKwh)"
              name="kWh Usage"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="voltage"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVoltage)"
              name="Voltage (V)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
