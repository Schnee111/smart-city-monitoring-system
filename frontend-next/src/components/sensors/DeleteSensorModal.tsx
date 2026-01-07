'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Sensor } from '@/src/types';
import { useToast } from '@/src/components/ui/Toast';

interface DeleteSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sensor: Sensor | null;
}

export function DeleteSensorModal({ isOpen, onClose, onSuccess, sensor }: DeleteSensorModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!sensor) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/sensors/${sensor.sensorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      onSuccess();
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete sensor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!sensor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Delete Sensor</h3>
        <p className="text-slate-400 mb-4">
          Are you sure you want to delete this sensor? This action cannot be undone.
        </p>
        <div className="bg-slate-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-slate-400">Sensor ID</p>
          <code className="text-emerald-400 text-sm">{sensor.sensorId}</code>
          <p className="text-sm text-slate-400 mt-2">District</p>
          <p className="text-white font-medium">{sensor.districtName}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete} isLoading={isLoading}>
            Delete Sensor
          </Button>
        </div>
      </div>
    </Modal>
  );
}
