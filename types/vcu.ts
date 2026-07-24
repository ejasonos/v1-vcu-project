// VCU Data Types
export interface VCUState {
  // Motor Control
  motorRunning: boolean;
  faulted: boolean;
  connected: boolean;
  operatingTime: number; // seconds
  motorTemperature: number; // °C
  requestedTorque: number; // Nm
  actualTorque: number; // Nm
  dcVoltage: number; // V
  dcCurrent: number; // A
  power: number; // kW

  // Throttle / Brake
  throttleLevel: number; // %
  brakeLevel: number; // %

  // Temperature System
  inverterTemperature: number; // °C

  // Additional monitoring
  rpm: number;
  batteryVoltage: number; // V
  maximumSpeed: number; // RPM
  maximumTorque: number; // Nm
  coolingFanState: boolean;
  mainContactorState: boolean;
  prechargeRelayState: boolean;

  // Annunciators (status indicators)
  annunciators: {
    prechargeRelay: AnnunciatorState;
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
  };

  // Configuration
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  throttleConfiguration: ThrottleConfig;
  brakeConfiguration: BrakeConfig;

  // Health & Prediction
  healthScore: number; // 0-100
  healthStatus: 'healthy' | 'warning' | 'critical';
  prediction: PredictionState;
  warnings: Warning[];

  // AI Chat
  chatHistory: ChatMessage[];
}

export type AnnunciatorState = 'off' | 'warning' | 'critical' | 'active';

export interface ThrottleConfig {
  numberOfPots: number;
  minSignalLevel1: number;
  maxSignalLevel1: number;
  minSignalLevel2: number;
  maxSignalLevel2: number;
  creepLevel: number; // %
  throttleType: 'pedal' | 'joystick';
  pedalPositionRegenMax: number; // %
  pedalPositionRegenMin: number; // %
  pedalPositionForwardMotionStart: number; // %
  pedalPosition50Throttle: number; // %
  minimumThrottleRange: number; // %
  maximumThrottleRange: number; // %
}

export interface BrakeConfig {
  minSignalLevel: number;
  maxSignalLevel: number;
  minBrakeRegen: number; // %
  maxBrakeRegen: number; // %
}

export interface PredictionState {
  status: 'healthy' | 'attention_required' | 'maintenance_soon' | 'critical_failure_risk';
  confidence: number; // 0-100
  alerts: Alert[];
  maintenanceRecommendations: string[];
  estimatedSafeOperation: number; // hours
}

export interface Alert {
  id: string;
  message: string;
  severity: 'warning' | 'critical';
  confidence: number; // 0-100
  timestamp: number;
  recommendedAction: string;
}

export interface Warning {
  id: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Chart data for monitoring
export interface ChartDataPoint {
  timestamp: number;
  motorTemperature?: number;
  inverterTemperature?: number;
  voltage?: number;
  current?: number;
  torque?: number;
  power?: number;
  throttle?: number;
  rpm?: number;
}
