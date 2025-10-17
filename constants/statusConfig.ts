import { MeetingStatus } from '@/types';

export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
  className: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const STATUS_CONFIG: Record<MeetingStatus, StatusConfig> = {
  scheduled: {
    label: 'Scheduled',
    color: 'yellow',
    icon: 'Clock',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  done: {
    label: 'Done',
    color: 'green',
    icon: 'CheckCircle2',
    className: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  canceled: {
    label: 'Canceled',
    color: 'red',
    icon: 'XCircle',
    className: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
};

export const STATUS_OPTIONS: Array<{ value: MeetingStatus; label: string }> = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
];
