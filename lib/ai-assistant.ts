import type { SimulationData } from '@/store/vcu-store';

export function generateAIResponse(userMessage: string, simData: SimulationData): string {
  const lowerMessage = userMessage.toLowerCase();

  // System status queries
  if (
    lowerMessage.includes('status') ||
    lowerMessage.includes('health') ||
    lowerMessage.includes('how is')
  ) {
    return generateStatusResponse(simData);
  }

  // Temperature queries
  if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
    return generateTemperatureResponse(simData);
  }

  // Battery queries
  if (
    lowerMessage.includes('battery') ||
    lowerMessage.includes('soc') ||
    lowerMessage.includes('charge')
  ) {
    return generateBatteryResponse(simData);
  }

  // Motor queries
  if (lowerMessage.includes('motor') || lowerMessage.includes('speed')) {
    return generateMotorResponse(simData);
  }

  // Throttle/brake queries
  if (
    lowerMessage.includes('throttle') ||
    lowerMessage.includes('brake') ||
    lowerMessage.includes('control')
  ) {
    return generateControlResponse(simData);
  }

  // Fault queries
  if (lowerMessage.includes('fault') || lowerMessage.includes('error')) {
    return generateFaultResponse(simData);
  }

  // Performance queries
  if (lowerMessage.includes('performance') || lowerMessage.includes('efficiency')) {
    return generatePerformanceResponse(simData);
  }

  // Charging queries
  if (lowerMessage.includes('charging') || lowerMessage.includes('charge')) {
    return generateChargingResponse(simData);
  }

  // Default response
  return generateDefaultResponse(simData);
}

function generateStatusResponse(simData: SimulationData): string {
  let response = `System Status Report:\n\n`;

  response += `Overall Status: ${simData.systemStatus}\n`;
  if (simData.systemStatus === 'Normal') {
    response += `✓ All systems operating normally.\n\n`;
  } else if (simData.systemStatus === 'Warning') {
    response += `⚠️ System warning detected. Check fault status.\n\n`;
  } else {
    response += `🔴 System critical. Immediate attention required.\n\n`;
  }

  response += `Battery State: ${simData.batterySoc.toFixed(1)}% SOC\n`;
  response += `Motor Status: ${simData.motorSpeed > 0 ? 'Running' : 'Idle'} (${simData.motorSpeed.toFixed(0)} RPM)\n`;
  response += `Vehicle Speed: ${simData.vehicleSpeed.toFixed(1)} km/h\n`;
  response += `Charging: ${simData.chargingStatus}\n`;

  if (simData.faultStatus) {
    response += `\n⚠️ Active Fault: ${simData.faultStatus}`;
  }

  return response;
}

function generateTemperatureResponse(simData: SimulationData): string {
  let response = `Temperature Analysis:\n\n`;

  response += `Motor Temperature: ${simData.motorTemperature.toFixed(1)}°C\n`;
  if (simData.motorTemperature > 80) {
    response += '  ⚠️ Elevated - Monitor cooling\n';
  } else if (simData.motorTemperature > 60) {
    response += '  ✓ Normal operating range\n';
  } else {
    response += '  ✓ Cool\n';
  }

  response += `\nBattery Temperature: ${simData.batteryTemperature.toFixed(1)}°C\n`;
  if (simData.batteryTemperature > 50) {
    response += '  ⚠️ Elevated - May reduce charging/discharging rate\n';
  } else if (simData.batteryTemperature > 30) {
    response += '  ✓ Optimal range\n';
  } else {
    response += '  ✓ Cool\n';
  }

  response += `\nAnalysis: `;
  if (simData.motorTemperature > 80) {
    response += 'Motor is running hot. Reduce throttle and monitor for cooling system activation. ';
  }
  if (simData.batteryTemperature > 50) {
    response += 'Battery is warm. Performance may be limited during high-current operations.';
  }
  if (simData.motorTemperature <= 60 && simData.batteryTemperature <= 40) {
    response += 'All temperatures are within normal operating parameters.';
  }

  return response;
}

function generateBatteryResponse(simData: SimulationData): string {
  let response = `Battery Status:\n\n`;

  response += `State of Charge (SOC): ${simData.batterySoc.toFixed(1)}%\n`;
  if (simData.batterySoc > 80) {
    response += '  ✓ Fully charged\n';
  } else if (simData.batterySoc > 20) {
    response += '  ✓ Good level\n';
  } else if (simData.batterySoc > 10) {
    response += '  ⚠️ Low - Plan charging soon\n';
  } else {
    response += '  🔴 Critical - Charge immediately\n';
  }

  response += `\nBattery Health (SOH): ${simData.batteryHealth.toFixed(1)}%\n`;
  if (simData.batteryHealth > 90) {
    response += '  ✓ Excellent\n';
  } else if (simData.batteryHealth > 70) {
    response += '  ✓ Good\n';
  } else if (simData.batteryHealth > 50) {
    response += '  ⚠️ Acceptable - Consider maintenance\n';
  } else {
    response += '  🔴 Poor - Battery replacement may be needed\n';
  }

  response += `\nBattery Temperature: ${simData.batteryTemperature.toFixed(1)}°C\n`;

  response += `\nRecommendation: `;
  if (simData.batterySoc < 15) {
    response += 'Battery level is critical. Please recharge as soon as possible.';
  } else if (simData.batterySoc < 30) {
    response += 'Battery is low. Plan charging for next opportunity.';
  } else {
    response += 'Battery levels are healthy. Normal operation can continue.';
  }

  return response;
}

function generateMotorResponse(simData: SimulationData): string {
  let response = `Motor Performance:\n\n`;

  response += `Motor Speed: ${simData.motorSpeed.toFixed(0)} RPM\n`;
  response += `Motor Temperature: ${simData.motorTemperature.toFixed(1)}°C\n`;
  response += `Throttle Position: ${simData.throttlePosition.toFixed(1)}%\n`;

  response += `\nStatus: ${simData.motorSpeed > 0 ? '✓ Motor running' : '⏹️ Motor idle'}\n`;

  if (simData.motorSpeed > 0) {
    response += `\nThe motor is operating at ${simData.motorSpeed.toFixed(0)} RPM with throttle at ${simData.throttlePosition.toFixed(1)}%. `;
    if (simData.motorTemperature > 70) {
      response += 'Temperature is elevated - monitor cooling system performance.';
    } else {
      response += 'Temperature is normal for current load.';
    }
  } else {
    response += `\nThe motor is currently idle. Apply throttle to start acceleration.`;
  }

  return response;
}

function generateControlResponse(simData: SimulationData): string {
  let response = `Drive Controls Status:\n\n`;

  response += `Throttle Position: ${simData.throttlePosition.toFixed(1)}%\n`;
  response += `Brake Position: ${simData.brakePosition.toFixed(1)}%\n`;
  response += `Vehicle Speed: ${simData.vehicleSpeed.toFixed(1)} km/h\n`;

  response += `\nThrottle: `;
  if (simData.throttlePosition > 50) {
    response += 'High - Significant acceleration command\n';
  } else if (simData.throttlePosition > 0) {
    response += 'Moderate - Light acceleration\n';
  } else {
    response += 'Released - No acceleration\n';
  }

  response += `Brake: `;
  if (simData.brakePosition > 50) {
    response += 'Heavy - Significant deceleration\n';
  } else if (simData.brakePosition > 0) {
    response += 'Light - Gentle deceleration\n';
  } else {
    response += 'Released - No braking\n';
  }

  response += `\nNote: Throttle and brake are ${
    simData.throttlePosition > 20 && simData.brakePosition > 20
      ? '⚠️ BOTH ACTIVE - This is unusual!'
      : 'operating normally'
  }`;

  return response;
}

function generateFaultResponse(simData: SimulationData): string {
  let response = `Fault Diagnostics:\n\n`;

  if (!simData.faultStatus) {
    response += `✓ No active faults detected. System is operating normally.`;
  } else {
    response += `🔴 Active Fault: ${simData.faultStatus}\n\n`;

    // Provide context based on fault
    if (
      simData.faultStatus.toLowerCase().includes('temperature') ||
      simData.faultStatus.toLowerCase().includes('thermal')
    ) {
      response += `The system has detected a thermal anomaly.\n`;
      response += `Motor Temperature: ${simData.motorTemperature.toFixed(1)}°C\n`;
      response += `Battery Temperature: ${simData.batteryTemperature.toFixed(1)}°C\n\n`;
      response += `Action: Reduce throttle and monitor temperatures. Ensure cooling system is functioning.`;
    } else if (simData.faultStatus.toLowerCase().includes('battery')) {
      response += `Battery system issue detected.\n`;
      response += `Battery SOC: ${simData.batterySoc.toFixed(1)}%\n`;
      response += `Battery Health: ${simData.batteryHealth.toFixed(1)}%\n\n`;
      response += `Action: Check battery connections and consider charging if SOC is low.`;
    } else if (simData.faultStatus.toLowerCase().includes('motor')) {
      response += `Motor system issue detected.\n`;
      response += `Motor Speed: ${simData.motorSpeed.toFixed(0)} RPM\n`;
      response += `Motor Temperature: ${simData.motorTemperature.toFixed(1)}°C\n\n`;
      response += `Action: Reduce load and monitor motor operation.`;
    } else {
      response += `Recommended: Monitor system closely and attempt to identify the source of the fault.`;
    }
  }

  return response;
}

function generatePerformanceResponse(simData: SimulationData): string {
  let response = `Performance Analysis:\n\n`;

  const efficiency =
    simData.motorSpeed > 0
      ? Math.min(100, Math.max(0, 100 - Math.abs(simData.motorTemperature - 70) * 2))
      : 100;

  response += `Overall Efficiency: ${efficiency.toFixed(0)}%\n`;
  response += `Vehicle Speed: ${simData.vehicleSpeed.toFixed(1)} km/h\n`;
  response += `Motor Speed: ${simData.motorSpeed.toFixed(0)} RPM\n`;
  response += `Battery SOC: ${simData.batterySoc.toFixed(1)}%\n\n`;

  if (simData.motorSpeed > 0) {
    response += `The system is delivering good performance. `;
    if (efficiency > 80) {
      response += 'Thermal efficiency is excellent - temperatures are well-managed.';
    } else {
      response += 'Consider cooling system performance - temperatures could be better managed.';
    }
  } else {
    response += `System is idle. Begin acceleration to assess real-time performance.`;
  }

  return response;
}

function generateChargingResponse(simData: SimulationData): string {
  let response = `Charging Status:\n\n`;

  response += `Status: ${simData.chargingStatus}\n`;
  response += `Battery SOC: ${simData.batterySoc.toFixed(1)}%\n`;
  response += `Battery Temperature: ${simData.batteryTemperature.toFixed(1)}°C\n\n`;

  if (simData.chargingStatus === 'Charging') {
    response += `✓ Battery is currently charging.\n`;
    response += `Battery temperature is ${simData.batteryTemperature > 50 ? 'elevated' : 'normal'}.\n`;
    response += `Charging will continue until SOC reaches 100% or temperature limits are reached.`;
  } else if (simData.chargingStatus === 'Idle') {
    response += `Battery is not charging.\n`;
    if (simData.batterySoc < 80) {
      response += `Consider connecting charger - current SOC is ${simData.batterySoc.toFixed(1)}%.`;
    } else {
      response += `Battery is at a good level (${simData.batterySoc.toFixed(1)}% SOC).`;
    }
  } else {
    response += `${simData.chargingStatus}`;
  }

  return response;
}

function generateDefaultResponse(simData: SimulationData): string {
  return (
    `VCU Simulation AI Assistant\n\n` +
    `I can help you understand the vehicle simulation. Ask me about:\n` +
    `• System status and health\n` +
    `• Battery state and health\n` +
    `• Motor performance and speed\n` +
    `• Temperature analysis\n` +
    `• Drive controls (throttle/brake)\n` +
    `• Active faults and diagnostics\n` +
    `• Overall performance and efficiency\n` +
    `• Charging status\n\n` +
    `Current Status: ${simData.systemStatus}\n` +
    `Battery SOC: ${simData.batterySoc.toFixed(1)}%\n` +
    `Motor Speed: ${simData.motorSpeed.toFixed(0)} RPM\n\n` +
    `What would you like to know?`
  );
}
