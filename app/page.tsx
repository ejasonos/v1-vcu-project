'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVCUStore } from '@/store/vcu-store';
import { simulateVCUUpdate, updateSimulationTargets, initializeSimulation, setSimulationFailureMode } from '@/lib/simulation';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const vcuStore = useVCUStore();
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [throttleSlider, setThrottleSlider] = useState(0);
  const [brakeSlider, setBrakeSlider] = useState(0);
  const [failureMode, setFailureMode] = useState<'none' | 'high-temp' | 'high-current' | 'low-voltage' | 'sensor-fault'>('none');

  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      updateSimulationTargets(throttleSlider, brakeSlider);
      const updates = simulateVCUUpdate(vcuStore);
      vcuStore.updateMotorControl(updates);
      vcuStore.addHealthMetric({
        motorTemp: updates.motorTemperature || vcuStore.motorTemperature,
        inverterTemp: updates.inverterTemperature || vcuStore.inverterTemperature,
        voltage: updates.dcVoltage || vcuStore.dcVoltage,
        current: updates.dcCurrent || vcuStore.dcCurrent,
        torque: updates.actualTorque || vcuStore.actualTorque,
        power: updates.power || vcuStore.power,
        throttle: updates.throttleLevel || vcuStore.throttleLevel,
        rpm: updates.rpm || vcuStore.rpm,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationRunning, throttleSlider, brakeSlider, vcuStore]);

  const handleStartSimulation = () => {
    if (!simulationRunning) {
      initializeSimulation();
      setSimulationFailureMode('none');
      vcuStore.reset();
      vcuStore.clearHealthMetrics();
      vcuStore.clearChatHistory();
      setSimulationRunning(true);
    }
  };

  const handleStopSimulation = () => {
    setSimulationRunning(false);
    setThrottleSlider(0);
    setBrakeSlider(0);
  };

  const handleFailureMode = (mode: typeof failureMode) => {
    setFailureMode(mode);
    setSimulationFailureMode(mode);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="rounded-lg border border-border bg-gradient-to-r from-accent-blue/10 to-transparent p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                  VCU-Software
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Professional Electric Vehicle Control Unit monitoring, configuration, and AI-powered diagnostics
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/status">
                    <motion.button
                      className="px-6 py-3 bg-accent-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Status
                    </motion.button>
                  </Link>
                  <Link href="/dashboard">
                    <motion.button
                      className="px-6 py-3 border border-accent-blue text-accent-blue rounded-lg font-semibold hover:bg-accent-blue/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Dashboard
                    </motion.button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">VCU</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Vehicle Control Unit</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simulation Control */}
        <Card title="Simulation Control" subtitle="Demo mode for testing and evaluation">
          <div className="space-y-6">
            {/* Start/Stop Controls */}
            <div className="flex gap-4 flex-wrap">
              <motion.button
                onClick={handleStartSimulation}
                disabled={simulationRunning}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="w-5 h-5" />
                Start Simulation
              </motion.button>
              <motion.button
                onClick={handleStopSimulation}
                disabled={!simulationRunning}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StopIcon className="w-5 h-5" />
                Stop Simulation
              </motion.button>
            </div>

            {/* Controls */}
            {simulationRunning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-border"
              >
                {/* Throttle Control */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground">Throttle Command</label>
                    <span className="text-sm text-accent-blue font-mono">{throttleSlider.toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={throttleSlider}
                    onChange={(e) => setThrottleSlider(Number(e.target.value))}
                    className="w-full accent-green-500"
                  />
                </div>

                {/* Brake Control */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground">Brake Command</label>
                    <span className="text-sm text-accent-blue font-mono">{brakeSlider.toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brakeSlider}
                    onChange={(e) => setBrakeSlider(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>

                {/* Failure Mode */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Failure Mode (Test Scenarios)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { id: 'none', label: 'Normal' },
                      { id: 'high-temp', label: 'High Temp' },
                      { id: 'high-current', label: 'High Current' },
                      { id: 'low-voltage', label: 'Low Voltage' },
                      { id: 'sensor-fault', label: 'Sensor Fault' },
                    ].map((mode) => (
                      <motion.button
                        key={mode.id}
                        onClick={() => handleFailureMode(mode.id as typeof failureMode)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          failureMode === mode.id
                            ? 'bg-accent-blue text-white'
                            : 'border border-border text-muted-foreground hover:text-foreground hover:border-accent-blue'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {mode.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!simulationRunning && (
              <p className="text-muted-foreground text-sm">
                Click "Start Simulation" to begin testing VCU-Software. You can then control throttle and brake inputs, and inject failure scenarios to test the diagnostic system.
              </p>
            )}
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
          {[
            {
              title: 'Real-time Monitoring',
              desc: 'Live VCU status and performance metrics',
              href: '/status',
            },
            {
              title: 'Engineering Dashboard',
              desc: 'Professional gauges and data visualization',
              href: '/dashboard',
            },
            {
              title: 'Configuration',
              desc: 'System settings and control parameters',
              href: '/configuration',
            },
            {
              title: 'AI Diagnostics',
              desc: 'Intelligent fault prediction and analysis',
              href: '/ai-assistant',
            },
          ].map((feature, idx) => (
            <Link key={idx} href={feature.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Card
                  className="h-full cursor-pointer hover:border-accent-blue transition-colors"
                  hoverable={true}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Status Indicator */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">System Status</p>
              <p className="text-lg font-semibold text-foreground">
                {simulationRunning ? '🟢 Simulation Running' : '⚪ Ready'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Health Score</p>
              <p className="text-2xl font-bold text-green-400">{vcuStore.healthScore.toFixed(0)}/100</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
