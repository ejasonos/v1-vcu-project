# VCU-Software

A Next.js application for Electric Vehicle Vehicle Control Unit (VCU) monitoring, configuration, diagnostics, and AI-assisted insights.

This project provides an interactive VCU dashboard with:
- live telemetry monitoring
- configuration controls
- system annunciators
- a simulation mode for testing
- an AI assistant powered by the OpenAI SDK

## Key Features

- Home page with simulation controls for throttle, brake, and failure modes
- Status page with live VCU health, annunciators, motor control, temperature, and prediction sections
- Dashboard page with gauges and live charts for key telemetry
- Configuration page for throttle, brake, motor control, and system settings
- AI Assistant chat page that uses current VCU state to answer user questions
- Zustand state store for shared VCU data across all pages

## Pages

- `/` — Home page with simulation controls and quick navigation
- `/status` — VCU status monitor with health score, annunciators, and diagnostics
- `/dashboard` — Engineering dashboard with live gauges and charts
- `/configuration` — Controller and system settings page
- `/ai-assistant` — AI-powered chat assistant for VCU diagnostics

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the app in development:

   ```bash
   pnpm dev
   ```

3. Build for production:

   ```bash
   pnpm build
   ```

4. Start the production app:

   ```bash
   pnpm start
   ```

## Environment

The OpenAI SDK in `lib/ai-assistant.ts` reads the following environment variables:

- `NEXT_PUBLIC_OPENAI_API_KEY`
- `NEXT_PUBLIC_OPENAI_BASE_URL`

If you do not use OpenAI, the app still includes fallback logic for hardcoded diagnostics.

## Scripts

- `pnpm dev` — start the Next.js development server
- `pnpm build` — build the production app
- `pnpm start` — run the production build
- `pnpm lint` — run ESLint across the project

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Framer Motion
- OpenAI SDK

## Project Structure

- `app/` — Next.js routes and page components
- `components/` — reusable UI elements, gauges, charts, and indicators
- `lib/` — VCU simulation, AI assistant, and utility logic
- `store/` — global Zustand VCU state management
- `types/` — shared TypeScript types
- `public/` — static assets

## VCU Features

- Live telemetry values: motor temperature, inverter temperature, DC voltage, current, torque, power, RPM, throttle, brake
- Annunciator panel for system states such as precharge, contactor, running, reverse, faults, cooling fan, emergency stop, and communication status
- Health scoring and predictive alert generation
- Configurable throttle, brake, motor control, and system parameters
- Built-in simulation mode so the UI can operate without actual hardware

## Notes

- The app is built for `pnpm` package management.
- The current route structure uses `app/` routing with React Server Components and client components where needed.
- The AI chat assistant leverages live VCU state from the global store when generating responses.


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