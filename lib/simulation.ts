import type { VCUState } from '@/store/vcu-store';
import type { AnnunciatorState } from '@/types';

export interface SimulationState {
  motorRunning: boolean;
  throttleTarget: number;
  brakeTarget: number;
  rpmTarget: number;
  failureMode: 'none' | 'high-temp' | 'high-current' | 'low-voltage' | 'sensor-fault';
}

const simState: SimulationState = {
  motorRunning: false,
  throttleTarget: 0,
  brakeTarget: 0,
  rpmTarget: 0,
  failureMode: 'none',
};

export function initializeSimulation() {
  simState.motorRunning = false;
  simState.throttleTarget = 0;
  simState.brakeTarget = 0;
  simState.rpmTarget = 0;
  simState.failureMode = 'none';
}

export function updateSimulationTargets(throttle: number, brake: number) {
  simState.throttleTarget = Math.max(0, Math.min(100, throttle));
  simState.brakeTarget = Math.max(0, Math.min(100, brake));

  if (throttle > 5) {
    simState.motorRunning = true;
    simState.rpmTarget = (throttle / 100) * 8000;
  } else if (brake > 10) {
    simState.rpmTarget = Math.max(0, simState.rpmTarget - 200);
  }

  if (throttle < 2 && brake < 2) {
    if (simState.rpmTarget < 100) {
      simState.motorRunning = false;
    }
  }
}

export function setSimulationFailureMode(mode: SimulationState['failureMode']) {
  simState.failureMode = mode;
}

export function simulateVCUUpdate(currentState: Partial<VCUState>): Partial<VCUState> {
  const updates: Partial<VCUState> = {};

  // Smoothly update throttle and brake
  const currentThrottle = currentState.throttleLevel || 0;
  const currentBrake = currentState.brakeLevel || 0;

  updates.throttleLevel = currentThrottle + (simState.throttleTarget - currentThrottle) * 0.2;
  updates.brakeLevel = currentBrake + (simState.brakeTarget - currentBrake) * 0.2;

  // Update RPM
  const currentRpm = currentState.rpm || 0;
  updates.rpm = currentRpm + (simState.rpmTarget - currentRpm) * 0.1;

  // Torque is proportional to throttle
  updates.requestedTorque = (updates.throttleLevel! / 100) * (currentState.maximumTorque || 300);
  updates.actualTorque = updates.requestedTorque * (0.95 + Math.random() * 0.1);

  // DC Current based on torque and throttle
  const baseCurrentPerTorque = 1.2;
  updates.dcCurrent =
    Math.abs(updates.actualTorque!) * baseCurrentPerTorque + Math.random() * 10 - 5;

  // Power calculation (kW)
  updates.power = (updates.dcCurrent! * (currentState.dcVoltage || 400)) / 1000;

  // Motor temperature simulation
  const currentMotorTemp = currentState.motorTemperature || 45;
  const tempIncrease = (updates.power! / 100) * 0.5;
  const tempDecrease = 0.1;
  const newMotorTemp = currentMotorTemp + tempIncrease - tempDecrease + (Math.random() - 0.5) * 2;
  updates.motorTemperature = Math.max(20, newMotorTemp);

  // Inverter temperature simulation
  const currentInverterTemp = currentState.inverterTemperature || 35;
  const inverterTempIncrease = (updates.power! / 150) * 0.3;
  const newInverterTemp = currentInverterTemp + inverterTempIncrease - 0.05 + (Math.random() - 0.5) * 1;
  updates.inverterTemperature = Math.max(20, newInverterTemp);

  // Operating time
  if (simState.motorRunning) {
    updates.operatingTime = (currentState.operatingTime || 0) + 1;
  }

  // Voltage fluctuation
  const baseVoltage = 400;
  updates.dcVoltage =
    baseVoltage + (Math.random() - 0.5) * 10 - (updates.dcCurrent! / 500) * 20;

  // Battery voltage correlation
  updates.batteryVoltage = updates.dcVoltage;

  // Motor running state
  updates.motorRunning = simState.motorRunning && updates.rpm! > 50;

  // Failure modes
  const updates_annunciators = currentState.annunciators ? { ...currentState.annunciators } : {};

  if (simState.failureMode === 'high-temp') {
    updates.motorTemperature = Math.min(130, updates.motorTemperature + 2);
    updates_annunciators.motorOvertemperature = 'critical';
    updates_annunciators.coolingFanActive = 'warning';
  } else {
    updates_annunciators.motorOvertemperature = updates.motorTemperature! > 110 ? 'critical' : 'off';
    updates_annunciators.coolingFanActive =
      updates.motorTemperature! > 80 ? 'warning' : 'off';
  }

  if (simState.failureMode === 'high-current') {
    updates.dcCurrent = Math.min(550, updates.dcCurrent! + 20);
    updates_annunciators.inverterFault = 'warning';
  } else {
    updates_annunciators.inverterFault = updates.dcCurrent! > 500 ? 'critical' : 'off';
  }

  if (simState.failureMode === 'low-voltage') {
    updates.batteryVoltage = Math.max(250, updates.batteryVoltage! - 10);
    updates.dcVoltage = updates.batteryVoltage;
    updates_annunciators.batteryLow = 'critical';
    updates_annunciators.lowVoltageFault = 'critical';
  } else {
    updates_annunciators.batteryLow = updates.batteryVoltage! < 300 ? 'critical' : 'off';
    updates_annunciators.lowVoltageFault = updates.dcVoltage! < 300 ? 'critical' : 'off';
  }

  if (simState.failureMode === 'sensor-fault') {
    updates_annunciators.throttleFault = 'warning';
    updates_annunciators.communicationFault = Math.random() > 0.7 ? 'warning' : 'off';
  } else {
    updates_annunciators.throttleFault = 'off';
    updates_annunciators.communicationFault = 'off';
  }

  // Set normal operational annunciators
  updates_annunciators.running = simState.motorRunning ? 'warning' : 'off';
  updates_annunciators.mainContactor = simState.motorRunning ? 'warning' : 'off';
  updates_annunciators.prechargRelay = simState.motorRunning ? 'warning' : 'off';
  updates_annunciators.highVoltageActive = simState.motorRunning ? 'warning' : 'off';
  updates_annunciators.controllerReady = 'warning';
  updates_annunciators.reverse = 'off';
  updates_annunciators.brakeFault = 'off';
  updates_annunciators.emergencyStop = 'off';
  updates_annunciators.canBusFault = 'off';

  updates.annunciators = updates_annunciators;

  // Probabilistic fault generation
  if (Math.random() < 0.02) {
    updates.warnings = [
      ...(currentState.warnings || []),
      `Transient fault at ${new Date().toLocaleTimeString()}`,
    ].slice(-5);
  }

  return updates;
}

export function getSimulationState(): SimulationState {
  return { ...simState };
}
