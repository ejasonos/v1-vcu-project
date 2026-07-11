export type HealthStatus = 'Healthy' | 'Attention Required' | 'Maintenance Soon' | 'Critical Failure Risk';

export type AnnunciatorState = 'off' | 'warning' | 'critical' | 'inactive';

export type AlertLevel = 'normal' | 'warning' | 'critical';

export interface ThrottleConfiguration {
  numberOfThrottlePots: number;
  minimumSignalLevel1: number;
  maximumSignalLevel1: number;
  minimumSignalLevel2: number;
  maximumSignalLevel2: number;
  creepLevel: number;
  throttleType: string;
  pedalPositionRegenMaximum: number;
  pedalPositionRegenMinimum: number;
  pedalPositionForwardMotionStart: number;
  pedalPosition50ThrottlePercent: number;
  minimumThrottleRange: number;
  maximumThrottleRange: number;
}

export interface BrakeConfiguration {
  minimumSignalLevel: number;
  maximumSignalLevel: number;
  minimumBrakeRegen: number;
  maximumBrakeRegen: number;
}

export interface MotorControlConfiguration {
  maximumSpeed: number;
  maximumTorque: number;
}

export interface SystemConfiguration {
  logLevel: string;
  batteryVoltage: number;
  prechargrelayOutput: number;
  prechargeDelay: number;
  coolingFanRelayOutput: number;
  mainContactorRelayOutput: number;
  coolingFanONTemperature: number;
  coolingFanOFFTemperature: number;
  brakeLightOutput: number;
}

export interface Alert {
  id: string;
  timestamp: number;
  message: string;
  level: AlertLevel;
  confidence: number;
  recommendedAction?: string;
  estimatedTimeRemaining?: number;
}

export interface HealthMetric {
  timestamp: number;
  motorTemp: number;
  inverterTemp: number;
  voltage: number;
  current: number;
  torque: number;
  power: number;
  throttle: number;
  rpm: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface PredictionResult {
  healthScore: number;
  healthStatus: HealthStatus;
  alerts: Alert[];
  possibleFault?: string;
  confidence: number;
  recommendedAction?: string;
  estimatedRemainingTime?: number;
}

export interface Annunciators {
  prechargRelay: AnnunciatorState;
  mainContactor: AnnunciatorState;
  running: AnnunciatorState;
  reverse: AnnunciatorState;
  motorOvertemperature: AnnunciatorState;
  throttleFault: AnnunciatorState;
  brakeFault: AnnunciatorState;
  inverterFault: AnnunciatorState;
  batteryLow: AnnunciatorState;
  coolingFanActive: AnnunciatorState;
  emergencyStop: AnnunciatorState;
  communicationFault: AnnunciatorState;
  canBusFault: AnnunciatorState;
  highVoltageActive: AnnunciatorState;
  lowVoltageFault: AnnunciatorState;
  controllerReady: AnnunciatorState;
}
