'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  padding = 'md',
  hoverable = true,
}) => {
  const paddingConfig = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <motion.div
      className={`rounded-lg border border-border bg-card ${paddingConfig[padding]} ${className}`}
      whileHover={hoverable ? { y: -2, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)' } : {}}
      transition={{ duration: 0.2 }}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
};
