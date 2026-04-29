import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are an expert EV (Electric Vehicle) diagnostics AI assistant integrated into a Vehicle Control Unit (VCU) monitoring system. You have deep knowledge of:

- EV battery management systems (BMS), cell balancing, and thermal management
- Electric motor controllers, inverters, and power electronics
- Vehicle dynamics, regenerative braking, and energy recovery
- Fault detection, predictive maintenance, and failure mode analysis
- SAE J1772, CCS, CHAdeMO charging standards
- ISO 26262 functional safety standards

When the user asks a question, you will receive real-time telemetry data appended to their message after a "---" separator.

ANALYSIS GUIDELINES:
1. Always reference specific values from telemetry
2. Compare against EV operating ranges
3. Identify anomalies and risks
4. Predict failures early
5. Provide severity levels (Normal / Warning / Critical)
6. Suggest maintenance actions
7. Consider subsystem interactions

Format clearly with sections and bullet points.`;

const client = new OpenAI({
  baseURL: process.env.BASE_URL || "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await client.chat.completions.create({
      model: "minimaxai/minimax-m2.7",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return new Response(
      JSON.stringify({
        error: error?.message || "AI diagnostics failed",
      }),
      { status: 500 }
    );
  }
}