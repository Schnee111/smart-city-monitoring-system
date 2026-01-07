// API Response Types (matching API_CONTRACT.md)

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Sensor {
  sensorId: string;
  districtName: string;
  latitude: number;
  longitude: number;
  energySource: 'Solar' | 'Grid';
  status: 'Active' | 'Maintenance' | 'Offline';
  latestReading?: EnergyReading;
}

export interface EnergyReading {
  sensorId: string;
  kwhUsage: number;
  voltage: number;
  recordedAt: string;
}

export interface DistrictStats {
  district: string;
  totalKwh: number;
  solarRatio: number;
  totalSensors: number;
  activeSensors: number;
  avgVoltage: number;
}

export interface DistrictProfile {
  districtName: string;
  population: number;
  category: 'Industrial' | 'Residential' | 'Commercial';
}

export interface CreateSensorRequest {
  districtName: string;
  latitude: number;
  longitude: number;
  energySource: 'Solar' | 'Grid';
}

export interface EnergyIngestRequest {
  sensorId: string;
  kwhUsage: number;
  voltage: number;
}

// Map marker types
export interface MapMarker {
  id: string;
  position: [number, number];
  sensor: Sensor;
}

// Chart data types
export interface ChartDataPoint {
  time: string;
  kwh: number;
  voltage: number;
}

// Store types
export interface DashboardState {
  selectedSensor: Sensor | null;
  selectedDistrict: string | null;
  isLoading: boolean;
  setSelectedSensor: (sensor: Sensor | null) => void;
  setSelectedDistrict: (district: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}
