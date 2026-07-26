import { create } from 'zustand';
import type {
  FailureMode,
  ChatMessage,
  SimulationData,
  SimulationSettings,
  SimulationMetric,
} from '@/types';
import type {
  AnnunciatorState,
  PredictionState,
  Warning,
  ThrottleConfig,
  BrakeConfig,
} from '@/types/vcu';

export interface VCUState {
  // Simulation Control
  simulationRunning: boolean;
  failureMode: FailureMode;
  userThrottle: number;
  userBrake: number;
  simulationSettings: SimulationSettings;

  // Simulated Vehicle Data
  data: SimulationData;

  // Simulation metrics history
  metrics: SimulationMetric[];

  // Chat & History
  chatHistory: ChatMessage[];

  // VCU state fields used by status UI and AI assistant
  motorRunning: boolean;
  faulted: boolean;
  connected: boolean;
  operatingTime: number;
  motorTemperature: number;
  requestedTorque: number;
  actualTorque: number;
  dcVoltage: number;
  dcCurrent: number;
  power: number;
  throttleLevel: number;
  brakeLevel: number;
  inverterTemperature: number;
  rpm: number;
  batteryVoltage: number;
  maximumSpeed: number;
  maximumTorque: number;
  coolingFanState: boolean;
  mainContactorState: boolean;
  prechargeRelayState: boolean;
  annunciators: {
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
  };
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  throttleConfiguration: ThrottleConfig;
  brakeConfiguration: BrakeConfig;
  healthScore: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
  prediction: PredictionState;
  warnings: Warning[];

  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  setFailureMode: (mode: FailureMode) => void;
  setThrottle: (value: number) => void;
  setBrake: (value: number) => void;
  updateSimulationData: (data: Partial<SimulationData>) => void;
  updateSimulationSettings: (settings: Partial<SimulationSettings>) => void;
  addSimulationMetric: (metric: SimulationMetric) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  resetSimulation: () => void;
  updatePrediction: (prediction: Partial<PredictionState> & {
    healthScore: number;
    healthStatus: 'healthy' | 'warning' | 'critical';
    possibleFault?: string | null;
    recommendedAction?: string | null;
    estimatedRemainingTime?: number | null;
    confidence?: number;
    alerts?: PredictionState['alerts'];
  }) => void;
}

const defaultSimulationData: SimulationData = {
  batterySoc: 100,
  batteryHealth: 95,
  batteryTemperature: 25,
  motorSpeed: 0,
  motorTemperature: 25,
  throttlePosition: 0,
  brakePosition: 0,
  vehicleSpeed: 0,
  chargingStatus: 'Not Charging',
  faultStatus: null,
  systemStatus: 'Normal',
};

const defaultSimulationSettings: SimulationSettings = {
  speed: 'Normal',
  batteryDrainRate: 'Medium',
  temperatureIncreaseRate: 'Normal',
};

const defaultAnnunciators = {
  prechargRelay: 'off' as AnnunciatorState,
  mainContactor: 'active' as AnnunciatorState,
  running: 'off' as AnnunciatorState,
  reverse: 'off' as AnnunciatorState,
  motorOvertemperature: 'off' as AnnunciatorState,
  throttleFault: 'off' as AnnunciatorState,
  brakeFault: 'off' as AnnunciatorState,
  inverterFault: 'off' as AnnunciatorState,
  batteryLow: 'off' as AnnunciatorState,
  coolingFanActive: 'off' as AnnunciatorState,
  emergencyStop: 'off' as AnnunciatorState,
  communicationFault: 'off' as AnnunciatorState,
  canBusFault: 'off' as AnnunciatorState,
  highVoltageActive: 'off' as AnnunciatorState,
  lowVoltageFault: 'off' as AnnunciatorState,
  controllerReady: 'active' as AnnunciatorState,
};

const defaultThrottleConfiguration: ThrottleConfig = {
  numberOfPots: 2,
  minSignalLevel1: 0,
  maxSignalLevel1: 100,
  minSignalLevel2: 0,
  maxSignalLevel2: 100,
  creepLevel: 0,
  throttleType: 'pedal',
  pedalPositionRegenMax: 20,
  pedalPositionRegenMin: 0,
  pedalPositionForwardMotionStart: 10,
  pedalPosition50Throttle: 50,
  minimumThrottleRange: 0,
  maximumThrottleRange: 100,
};

const defaultBrakeConfiguration: BrakeConfig = {
  minSignalLevel: 0,
  maxSignalLevel: 100,
  minBrakeRegen: 0,
  maxBrakeRegen: 20,
};

const defaultPrediction: PredictionState = {
  status: 'healthy',
  confidence: 100,
  alerts: [],
  maintenanceRecommendations: [],
  estimatedSafeOperation: 24,
};

export const useVCUStore = create<VCUState>((set) => ({
  // Initial state
  simulationRunning: false,
  failureMode: 'Normal',
  userThrottle: 0,
  userBrake: 0,
  simulationSettings: defaultSimulationSettings,
  data: defaultSimulationData,
  metrics: [],
  chatHistory: [],
  motorRunning: false,
  faulted: false,
  connected: true,
  operatingTime: 0,
  motorTemperature: defaultSimulationData.motorTemperature,
  requestedTorque: 0,
  actualTorque: 0,
  dcVoltage: 400,
  dcCurrent: 0,
  power: 0,
  throttleLevel: 0,
  brakeLevel: 0,
  inverterTemperature: 25,
  rpm: 0,
  batteryVoltage: 400,
  maximumSpeed: 8000,
  maximumTorque: 300,
  coolingFanState: false,
  mainContactorState: true,
  prechargeRelayState: true,
  annunciators: defaultAnnunciators,
  logLevel: 'INFO',
  throttleConfiguration: defaultThrottleConfiguration,
  brakeConfiguration: defaultBrakeConfiguration,
  healthScore: 95,
  healthStatus: 'healthy',
  prediction: defaultPrediction,
  warnings: [],

  // Actions
  startSimulation: () =>
    set({
      simulationRunning: true,
    }),

  stopSimulation: () =>
    set({
      simulationRunning: false,
    }),

  setFailureMode: (mode) =>
    set({
      failureMode: mode,
    }),

  setThrottle: (value) =>
    set({
      userThrottle: Math.max(0, Math.min(100, value)),
    }),

  setBrake: (value) =>
    set({
      userBrake: Math.max(0, Math.min(100, value)),
    }),

  updateSimulationData: (data) =>
    set((state) => ({
      data: { ...state.data, ...data },
      motorTemperature: data.motorTemperature ?? state.motorTemperature,
      throttleLevel: data.throttlePosition ?? state.throttleLevel,
      brakeLevel: data.brakePosition ?? state.brakeLevel,
      rpm: data.motorSpeed ?? state.rpm,
      inverterTemperature: state.inverterTemperature,
    })),

  updateSimulationSettings: (settings) =>
    set((state) => ({
      simulationSettings: { ...state.simulationSettings, ...settings },
    })),

  addSimulationMetric: (metric) =>
    set((state) => ({
      metrics: [...state.metrics.slice(-299), metric],
    })),

  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),

  clearChatHistory: () =>
    set({
      chatHistory: [],
    }),

  resetSimulation: () =>
    set({
      simulationRunning: false,
      failureMode: 'Normal',
      userThrottle: 0,
      userBrake: 0,
      data: defaultSimulationData,
      metrics: [],
      chatHistory: [],
      motorRunning: false,
      faulted: false,
      connected: true,
      operatingTime: 0,
      motorTemperature: defaultSimulationData.motorTemperature,
      requestedTorque: 0,
      actualTorque: 0,
      dcVoltage: 400,
      dcCurrent: 0,
      power: 0,
      throttleLevel: 0,
      brakeLevel: 0,
      inverterTemperature: 25,
      rpm: 0,
      batteryVoltage: 400,
      maximumSpeed: 8000,
      maximumTorque: 300,
      coolingFanState: false,
      mainContactorState: true,
      prechargeRelayState: true,
      annunciators: defaultAnnunciators,
      logLevel: 'INFO',
      throttleConfiguration: defaultThrottleConfiguration,
      brakeConfiguration: defaultBrakeConfiguration,
      healthScore: 95,
      healthStatus: 'healthy',
      prediction: defaultPrediction,
      warnings: [],
    }),

  updatePrediction: (prediction) =>
    set((state) => ({
      prediction: { ...state.prediction, ...prediction },
      healthScore: prediction.healthScore ?? state.healthScore,
      healthStatus: prediction.healthStatus ?? state.healthStatus,
    })),
}));
