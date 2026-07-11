'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  label: string;
  value: string | number;
  status?: 'healthy' | 'warning' | 'critical';
  unit?: string;
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  value,
  status = 'healthy',
  unit = '',
  icon,
}) => {
  const statusColors = {
    healthy: { bg: '#10b981', text: '#dcfce7' },
    warning: { bg: '#f59e0b', text: '#fef3c7' },
    critical: { bg: '#ef4444', text: '#fee2e2' },
  };

  const colors = statusColors[status];

  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-4 overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>

        {icon && (
          <div className="flex-shrink-0">
            <motion.div
              animate={{ scale: status === 'critical' ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: status === 'critical' ? Infinity : 0 }}
            >
              {icon}
            </motion.div>
          </div>
        )}
      </div>

      {/* Status indicator bar */}
      <motion.div
        className="mt-3 h-1 rounded-full"
        style={{ backgroundColor: colors.bg }}
        layoutId={`status-${label}`}
      />
    </motion.div>
  );
};
