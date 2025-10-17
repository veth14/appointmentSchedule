import { MeetingStatus } from '@/types/meeting';
import { STATUS_CONFIG } from '@/constants/statusConfig';

interface StatusBadgeProps {
  status: MeetingStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  } as const;

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl font-bold shadow-sm ${sizeClasses[size]} ${config.className}`}
    >
      {IconComponent && <IconComponent className={iconSizes[size]} />}
      <span className="leading-none">{config.label}</span>
    </span>
  );
}
