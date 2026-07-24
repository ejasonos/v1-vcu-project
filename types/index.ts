export type SystemStatus = 'Normal' | 'Warning' | 'Fault';

export type FailureMode = 'Normal' | 'HighTemperature' | 'LowBattery' | 'HighCurrent' | 'SensorFault';

export type BatteryState = 'Healthy' | 'Low' | 'Critical';

export type VehicleMode = 'Idle' | 'Running' | 'Charging';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SimulationSettings {
  speed: 'Slow' | 'Normal' | 'Fast';
  batteryDrainRate: 'Low' | 'Medium' | 'High';
  temperatureIncreaseRate: 'Slow' | 'Normal' | 'Fast';
}

export interface SimulationMetric {
  timestamp: number;
  batterySoc: number;
  batteryTemperature: number;
  motorSpeed: number;
  motorTemperature: number;
  throttlePosition: number;
  brakePosition: number;
  vehicleSpeed: number;
}

export interface SimulationData {
  batterySoc: number; // 0-100%
  batteryHealth: number; // 0-100%
  batteryTemperature: number; // °C
  motorSpeed: number; // RPM
  motorTemperature: number; // °C
  throttlePosition: number; // 0-100%
  brakePosition: number; // 0-100%
  vehicleSpeed: number; // km/h
  chargingStatus: 'Not Charging' | 'Charging' | 'Discharging';
  faultStatus: string | null;
  systemStatus: SystemStatus;
}
