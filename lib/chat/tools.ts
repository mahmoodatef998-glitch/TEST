import type Anthropic from "@anthropic-ai/sdk";

// Every tool here executes a real write (or read) against the database via
// lib/chat/executor.ts. Claude must call these instead of describing what it
// would do — this file only defines the shapes it can call.

export const CHAT_TOOLS: Anthropic.Tool[] = [
  {
    name: "mark_payroll_paid",
    description:
      "تحديد مستحق مرتب (لعضو فريق) كمدفوع. استخدمه لما المستخدم يقول حاجة زي 'تم دفع فلان' أو 'ادفعت لفلان مرتبه'. لازم اسم عضو الفريق على الأقل، واسم العميل اختياري لو محتاج تحديد أي مستحق بالظبط.",
    input_schema: {
      type: "object",
      properties: {
        teamMemberName: { type: "string", description: "اسم عضو الفريق" },
        clientName: { type: "string", description: "اسم العميل (اختياري، لو فيه أكتر من مستحق لنفس الشخص)" },
        payrollEntryId: { type: "string", description: "معرف المستحق لو معروف بالظبط" },
      },
      required: ["teamMemberName"],
    },
  },
  {
    name: "add_payroll_entry",
    description: "إضافة مستحق مرتب جديد لعضو فريق (لسه لازم يتدفع).",
    input_schema: {
      type: "object",
      properties: {
        teamMemberName: { type: "string" },
        clientName: { type: "string", description: "العميل المرتبط (اختياري لو مديونية عامة)" },
        amount: { type: "number" },
        dueDate: { type: "string", description: "تاريخ الاستحقاق بصيغة YYYY-MM-DD" },
        note: { type: "string" },
      },
      required: ["teamMemberName", "amount", "dueDate"],
    },
  },
  {
    name: "update_client_cost_line",
    description:
      "تحديث أو إضافة بند تكلفة (أجر) لعضو فريق على عميل معين. استخدمه لما المستخدم يقول 'زود أجر فلان لكذا' أو 'غيّر سعر فلان مع عميل كذا'.",
    input_schema: {
      type: "object",
      properties: {
        clientName: { type: "string" },
        teamMemberName: { type: "string" },
        role: { type: "string", description: "الدور، مطلوب لو ده بند جديد" },
        amount: { type: "number" },
      },
      required: ["clientName", "teamMemberName", "amount"],
    },
  },
  {
    name: "add_client",
    description: "إضافة عميل جديد بباقته الشهرية وبنود التكلفة المبدئية.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        monthlyRevenue: { type: "number" },
        billingType: { type: "string", enum: ["monthly_recurring", "fixed_term"] },
        contractMonths: { type: "number" },
        startDate: { type: "string", description: "YYYY-MM-DD" },
        costLines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              teamMemberName: { type: "string" },
              role: { type: "string" },
              amount: { type: "number" },
              note: { type: "string" },
            },
            required: ["teamMemberName", "role", "amount"],
          },
        },
      },
      required: ["name", "monthlyRevenue", "billingType", "startDate"],
    },
  },
  {
    name: "update_client_revenue",
    description: "تحديث الباقة الشهرية (الإيراد) لعميل موجود.",
    input_schema: {
      type: "object",
      properties: {
        clientName: { type: "string" },
        newRevenue: { type: "number" },
      },
      required: ["clientName", "newRevenue"],
    },
  },
  {
    name: "add_payable",
    description: "إضافة مستحق أو مديونية عامة (لموظف أو مورد) غير مرتبطة بدورة مرتبات عادية.",
    input_schema: {
      type: "object",
      properties: {
        who: { type: "string" },
        reason: { type: "string" },
        amount: { type: "number" },
        statusNote: { type: "string", description: "توضيح إمتى هيتدفع" },
      },
      required: ["who", "reason", "amount", "statusNote"],
    },
  },
  {
    name: "add_collection_entry",
    description: "تسجيل دفعة تحصيل من عميل (متوقعة أو متحصلة فعلاً).",
    input_schema: {
      type: "object",
      properties: {
        clientName: { type: "string" },
        amount: { type: "number" },
        dueDate: { type: "string", description: "YYYY-MM-DD" },
        status: { type: "string", enum: ["pending", "paid"] },
      },
      required: ["clientName", "amount", "dueDate"],
    },
  },
  {
    name: "add_partner_draw",
    description: "تسجيل سحب أرباح لأحد الشركاء.",
    input_schema: {
      type: "object",
      properties: {
        partnerName: { type: "string" },
        amount: { type: "number" },
        date: { type: "string", description: "YYYY-MM-DD" },
      },
      required: ["partnerName", "amount", "date"],
    },
  },
  {
    name: "add_reminder",
    description: "إضافة تذكير مالي عام (مرتبط بعميل أو مش لازم).",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        type: { type: "string", enum: ["payroll", "collection", "other"] },
        relatedClientName: { type: "string" },
      },
      required: ["title", "date"],
    },
  },
  {
    name: "mark_reminder_done",
    description: "تحديد تذكير كمنجز (تم) أو إعادة فتحه.",
    input_schema: {
      type: "object",
      properties: {
        matchingText: { type: "string", description: "جزء من نص التذكير للبحث عنه" },
        done: { type: "boolean" },
      },
      required: ["matchingText", "done"],
    },
  },
  {
    name: "get_financial_summary",
    description:
      "استرجاع كل الأرقام المالية الحالية: الإيراد، التكلفة، صافي الربح، نصيب كل شريك. استخدمه لأي سؤال عن الأرقام زي 'معايا كام؟'.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_upcoming_payments",
    description: "استرجاع كل المستحقات والتحصيلات والتذكيرات القادمة خلال عدد أيام معين.",
    input_schema: {
      type: "object",
      properties: {
        daysAhead: { type: "number", description: "عدد الأيام القادمة (افتراضي 14)" },
      },
    },
  },
];
