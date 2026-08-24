import type { SimulationData, FailureMode } from '@/types';

export interface SimulationState {
  motorRunning: boolean;
  throttleTarget: number;
  brakeTarget: number;
  motorSpeedTarget: number;
  failureMode: FailureMode;
  timeElapsed: number;
}

const simState: SimulationState = {
  motorRunning: false,
  throttleTarget: 0,
  brakeTarget: 0,
  motorSpeedTarget: 0,
  failureMode: 'Normal',
  timeElapsed: 0,
};

export function initializeSimulation() {
  simState.motorRunning = false;
  simState.throttleTarget = 0;
  simState.brakeTarget = 0;
  simState.motorSpeedTarget = 0;
  simState.failureMode = 'Normal';
  simState.timeElapsed = 0;
}

export function updateSimulationTargets(throttle: number, brake: number) {
  simState.throttleTarget = Math.max(0, Math.min(100, throttle));
  simState.brakeTarget = Math.max(0, Math.min(100, brake));

  // Motor running logic
  if (throttle > 5) {
    simState.motorRunning = true;
    simState.motorSpeedTarget = (throttle / 100) * 8000;
  } else if (brake > 10) {
    simState.motorSpeedTarget = Math.max(0, simState.motorSpeedTarget - 300);
  }

  if (throttle < 2 && brake < 2) {
    if (simState.motorSpeedTarget < 100) {
      simState.motorRunning = false;
    }
  }
}

export function setSimulationFailureMode(mode: FailureMode) {
  simState.failureMode = mode;
}

export function simulateVCUUpdate(currentData: SimulationData): SimulationData {
  const newData = { ...currentData };

  // Increment time
  simState.timeElapsed += 1;

  // Update throttle and brake positions smoothly
  newData.throttlePosition =
    currentData.throttlePosition + (simState.throttleTarget - currentData.throttlePosition) * 0.2;
  newData.brakePosition =
    currentData.brakePosition + (simState.brakeTarget - currentData.brakePosition) * 0.2;

  // Update motor speed
  newData.motorSpeed =
    currentData.motorSpeed + (simState.motorSpeedTarget - currentData.motorSpeed) * 0.1;

  // Vehicle speed proportional to motor speed (simplified)
  newData.vehicleSpeed = (newData.motorSpeed / 8000) * 200;

  // Battery discharge based on throttle
  const drainRate = (simState.throttleTarget / 100) * 0.5; // 0.5% max per second
  newData.batterySoc = Math.max(0, currentData.batterySoc - drainRate);

  // Battery charging if not moving
  if (simState.throttleTarget < 5 && simState.brakeTarget < 5) {
    if (newData.chargingStatus === 'Charging') {
      newData.batterySoc = Math.min(100, currentData.batterySoc + 0.2);
    }
  }

  // Motor temperature increases with load, decreases over time
  const loadFactor = simState.throttleTarget / 100;
  const tempIncrease = loadFactor * 0.3;
  const tempDecrease = 0.05;
  newData.motorTemperature =
    Math.max(25, currentData.motorTemperature + tempIncrease - tempDecrease) +
    (Math.random() - 0.5) * 0.5;

  // Battery temperature increases with discharge, affected by motor temp
  const batteryLoadFactor = drainRate / 0.5;
  const batteryTempIncrease = batteryLoadFactor * 0.2 + (newData.motorTemperature - 25) * 0.01;
  const batteryTempDecrease = 0.02;
  newData.batteryTemperature = Math.max(20, currentData.batteryTemperature + batteryTempIncrease - batteryTempDecrease) + (Math.random() - 0.5) * 0.3;

  // Battery health degrades with use and more quickly during a current fault.
  const healthDegradation = 0.01 + loadFactor * 0.02 + (simState.failureMode === 'HighCurrent' ? 0.05 : 0);
  newData.batteryHealth = Math.max(0, currentData.batteryHealth - healthDegradation);

  // Determine system status based on conditions
  let systemStatus = 'Normal' as const;
  let faultStatus = null as string | null;

  // Apply failure modes
  if (simState.failureMode === 'HighTemperature') {
    newData.motorTemperature = Math.max(125, newData.motorTemperature);
    systemStatus = 'Warning';
    faultStatus = 'High Motor Temperature';
  }

  if (simState.failureMode === 'LowBattery') {
    newData.batterySoc = Math.min(15, Math.max(0, newData.batterySoc - 2));
    if (newData.batterySoc < 20) {
      systemStatus = 'Fault';
      faultStatus = 'Battery Critically Low';
    } else {
      systemStatus = 'Warning';
      faultStatus = 'Low Battery';
    }
  }

  if (simState.failureMode === 'HighCurrent') {
    // Simulate high current draw
    newData.batterySoc = Math.max(0, newData.batterySoc - 1);
    systemStatus = 'Warning';
    faultStatus = 'High Current Draw';
  }

  if (simState.failureMode === 'SensorFault') {
    systemStatus = 'Warning';
    faultStatus = 'Sensor Fault Detected';
  }

  // Temperature-based warnings
  if (newData.motorTemperature > 120) {
    systemStatus = 'Fault';
    faultStatus = 'Motor Overtemperature';
  } else if (newData.motorTemperature > 100) {
    if (systemStatus !== 'Fault') systemStatus = 'Warning';
    if (!faultStatus) faultStatus = 'High Motor Temperature';
  }

  // Battery temperature warnings
  if (newData.batteryTemperature > 60) {
    if (systemStatus !== 'Fault') systemStatus = 'Warning';
    if (!faultStatus) faultStatus = 'High Battery Temperature';
  }

  // Battery health warnings
  if (newData.batteryHealth < 20) {
    if (systemStatus !== 'Fault') systemStatus = 'Warning';
    if (!faultStatus) faultStatus = 'Battery Health Degraded';
  }

  newData.systemStatus = systemStatus;
  newData.faultStatus = faultStatus;

  // Determine charging status
  if (newData.motorSpeed < 50 && newData.brakePosition > 80) {
    newData.chargingStatus = 'Charging';
  } else if (newData.motorSpeed > 0) {
    newData.chargingStatus = 'Discharging';
  } else {
    newData.chargingStatus = 'Not Charging';
  }

  return newData;
}

export function getSimulationState(): SimulationState {
  return { ...simState };
}
