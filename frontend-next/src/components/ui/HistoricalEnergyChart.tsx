'use client';

import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { ChevronLeft, ChevronRight, Activity, Calendar, RefreshCw } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/id';
import { fetcher } from '@/src/lib/fetcher';

// MUI Dark Theme for DatePicker
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10b981', // emerald-500
    },
    background: {
      paper: '#1e293b', // slate-800
      default: '#0f172a', // slate-900
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8', // slate-400
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottom: '1px solid #475569',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #64748b',
          },
        },
      },
    },
  },
});

interface Sensor {
  sensorId: string;
  districtName: string;
  energySource: string;
  latestReading?: {
    kwhUsage: number;
    voltage: number;
    recordedAt: string;
  };
}

interface HourlyData {
  hour: number;
  timeLabel: string;
  totalKwh: number;
  solarKwh: number;
  gridKwh: number;
  readingCount: number;
}

interface ChartDataPoint {
  time: string;
  hour?: number;
  totalKwh: number;
  solarKwh: number;
  gridKwh: number;
}

type ViewMode = 'live' | 'history';

interface HistoricalEnergyChartProps {
  showModeToggle?: boolean;
  height?: number;
}

export default function HistoricalEnergyChart({ 
  showModeToggle = true,
  height = 280 
}: HistoricalEnergyChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('live');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [realtimeHistory, setRealtimeHistory] = useState<ChartDataPoint[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Format date for API
  const dateStr = selectedDate.toISOString().split('T')[0];
  const isToday = dateStr === new Date().toISOString().split('T')[0];

  // Fetch hourly data from backend for history view
  const { data: hourlyData, isLoading: hourlyLoading, mutate: refetchHourly } = useSWR<HourlyData[]>(
    viewMode === 'history' ? `/stats/hourly?date=${dateStr}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch all sensors for live data
  const { data: sensors = [] } = useSWR<Sensor[]>(
    viewMode === 'live' ? '/sensors' : null,
    fetcher,
    { refreshInterval: 3000 }
  );

  // Build real-time history when sensors data changes
  useEffect(() => {
    if (viewMode !== 'live' || sensors.length === 0) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    let totalKwh = 0;
    let solarKwh = 0;
    let gridKwh = 0;

    sensors.forEach(sensor => {
      if (sensor.latestReading) {
        const kwh = sensor.latestReading.kwhUsage || 0;
        totalKwh += kwh;
        if (sensor.energySource === 'Solar') {
          solarKwh += kwh;
        } else {
          gridKwh += kwh;
        }
      }
    });

    setRealtimeHistory(prev => {
      const newPoint: ChartDataPoint = {
        time: timeStr,
        totalKwh: Math.round(totalKwh * 100) / 100,
        solarKwh: Math.round(solarKwh * 100) / 100,
        gridKwh: Math.round(gridKwh * 100) / 100,
      };

      // Avoid duplicates within same second
      if (prev.length > 0) {
        const lastTime = prev[prev.length - 1].time;
        if (lastTime === timeStr) return prev;
      }

      const updated = [...prev, newPoint];
      return updated.slice(-60); // Keep last 60 data points
    });
  }, [sensors, viewMode]);

  // Reset date when switching to history mode
  useEffect(() => {
    if (viewMode === 'history') {
      setSelectedDate(new Date());
    }
  }, [viewMode]);

  // Navigate dates (for history mode only)
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedDate(newValue.toDate());
      setShowDatePicker(false);
    }
  };

  // Current stats
  const currentStats = useMemo(() => {
    if (viewMode === 'history' && hourlyData && hourlyData.length > 0) {
      const totalKwh = hourlyData.reduce((acc, h) => acc + h.totalKwh, 0);
      const solarKwh = hourlyData.reduce((acc, h) => acc + h.solarKwh, 0);
      const gridKwh = hourlyData.reduce((acc, h) => acc + h.gridKwh, 0);
      const hoursWithData = hourlyData.filter(h => h.readingCount > 0).length;
      return { totalKwh, solarKwh, gridKwh, hoursWithData };
    }

    let totalKwh = 0;
    let solarKwh = 0;
    let gridKwh = 0;
    let activeCount = 0;

    sensors.forEach(sensor => {
      if (sensor.latestReading) {
        const kwh = sensor.latestReading.kwhUsage || 0;
        totalKwh += kwh;
        if (sensor.energySource === 'Solar') {
          solarKwh += kwh;
        } else {
          gridKwh += kwh;
        }
        activeCount++;
      }
    });

    return { totalKwh, solarKwh, gridKwh, hoursWithData: activeCount };
  }, [sensors, viewMode, hourlyData]);

  // Chart data based on mode
  const chartData = useMemo(() => {
    if (viewMode === 'history' && hourlyData && hourlyData.length > 0) {
      // Show all hours up to current hour for today, or all hours with data for history
      const currentHour = new Date().getHours();
      return hourlyData
        .filter(h => {
          if (isToday) {
            return h.hour <= currentHour;
          }
          return h.readingCount > 0;
        })
        .map(h => ({
          time: h.timeLabel,
          hour: h.hour,
          totalKwh: h.totalKwh,
          solarKwh: h.solarKwh,
          gridKwh: h.gridKwh,
        }));
    }
    return realtimeHistory;
  }, [viewMode, hourlyData, realtimeHistory, isToday]);

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format large numbers
  const formatKwh = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(1);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle + Date Selector Row */}
      {showModeToggle && (
        <div className="flex items-center justify-between">
          {/* Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                viewMode === 'live' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                viewMode === 'history' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Historis
            </button>
          </div>

          {/* Date Selector (only for history mode) */}
          {viewMode === 'history' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousDay}
                className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="relative">
                <button
                  ref={(el) => {
                    if (el && !anchorEl) setAnchorEl(el);
                  }}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">
                    {isToday ? 'Hari Ini' : formatDisplayDate(selectedDate)}
                  </span>
                </button>
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
                    <DatePicker
                      value={dayjs(selectedDate)}
                      onChange={handleDateChange}
                      maxDate={dayjs()}
                      open={showDatePicker}
                      onClose={() => setShowDatePicker(false)}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          sx: { display: 'none' },
                        },
                        popper: {
                          anchorEl: anchorEl,
                          placement: 'bottom-end',
                          sx: {
                            '& .MuiPaper-root': {
                              backgroundColor: '#1e293b',
                              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                              border: '1px solid #334155',
                              borderRadius: '12px',
                              marginTop: '8px',
                            },
                            '& .MuiPickersDay-root': {
                              color: '#ffffff',
                              '&:hover': {
                                backgroundColor: '#334155',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#10b981 !important',
                                '&:hover': {
                                  backgroundColor: '#059669 !important',
                                },
                              },
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              color: '#ffffff',
                            },
                            '& .MuiDayCalendar-weekDayLabel': {
                              color: '#94a3b8',
                            },
                            '& .MuiPickersYear-yearButton': {
                              color: '#ffffff',
                              '&:hover': {
                                backgroundColor: '#334155',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#10b981 !important',
                                '&:hover': {
                                  backgroundColor: '#059669 !important',
                                },
                              },
                            },
                            '& .MuiIconButton-root': {
                              color: '#94a3b8',
                              '&:hover': {
                                backgroundColor: '#334155',
                              },
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
              <button
                onClick={goToNextDay}
                disabled={isToday}
                className={`p-1.5 rounded-lg transition-colors ${
                  isToday 
                    ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed' 
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => refetchHourly()}
                className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">{viewMode === 'live' ? 'Total Saat Ini' : 'Total'}</p>
          <p className="text-lg font-bold text-white">
            {formatKwh(currentStats.totalKwh)} <span className="text-xs font-normal text-slate-400">kWh</span>
          </p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Solar</p>
          <p className="text-lg font-bold text-amber-400">
            {formatKwh(currentStats.solarKwh)} <span className="text-xs font-normal text-slate-400">kWh</span>
          </p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Grid</p>
          <p className="text-lg font-bold text-indigo-400">
            {formatKwh(currentStats.gridKwh)} <span className="text-xs font-normal text-slate-400">kWh</span>
          </p>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {viewMode === 'live' 
              ? `Data real-time` 
              : `Data per jam • ${currentStats.hoursWithData} jam`
            }
          </span>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-slate-400">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <span className="text-slate-400">Solar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            <span className="text-slate-400">Grid</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        {hourlyLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(value) => `${value}`}
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
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      totalKwh: 'Total',
                      solarKwh: 'Solar',
                      gridKwh: 'Grid'
                    };
                    return [`${value.toFixed(2)} kWh`, labels[name] || name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalKwh"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  name="totalKwh"
                  dot={false}
                  activeDot={{ r: 4, fill: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="solarKwh"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorSolar)"
                  name="solarKwh"
                  dot={false}
                  activeDot={{ r: 3, fill: '#f59e0b' }}
                />
                <Area
                  type="monotone"
                  dataKey="gridKwh"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorGrid)"
                  name="gridKwh"
                  dot={false}
                  activeDot={{ r: 3, fill: '#6366f1' }}
                />
              </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Activity className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">
              {viewMode === 'live' ? 'Mengumpulkan data...' : 'Tidak ada data untuk tanggal ini'}
            </p>
            <p className="text-xs text-slate-500">
              {viewMode === 'live' ? 'Grafik akan muncul setelah beberapa detik' : 'Coba pilih tanggal lain'}
            </p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <p className="text-xs text-slate-500 text-center">
        {viewMode === 'live' 
          ? 'Data historis untuk Hari Ini' 
          : `Data historis untuk ${isToday ? 'Hari Ini' : formatDisplayDate(selectedDate)}`
        }
      </p>
    </div>
  );
}
