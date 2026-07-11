'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  min = 0,
  max = 100,
  unit = '',
  label = '',
  size = 'medium',
  showValue = true,
}) => {
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  // Determine color based on value
  const getColor = () => {
    if (percentage <= 30) return '#10b981'; // green
    if (percentage <= 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Size configuration
  const sizeConfig = {
    small: {
      diameter: 100,
      strokeWidth: 6,
      fontSize: 'text-xs',
      labelFontSize: 'text-xs',
    },
    medium: {
      diameter: 160,
      strokeWidth: 8,
      fontSize: 'text-sm',
      labelFontSize: 'text-sm',
    },
    large: {
      diameter: 220,
      strokeWidth: 10,
      fontSize: 'text-lg',
      labelFontSize: 'text-base',
    },
  };

  const config = sizeConfig[size];
  const radius = config.diameter / 2 - config.strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {label && <p className={`${config.labelFontSize} text-muted-foreground font-medium`}>{label}</p>}

      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          width={config.diameter}
          height={config.diameter}
          className="transform -rotate-90"
          style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.1))' }}
        >
          {/* Background circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="#1F2937"
            strokeWidth={config.strokeWidth}
          />

          {/* Progress circle */}
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${getColor()})` }}
          />
        </svg>

        {/* Center value */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${config.fontSize} font-bold text-foreground`}>
              {normalizedValue.toFixed(1)}
            </span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
