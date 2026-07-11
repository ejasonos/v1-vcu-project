import type { VCUState } from '@/store/vcu-store';
import type { HealthStatus, Alert } from '@/types';

export interface HealthEvaluation {
  healthScore: number;
  healthStatus: HealthStatus;
  alerts: Alert[];
  possibleFault?: string;
  confidence: number;
  recommendedAction?: string;
  estimatedRemainingTime?: number;
}

export function calculateHealthScore(state: Partial<VCUState>): HealthEvaluation {
  let healthScore = 100;
  const alerts: Alert[] = [];
  let possibleFault: string | undefined;
  let recommendedAction: string | undefined;
  let estimatedRemainingTime: number | undefined;

  // Motor Temperature Checks
  if ((state.motorTemperature || 0) > 110) {
    healthScore -= 25;
    alerts.push({
      id: `alert-motor-temp-critical-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Motor temperature critical - system overheating',
      level: 'critical',
      confidence: 98,
      recommendedAction: 'Stop vehicle immediately and allow cooling',
      estimatedTimeRemaining: 5,
    });
    possibleFault = 'Motor thermal failure imminent';
  } else if ((state.motorTemperature || 0) > 90) {
    healthScore -= 15;
    alerts.push({
      id: `alert-motor-temp-warning-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Motor temperature rising abnormally',
      level: 'warning',
      confidence: 85,
      recommendedAction: 'Reduce load and monitor cooling system',
    });
  }

  // Inverter Temperature Checks
  if ((state.inverterTemperature || 0) > 95) {
    healthScore -= 20;
    alerts.push({
      id: `alert-inverter-temp-${Date.now()}`,
      timestamp: Date.now(),
      message: 'High probability of inverter overheating',
      level: state.inverterTemperature! > 110 ? 'critical' : 'warning',
      confidence: 90,
      recommendedAction: 'Reduce throttle input and check cooling',
    });
  }

  // DC Voltage Checks
  if ((state.batteryVoltage || 0) < 300) {
    healthScore -= 30;
    alerts.push({
      id: `alert-battery-low-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Battery voltage instability detected',
      level: 'critical',
      confidence: 95,
      recommendedAction: 'Battery replacement may be required',
      estimatedTimeRemaining: 15,
    });
    possibleFault = 'Battery failure or disconnection';
  } else if ((state.batteryVoltage || 0) < 350) {
    healthScore -= 10;
    alerts.push({
      id: `alert-battery-warning-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Battery voltage below recommended threshold',
      level: 'warning',
      confidence: 80,
    });
  }

  // DC Current Checks
  if ((state.dcCurrent || 0) > 500) {
    healthScore -= 20;
    alerts.push({
      id: `alert-current-high-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Current draw exceeds expected operating range',
      level: 'critical',
      confidence: 92,
      recommendedAction: 'Check for short circuits or motor winding issues',
    });
  } else if ((state.dcCurrent || 0) > 450) {
    healthScore -= 10;
    alerts.push({
      id: `alert-current-warning-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Current draw approaching maximum safe limit',
      level: 'warning',
      confidence: 85,
    });
  }

  // Torque Mismatch
  const requestedTorque = state.requestedTorque || 0;
  const actualTorque = state.actualTorque || 0;
  const torqueDifference = Math.abs(requestedTorque - actualTorque);
  const torquePercentDiff = requestedTorque !== 0 ? (torqueDifference / Math.abs(requestedTorque)) * 100 : 0;

  if (torquePercentDiff > 25) {
    healthScore -= 15;
    alerts.push({
      id: `alert-torque-mismatch-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Torque output differs from requested torque',
      level: 'warning',
      confidence: 88,
      recommendedAction: 'Check motor encoder and torque sensor calibration',
    });
    possibleFault = 'Motor control or encoder issue';
  }

  // Cooling Fan Status
  if (
    (state.motorTemperature || 0) > (state.systemConfiguration?.coolingFanONTemperature || 80) &&
    !state.coolingFanState
  ) {
    healthScore -= 12;
    alerts.push({
      id: `alert-cooling-fan-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Cooling fan may require inspection',
      level: 'warning',
      confidence: 82,
      recommendedAction: 'Check cooling fan relay and motor connections',
    });
    possibleFault = 'Cooling system malfunction';
  }

  // Annunciator Faults
  const annunciators = state.annunciators || {};
  let activeFaults = 0;

  if (annunciators.inverterFault === 'critical') {
    healthScore -= 20;
    activeFaults++;
    alerts.push({
      id: `alert-inverter-fault-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Inverter fault detected',
      level: 'critical',
      confidence: 95,
      recommendedAction: 'Inverter requires service',
    });
    possibleFault = 'Inverter failure';
  }

  if (annunciators.motorOvertemperature === 'critical') {
    healthScore -= 18;
    activeFaults++;
  }

  if (annunciators.throttleFault === 'critical' || annunciators.throttleFault === 'warning') {
    healthScore -= 10;
    activeFaults++;
    alerts.push({
      id: `alert-throttle-sensor-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Throttle sensor inconsistency detected',
      level: 'warning',
      confidence: 80,
      recommendedAction: 'Recalibrate throttle sensor',
    });
  }

  if (annunciators.brakeFault === 'critical' || annunciators.brakeFault === 'warning') {
    healthScore -= 10;
    activeFaults++;
    alerts.push({
      id: `alert-brake-regen-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Brake regeneration behaving abnormally',
      level: 'warning',
      confidence: 78,
      recommendedAction: 'Check brake system and regen circuit',
    });
  }

  if (annunciators.communicationFault === 'critical') {
    healthScore -= 15;
    activeFaults++;
    alerts.push({
      id: `alert-communication-${Date.now()}`,
      timestamp: Date.now(),
      message: 'CAN communication instability',
      level: 'critical',
      confidence: 90,
      recommendedAction: 'Check CAN bus connections and termination',
    });
    possibleFault = 'Communication system fault';
  }

  if (annunciators.canBusFault === 'critical') {
    healthScore -= 15;
    activeFaults++;
    alerts.push({
      id: `alert-can-bus-${Date.now()}`,
      timestamp: Date.now(),
      message: 'CAN bus fault detected',
      level: 'critical',
      confidence: 92,
      recommendedAction: 'Verify CAN bus wiring and devices',
    });
    possibleFault = 'CAN bus hardware issue';
  }

  if (annunciators.mainContactor === 'critical') {
    healthScore -= 20;
    activeFaults++;
    alerts.push({
      id: `alert-contactor-${Date.now()}`,
      timestamp: Date.now(),
      message: 'Potential contactor failure',
      level: 'critical',
      confidence: 88,
      recommendedAction: 'Main contactor requires replacement',
    });
    possibleFault = 'Contactor mechanical failure';
  }

  if (annunciators.batteryLow === 'critical' || annunciators.batteryLow === 'warning') {
    healthScore -= 10;
    activeFaults++;
  }

  // Multiple simultaneous faults
  if (activeFaults >= 3) {
    healthScore -= 10;
  }

  // Clamp health score between 0 and 100
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Determine health status
  let healthStatus: HealthStatus = 'Healthy';
  if (healthScore >= 80) {
    healthStatus = 'Healthy';
  } else if (healthScore >= 60) {
    healthStatus = 'Attention Required';
  } else if (healthScore >= 40) {
    healthStatus = 'Maintenance Soon';
  } else {
    healthStatus = 'Critical Failure Risk';
  }

  // Calculate confidence
  const confidence = Math.min(98, 70 + (activeFaults > 0 ? 20 : 0));

  return {
    healthScore,
    healthStatus,
    alerts,
    possibleFault,
    confidence,
    recommendedAction,
    estimatedRemainingTime,
  };
}
