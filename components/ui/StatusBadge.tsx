import { MeetingStatus } from '@/types/meeting';
import { STATUS_CONFIG } from '@/constants/statusConfig';
import * as LucideIcons from 'lucide-react';

interface StatusBadgeProps {
  status: MeetingStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const IconComponent = LucideIcons[config.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}
    >
      {IconComponent && <IconComponent className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
