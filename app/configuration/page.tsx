'use client';

import React, { useState } from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

const configSchema = z.object({
  // Throttle
  numberOfThrottlePots: z.number().min(1).max(3),
  minimumSignalLevel1: z.number(),
  maximumSignalLevel1: z.number(),
  minimumSignalLevel2: z.number(),
  maximumSignalLevel2: z.number(),
  creepLevel: z.number(),
  throttleType: z.string(),
  pedalPositionRegenMaximum: z.number(),
  pedalPositionRegenMinimum: z.number(),
  pedalPositionForwardMotionStart: z.number(),
  pedalPosition50ThrottlePercent: z.number(),
  minimumThrottleRange: z.number(),
  maximumThrottleRange: z.number(),
  // Brake
  brakeMinimumSignalLevel: z.number(),
  brakeMaximumSignalLevel: z.number(),
  brakeMinimumRegen: z.number(),
  brakeMaximumRegen: z.number(),
  // Motor
  maximumSpeed: z.number().min(1000).max(15000),
  maximumTorque: z.number().min(50).max(500),
  // System
  logLevel: z.string(),
  batteryVoltage: z.number().min(200).max(500),
  prechargRelayOutput: z.number(),
  prechargeDelay: z.number(),
  coolingFanRelayOutput: z.number(),
  mainContactorRelayOutput: z.number(),
  coolingFanONTemperature: z.number(),
  coolingFanOFFTemperature: z.number(),
  brakeLightOutput: z.number(),
});

type ConfigFormData = z.infer<typeof configSchema>;

export default function ConfigurationPage() {
  const vcuStore = useVCUStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      numberOfThrottlePots: vcuStore.throttleConfiguration.numberOfThrottlePots,
      minimumSignalLevel1: vcuStore.throttleConfiguration.minimumSignalLevel1,
      maximumSignalLevel1: vcuStore.throttleConfiguration.maximumSignalLevel1,
      minimumSignalLevel2: vcuStore.throttleConfiguration.minimumSignalLevel2,
      maximumSignalLevel2: vcuStore.throttleConfiguration.maximumSignalLevel2,
      creepLevel: vcuStore.throttleConfiguration.creepLevel,
      throttleType: vcuStore.throttleConfiguration.throttleType,
      pedalPositionRegenMaximum: vcuStore.throttleConfiguration.pedalPositionRegenMaximum,
      pedalPositionRegenMinimum: vcuStore.throttleConfiguration.pedalPositionRegenMinimum,
      pedalPositionForwardMotionStart: vcuStore.throttleConfiguration.pedalPositionForwardMotionStart,
      pedalPosition50ThrottlePercent: vcuStore.throttleConfiguration.pedalPosition50ThrottlePercent,
      minimumThrottleRange: vcuStore.throttleConfiguration.minimumThrottleRange,
      maximumThrottleRange: vcuStore.throttleConfiguration.maximumThrottleRange,
      brakeMinimumSignalLevel: vcuStore.brakeConfiguration.minimumSignalLevel,
      brakeMaximumSignalLevel: vcuStore.brakeConfiguration.maximumSignalLevel,
      brakeMinimumRegen: vcuStore.brakeConfiguration.minimumBrakeRegen,
      brakeMaximumRegen: vcuStore.brakeConfiguration.maximumBrakeRegen,
      maximumSpeed: vcuStore.motorControlConfiguration.maximumSpeed,
      maximumTorque: vcuStore.motorControlConfiguration.maximumTorque,
      logLevel: vcuStore.systemConfiguration.logLevel,
      batteryVoltage: vcuStore.systemConfiguration.batteryVoltage,
      prechargRelayOutput: vcuStore.systemConfiguration.prechargrelayOutput,
      prechargeDelay: vcuStore.systemConfiguration.prechargeDelay,
      coolingFanRelayOutput: vcuStore.systemConfiguration.coolingFanRelayOutput,
      mainContactorRelayOutput: vcuStore.systemConfiguration.mainContactorRelayOutput,
      coolingFanONTemperature: vcuStore.systemConfiguration.coolingFanONTemperature,
      coolingFanOFFTemperature: vcuStore.systemConfiguration.coolingFanOFFTemperature,
      brakeLightOutput: vcuStore.systemConfiguration.brakeLightOutput,
    },
  });

  const onSubmit = async (data: ConfigFormData) => {
    setSaveStatus('saving');
    await new Promise((resolve) => setTimeout(resolve, 500));

    vcuStore.updateThrottleConfig({
      numberOfThrottlePots: data.numberOfThrottlePots,
      minimumSignalLevel1: data.minimumSignalLevel1,
      maximumSignalLevel1: data.maximumSignalLevel1,
      minimumSignalLevel2: data.minimumSignalLevel2,
      maximumSignalLevel2: data.maximumSignalLevel2,
      creepLevel: data.creepLevel,
      throttleType: data.throttleType,
      pedalPositionRegenMaximum: data.pedalPositionRegenMaximum,
      pedalPositionRegenMinimum: data.pedalPositionRegenMinimum,
      pedalPositionForwardMotionStart: data.pedalPositionForwardMotionStart,
      pedalPosition50ThrottlePercent: data.pedalPosition50ThrottlePercent,
      minimumThrottleRange: data.minimumThrottleRange,
      maximumThrottleRange: data.maximumThrottleRange,
    });

    vcuStore.updateBrakeConfig({
      minimumSignalLevel: data.brakeMinimumSignalLevel,
      maximumSignalLevel: data.brakeMaximumSignalLevel,
      minimumBrakeRegen: data.brakeMinimumRegen,
      maximumBrakeRegen: data.brakeMaximumRegen,
    });

    vcuStore.updateMotorControlConfig({
      maximumSpeed: data.maximumSpeed,
      maximumTorque: data.maximumTorque,
    });

    vcuStore.updateSystemConfig({
      logLevel: data.logLevel,
      batteryVoltage: data.batteryVoltage,
      prechargrelayOutput: data.prechargRelayOutput,
      prechargeDelay: data.prechargeDelay,
      coolingFanRelayOutput: data.coolingFanRelayOutput,
      mainContactorRelayOutput: data.mainContactorRelayOutput,
      coolingFanONTemperature: data.coolingFanONTemperature,
      coolingFanOFFTemperature: data.coolingFanOFFTemperature,
      brakeLightOutput: data.brakeLightOutput,
    });

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const onReset = () => {
    reset();
    setSaveStatus('idle');
  };

  const FormGroup: React.FC<{
    label: string;
    name: keyof ConfigFormData;
    error?: string;
    type?: string;
    step?: string;
  }> = ({ label, name, error, type = 'number', step = '0.01' }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        {...register(name, { valueAsNumber: type === 'number' })}
        type={type}
        step={step}
        className="px-3 py-2 bg-secondary rounded-lg border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue"
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Configuration</h1>
          <p className="text-muted-foreground">System and motor control parameters</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Throttle Configuration */}
          <Card title="Throttle Configuration" subtitle="Throttle pedal and control parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroup
                label="Number of Throttle Pots"
                name="numberOfThrottlePots"
                error={errors.numberOfThrottlePots?.message}
                type="number"
                step="1"
              />
              <FormGroup
                label="Minimum Signal Level 1 (V)"
                name="minimumSignalLevel1"
                error={errors.minimumSignalLevel1?.message}
              />
              <FormGroup
                label="Maximum Signal Level 1 (V)"
                name="maximumSignalLevel1"
                error={errors.maximumSignalLevel1?.message}
              />
              <FormGroup
                label="Minimum Signal Level 2 (V)"
                name="minimumSignalLevel2"
                error={errors.minimumSignalLevel2?.message}
              />
              <FormGroup
                label="Maximum Signal Level 2 (V)"
                name="maximumSignalLevel2"
                error={errors.maximumSignalLevel2?.message}
              />
              <FormGroup
                label="Creep Level (%)"
                name="creepLevel"
                error={errors.creepLevel?.message}
              />
              <FormGroup
                label="Throttle Type"
                name="throttleType"
                error={errors.throttleType?.message}
                type="text"
              />
              <FormGroup
                label="Pedal Regen Maximum (%)"
                name="pedalPositionRegenMaximum"
                error={errors.pedalPositionRegenMaximum?.message}
              />
              <FormGroup
                label="Pedal Regen Minimum (%)"
                name="pedalPositionRegenMinimum"
                error={errors.pedalPositionRegenMinimum?.message}
              />
              <FormGroup
                label="Forward Motion Start (%)"
                name="pedalPositionForwardMotionStart"
                error={errors.pedalPositionForwardMotionStart?.message}
              />
              <FormGroup
                label="50% Throttle Point (%)"
                name="pedalPosition50ThrottlePercent"
                error={errors.pedalPosition50ThrottlePercent?.message}
              />
              <FormGroup
                label="Minimum Throttle Range (%)"
                name="minimumThrottleRange"
                error={errors.minimumThrottleRange?.message}
              />
              <FormGroup
                label="Maximum Throttle Range (%)"
                name="maximumThrottleRange"
                error={errors.maximumThrottleRange?.message}
              />
            </div>
          </Card>

          {/* Brake Configuration */}
          <Card title="Brake Configuration" subtitle="Brake system and regenerative braking">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormGroup
                label="Minimum Signal Level (V)"
                name="brakeMinimumSignalLevel"
                error={errors.brakeMinimumSignalLevel?.message}
              />
              <FormGroup
                label="Maximum Signal Level (V)"
                name="brakeMaximumSignalLevel"
                error={errors.brakeMaximumSignalLevel?.message}
              />
              <FormGroup
                label="Minimum Brake Regen (%)"
                name="brakeMinimumRegen"
                error={errors.brakeMinimumRegen?.message}
              />
              <FormGroup
                label="Maximum Brake Regen (%)"
                name="brakeMaximumRegen"
                error={errors.brakeMaximumRegen?.message}
              />
            </div>
          </Card>

          {/* Motor Control Configuration */}
          <Card title="Motor Control Configuration" subtitle="Motor performance limits">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup
                label="Maximum Speed (RPM)"
                name="maximumSpeed"
                error={errors.maximumSpeed?.message}
                type="number"
                step="100"
              />
              <FormGroup
                label="Maximum Torque (Nm)"
                name="maximumTorque"
                error={errors.maximumTorque?.message}
                type="number"
                step="10"
              />
            </div>
          </Card>

          {/* System Configuration */}
          <Card title="System Configuration" subtitle="Vehicle system and electrical settings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroup
                label="Log Level"
                name="logLevel"
                error={errors.logLevel?.message}
                type="text"
              />
              <FormGroup
                label="Battery Voltage (V)"
                name="batteryVoltage"
                error={errors.batteryVoltage?.message}
                type="number"
                step="10"
              />
              <FormGroup
                label="Precharge Relay Output"
                name="prechargRelayOutput"
                error={errors.prechargRelayOutput?.message}
                type="number"
                step="1"
              />
              <FormGroup
                label="Precharge Delay (ms)"
                name="prechargeDelay"
                error={errors.prechargeDelay?.message}
                type="number"
                step="100"
              />
              <FormGroup
                label="Cooling Fan Relay Output"
                name="coolingFanRelayOutput"
                error={errors.coolingFanRelayOutput?.message}
                type="number"
                step="1"
              />
              <FormGroup
                label="Main Contactor Relay Output"
                name="mainContactorRelayOutput"
                error={errors.mainContactorRelayOutput?.message}
                type="number"
                step="1"
              />
              <FormGroup
                label="Cooling Fan ON Temp (°C)"
                name="coolingFanONTemperature"
                error={errors.coolingFanONTemperature?.message}
                type="number"
                step="1"
              />
              <FormGroup
                label="Cooling Fan OFF Temp (°C)"
                name="coolingFanOFFTemperature"
                error={errors.coolingFanOFFTemperature?.message}
                type="number"
                step="1"
              />
              <FormGroup
                label="Brake Light Output"
                name="brakeLightOutput"
                error={errors.brakeLightOutput?.message}
                type="number"
                step="1"
              />
            </div>
          </Card>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onReset}
              disabled={!isDirty}
              className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Reset
            </button>
            <motion.button
              type="submit"
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : 'bg-accent-blue text-white hover:bg-blue-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
