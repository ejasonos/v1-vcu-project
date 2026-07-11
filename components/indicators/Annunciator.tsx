'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { AnnunciatorState } from '@/types';

interface AnnunciatorProps {
  label: string;
  state: AnnunciatorState;
  size?: 'small' | 'medium';
}

export const Annunciator: React.FC<AnnunciatorProps> = ({ label, state, size = 'medium' }) => {
  const sizeConfig = {
    small: {
      diameter: 40,
      labelSize: 'text-xs',
    },
    medium: {
      diameter: 56,
      labelSize: 'text-sm',
    },
  };

  const config = sizeConfig[size];

  const getColor = () => {
    switch (state) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'off':
        return '#374151';
      case 'inactive':
        return '#4b5563';
      default:
        return '#374151';
    }
  };

  const getGlow = () => {
    switch (state) {
      case 'critical':
        return '0 0 20px rgba(239, 68, 68, 0.6)';
      case 'warning':
        return '0 0 16px rgba(245, 158, 11, 0.5)';
      default:
        return 'none';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={{
          boxShadow: state === 'critical' ? ['0 0 20px rgba(239, 68, 68, 0.6)', '0 0 30px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.6)'] : getGlow(),
        }}
        transition={{
          duration: state === 'critical' ? 1.5 : 0,
          repeat: state === 'critical' ? Infinity : 0,
        }}
        className="rounded-full"
        style={{ width: config.diameter, height: config.diameter }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: getColor(),
            backgroundColor: `${getColor()}20`,
          }}
          animate={state === 'warning' ? { opacity: [1, 0.5, 1] } : {}}
          transition={state === 'warning' ? { duration: 1, repeat: Infinity } : {}}
        >
          <div
            className="w-1/3 h-1/3 rounded-full"
            style={{
              backgroundColor: getColor(),
              boxShadow: `0 0 8px ${getColor()}`,
            }}
          />
        </motion.div>
      </motion.div>

      <span className={`${config.labelSize} text-muted-foreground text-center font-medium w-full px-1 line-clamp-2`}>
        {label}
      </span>
    </div>
  );
};
