'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { HealthEvaluation } from '@/lib/health-score';

interface PredictionSectionProps {
  healthEval: HealthEvaluation;
}

export const PredictionSection: React.FC<PredictionSectionProps> = ({ healthEval }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return '#10b981';
      case 'Attention Required':
        return '#f59e0b';
      case 'Maintenance Soon':
        return '#f97316';
      case 'Critical Failure Risk':
        return '#ef4444';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <Card title="AI Prediction & Health" subtitle="System diagnosis and recommendations">
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Health Status</span>
          <span
            className="px-3 py-1 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: `${getStatusColor(healthEval.healthStatus)}20`,
              color: getStatusColor(healthEval.healthStatus),
              border: `1px solid ${getStatusColor(healthEval.healthStatus)}40`,
            }}
          >
            {healthEval.healthStatus}
          </span>
        </div>

        {/* Possible Fault */}
        {healthEval.possibleFault && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs font-semibold text-red-400 mb-1">Possible Fault</p>
            <p className="text-sm text-red-300">{healthEval.possibleFault}</p>
          </div>
        )}

        {/* Confidence */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Confidence</span>
          <span className="text-sm font-semibold text-foreground">{healthEval.confidence}%</span>
        </div>

        {/* Recommendation */}
        {healthEval.recommendedAction && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs font-semibold text-blue-400 mb-1">Recommended Action</p>
            <p className="text-sm text-blue-300">{healthEval.recommendedAction}</p>
          </div>
        )}

        {/* Active Alerts */}
        {healthEval.alerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Active Alerts ({healthEval.alerts.length})</p>
            <div className="space-y-2">
              {healthEval.alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-2 rounded-lg text-xs"
                  style={{
                    backgroundColor:
                      alert.level === 'critical'
                        ? '#ef4444'
                        : alert.level === 'warning'
                          ? '#f59e0b'
                          : '#10b981' + '20',
                    border: `1px solid ${alert.level === 'critical' ? '#ef4444' : alert.level === 'warning' ? '#f59e0b' : '#10b981'}40`,
                  }}
                >
                  <p
                    style={{
                      color:
                        alert.level === 'critical'
                          ? '#fca5a5'
                          : alert.level === 'warning'
                            ? '#fcd34d'
                            : '#86efac',
                    }}
                  >
                    {alert.message}
                  </p>
                  <p className="text-xs opacity-75 mt-1">Confidence: {alert.confidence}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
