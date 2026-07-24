'use client';

import { useEffect, useState } from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { simulateVCUUpdate, updateSimulationTargets, initializeSimulation, setSimulationFailureMode } from '@/lib/simulation';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';

export default function SimulationPage() {
  const store = useVCUStore();
  const [isRunning, setIsRunning] = useState(false);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      updateSimulationTargets(store.userThrottle, store.userBrake);
      const newData = simulateVCUUpdate(store.data);
      store.updateSimulationData(newData);

      // Add metric to history
      store.addSimulationMetric({
        timestamp: Date.now(),
        batterySoc: newData.batterySoc,
        batteryTemperature: newData.batteryTemperature,
        motorSpeed: newData.motorSpeed,
        motorTemperature: newData.motorTemperature,
        throttlePosition: newData.throttlePosition,
        brakePosition: newData.brakePosition,
        vehicleSpeed: newData.vehicleSpeed,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, store]);

  const handleStart = () => {
    initializeSimulation();
    setSimulationFailureMode('Normal');
    store.startSimulation();
    setIsRunning(true);
  };

  const handleStop = () => {
    store.stopSimulation();
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    store.resetSimulation();
  };

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-8">Simulation Control</h1>
        </motion.div>

        {/* Simulation State Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Simulation Status</p>
                <p className="text-3xl font-bold text-foreground">
                  {isRunning ? (
                    <span className="text-green-400">● Running</span>
                  ) : (
                    <span className="text-muted-foreground">● Stopped</span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Play size={20} />
                  Start
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Square size={20} />
                  Stop
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-card text-foreground font-semibold rounded-lg border border-border hover:bg-card/80 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Vehicle Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="Vehicle Controls">
              <div className="space-y-6">
                {/* Throttle Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-foreground">Throttle</label>
                    <span className="text-lg font-mono font-bold text-accent">
                      {store.userThrottle.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={store.userThrottle}
                    onChange={(e) => store.setThrottle(Number(e.target.value))}
                    disabled={!isRunning}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-green-500 disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Driver throttle input: 0% = idle, 100% = full throttle
                  </p>
                </div>

                {/* Brake Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-foreground">Brake</label>
                    <span className="text-lg font-mono font-bold text-red-500">
                      {store.userBrake.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={store.userBrake}
                    onChange={(e) => store.setBrake(Number(e.target.value))}
                    disabled={!isRunning}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Driver brake input: 0% = no braking, 100% = full braking
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Failure Modes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Failure Modes">
              <div className="space-y-3">
                {[
                  { mode: 'Normal' as const, label: 'Normal Operation' },
                  { mode: 'HighTemperature' as const, label: 'High Temperature' },
                  { mode: 'LowBattery' as const, label: 'Low Battery' },
                  { mode: 'HighCurrent' as const, label: 'High Current Draw' },
                  { mode: 'SensorFault' as const, label: 'Sensor Fault' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      store.setFailureMode(item.mode);
                      setSimulationFailureMode(item.mode);
                    }}
                    disabled={!isRunning}
                    className={`w-full px-4 py-3 rounded-lg text-left font-medium transition ${
                      store.failureMode === item.mode
                        ? 'bg-accent text-white'
                        : 'bg-card border border-border text-foreground hover:border-accent disabled:opacity-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Select a failure mode to inject faults and test the system&apos;s response.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Simulation Status Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card title="Current Simulation State">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Motor Speed',
                  value: store.data.motorSpeed.toFixed(0),
                  unit: 'RPM',
                },
                {
                  label: 'Motor Temp',
                  value: store.data.motorTemperature.toFixed(1),
                  unit: '°C',
                },
                {
                  label: 'Battery SOC',
                  value: store.data.batterySoc.toFixed(1),
                  unit: '%',
                },
                {
                  label: 'Battery Temp',
                  value: store.data.batteryTemperature.toFixed(1),
                  unit: '°C',
                },
                {
                  label: 'Vehicle Speed',
                  value: store.data.vehicleSpeed.toFixed(1),
                  unit: 'km/h',
                },
                {
                  label: 'Battery Health',
                  value: store.data.batteryHealth.toFixed(1),
                  unit: '%',
                },
                {
                  label: 'System Status',
                  value: store.data.systemStatus,
                  unit: '',
                  color: store.data.systemStatus === 'Normal' ? 'text-green-400' : store.data.systemStatus === 'Warning' ? 'text-yellow-400' : 'text-red-500',
                },
                {
                  label: 'Charging',
                  value: store.data.chargingStatus,
                  unit: '',
                },
              ].map((item) => (
                <div key={item.label} className="border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-xl font-bold text-foreground ${item.color || ''}`}>
                    {item.value}
                    {item.unit && <span className="text-sm ml-1">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Fault Display */}
        {store.data.faultStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-l-4 border-l-red-500 bg-red-500/5">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Fault</p>
                <p className="text-lg font-bold text-red-400">{store.data.faultStatus}</p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
