'use client';

import React, { useEffect } from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { calculateHealthScore } from '@/lib/health-score';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CircularProgress } from '@/components/indicators/CircularProgress';
import { Annunciator } from '@/components/indicators/Annunciator';
import { Gauge } from '@/components/gauges/Gauge';
import { MotorControlSection } from './sections/MotorControlSection';
import { TemperatureSystemSection } from './sections/TemperatureSystemSection';
import { ThrottleBrakeSection } from './sections/ThrottleBrakeSection';
import { PredictionSection } from './sections/PredictionSection';

export default function StatusPage() {
  const vcuState = useVCUStore();
  const prevHealthScoreRef = React.useRef<number | null>(null);

  const healthEval = React.useMemo(() => calculateHealthScore(vcuState), [vcuState]);

  useEffect(() => {
    if (prevHealthScoreRef.current !== healthEval.healthScore) {
      prevHealthScoreRef.current = healthEval.healthScore;
      vcuState.updatePrediction({
        healthScore: healthEval.healthScore,
        healthStatus: healthEval.healthStatus,
        alerts: healthEval.alerts,
        possibleFault: healthEval.possibleFault,
        confidence: healthEval.confidence,
        recommendedAction: healthEval.recommendedAction,
        estimatedRemainingTime: healthEval.estimatedRemainingTime,
      });
    }
  }, [healthEval, vcuState]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">VCU Status Monitor</h1>
          <p className="text-muted-foreground">Real-time vehicle control unit performance and diagnostics</p>
        </div>

        {/* Health Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Card className="flex items-center justify-center h-full">
              <CircularProgress
                value={healthEval.healthScore}
                max={100}
                healthStatus={healthEval.healthStatus}
                showLabel={true}
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <PredictionSection healthEval={healthEval} />
          </div>
        </div>

        {/* Main Status Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MotorControlSection />
          <TemperatureSystemSection />
        </div>

        {/* Throttle/Brake Section */}
        <div className="mb-8">
          <ThrottleBrakeSection />
        </div>

        {/* Annunciators Grid */}
        <div>
          <Card title="System Annunciators" subtitle="Status indicators for vehicle systems">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              <Annunciator
                label="Precharge Relay"
                state={vcuState.annunciators.prechargRelay}
              />
              <Annunciator
                label="Main Contactor"
                state={vcuState.annunciators.mainContactor}
              />
              <Annunciator
                label="Running"
                state={vcuState.annunciators.running}
              />
              <Annunciator
                label="Reverse"
                state={vcuState.annunciators.reverse}
              />
              <Annunciator
                label="Motor Overtemp"
                state={vcuState.annunciators.motorOvertemperature}
              />
              <Annunciator
                label="Throttle Fault"
                state={vcuState.annunciators.throttleFault}
              />
              <Annunciator
                label="Brake Fault"
                state={vcuState.annunciators.brakeFault}
              />
              <Annunciator
                label="Inverter Fault"
                state={vcuState.annunciators.inverterFault}
              />
              <Annunciator
                label="Battery Low"
                state={vcuState.annunciators.batteryLow}
              />
              <Annunciator
                label="Cooling Fan"
                state={vcuState.annunciators.coolingFanActive}
              />
              <Annunciator
                label="Emergency Stop"
                state={vcuState.annunciators.emergencyStop}
              />
              <Annunciator
                label="Comm Fault"
                state={vcuState.annunciators.communicationFault}
              />
              <Annunciator
                label="CAN Bus Fault"
                state={vcuState.annunciators.canBusFault}
              />
              <Annunciator
                label="High Voltage"
                state={vcuState.annunciators.highVoltageActive}
              />
              <Annunciator
                label="Low Voltage"
                state={vcuState.annunciators.lowVoltageFault}
              />
              <Annunciator
                label="Controller Ready"
                state={vcuState.annunciators.controllerReady}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
