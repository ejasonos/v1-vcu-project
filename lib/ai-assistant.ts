"use server"

import type { VCUState } from '@/store/vcu-store';
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL
})
const messages: { role: 'system' | 'user', content: string }[] = [
  { role: 'system', content: 'You are a STRICTLY a helpful assistant that provides information about the Electric Vehicle Control Unit (VCU) based on the provided state data. Answer all questions using Markdown format only. Use headings, bullet lists, bold text, inline code, and short paragraphs. Do not output HTML. You do not ever offer any assistant of any sort apart from providing VCU information. If user asks for anything else, politely decline.' }
]

function buildVCUStateContext(vcuState: Partial<VCUState> & Record<string, unknown>): string {
  const simulationData = (vcuState as any).data ?? vcuState;

  const stateSummary = {
    simulationRunning: vcuState.simulationRunning,
    failureMode: vcuState.failureMode,
    userThrottle: vcuState.userThrottle,
    userBrake: vcuState.userBrake,
    simulationSettings: vcuState.simulationSettings,
    simulationData: {
      batterySoc: simulationData.batterySoc,
      batteryHealth: simulationData.batteryHealth,
      batteryTemperature: simulationData.batteryTemperature,
      motorSpeed: simulationData.motorSpeed,
      motorTemperature: simulationData.motorTemperature,
      throttlePosition: simulationData.throttlePosition,
      brakePosition: simulationData.brakePosition,
      vehicleSpeed: simulationData.vehicleSpeed,
      chargingStatus: simulationData.chargingStatus,
      faultStatus: simulationData.faultStatus,
      systemStatus: simulationData.systemStatus,
    },
    motorRunning: vcuState.motorRunning,
    faulted: vcuState.faulted,
    connected: vcuState.connected,
    operatingTime: vcuState.operatingTime,
    motorTemperature: vcuState.motorTemperature ?? simulationData.motorTemperature,
    inverterTemperature: vcuState.inverterTemperature,
    requestedTorque: vcuState.requestedTorque,
    actualTorque: vcuState.actualTorque,
    maximumTorque: vcuState.maximumTorque,
    dcVoltage: vcuState.dcVoltage,
    batteryVoltage: vcuState.batteryVoltage ?? simulationData.batteryVoltage,
    dcCurrent: vcuState.dcCurrent,
    power: vcuState.power,
    throttleLevel: vcuState.throttleLevel ?? simulationData.throttlePosition,
    brakeLevel: vcuState.brakeLevel ?? simulationData.brakePosition,
    rpm: vcuState.rpm ?? simulationData.motorSpeed,
    maximumSpeed: vcuState.maximumSpeed,
    coolingFanState: vcuState.coolingFanState,
    mainContactorState: vcuState.mainContactorState,
    prechargeRelayState: vcuState.prechargeRelayState,
    logLevel: vcuState.logLevel,
    annunciators: vcuState.annunciators,
    healthScore: vcuState.healthScore,
    healthStatus: vcuState.healthStatus,
    prediction: vcuState.prediction,
    chatHistory: vcuState.chatHistory,
  }

  return `VCU state summary:\n${JSON.stringify(stateSummary, null, 2)}`
}

