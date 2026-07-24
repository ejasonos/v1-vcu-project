'use client';

import React, { useMemo } from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { Card } from '@/components/ui/Card';
import { ChartCard } from '@/components/charts/ChartCard';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const store = useVCUStore();

  // Format chart data
  const chartData = useMemo(() => {
    return store.metrics.map((metric) => ({
      time: new Date(metric.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      batterySoc: metric.batterySoc,
      batteryTemp: metric.batteryTemperature,
      motorSpeed: metric.motorSpeed,
      motorTemp: metric.motorTemperature,
    }));
  }, [store.metrics]);

  const getStatusColor = (status: string) => {
    if (status === 'Normal') return 'text-green-400';
    if (status === 'Warning') return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Vehicle Dashboard</h1>
          <p className="text-muted-foreground mb-8">Real-time monitoring of simulated vehicle parameters</p>
        </motion.div>

        {/* Status Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: 'Battery State of Charge (SOC)',
              value: store.data.batterySoc.toFixed(1),
              unit: '%',
              icon: '🔋',
            },
            {
              label: 'Battery State of Health (SOH)',
              value: store.data.batteryHealth.toFixed(1),
              unit: '%',
              icon: '💪',
            },
            {
              label: 'Battery Temperature',
              value: store.data.batteryTemperature.toFixed(1),
              unit: '°C',
              icon: '🌡️',
            },
            {
              label: 'Motor Speed',
              value: store.data.motorSpeed.toFixed(0),
              unit: 'RPM',
              icon: '⚙️',
            },
            {
              label: 'Motor Temperature',
              value: store.data.motorTemperature.toFixed(1),
              unit: '°C',
              icon: '🔥',
            },
            {
              label: 'Vehicle Speed',
              value: store.data.vehicleSpeed.toFixed(1),
              unit: 'km/h',
              icon: '🚗',
            },
            {
              label: 'Throttle Position',
              value: store.data.throttlePosition.toFixed(1),
              unit: '%',
              icon: '👉',
            },
            {
              label: 'Brake Position',
              value: store.data.brakePosition.toFixed(1),
              unit: '%',
              icon: '🛑',
            },
            {
              label: 'Charging Status',
              value: store.data.chargingStatus,
              unit: '',
              icon: '⚡',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {item.value}
                      {item.unit && <span className="text-sm ml-1 text-muted-foreground">{item.unit}</span>}
                    </p>
                  </div>
                  <span className="text-2xl">{item.icon}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* System Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <Card>
            <div>
              <p className="text-sm text-muted-foreground mb-2">System Status</p>
              <p className={`text-3xl font-bold ${getStatusColor(store.data.systemStatus)}`}>
                {store.data.systemStatus}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Active Fault</p>
              <p className="text-2xl font-bold text-foreground">
                {store.data.faultStatus || 'None'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Live Trend Charts */}
        {chartData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Live Data Trends</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Battery State of Charge (%)"
                data={chartData}
                dataKey="batterySoc"
                color="#22c55e"
                height={250}
              />
              <ChartCard
                title="Motor Temperature (°C)"
                data={chartData}
                dataKey="motorTemp"
                color="#f59e0b"
                height={250}
              />
              <ChartCard
                title="Motor Speed (RPM)"
                data={chartData}
                dataKey="motorSpeed"
                color="#3b82f6"
                height={250}
              />
              <ChartCard
                title="Battery Temperature (°C)"
                data={chartData}
                dataKey="batteryTemp"
                color="#ef4444"
                height={250}
              />
            </div>
          </motion.div>
        )}

        {chartData.length === 0 && (
          <Card>
            <p className="text-muted-foreground text-center py-12">
              Start the simulation to see live data and trends
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
