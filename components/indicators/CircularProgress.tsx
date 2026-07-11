'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { HealthStatus } from '@/types';

interface CircularProgressProps {
  value: number;
  max?: number;
  healthStatus?: HealthStatus;
  showLabel?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  healthStatus,
  showLabel = true,
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const getColor = () => {
    if (healthStatus === 'Healthy') return '#10b981';
    if (healthStatus === 'Attention Required') return '#f59e0b';
    if (healthStatus === 'Maintenance Soon') return '#f97316';
    if (healthStatus === 'Critical Failure Risk') return '#ef4444';

    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#f97316';
    return '#ef4444';
  };

  const getStatusText = () => {
    if (healthStatus) return healthStatus;
    if (percentage >= 80) return 'Healthy';
    if (percentage >= 60) return 'Attention Required';
    if (percentage >= 40) return 'Maintenance Soon';
    return 'Critical';
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getColor();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-64 h-64">
        <svg
          width={256}
          height={256}
          className="transform -rotate-90"
          style={{ filter: `drop-shadow(0 0 12px ${color}20)` }}
        >
          {/* Background circle */}
          <circle
            cx={128}
            cy={128}
            r={radius}
            fill="none"
            stroke="#1F2937"
            strokeWidth={12}
          />

          {/* Progress circle */}
          <motion.circle
            cx={128}
            cy={128}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-5xl font-bold text-foreground">{percentage.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </motion.div>
        </div>
      </div>

      {showLabel && (
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color }}>
            {getStatusText()}
          </p>
        </div>
      )}
    </div>
  );
};
