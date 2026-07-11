"use server"

import type { VCUState } from '@/store/vcu-store';
import { calculateHealthScore } from './health-score';
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL
})
const messages: { role: 'system' | 'user', content: string }[] = [
  { role: 'system', content: 'You are a STRICTLY a helpful assistant that provides information about the Electric Vehicle Control Unit (VCU) based on the provided state data. You do not ever offer any assistant of any sort apart from providing VCU information. If user asks for anything else, politely decline.' },
  { role: 'system', content: 'Answer all questions using Markdown format only. Use headings, bullet lists, bold text, inline code, and short paragraphs. Do not output HTML' }
]

function buildVCUStateContext(vcuState: Partial<VCUState>): string {
  const stateSummary = {
    motorRunning: vcuState.motorRunning,
    faulted: vcuState.faulted,
    connected: vcuState.connected,
    operatingTime: vcuState.operatingTime,
    motorTemperature: vcuState.motorTemperature,
    inverterTemperature: vcuState.inverterTemperature,
    requestedTorque: vcuState.requestedTorque,
    actualTorque: vcuState.actualTorque,
    maximumTorque: vcuState.maximumTorque,
    dcVoltage: vcuState.dcVoltage,
    batteryVoltage: vcuState.batteryVoltage,
    dcCurrent: vcuState.dcCurrent,
    power: vcuState.power,
    throttleLevel: vcuState.throttleLevel,
    brakeLevel: vcuState.brakeLevel,
    rpm: vcuState.rpm,
    maximumSpeed: vcuState.maximumSpeed,
    coolingFanState: vcuState.coolingFanState,
    mainContactorState: vcuState.mainContactorState,
    prechargeRelayState: vcuState.prechargeRelayState,
    logLevel: vcuState.logLevel,
    annunciators: vcuState.annunciators,
    systemConfiguration: vcuState.systemConfiguration,
    throttleConfiguration: vcuState.throttleConfiguration,
    brakeConfiguration: vcuState.brakeConfiguration,
    motorControlConfiguration: vcuState.motorControlConfiguration,
    healthScore: vcuState.healthScore,
    healthStatus: vcuState.healthStatus,
    prediction: vcuState.prediction,
  }

  return `VCU state summary:\n${JSON.stringify(stateSummary, null, 2)}`
}

export async function generateAIResponse(userMessage: string, vcuState: Partial<VCUState>): Promise<string> {
  const prompt = userMessage.trim();
  const stateContext = buildVCUStateContext(vcuState)

  const response = await openai.chat.completions.create({
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      ...messages,
      { role: 'system', content: 'Use the following VCU state data to answer the user question. Do not invent values that are not present in the provided data.' },
      { role: 'system', content: stateContext },
      { role: 'user', content: prompt }
    ]
  })
  if (response && response.choices?.[0]?.message?.content) {
    messages.push({ role: 'user', content: prompt })
    messages.push({ role: 'system', content: response.choices[0].message.content })
    return response.choices[0].message.content
  } else {
    const lowerMessage = userMessage.toLowerCase();

    // Health and prediction queries
    if (
      lowerMessage.includes('health') ||
      lowerMessage.includes('predict') ||
      lowerMessage.includes('fault')
    ) {
      const health = calculateHealthScore(vcuState);
      return generateHealthResponse(health, vcuState);
    }

    // Temperature queries
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
      return generateTemperatureResponse(vcuState);
    }

    // Torque queries
    if (lowerMessage.includes('torque')) {
      return generateTorqueResponse(vcuState);
    }

    // Battery queries
    if (lowerMessage.includes('battery') || lowerMessage.includes('voltage')) {
      return generateBatteryResponse(vcuState);
    }

    // Current queries
    if (lowerMessage.includes('current')) {
      return generateCurrentResponse(vcuState);
    }

    // Maintenance queries
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('service')) {
      return generateMaintenanceResponse(vcuState);
    }

    // Power queries
    if (lowerMessage.includes('power')) {
      return generatePowerResponse(vcuState);
    }

    // RPM queries
    if (lowerMessage.includes('rpm') || lowerMessage.includes('speed')) {
      return generateRPMResponse(vcuState);
    }

    // Cooling queries
    if (lowerMessage.includes('cooling') || lowerMessage.includes('fan')) {
      return generateCoolingResponse(vcuState);
    }

    // Sensor queries
    if (lowerMessage.includes('sensor')) {
      return generateSensorResponse(vcuState);
    }

    // Default response
    return generateDefaultResponse(vcuState);
  }
}

async function generateHealthResponse(health: any, vcuState: Partial<VCUState>): Promise<string> {
  let response = `Current system health status: ${health.healthStatus} (Score: ${health.healthScore}/100)\n\n`;

  if (health.alerts.length > 0) {
    response += `Active alerts (${health.alerts.length}):\n`;
    health.alerts.slice(0, 3).forEach((alert: any) => {
      response += `• ${alert.message} [${alert.level.toUpperCase()}, ${alert.confidence}% confidence]\n`;
    });
    response += '\n';
  }

  if (health.possibleFault) {
    response += `Possible fault detected: ${health.possibleFault}\n`;
  }

  if (health.recommendedAction) {
    response += `Recommended action: ${health.recommendedAction}\n`;
  }

  if (health.estimatedRemainingTime) {
    response += `Estimated safe operation time: ~${health.estimatedRemainingTime} minutes\n`;
  }

  return response;
}

async function generateTemperatureResponse(vcuState: Partial<VCUState>): Promise<string> {
  const motorTemp = vcuState.motorTemperature || 0;
  const inverterTemp = vcuState.inverterTemperature || 0;
  const coolingFanOn = vcuState.coolingFanState || false;

  let response = `Temperature Status:\n`;
  response += `• Motor: ${motorTemp.toFixed(1)}°C `;

  if (motorTemp > 110) {
    response += '⚠️ CRITICAL - System overheating\n';
  } else if (motorTemp > 90) {
    response += '⚠️ WARNING - Elevated temperature\n';
  } else if (motorTemp > 70) {
    response += '✓ Normal operating range\n';
  } else {
    response += '✓ Cool\n';
  }

  response += `• Inverter: ${inverterTemp.toFixed(1)}°C `;

  if (inverterTemp > 95) {
    response += '⚠️ WARNING - High inverter temperature\n';
  } else {
    response += '✓ Normal\n';
  }

  response += `• Cooling fan: ${coolingFanOn ? 'ON' : 'OFF'}\n\n`;

  if (motorTemp > 90) {
    response +=
      'Analysis: Motor temperature is elevated. Cooling system is ' +
      (coolingFanOn ? 'active' : 'not engaged') +
      '. ';
    response += 'Reduce load and monitor thermal performance. ';
    if (!coolingFanOn) {
      response += 'Check if cooling fan is functioning properly.';
    }
  }

  return response;
}

async function generateTorqueResponse(vcuState: Partial<VCUState>): Promise<string> {
  const requested = vcuState.requestedTorque || 0;
  const actual = vcuState.actualTorque || 0;
  const maxTorque = vcuState.maximumTorque || 300;

  const difference = Math.abs(requested - actual);
  const percentDiff = requested !== 0 ? (difference / Math.abs(requested)) * 100 : 0;

  let response = `Torque Analysis:\n`;
  response += `• Requested: ${requested.toFixed(1)} Nm\n`;
  response += `• Actual: ${actual.toFixed(1)} Nm\n`;
  response += `• Maximum configured: ${maxTorque} Nm\n`;
  response += `• Difference: ${difference.toFixed(1)} Nm (${percentDiff.toFixed(1)}%)\n\n`;

  if (percentDiff > 25) {
    response +=
      'WARNING: Significant torque mismatch detected. This may indicate:\n' +
      '• Motor encoder calibration issue\n' +
      '• Torque sensor fault\n' +
      '• Motor control anomaly\n' +
      'Recommendation: Perform sensor calibration and verify motor connections.';
  } else if (requested === 0) {
    response += 'Motor is idle or not commanded.';
  } else {
    response += 'Torque delivery is within acceptable range (< 25% variance).';
  }

  return response;
}

async function generateBatteryResponse(vcuState: Partial<VCUState>): Promise<string> {
  const voltage = vcuState.batteryVoltage || vcuState.dcVoltage || 400;
  const configuredVoltage = vcuState.systemConfiguration?.batteryVoltage || 400;

  let response = `Battery/Voltage Status:\n`;
  response += `• Current voltage: ${voltage.toFixed(1)} V\n`;
  response += `• Configured nominal: ${configuredVoltage} V\n`;
  response += `• Voltage drop: ${(configuredVoltage - voltage).toFixed(1)} V\n\n`;

  if (voltage < 300) {
    response += '🔴 CRITICAL: Battery voltage critically low. ';
    response += 'Vehicle may not have sufficient power. Battery replacement recommended.';
  } else if (voltage < 350) {
    response += '⚠️ WARNING: Battery voltage below recommended threshold. ';
    response += 'Monitor voltage stability and check battery health.';
  } else if (voltage > 420) {
    response += '⚠️ WARNING: Battery voltage elevated. Check charging system.';
  } else {
    response += '✓ Battery voltage nominal. System operating normally.';
  }

  return response;
}

async function generateCurrentResponse(vcuState: Partial<VCUState>): Promise<string> {
  const current = vcuState.dcCurrent || 0;
  const throttle = vcuState.throttleLevel || 0;

  let response = `Current Draw Analysis:\n`;
  response += `• DC Current: ${current.toFixed(1)} A\n`;
  response += `• Throttle command: ${throttle.toFixed(1)}%\n\n`;

  if (current > 500) {
    response += '🔴 CRITICAL: Current exceeds safe maximum (500A).\n';
    response +=
      'Possible causes: Motor short circuit, inverter overcurrent, high load.\n' +
      'Recommendation: Reduce load immediately and check wiring integrity.';
  } else if (current > 450) {
    response +=
      '⚠️ WARNING: Current approaching maximum safe limit.\n' +
      'Monitor for sustained high currents which may indicate motor issues.';
  } else if (current > 0) {
    response +=
      `Current is normal for throttle level of ${throttle.toFixed(1)}%. ` +
      `Expected draw at this throttle is approximately ${(throttle * 3).toFixed(0)}A.`;
  } else {
    response += 'Motor is not drawing current. Either idle or disconnected.';
  }

  return response;
}

async function generateMaintenanceResponse(vcuState: Partial<VCUState>): Promise<string> {
  const operatingTime = vcuState.operatingTime || 0;
  const motorTemp = vcuState.motorTemperature || 0;
  const inverterTemp = vcuState.inverterTemperature || 0;

  let response = `Maintenance Report:\n`;
  response += `• Operating time: ${(operatingTime / 3600).toFixed(1)} hours\n`;
  response += `• Motor thermal stress: ${motorTemp > 80 ? '⚠️ High' : '✓ Normal'}\n`;
  response += `• Inverter thermal stress: ${inverterTemp > 80 ? '⚠️ High' : '✓ Normal'}\n\n`;

  response += 'Recommended maintenance schedule:\n';
  if (operatingTime > 100000) {
    response += '• 🔴 OVERDUE: Comprehensive system inspection\n';
  } else if (operatingTime > 80000) {
    response += '• ⚠️ DUE SOON (80k+ hours): Motor bearing inspection\n';
  }
  response += '• ✓ Cooling system: Check filters and fan operation\n';
  response += '• ✓ Electrical connectors: Inspect for corrosion\n';
  response += '• ✓ CAN bus termination: Verify connections\n';

  return response;
}

async function generatePowerResponse(vcuState: Partial<VCUState>): Promise<string> {
  const power = vcuState.power || 0;
  const current = vcuState.dcCurrent || 0;
  const voltage = vcuState.dcVoltage || 400;
  const throttle = vcuState.throttleLevel || 0;

  let response = `Power Analysis:\n`;
  response += `• Real-time power: ${power.toFixed(2)} kW\n`;
  response += `• Calculation: (${current.toFixed(1)}A × ${voltage.toFixed(1)}V) ÷ 1000\n`;
  response += `• Throttle demand: ${throttle.toFixed(1)}%\n\n`;

  if (power > 150) {
    response += 'High power draw. Monitor for thermal issues.';
  } else if (power > 50) {
    response += 'Moderate power delivery. System operating normally.';
  } else {
    response += 'Low power draw. Motor is lightly loaded or idle.';
  }

  return response;
}

async function generateRPMResponse(vcuState: Partial<VCUState>): Promise<string> {
  const rpm = vcuState.rpm || 0;
  const maxSpeed = vcuState.maximumSpeed || 8000;
  const motorRunning = vcuState.motorRunning || false;

  let response = `Speed/RPM Status:\n`;
  response += `• Current RPM: ${rpm.toFixed(0)}\n`;
  response += `• Maximum configured: ${maxSpeed} RPM\n`;
  response += `• Operating status: ${motorRunning ? '✓ Running' : '⏹️ Idle'}\n`;
  response += `• RPM percentage: ${((rpm / maxSpeed) * 100).toFixed(1)}%\n\n`;

  if (rpm > maxSpeed) {
    response += '⚠️ WARNING: Motor speed exceeds maximum configured limit!';
  } else if (rpm > maxSpeed * 0.8) {
    response += 'Motor operating at high speed. Monitor for vibration and cooling.';
  } else if (rpm > 0) {
    response += 'Motor running at normal operating speed.';
  } else {
    response += 'Motor is not running.';
  }

  return response;
}

async function generateCoolingResponse(vcuState: Partial<VCUState>): Promise<string> {
  const motorTemp = vcuState.motorTemperature || 0;
  const inverterTemp = vcuState.inverterTemperature || 0;
  const fanOn = vcuState.coolingFanState || false;
  const fanOnTemp = vcuState.systemConfiguration?.coolingFanONTemperature || 80;
  const fanOffTemp = vcuState.systemConfiguration?.coolingFanOFFTemperature || 70;

  let response = `Cooling System Status:\n`;
  response += `• Cooling fan: ${fanOn ? '✓ ON' : '⏹️ OFF'}\n`;
  response += `• Motor temperature: ${motorTemp.toFixed(1)}°C\n`;
  response += `• Inverter temperature: ${inverterTemp.toFixed(1)}°C\n`;
  response += `• Fan ON threshold: ${fanOnTemp}°C\n`;
  response += `• Fan OFF threshold: ${fanOffTemp}°C\n\n`;

  if (motorTemp > fanOnTemp && !fanOn) {
    response +=
      '⚠️ WARNING: Motor temperature exceeds fan activation threshold but fan is OFF.\n' +
      'Possible causes: Cooling fan fault, relay failure, or control system issue.\n' +
      'Recommendation: Check cooling fan relay connections and motor.';
  } else if (motorTemp > 100) {
    response +=
      '⚠️ CAUTION: Thermal stress is high. Cooling fan should be actively engaged.\n' +
      'Monitor temperature trend. Reduce throttle if temperature continues rising.';
  } else if (fanOn) {
    response += '✓ Cooling system actively managing thermal load.';
  } else {
    response += '✓ Temperatures nominal. Cooling system on standby.';
  }

  return response;
}

async function generateSensorResponse(vcuState: Partial<VCUState>): Promise<string> {
  const annunciators: Partial<VCUState['annunciators']> = vcuState.annunciators ?? {};
  const throttleFault = annunciators.throttleFault ?? 'off';
  const brakeFault = annunciators.brakeFault ?? 'off';
  const canBusFault = annunciators.canBusFault ?? 'off';
  const communicationFault = annunciators.communicationFault ?? 'off';
  const inverterFault = annunciators.inverterFault ?? 'off';

  let response = `Sensor/System Status:\n`;
  response += `• Throttle sensor: ${throttleFault !== 'off' ? '⚠️ FAULT' : '✓ OK'}\n`;
  response += `• Brake sensor: ${brakeFault !== 'off' ? '⚠️ FAULT' : '✓ OK'}\n`;
  response += `• CAN bus: ${canBusFault !== 'off' ? '⚠️ FAULT' : '✓ OK'}\n`;
  response += `• Communication: ${communicationFault !== 'off' ? '⚠️ FAULT' : '✓ OK'}\n`;
  response += `• Motor encoder: ${inverterFault !== 'off' ? '⚠️ ISSUE' : '✓ OK'}\n\n`;

  const faultyCount = [throttleFault, brakeFault, canBusFault, communicationFault, inverterFault].filter((state) => state !== 'off').length;

  if (faultyCount === 0) {
    response += 'All sensors and systems operating normally.';
  } else if (faultyCount === 1) {
    response += `${faultyCount} sensor fault detected. Diagnosis recommended.`;
  } else {
    response +=
      `Multiple sensor faults detected (${faultyCount}). ` +
      'System health compromised. Comprehensive diagnostics required.';
  }

  return response;
}

async function generateDefaultResponse(vcuState: Partial<VCUState>): Promise<string> {
  const health = calculateHealthScore(vcuState);

  return (
    `VCU-Software AI Assistant\n\n` +
    `I can help you diagnose and monitor your Electric Vehicle Control Unit.\n` +
    `Ask me about:\n` +
    `• Health and diagnostics\n` +
    `• Temperature, voltage, and current readings\n` +
    `• Torque and power delivery\n` +
    `• Motor speed (RPM)\n` +
    `• Battery and electrical system\n` +
    `• Cooling system performance\n` +
    `• Sensor status\n` +
    `• Maintenance recommendations\n\n` +
    `Current system health: ${health.healthStatus} (${health.healthScore}/100)\n` +
    `What would you like to know?`
  );
}
