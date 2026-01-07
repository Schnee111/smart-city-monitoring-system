import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMM yyyy, HH:mm:ss', { locale: id });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
  } catch {
    return dateString;
  }
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatKwh(kwh: number): string {
  if (kwh >= 1000) {
    return `${formatNumber(kwh / 1000)} MWh`;
  }
  return `${formatNumber(kwh)} kWh`;
}

export function formatVoltage(voltage: number): string {
  return `${voltage} V`;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-500 bg-green-500/20';
    case 'maintenance':
      return 'text-yellow-500 bg-yellow-500/20';
    case 'offline':
      return 'text-red-500 bg-red-500/20';
    default:
      return 'text-gray-500 bg-gray-500/20';
  }
}

export function getEnergySourceColor(source: string): { bg: string; text: string; icon: string } {
  if (source.toLowerCase() === 'solar') {
    return {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      icon: '☀️',
    };
  }
  return {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    icon: '⚡',
  };
}
