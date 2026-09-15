import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam, ContentBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { CHAT_TOOLS } from "@/lib/chat/tools";
import { executeTool } from "@/lib/chat/executor";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const MAX_TOOL_ROUNDS = 6;

const SYSTEM_PROMPT = `انت المحاسب الداخلي لوكالة تسويق رقمي وسوفوير في الإمارات. بتكلم عربي مصري عادي وبتنفذ عمليات حقيقية على قاعدة بيانات الوكالة عن طريق الأدوات (tools) المتاحة ليك — إنت مش مجرد شات بيوصف، لازم تستخدم الأداة المناسبة فعليًا عشان العملية تتسجل.

قواعد أساسية:
- لو الأمر ناقص بيانات أساسية (زي مبلغ أو اسم أو تاريخ)، اسأل توضيح بدل ما تفترض. متعملش حساب افتراضي لأي مبلغ مالي أبدًا.
- لو الأداة رجعت رسالة فيها طلب توضيح أو خيارات متعددة (أكتر من عميل/موظف بنفس الاسم)، اعرض الخيارات على المستخدم واسأله يحدد.
- بعد أي عملية ناجحة، اعرض ملخص واضح ومختصر بالعربي زي: "تم تسجيل: تامر — 800 درهم — مدفوع".
- لو المستخدم بيسأل سؤال عن الأرقام (زي "معايا كام؟" أو "الوضع المالي إيه؟")، استخدم get_financial_summary.
- خليك مختصر ومباشر، من غير مقدمات طويلة.`;

interface ChatRequestBody {
  message: string;
  history?: MessageParam[];
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "الشات بوت مش شغال — ANTHROPIC_API_KEY مش متضاف في إعدادات السيرفر." },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const userMessage = body.message?.trim();
  if (!userMessage) {
    return NextResponse.json({ error: "الرسالة فاضية" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages: MessageParam[] = [...(body.history ?? []), { role: "user", content: userMessage }];

  const opsApplied: Array<{ tool: string; input: unknown; result: unknown }> = [];
  let finalText = "";

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: CHAT_TOOLS,
        messages,
      });

      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        finalText = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("\n");
        break;
      }

      const toolResults: ContentBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        const result = await executeTool(block.name, (block.input ?? {}) as Record<string, unknown>);
        opsApplied.push({ tool: block.name, input: block.input, result });
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result.message,
          is_error: !result.success,
        });
      }

      messages.push({ role: "user", content: toolResults });

      if (round === MAX_TOOL_ROUNDS - 1) {
        finalText = "العملية معقدة شوية، ممكن توضح أكتر أو تجرب تاني؟";
      }
    }
  } catch (error) {
    console.error("Chat API error", error);
    const errorMessage =
      error instanceof Anthropic.APIError
        ? `حصل خطأ في الاتصال بـ Claude: ${error.message}`
        : "حصل خطأ غير متوقع، حاول تاني.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  await prisma.chatCommandLog.create({
    data: {
      userId: session.user.id ?? null,
      commandText: userMessage,
      resultSummary: finalText || "(بدون رد نصي)",
      opsApplied: JSON.stringify(opsApplied),
    },
  });

  return NextResponse.json({ reply: finalText, history: messages });
}
