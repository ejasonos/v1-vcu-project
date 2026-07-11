# VCU-Software

A modern web-based **Vehicle Control Unit (VCU)** monitoring, configuration, and intelligent diagnostics platform built for Electric Vehicles (EVs).

VCU-Software provides engineers, researchers, and students with an interactive dashboard for monitoring live VCU parameters, configuring controller settings, visualizing vehicle performance, and using an AI-powered assistant to predict potential faults before they become critical.

This project was developed as part of a final year research project focused on **AI-assisted predictive health monitoring for Electric Vehicle Vehicle Control Units**.

---

## Features

### Real-Time Monitoring

Monitor critical VCU parameters in real time.

- Motor Running Status
- Fault Status
- Connection Status
- Operating Time
- Warning State
- Motor Temperature
- Inverter Temperature
- Requested Torque
- Actual Torque
- DC Voltage
- DC Current
- Power
- Throttle Position
- Brake Position
- RPM
- Battery Voltage
- Health Score
- System Prediction

---

### Engineering Dashboard

A modern engineering dashboard displaying:

- Animated Torque Gauge
- Current Gauge
- RPM Gauge
- Motor Temperature Gauge
- Inverter Temperature Gauge
- Voltage Gauge
- Battery Health Gauge
- Power Gauge

Live graphs for:

- Motor Temperature
- Inverter Temperature
- Voltage
- Current
- Torque
- Power
- RPM
- Throttle Position

---

### Configuration Panel

Configure VCU operating parameters including:

#### Throttle

- Number of Throttle Pots
- Minimum Signal Level 1
- Maximum Signal Level 1
- Minimum Signal Level 2
- Maximum Signal Level 2
- Creep Level
- Throttle Type
- Pedal Position Regen Maximum
- Pedal Position Regen Minimum
- Forward Motion Start
- 50% Throttle Position
- Minimum Throttle Range
- Maximum Throttle Range

Interactive throttle mapping graph showing:

- Regenerative braking region
- Neutral region
- Forward power region

---

#### Brake

- Minimum Signal Level
- Maximum Signal Level
- Minimum Brake Regen
- Maximum Brake Regen

---

#### Motor Control

- Maximum Speed
- Maximum Torque

---

#### System Configuration

- Battery Voltage
- Log Level
- Precharge Relay Output
- Precharge Delay
- Cooling Fan Relay Output
- Main Contactor Relay Output
- Cooling Fan ON Temperature
- Cooling Fan OFF Temperature
- Brake Light Output

---

### Annunciator Panel

Displays the health of important vehicle systems.

Includes indicators for:

- Precharge Relay
- Main Contactor
- Running
- Reverse
- Motor Overtemperature
- Throttle Fault
- Brake Fault
- Inverter Fault
- Battery Low
- Cooling Fan Active
- Emergency Stop
- CAN Bus Fault
- Communication Fault
- High Voltage Active
- Low Voltage Fault
- Controller Ready

Each annunciator automatically changes colour based on system status.

---

### AI Assistant

The AI Assistant continuously monitors every VCU parameter and provides intelligent insights.

Capabilities include:

- Predictive fault detection
- Health score calculation
- Failure risk estimation
- Maintenance recommendations
- Live diagnostic explanations
- Engineering troubleshooting assistance

Users can ask questions such as:

- Why is motor temperature increasing?
- Why is torque dropping?
- Why is battery voltage unstable?
- Predict motor health.
- Predict battery health.
- Explain active faults.
- Recommend maintenance.

---

### Predictive Health Monitoring

The prediction engine continuously evaluates:

- Motor Temperature
- Inverter Temperature
- Battery Voltage
- DC Current
- Torque Difference
- RPM
- Power
- Cooling System
- Annunciator States
- Communication Status

The engine calculates:

- Health Score (0–100)
- Health Status
- Failure Risk
- Confidence Score
- Active Alerts
- Maintenance Recommendations

---

### Simulation Mode

The application includes a built-in simulator for demonstration purposes.

Simulation updates include:

- Motor Temperature
- Inverter Temperature
- Voltage
- Current
- Torque
- RPM
- Power
- Throttle
- Brake
- Battery Voltage
- Annunciators
- AI Predictions

This allows the entire application to function without requiring physical VCU hardware.

---

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Zustand
- React Hook Form
- Zod
- Recharts
- Framer Motion
- Lucide React
- Heroicons

---

## Project Structure

```
app/
│
├── status/
├── dashboard/
├── configuration/
├── ai-assistant/
│
components/
├── ai/
├── charts/
├── forms/
├── gauges/
├── indicators/
└── ui/
│
store/
└── vcu-store.ts
│
lib/
├── health-score.ts
├── prediction-engine.ts
└── simulation.ts
│
hooks/
│
types/
│
utils/
```

---

## Pages

### Status

Displays live operating information.

Includes:

- Motor Control
- Throttle / Brake
- Annunciators
- Health Score
- System Prediction

---

### Dashboard

Engineering visualization page containing:

- Gauges
- Live Charts
- Battery Health
- Performance Metrics

---

### Configuration

Allows modification of controller settings.

All changes update the global application state immediately.

---

### AI Assistant

Provides intelligent monitoring and predictive diagnostics using a rule-based prediction engine.

---

## State Management

The application uses **Zustand** for centralized state management.

All pages consume the same global store, ensuring:

- Real-time synchronization
- No duplicated state
- Reactive UI updates
- Consistent simulation behavior

---

## Prediction Engine

The prediction engine evaluates operating conditions using deterministic engineering rules.

Example rules include:

- High motor temperature
- High inverter temperature
- Excessive current draw
- Battery voltage instability
- Cooling system faults
- Torque mismatch
- Communication failures
- Multiple simultaneous faults

Outputs include:

- Health Score
- Health Status
- Active Alerts
- Recommended Maintenance
- Failure Probability
- Confidence Percentage

---

## Future Improvements

Potential future enhancements include:

- CAN Bus integration
- Real VCU hardware communication
- MQTT support
- Modbus support
- OBD-II integration
- Machine Learning anomaly detection
- Historical analytics
- User authentication
- Cloud synchronization
- Remote monitoring
- Fleet management
- Fault report generation
- PDF export
- CSV data logging

---

## Installation

Clone the repository.

```bash
git clone https://github.com/<username>/VCU-Software.git
```

Navigate into the project.

```bash
cd VCU-Software
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Open your browser.

```
http://localhost:3000
```

---

## Build

```bash
npm run build
```

Start production server.

```bash
npm start
```

---

## Research Objective

The objective of this project is to develop a web-based Vehicle Control Unit monitoring platform capable of integrating real-time operational data with intelligent predictive diagnostics.

The system aims to assist engineers in identifying abnormal operating conditions, estimating component health, and supporting preventive maintenance decisions through an AI-assisted monitoring interface.

---

## License

This project is intended for academic research and educational purposes.