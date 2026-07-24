'use client';

import { useVCUStore } from '@/store/vcu-store';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function ConfigurationPage() {
  const store = useVCUStore();

  const handleResetSimulation = () => {
    store.resetSimulation();
  };

  const setSetting = (key: 'speed' | 'batteryDrainRate' | 'temperatureIncreaseRate', value: string) => {
    store.updateSimulationSettings({
      ...store.simulationSettings,
      [key]: value as any,
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Simulation Settings</h1>
          <p className="text-muted-foreground mb-8">Configure simulation behavior and parameters</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Simulation Speed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title="Simulation Speed">
              <div className="space-y-3">
                {[
                  { value: 'Slow' as const, label: 'Slow' },
                  { value: 'Normal' as const, label: 'Normal' },
                  { value: 'Fast' as const, label: 'Fast' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="speed"
                      value={option.value}
                      checked={store.simulationSettings.speed === option.value}
                      onChange={(e) => setSetting('speed', e.target.value)}
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-foreground group-hover:text-accent transition">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Controls the rate at which simulation time progresses relative to real time.
              </p>
            </Card>
          </motion.div>

          {/* Battery Drain Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="Battery Drain Rate">
              <div className="space-y-3">
                {[
                  { value: 'Low' as const, label: 'Low' },
                  { value: 'Medium' as const, label: 'Medium' },
                  { value: 'High' as const, label: 'High' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="drainRate"
                      value={option.value}
                      checked={store.simulationSettings.batteryDrainRate === option.value}
                      onChange={(e) => setSetting('batteryDrainRate', e.target.value)}
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-foreground group-hover:text-accent transition">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                How quickly the battery discharges during acceleration and driving.
              </p>
            </Card>
          </motion.div>

          {/* Temperature Increase Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Temperature Increase Rate">
              <div className="space-y-3">
                {[
                  { value: 'Slow' as const, label: 'Slow' },
                  { value: 'Normal' as const, label: 'Normal' },
                  { value: 'Fast' as const, label: 'Fast' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="tempRate"
                      value={option.value}
                      checked={store.simulationSettings.temperatureIncreaseRate === option.value}
                      onChange={(e) => setSetting('temperatureIncreaseRate', e.target.value)}
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-foreground group-hover:text-accent transition">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                How quickly motor and battery temperatures increase during operation.
              </p>
            </Card>
          </motion.div>

          {/* Reset */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="Reset Simulation">
              <button
                onClick={handleResetSimulation}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Reset to Defaults
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Restores all simulation data to initial state and resets settings.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Current Settings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card title="Current Settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Simulation Speed</p>
                <p className="font-semibold text-foreground">{store.simulationSettings.speed}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Battery Drain</p>
                <p className="font-semibold text-foreground">{store.simulationSettings.batteryDrainRate}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Temperature Increase</p>
                <p className="font-semibold text-foreground">{store.simulationSettings.temperatureIncreaseRate}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
