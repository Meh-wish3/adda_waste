import React from 'react';
import { Clock, UserCheck, CheckCircle2 } from 'lucide-react';

const statusConfig = {
  pending: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock size={14} />,
    label: 'Pending Pickup'
  },
  assigned: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <UserCheck size={14} />,
    label: 'Collector Assigned'
  },
  completed: {
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 size={14} />,
    label: 'Pickup Completed'
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    color: 'bg-gray-100 text-gray-600',
    icon: null,
    label: status
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;

