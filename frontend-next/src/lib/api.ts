// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// Type definitions
export interface Sensor {
  sensorId: string;
  districtName: string;
  latitude: number;
  longitude: number;
  energySource: string;
  status: string;
  latestReading?: {
    timestamp: string;
    energyConsumption: number;
    solarOutput: number;
    gridLoad: number;
    peakDemand: number;
    efficiency: number;
  };
}

export interface EnergyReading {
  sensorId: string;
  timestamp: string;
  energyConsumption: number;
  solarOutput: number;
  gridLoad: number;
  peakDemand: number;
  efficiency: number;
}

export interface CityStats {
  totalSensors: number;
  activeSensors: number;
  totalEnergyConsumption: number;
  avgSolarOutput: number;
  avgEfficiency: number;
  totalDistricts: number;
}

export interface DistrictStats {
  districtName: string;
  totalSensors: number;
  avgConsumption: number;
  totalConsumption: number;
  solarPercentage: number;
}

// API Helper functions
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = await response.json();
  return json.data || json;
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = await response.json();
  return json.data || json;
}

export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = await response.json();
  return json.data || json;
}

export async function apiDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
}
