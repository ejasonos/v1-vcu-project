'use client';

import React from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const TemperatureSystemSection: React.FC = () => {
  const vcuState = useVCUStore();

  return (
    <Card title="Temperature System" subtitle="Power electronics thermal monitoring">
      <div className="space-y-3">
        <StatusBadge
          label="Inverter Temperature"
          value={vcuState.inverterTemperature.toFixed(1)}
          unit="°C"
          status={
            vcuState.inverterTemperature > 110
              ? 'critical'
              : vcuState.inverterTemperature > 95
                ? 'warning'
                : 'healthy'
          }
        />
        <StatusBadge
          label="Actual Torque"
          value={vcuState.actualTorque.toFixed(1)}
          unit="Nm"
          status="healthy"
        />
        <StatusBadge
          label="DC Current"
          value={vcuState.dcCurrent.toFixed(1)}
          unit="A"
          status={
            vcuState.dcCurrent > 500
              ? 'critical'
              : vcuState.dcCurrent > 450
                ? 'warning'
                : 'healthy'
          }
        />
        <StatusBadge
          label="Power Output"
          value={vcuState.power.toFixed(2)}
          unit="kW"
          status={vcuState.power > 150 ? 'warning' : 'healthy'}
        />
      </div>
    </Card>
  );
};
