'use client';

import React, { useMemo } from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { Card } from '@/components/ui/Card';
import { Gauge } from '@/components/gauges/Gauge';
import { ChartCard } from '@/components/charts/ChartCard';

export default function DashboardPage() {
  const vcuState = useVCUStore();

  // Format chart data
  const chartData = useMemo(() => {
    return vcuState.healthMetrics.map((metric, idx) => ({
      time: new Date(metric.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      motorTemp: metric.motorTemp,
      inverterTemp: metric.inverterTemp,
      voltage: metric.voltage,
      current: metric.current,
      torque: metric.torque,
      power: metric.power,
      throttle: metric.throttle,
      rpm: metric.rpm,
    }));
  }, [vcuState.healthMetrics]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Engineering Dashboard</h1>
          <p className="text-muted-foreground">Real-time gauges and performance monitoring</p>
        </div>

        {/* Large Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="flex items-center justify-center py-8">
            <Gauge
              value={vcuState.actualTorque}
              min={-100}
              max={300}
              unit="Nm"
              label="Torque Output"
              size="large"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-8">
            <Gauge
              value={vcuState.dcCurrent}
              min={-100}
              max={500}
              unit="A"
              label="DC Current"
              size="large"
              showValue={true}
            />
          </Card>
        </div>

        {/* Small Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.throttleLevel}
              min={0}
              max={100}
              unit="%"
              label="Throttle"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.rpm}
              min={0}
              max={10000}
              unit="RPM"
              label="Speed"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.motorTemperature}
              min={0}
              max={250}
              unit="°C"
              label="Motor Temp"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.inverterTemperature}
              min={0}
              max={250}
              unit="°C"
              label="Inverter Temp"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.dcVoltage}
              min={0}
              max={500}
              unit="V"
              label="DC Voltage"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.healthScore}
              min={0}
              max={100}
              unit="%"
              label="Health"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.power}
              min={0}
              max={150}
              unit="kW"
              label="Power"
              size="small"
              showValue={true}
            />
          </Card>
          <Card className="flex items-center justify-center py-4">
            <Gauge
              value={vcuState.brakeLevel}
              min={0}
              max={100}
              unit="%"
              label="Brake"
              size="small"
              showValue={true}
            />
          </Card>
        </div>

        {/* Live Charts */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Live Data Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartData.length > 1 ? (
              <>
                <ChartCard
                  title="Motor Temperature (°C)"
                  data={chartData}
                  dataKey="motorTemp"
                  color="#f59e0b"
                  height={250}
                />
                <ChartCard
                  title="Inverter Temperature (°C)"
                  data={chartData}
                  dataKey="inverterTemp"
                  color="#f59e0b"
                  height={250}
                />
                <ChartCard
                  title="Voltage (V)"
                  data={chartData}
                  dataKey="voltage"
                  color="#3b82f6"
                  height={250}
                />
                <ChartCard
                  title="Current (A)"
                  data={chartData}
                  dataKey="current"
                  color="#ef4444"
                  height={250}
                />
                <ChartCard
                  title="Torque (Nm)"
                  data={chartData}
                  dataKey="torque"
                  color="#10b981"
                  height={250}
                />
                <ChartCard
                  title="Power (kW)"
                  data={chartData}
                  dataKey="power"
                  color="#8b5cf6"
                  height={250}
                />
                <ChartCard
                  title="Throttle (%)"
                  data={chartData}
                  dataKey="throttle"
                  color="#06b6d4"
                  height={250}
                />
                <ChartCard
                  title="RPM"
                  data={chartData}
                  dataKey="rpm"
                  color="#ec4899"
                  height={250}
                />
              </>
            ) : (
              <Card className="col-span-2">
                <p className="text-muted-foreground text-center py-8">
                  Start simulation to see live data trends
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
