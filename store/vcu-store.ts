import { create } from 'zustand';
import type {
  SystemStatus,
  FailureMode,
  BatteryState,
  ChatMessage,
  SimulationData,
  SimulationSettings,
  SimulationMetric,
  VehicleMode,
} from '@/types';

interface VCUState {
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
    }),
}));
