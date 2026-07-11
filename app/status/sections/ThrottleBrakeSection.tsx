'use client';

import React from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { Card } from '@/components/ui/Card';
import { Gauge } from '@/components/gauges/Gauge';

export const ThrottleBrakeSection: React.FC = () => {
  const vcuState = useVCUStore();

  return (
    <Card title="Throttle / Brake Control" subtitle="Driver input and motor response">
      <div className="grid grid-cols-2 gap-8 py-4">
        <div className="flex justify-center">
          <Gauge
            value={vcuState.throttleLevel}
            min={0}
            max={100}
            unit="%"
            label="Throttle Level"
            size="medium"
            showValue={true}
          />
        </div>
        <div className="flex justify-center">
          <Gauge
            value={vcuState.brakeLevel}
            min={0}
            max={100}
            unit="%"
            label="Brake Level"
            size="medium"
            showValue={true}
          />
        </div>
      </div>
    </Card>
  );
};
