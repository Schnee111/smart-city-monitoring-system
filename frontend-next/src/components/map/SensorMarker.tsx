'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDashboardStore } from '@/src/lib/store';
import { formatKwh, formatVoltage, formatRelativeTime } from '@/src/lib/formatters';
import { Sensor } from '@/src/types';

interface SensorMarkerProps {
  sensor: Sensor;
  showCoverage?: boolean;
}

// SVG icons for energy sources
const SolarIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.41 1.41"></path>
    <path d="m17.66 17.66 1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.34 17.66-1.41 1.41"></path>
    <path d="m19.07 4.93-1.41 1.41"></path>
  </svg>
`;

const GridIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
`;

// Create custom icon based on energy source and status
function createSensorIcon(energySource: string, status: string, loadPercentage?: number): L.DivIcon {
  const isSolar = energySource.toLowerCase() === 'solar';
  const isActive = status.toLowerCase() === 'active';
  
  // Color based on energy source
  const baseColor = isSolar ? '#f59e0b' : '#3b82f6';
  const bgColor = isSolar ? '#fef3c7' : '#dbeafe';
  const iconSvg = isSolar ? SolarIcon : GridIcon;
  
  // Status indicator
  const statusColor = isActive ? '#10b981' : '#ef4444';
  const opacity = isActive ? 1 : 0.6;

  // Load indicator (optional ring)
  const load = loadPercentage || 50;
  const loadColor = load > 80 ? '#ef4444' : load > 60 ? '#f59e0b' : '#10b981';

  return L.divIcon({
    className: 'custom-sensor-marker',
    html: `
      <div class="sensor-marker-wrapper" style="opacity: ${opacity};">
        <!-- Outer ring (load indicator) -->
        <div class="sensor-load-ring" style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 3px solid ${loadColor};
          opacity: 0.4;
        "></div>
        
        <!-- Status pulse -->
        ${isActive ? `
          <div class="sensor-pulse" style="
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: ${baseColor};
            opacity: 0.2;
            animation: sensor-pulse 2s ease-out infinite;
          "></div>
        ` : ''}
        
        <!-- Main marker -->
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${bgColor}, white);
          border: 3px solid ${baseColor};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="width: 18px; height: 18px; color: ${baseColor};">
            ${iconSvg}
          </div>
          
          <!-- Status dot -->
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${statusColor};
            border: 2px solid white;
          "></div>
        </div>
      </div>
      
      <style>
        @keyframes sensor-pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }
        .sensor-marker-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
}

export default function SensorMarker({ sensor, showCoverage = true }: SensorMarkerProps) {
  const map = useMap();
  const { setSelectedSensor, selectedSensor } = useDashboardStore();
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  const loadPercentage = sensor.latestReading 
    ? Math.min(100, (sensor.latestReading.kwhUsage / 10) * 100) 
    : 50;

  useEffect(() => {
    setIcon(createSensorIcon(sensor.energySource, sensor.status, loadPercentage));
  }, [sensor.energySource, sensor.status, loadPercentage]);

  const handleClick = () => {
    setSelectedSensor(sensor);
    map.flyTo([sensor.latitude, sensor.longitude], 15, { duration: 1 });
  };

  const isSelected = selectedSensor?.sensorId === sensor.sensorId;
  const isSolar = sensor.energySource.toLowerCase() === 'solar';
  const isActive = sensor.status.toLowerCase() === 'active';

  if (!icon) return null;

  return (
    <>
      {/* Coverage circle */}
      {showCoverage && isSelected && (
        <Circle
          center={[sensor.latitude, sensor.longitude]}
          radius={500}
          pathOptions={{
            color: isSolar ? '#f59e0b' : '#3b82f6',
            fillColor: isSolar ? '#f59e0b' : '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 5',
          }}
        />
      )}

      <Marker
        position={[sensor.latitude, sensor.longitude]}
        icon={icon}
        eventHandlers={{
          click: handleClick,
        }}
      >
        <Popup className="sensor-popup-modern">
          <div className="min-w-[240px] bg-slate-800 rounded-lg overflow-hidden -m-3">
            {/* Header */}
            <div className={`p-3 ${isSolar ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSolar ? 'bg-amber-500/30 text-amber-400' : 'bg-blue-500/30 text-blue-400'
                  }`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {isSolar ? (
                        <>
                          <circle cx="12" cy="12" r="4"></circle>
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                        </>
                      ) : (
                        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{sensor.districtName}</p>
                    <p className="text-xs text-slate-400">{sensor.energySource}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {isActive ? 'Aktif' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
              {/* Sensor ID */}
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Sensor ID</p>
                <p className="text-xs font-mono text-slate-300 truncate bg-slate-700/50 px-2 py-1 rounded">
                  {sensor.sensorId}
                </p>
              </div>

              {/* Latest Reading */}
              {sensor.latestReading && (
                <div className="bg-slate-700/30 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-emerald-400 font-medium">Pembacaan Terakhir</p>
                    <p className="text-xs text-slate-500">
                      {formatRelativeTime(sensor.latestReading.recordedAt)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-xs text-slate-500 mb-0.5">Penggunaan</p>
                      <p className="text-sm font-bold text-white">
                        {formatKwh(sensor.latestReading.kwhUsage)}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-xs text-slate-500 mb-0.5">Tegangan</p>
                      <p className="text-sm font-bold text-white">
                        {formatVoltage(sensor.latestReading.voltage)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coordinates */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{sensor.latitude.toFixed(5)}, {sensor.longitude.toFixed(5)}</span>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}
