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
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-sm px-3.5 py-2',
  } as const;

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${sizeClasses[size]} ${config.className}`}
    >
      {IconComponent && <IconComponent className={iconSizes[size]} />}
      <span className="leading-none">{config.label}</span>
    </span>
  );
}
