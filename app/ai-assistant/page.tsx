'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useVCUStore } from '@/store/vcu-store';
import { calculateHealthScore } from '@/lib/health-score';
import { generateAIResponse } from '@/lib/ai-assistant';
import { Card } from '@/components/ui/Card';
import { CircularProgress } from '@/components/indicators/CircularProgress';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Annunciator } from '@/components/indicators/Annunciator';
import { motion } from 'framer-motion';

export default function AIAssistantPage() {
  const vcuStore = useVCUStore();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const health = React.useMemo(() => calculateHealthScore(vcuStore), [vcuStore]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [vcuStore.chatHistory]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user message
    const userMsg = {
      id: `msg-${Date.now()}-user`,
      role: 'user' as const,
      content: userInput,
      timestamp: Date.now(),
    };

    vcuStore.addChatMessage(userMsg);
    setUserInput('');
    setIsLoading(true);

    // Generate AI response
    setTimeout(async () => {
      try {
        const response = await generateAIResponse(userInput, vcuStore);
        const aiMsg = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant' as const,
          content: response,
          timestamp: Date.now(),
        };
        vcuStore.addChatMessage(aiMsg);
      } catch (error) {
        const errorMsg = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant' as const,
          content: 'Sorry, I could not generate a response right now.',
          timestamp: Date.now(),
        };
        vcuStore.addChatMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">Interactive VCU diagnostics and health monitoring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto max-h-[600px] mb-4 space-y-4 p-4">
                {vcuStore.chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <p className="text-muted-foreground mb-4">Welcome to VCU-Software AI Assistant</p>
                      <p className="text-sm text-muted-foreground">Ask me about your vehicle&apos;s health, diagnostics, or maintenance</p>
                    </div>
                  </div>
                ) : (
                  vcuStore.chatHistory.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-accent-blue text-white'
                            : 'bg-secondary text-foreground border border-border'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="text-sm whitespace-pre-wrap break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary text-foreground border border-border px-4 py-2 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="border-t border-border pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about temperature, torque, battery, diagnostics..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 bg-secondary rounded-lg border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    Send
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* Health Monitor */}
          <div className="space-y-4">
            {/* Health Score */}
            <Card className="flex items-center justify-center py-8">
              <CircularProgress
                value={health.healthScore}
                max={100}
                healthStatus={health.healthStatus}
                showLabel={true}
              />
            </Card>

            {/* Key Metrics */}
            <Card title="Live Metrics" subtitle="Real-time VCU parameters">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Motor Temp</span>
                  <span className="font-mono font-semibold">{vcuStore.motorTemperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inverter Temp</span>
                  <span className="font-mono font-semibold">{vcuStore.inverterTemperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voltage</span>
                  <span className="font-mono font-semibold">{vcuStore.dcVoltage.toFixed(1)}V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-mono font-semibold">{vcuStore.dcCurrent.toFixed(1)}A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Torque</span>
                  <span className="font-mono font-semibold">{vcuStore.actualTorque.toFixed(1)}Nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power</span>
                  <span className="font-mono font-semibold">{vcuStore.power.toFixed(2)}kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RPM</span>
                  <span className="font-mono font-semibold">{vcuStore.rpm.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Throttle</span>
                  <span className="font-mono font-semibold">{vcuStore.throttleLevel.toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            {/* Prediction */}
            {health.alerts.length > 0 && (
              <Card title="Active Alerts" subtitle={`${health.alerts.length} issues detected`}>
                <div className="space-y-2">
                  {health.alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2 rounded-lg text-xs"
                      style={{
                        backgroundColor:
                          alert.level === 'critical'
                            ? '#ef4444'
                            : alert.level === 'warning'
                              ? '#f59e0b'
                              : '#10b981' + '20',
                        border: `1px solid ${alert.level === 'critical' ? '#ef4444' : alert.level === 'warning' ? '#f59e0b' : '#10b981'}40`,
                      }}
                    >
                      <p
                        style={{
                          color:
                            alert.level === 'critical'
                              ? '#fca5a5'
                              : alert.level === 'warning'
                                ? '#fcd34d'
                                : '#86efac',
                        }}
                      >
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Key Annunciators */}
            <Card title="System Status" subtitle="Critical indicators">
              <div className="grid grid-cols-4 gap-2">
                <Annunciator
                  label="Running"
                  state={vcuStore.annunciators.running}
                  size="small"
                />
                <Annunciator
                  label="Inverter"
                  state={vcuStore.annunciators.inverterFault}
                  size="small"
                />
                <Annunciator
                  label="Battery"
                  state={vcuStore.annunciators.batteryLow}
                  size="small"
                />
                <Annunciator
                  label="Comm"
                  state={vcuStore.annunciators.communicationFault}
                  size="small"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
