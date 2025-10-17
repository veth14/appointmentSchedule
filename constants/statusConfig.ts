import { MeetingStatus } from '@/types';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import type { ComponentType } from 'react';

export interface StatusConfig {
  label: string;
  color: string;
  // Icon component (lucide-react)
  icon: ComponentType<{ className?: string }>;
  // Tailwind utility classes for color/background/border
  className: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const STATUS_CONFIG: Record<MeetingStatus, StatusConfig> = {
  scheduled: {
    label: 'Scheduled',
    color: 'info',
    icon: Sparkles,
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  done: {
    label: 'Done',
    color: 'success',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 border border-green-200',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  canceled: {
    label: 'Canceled',
    color: 'danger',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border border-red-200',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

export const STATUS_OPTIONS: Array<{ value: MeetingStatus; label: string }> = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
];
