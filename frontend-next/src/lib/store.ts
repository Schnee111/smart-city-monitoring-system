import { create } from 'zustand';
import { Sensor, DashboardState } from '@/src/types';

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedSensor: null,
  selectedDistrict: null,
  isLoading: false,
  
  setSelectedSensor: (sensor: Sensor | null) => set({ selectedSensor: sensor }),
  setSelectedDistrict: (district: string | null) => set({ selectedDistrict: district }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));
