'use client';

import React from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const MotorControlSection: React.FC = () => {
  const vcuState = useVCUStore();

  const motorStatus =
    vcuState.motorRunning && !vcuState.faulted ? 'healthy' : vcuState.faulted ? 'critical' : 'warning';

  return (
    <Card title="Motor Control" subtitle="Motor operational status and parameters">
      <div className="space-y-3">
        <StatusBadge
          label="Motor Running"
          value={vcuState.motorRunning ? 'Yes' : 'No'}
          status={vcuState.motorRunning ? 'healthy' : 'warning'}
        />
        <StatusBadge
          label="Faulted"
          value={vcuState.faulted ? 'Yes' : 'No'}
          status={vcuState.faulted ? 'critical' : 'healthy'}
        />
        <StatusBadge
          label="Connected"
          value={vcuState.connected ? 'Connected' : 'Disconnected'}
          status={vcuState.connected ? 'healthy' : 'critical'}
        />
        <StatusBadge
          label="Motor Temperature"
          value={vcuState.motorTemperature.toFixed(1)}
          unit="°C"
          status={
            vcuState.motorTemperature > 110
              ? 'critical'
              : vcuState.motorTemperature > 90
                ? 'warning'
                : 'healthy'
          }
        />
        <StatusBadge
          label="Requested Torque"
          value={vcuState.requestedTorque.toFixed(1)}
          unit="Nm"
          status="healthy"
        />
        <StatusBadge
          label="DC Voltage"
          value={vcuState.dcVoltage.toFixed(1)}
          unit="V"
          status={
            vcuState.dcVoltage < 300
              ? 'critical'
              : vcuState.dcVoltage < 350
                ? 'warning'
                : 'healthy'
          }
        />
        <StatusBadge
          label="Operating Time"
          value={(vcuState.operatingTime / 3600).toFixed(1)}
          unit="hrs"
          status="healthy"
        />
        {vcuState.warnings.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-3 mt-4">
            <p className="text-sm font-semibold text-yellow-400 mb-2">Active Warnings</p>
            <ul className="space-y-1">
              {vcuState.warnings.slice(-3).map((warning, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">
                  • {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
