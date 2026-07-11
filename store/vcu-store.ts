import { create } from 'zustand';
import type {
  ThrottleConfiguration,
  BrakeConfiguration,
  MotorControlConfiguration,
  SystemConfiguration,
  HealthStatus,
  Annunciators,
  ChatMessage,
  PredictionResult,
  Alert,
} from '@/types';

export interface VCUState {
  // Motor Control
  motorRunning: boolean;
  faulted: boolean;
  connected: boolean;
  operatingTime: number;
  motorTemperature: number;
  requestedTorque: number;
  dcVoltage: number;

  // Temperature System
  inverterTemperature: number;
  actualTorque: number;
  dcCurrent: number;
  power: number;

  // Throttle/Brake
  throttleLevel: number;
  brakeLevel: number;

  // RPM
  rpm: number;

  // Warnings & Annunciators
  warnings: string[];
  annunciators: Annunciators;

  // Battery & Power
  batteryVoltage: number;
  maximumSpeed: number;
  maximumTorque: number;

  // System
  coolingFanState: boolean;
  mainContactorState: boolean;
  prechargeRelayState: boolean;
  logLevel: string;

  // Health & Prediction
  prediction: PredictionResult;
  healthScore: number;
  healthStatus: HealthStatus;

  // Configuration
  throttleConfiguration: ThrottleConfiguration;
  brakeConfiguration: BrakeConfiguration;
  motorControlConfiguration: MotorControlConfiguration;
  systemConfiguration: SystemConfiguration;

  // Chat & History
  chatHistory: ChatMessage[];

  // Health metrics history
  healthMetrics: Array<{
    timestamp: number;
    motorTemp: number;
    inverterTemp: number;
    voltage: number;
    current: number;
    torque: number;
    power: number;
    throttle: number;
    rpm: number;
  }>;

  // Actions
  updateMotorControl: (data: Partial<VCUState>) => void;
  updateAnnunciators: (data: Partial<Annunciators>) => void;
  addWarning: (warning: string) => void;
  clearWarnings: () => void;
  updateThrottleConfig: (config: Partial<ThrottleConfiguration>) => void;
  updateBrakeConfig: (config: Partial<BrakeConfiguration>) => void;
  updateMotorControlConfig: (config: Partial<MotorControlConfiguration>) => void;
  updateSystemConfig: (config: Partial<SystemConfiguration>) => void;
  updatePrediction: (prediction: PredictionResult) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  addHealthMetric: (metric: {
    motorTemp: number;
    inverterTemp: number;
    voltage: number;
    current: number;
    torque: number;
    power: number;
    throttle: number;
    rpm: number;
  }) => void;
  clearHealthMetrics: () => void;
  reset: () => void;
}

const defaultAnnunciators: Annunciators = {
  prechargRelay: 'off',
  mainContactor: 'off',
  running: 'off',
  reverse: 'off',
  motorOvertemperature: 'off',
  throttleFault: 'off',
  brakeFault: 'off',
  inverterFault: 'off',
  batteryLow: 'off',
  coolingFanActive: 'off',
  emergencyStop: 'off',
  communicationFault: 'off',
  canBusFault: 'off',
  highVoltageActive: 'off',
  lowVoltageFault: 'off',
  controllerReady: 'warning',
};

const defaultThrottleConfig: ThrottleConfiguration = {
  numberOfThrottlePots: 2,
  minimumSignalLevel1: 0.8,
  maximumSignalLevel1: 4.0,
  minimumSignalLevel2: 0.8,
  maximumSignalLevel2: 4.0,
  creepLevel: 5,
  throttleType: 'Pedal',
  pedalPositionRegenMaximum: 30,
  pedalPositionRegenMinimum: 5,
  pedalPositionForwardMotionStart: 10,
  pedalPosition50ThrottlePercent: 50,
  minimumThrottleRange: 5,
  maximumThrottleRange: 95,
};

const defaultBrakeConfig: BrakeConfiguration = {
  minimumSignalLevel: 0.5,
  maximumSignalLevel: 4.5,
  minimumBrakeRegen: 10,
  maximumBrakeRegen: 50,
};

const defaultMotorControlConfig: MotorControlConfiguration = {
  maximumSpeed: 8000,
  maximumTorque: 300,
};

const defaultSystemConfig: SystemConfiguration = {
  logLevel: 'INFO',
  batteryVoltage: 400,
  prechargrelayOutput: 1,
  prechargeDelay: 2000,
  coolingFanRelayOutput: 2,
  mainContactorRelayOutput: 3,
  coolingFanONTemperature: 80,
  coolingFanOFFTemperature: 70,
  brakeLightOutput: 4,
};

const defaultPrediction: PredictionResult = {
  healthScore: 100,
  healthStatus: 'Healthy',
  alerts: [],
  confidence: 95,
};

export const useVCUStore = create<VCUState>((set) => ({
  // Initial state
  motorRunning: false,
  faulted: false,
  connected: true,
  operatingTime: 0,
  motorTemperature: 45,
  requestedTorque: 0,
  dcVoltage: 400,

  inverterTemperature: 35,
  actualTorque: 0,
  dcCurrent: 0,
  power: 0,

  throttleLevel: 0,
  brakeLevel: 0,

  rpm: 0,

  warnings: [],
  annunciators: defaultAnnunciators,

  batteryVoltage: 400,
  maximumSpeed: 8000,
  maximumTorque: 300,

  coolingFanState: false,
  mainContactorState: false,
  prechargeRelayState: false,
  logLevel: 'INFO',

  prediction: defaultPrediction,
  healthScore: 100,
  healthStatus: 'Healthy',

  throttleConfiguration: defaultThrottleConfig,
  brakeConfiguration: defaultBrakeConfig,
  motorControlConfiguration: defaultMotorControlConfig,
  systemConfiguration: defaultSystemConfig,

  chatHistory: [],

  healthMetrics: [],

  // Actions
  updateMotorControl: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  updateAnnunciators: (data) =>
    set((state) => ({
      annunciators: { ...state.annunciators, ...data },
    })),

  addWarning: (warning) =>
    set((state) => ({
      warnings: [...state.warnings, warning],
    })),

  clearWarnings: () =>
    set({
      warnings: [],
    }),

  updateThrottleConfig: (config) =>
    set((state) => ({
      throttleConfiguration: { ...state.throttleConfiguration, ...config },
    })),

  updateBrakeConfig: (config) =>
    set((state) => ({
      brakeConfiguration: { ...state.brakeConfiguration, ...config },
    })),

  updateMotorControlConfig: (config) =>
    set((state) => ({
      motorControlConfiguration: { ...state.motorControlConfiguration, ...config },
    })),

  updateSystemConfig: (config) =>
    set((state) => ({
      systemConfiguration: { ...state.systemConfiguration, ...config },
    })),

  updatePrediction: (prediction) =>
    set({
      prediction,
      healthScore: prediction.healthScore,
      healthStatus: prediction.healthStatus,
    }),

  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),

  clearChatHistory: () =>
    set({
      chatHistory: [],
    }),

  addHealthMetric: (metric) =>
    set((state) => ({
      healthMetrics: [
        ...state.healthMetrics.slice(-299),
        { timestamp: Date.now(), ...metric },
      ],
    })),

  clearHealthMetrics: () =>
    set({
      healthMetrics: [],
    }),

  reset: () =>
    set({
      motorRunning: false,
      faulted: false,
      connected: true,
      operatingTime: 0,
      motorTemperature: 45,
      requestedTorque: 0,
      dcVoltage: 400,
      inverterTemperature: 35,
      actualTorque: 0,
      dcCurrent: 0,
      power: 0,
      throttleLevel: 0,
      brakeLevel: 0,
      rpm: 0,
      warnings: [],
      annunciators: defaultAnnunciators,
      batteryVoltage: 400,
      coolingFanState: false,
      mainContactorState: false,
      prechargeRelayState: false,
      prediction: defaultPrediction,
      healthScore: 100,
      healthStatus: 'Healthy',
      chatHistory: [],
      healthMetrics: [],
    }),
}));
