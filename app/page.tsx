'use client';

import Link from 'next/link';
import { Play, Database, BarChart3, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            VCU Software Simulation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            An educational software simulation of a Vehicle Control Unit in an Electric Vehicle. 
            This application generates vehicle operating conditions, displays simulated system 
            parameters through a dashboard, and provides AI-assisted diagnostic explanations.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
        >
          <Link
            href="/simulation"
            className="px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition flex items-center justify-center gap-3 text-lg"
          >
            <Play size={24} />
            Start Simulation
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-card text-foreground font-semibold rounded-lg border border-border hover:bg-card/80 transition flex items-center justify-center gap-3 text-lg"
          >
            View Dashboard
            <BarChart3 size={20} />
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="hover:border-accent transition h-full">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10">
                    <Database className="text-accent" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">VCU Simulation Engine</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Generates realistic simulated vehicle data including battery state, motor speed, temperatures, and vehicle dynamics.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="hover:border-accent transition h-full">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10">
                    <BarChart3 className="text-accent" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Dashboard Interface</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Monitor all simulated vehicle parameters in real-time through an intuitive HMI with live trend charts.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="hover:border-accent transition h-full">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10">
                    <Sparkles className="text-accent" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI Diagnostics</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Ask questions about the current simulation state and receive intelligent explanations of system conditions.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="hover:border-accent transition h-full">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10">
                    <Database className="text-accent" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Educational Software</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Designed for learning and demonstration of EV control systems, diagnostics, and vehicle behavior.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Link href="/simulation">
            <Card className="cursor-pointer hover:border-accent transition">
              <h3 className="text-base font-semibold text-foreground mb-1">Simulation Control</h3>
              <p className="text-sm text-muted-foreground">
                Control throttle and brake, inject faults, and manage simulation speed
              </p>
            </Card>
          </Link>
          <Link href="/configuration">
            <Card className="cursor-pointer hover:border-accent transition">
              <h3 className="text-base font-semibold text-foreground mb-1">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Adjust simulation parameters and system configuration
              </p>
            </Card>
          </Link>
          <Link href="/ai-assistant">
            <Card className="cursor-pointer hover:border-accent transition">
              <h3 className="text-base font-semibold text-foreground mb-1">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions and get diagnostic insights about the simulation
              </p>
            </Card>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
