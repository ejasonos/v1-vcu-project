"use client";

import { useState } from "react";
import { useTelemetryStore } from "@/lib/telemetry-store";
import { DashboardHeader } from "@/components/dashboard-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function buildTelemetrySummary(history: any[], faults: any[]) {
  if (!history?.length) return "No telemetry data available.";

  const latest = history[history.length - 1];
  const last30 = history.slice(-30);

  const avgVoltage = last30.reduce((a, b) => a + b.voltage, 0) / last30.length;
  const avgCurrent = last30.reduce((a, b) => a + b.current, 0) / last30.length;
  const avgTemp = last30.reduce((a, b) => a + b.temperature, 0) / last30.length;

  const packAvg =
    latest.batteryPacks.reduce((a, b) => a + b, 0) /
    latest.batteryPacks.length;

  const packImbalances = latest.batteryPacks.map(
    (v: number, i: number) =>
      `Pack ${i + 1}: ${v.toFixed(2)}V (dev: ${(v - packAvg).toFixed(2)}V)`
  );

  return `
CURRENT EV TELEMETRY:
- Voltage: ${latest.voltage.toFixed(1)}V (avg ${avgVoltage.toFixed(1)}V)
- Current: ${latest.current.toFixed(1)}A (avg ${avgCurrent.toFixed(1)}A)
- Temp: ${latest.temperature.toFixed(1)}°C (avg ${avgTemp.toFixed(1)}°C)
- SoC: ${latest.soc.toFixed(1)}%

BATTERY PACKS:
${packImbalances.join("\n")}
`.trim();
}

export default function DiagnosticsPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const history = useTelemetryStore((s) => s.history);
  const faults = useTelemetryStore((s) => s.faults);

  const isLoading = loading;

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const telemetry = buildTelemetrySummary(history, faults);

    const userMessage = {
      role: "user" as const,
      content: text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/diagnostics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          ...updatedMessages,
          {
            role: "user",
            content: `${text}\n\n---\n${telemetry}`,
          },
        ],
      }),
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let assistantText = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      assistantText += decoder.decode(value, { stream: true });

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: assistantText,
        };
        return copy;
      });
    }

    setLoading(false);
  };

  return (
    <>
      <DashboardHeader title="AI Diagnostics" />

      <div className="flex flex-1 flex-col">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BrainCircuit className="h-10 w-10 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Ask about EV system health
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[75%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "ml-auto bg-primary text-white"
                      : "border bg-card"
                  )}
                >
                  {m.role === "user"
                    ? m.content.split("\n\n---\n")[0]
                    : m.content}
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

        <div className="border-t p-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Ask diagnostics..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(input);
            }}
          />

          <Button onClick={() => handleSend(input)} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}