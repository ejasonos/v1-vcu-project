"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTelemetryStore } from "@/lib/telemetry-store";
import { DashboardHeader } from "@/components/dashboard-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  Send,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function buildTelemetrySummary(history: any[], faults: any[]) {
  if (!history?.length) return "No telemetry data available.";

  const latest = history[history.length - 1];
  const last30 = history.slice(-30);

  const avgVoltage = last30.reduce((a, b) => a + b.voltage, 0) / last30.length;
  const avgCurrent = last30.reduce((a, b) => a + b.current, 0) / last30.length;
  const avgTemp = last30.reduce((a, b) => a + b.temperature, 0) / last30.length;

  const maxTemp = Math.max(...last30.map((s) => s.temperature));
  const maxCurrent = Math.max(...last30.map((s) => s.current));
  const minVoltage = Math.min(...last30.map((s) => s.voltage));

  const packAvg =
    latest.batteryPacks.reduce((a, b) => a + b, 0) /
    latest.batteryPacks.length;

  const packImbalances = latest.batteryPacks.map(
    (v: number, i: number) =>
      `Pack ${i + 1}: ${v.toFixed(2)}V (dev: ${(v - packAvg).toFixed(2)}V)`
  );

  const recentFaults = faults.slice(0, 10);

  return `
CURRENT EV TELEMETRY DATA:
- System Voltage: ${latest.voltage.toFixed(1)}V (avg: ${avgVoltage.toFixed(1)}V, min: ${minVoltage.toFixed(1)}V)
- System Current: ${latest.current.toFixed(1)}A (avg: ${avgCurrent.toFixed(1)}A, max: ${maxCurrent.toFixed(1)}A)
- Vehicle Speed: ${latest.velocity.toFixed(1)} km/h
- Acceleration: ${latest.acceleration.toFixed(2)} m/s²
- Temperature: ${latest.temperature.toFixed(1)}°C (avg: ${avgTemp.toFixed(1)}°C, max: ${maxTemp.toFixed(1)}°C)
- State of Charge: ${latest.soc.toFixed(1)}%
- Power Output: ${latest.power.toFixed(1)} kW

BATTERY PACK VOLTAGES:
${packImbalances.join("\n")}
Pack Average: ${packAvg.toFixed(2)}V

RECENT FAULT EVENTS:
${
  recentFaults.length
    ? recentFaults
        .map(
          (f) =>
            `[${f.severity.toUpperCase()}] ${f.system}: ${f.message}`
        )
        .join("\n")
    : "No recent faults."
}
  `.trim();
}

const QUICK_PROMPTS = [
  "Analyze system health and predict faults",
  "Check battery imbalance issues",
  "Thermal risk assessment",
  "Predict remaining range",
  "Validate current draw safety",
];

export default function DiagnosticsPage() {
  const [input, setInput] = useState("");

  const history = useTelemetryStore((s) => s.history);
  const faults = useTelemetryStore((s) => s.faults);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/diagnostics",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const telemetry = buildTelemetrySummary(history, faults);

    sendMessage({
      text: `${trimmed}\n\n---\n${telemetry}`,
    });

    setInput("");
  };

  const criticalFaults = faults.filter((f) => f.severity === "critical");
  const warningFaults = faults.filter((f) => f.severity === "warning");

  return (
    <>
      <DashboardHeader title="AI Diagnostics" />

      <div className="flex flex-1 overflow-hidden">
        {/* CHAT AREA */}
        <div className="flex flex-1 flex-col">
          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <BrainCircuit className="h-10 w-10 text-primary" />
                <h2 className="mt-3 text-lg font-semibold">
                  AI Fault Prediction
                </h2>

                <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                  Ask the AI to analyze EV telemetry, detect faults, and
                  generate maintenance insights in real time.
                </p>

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      className="rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[75%] rounded-lg px-4 py-3 text-sm",
                      m.role === "user"
                        ? "ml-auto bg-primary text-white"
                        : "border bg-card"
                    )}
                  >
                    <div className="whitespace-pre-wrap">
                      {m.parts?.map((p, i) =>
                        p.type === "text" ? (
                          <span key={i}>
                            {m.role === "user"
                              ? p.text.split("\n\n---\n")[0]
                              : p.text}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing telemetry...
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* INPUT */}
          <div className="border-t p-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about system health..."
              className="flex-1 border rounded px-3 py-2 text-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(input);
              }}
            />

            <Button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="hidden xl:flex w-72 border-l p-4 flex-col gap-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Fault Summary
            </p>

            <div className="mt-2 text-center">
              <p className="text-3xl font-bold">
                {Math.max(
                  0,
                  100 - criticalFaults.length * 15 - warningFaults.length * 5
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Health Score / 100
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Critical: {criticalFaults.length} | Warning: {warningFaults.length}
          </div>
        </div>
      </div>
    </>
  );
  }
