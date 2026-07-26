'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useVCUStore } from '@/store/vcu-store';
import { generateAIResponse } from '@/lib/ai-assistant';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIAssistantPage() {
  const store = useVCUStore();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [store.chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      role: 'user' as const,
      content: trimmedInput,
      timestamp: Date.now(),
    };

    store.addChatMessage(userMsg);
    setUserInput('');
    setIsLoading(true);

    try {
      const assistantContext = {
        simulationRunning: store.simulationRunning,
        failureMode: store.failureMode,
        userThrottle: store.userThrottle,
        userBrake: store.userBrake,
        simulationSettings: store.simulationSettings,
        data: store.data,
        metrics: store.metrics,
        chatHistory: store.chatHistory,
        motorRunning: store.motorRunning,
        faulted: store.faulted,
        connected: store.connected,
        operatingTime: store.operatingTime,
        motorTemperature: store.motorTemperature,
        requestedTorque: store.requestedTorque,
        actualTorque: store.actualTorque,
        dcVoltage: store.dcVoltage,
        dcCurrent: store.dcCurrent,
        power: store.power,
        throttleLevel: store.throttleLevel,
        brakeLevel: store.brakeLevel,
        inverterTemperature: store.inverterTemperature,
        rpm: store.rpm,
        batteryVoltage: store.batteryVoltage,
        maximumSpeed: store.maximumSpeed,
        maximumTorque: store.maximumTorque,
        coolingFanState: store.coolingFanState,
        mainContactorState: store.mainContactorState,
        prechargeRelayState: store.prechargeRelayState,
        annunciators: store.annunciators,
        logLevel: store.logLevel,
        throttleConfiguration: store.throttleConfiguration,
        brakeConfiguration: store.brakeConfiguration,
        healthScore: store.healthScore,
        healthStatus: store.healthStatus,
        prediction: store.prediction,
        warnings: store.warnings,
      };

      const response = await generateAIResponse(trimmedInput, assistantContext);
      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant' as const,
        content: response || 'I could not generate a reply right now.',
        timestamp: Date.now(),
      };

      store.addChatMessage(aiMsg);
    } catch (error) {
      const fallbackMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant' as const,
        content: 'The assistant service is unavailable right now. Please try again in a moment.',
        timestamp: Date.now(),
      };
      store.addChatMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Diagnostic Assistant</h1>
          <p className="text-muted-foreground mb-8">Ask questions about the current simulation state and receive intelligent explanations</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto max-h-[600px] mb-4 space-y-4 p-4">
                {store.chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground mb-2">Welcome to the AI Assistant</p>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Ask questions about the current simulation state. For example: &quot;Why is the battery temperature increasing?&quot; or &quot;Is the system healthy?&quot;
                      </p>
                    </div>
                  </div>
                ) : (
                  store.chatHistory.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-sm px-4 py-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-accent text-white'
                            : 'bg-card text-foreground border border-border'
                        }`}
                      >
                        <div className="text-sm break-words">
                          {msg.role === 'assistant' ? (
                            <div className="space-y-2">
                              <ReactMarkdown
                                skipHtml
                                components={{
                                  p: ({ children }) => <p className="whitespace-pre-wrap leading-relaxed">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                                  li: ({ children }) => <li>{children}</li>,
                                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                  code: ({ children, className, ...props }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                      <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs" {...props}>
                                        {children}
                                      </code>
                                    ) : (
                                      <pre className="overflow-x-auto rounded bg-muted/60 p-2">
                                        <code className={className} {...props}>
                                          {children}
                                        </code>
                                      </pre>
                                    );
                                  },
                                  a: ({ children, href }) => (
                                    <a href={href} className="text-accent underline" target="_blank" rel="noreferrer">
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {typeof msg.content === 'string' ? msg.content : 'Unable to render message.'}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{typeof msg.content === 'string' ? msg.content : 'Unable to render message.'}</p>
                          )}
                        </div>
                        <p className="text-xs opacity-70 mt-2">
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
                    <div className="bg-card text-foreground border border-border px-4 py-3 rounded-lg">
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-muted-foreground">Thinking</span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
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
                    placeholder="Ask about system status, battery, temperature..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-card rounded-lg border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className="px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Live Metrics Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* System Status */}
            <Card>
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">System Status</p>
                <p className={`text-2xl font-bold ${store.data.systemStatus === 'Normal' ? 'text-green-400' : store.data.systemStatus === 'Warning' ? 'text-yellow-400' : 'text-red-500'}`}>
                  {store.data.systemStatus}
                </p>
              </div>
            </Card>

            {/* Live Metrics */}
            <Card title="Current Parameters">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground">Battery SOC</span>
                  <span className="font-mono font-semibold text-green-400">{store.data.batterySoc.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground">Battery Temp</span>
                  <span className="font-mono font-semibold">{store.data.batteryTemperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground">Motor Speed</span>
                  <span className="font-mono font-semibold">{store.data.motorSpeed.toFixed(0)} RPM</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground">Motor Temp</span>
                  <span className="font-mono font-semibold">{store.data.motorTemperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground">Throttle</span>
                  <span className="font-mono font-semibold">{store.data.throttlePosition.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Brake</span>
                  <span className="font-mono font-semibold">{store.data.brakePosition.toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            {/* Fault Display */}
            {store.data.faultStatus && (
              <Card className="border-l-4 border-l-red-500">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Active Fault</p>
                  <p className="text-base font-semibold text-red-400">{store.data.faultStatus}</p>
                </div>
              </Card>
            )}

            {/* Charging Status */}
            <Card>
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Charging</p>
                <p className="text-lg font-semibold text-foreground">{store.data.chargingStatus}</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
