'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Sun, Zap, Activity, Gauge } from 'lucide-react';
import { useDashboardStore } from '@/src/lib/store';
import { formatKwh, formatVoltage, formatRelativeTime, getStatusColor, getEnergySourceColor } from '@/src/lib/formatters';

export default function SensorDetail() {
  const { selectedSensor, setSelectedSensor } = useDashboardStore();

  if (!selectedSensor) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Detail Sensor
        </h3>
        <div className="text-center py-8 text-slate-500">
          <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm">Klik marker pada peta untuk melihat detail sensor</p>
        </div>
      </div>
    );
  }

  const isSolar = selectedSensor.energySource.toLowerCase() === 'solar';
  const isActive = selectedSensor.status.toLowerCase() === 'active';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedSensor.sensorId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Detail Sensor
          </h3>
          <button
            onClick={() => setSelectedSensor(null)}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sensor Info */}
        <div className="space-y-3">
          {/* ID */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Sensor ID</p>
            <p className="text-white font-mono text-sm mt-0.5 truncate">
              {selectedSensor.sensorId}
            </p>
          </div>

          {/* Type & Status */}
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-700/30 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Sumber Energi</p>
              <div className="flex items-center gap-2 mt-1">
                {isSolar ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Zap className="w-4 h-4 text-blue-400" />
                )}
                <span className={`font-medium ${isSolar ? 'text-amber-400' : 'text-blue-400'}`}>
                  {selectedSensor.energySource}
                </span>
              </div>
            </div>
            <div className="flex-1 bg-slate-700/30 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Status</p>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedSensor.status}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Lokasi</p>
            <p className="text-white font-medium mt-0.5">
              {selectedSensor.districtName}
            </p>
            <p className="text-slate-500 text-xs mt-1 font-mono">
              {selectedSensor.latitude.toFixed(6)}, {selectedSensor.longitude.toFixed(6)}
            </p>
          </div>

          {/* Latest Reading */}
          {selectedSensor.latestReading && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-lg p-3 border border-emerald-500/20">
              <p className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                <Gauge className="w-3 h-3" />
                Pembacaan Terakhir
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-slate-400 text-xs">Penggunaan</p>
                  <p className="text-white font-bold">
                    {formatKwh(selectedSensor.latestReading.kwhUsage)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Tegangan</p>
                  <p className="text-white font-bold">
                    {formatVoltage(selectedSensor.latestReading.voltage)}
                  </p>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                {formatRelativeTime(selectedSensor.latestReading.recordedAt)}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
