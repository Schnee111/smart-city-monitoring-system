'use client';

import DashboardLayout from '@/src/components/layout/DashboardLayout';
import SensorManagement from '@/src/components/sensors/SensorManagement';

export default function SensorsPage() {
  return (
    <DashboardLayout 
      title="Manajemen Sensor" 
      subtitle="Kelola data sensor energi"
    >
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <SensorManagement />
      </div>
    </DashboardLayout>
  );
}
