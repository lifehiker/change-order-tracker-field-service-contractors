export type DecisionState = "pending" | "approved" | "needs_changes" | "declined";

export type MaterialLine = {
  id: string;
  label: string;
  quantity: number;
  unitCost: number;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
};

export type ChangeOrderDraft = {
  trade: "Plumbing" | "Commercial AV";
  jobName: string;
  clientName: string;
  clientContact: string;
  siteLocation: string;
  changeTitle: string;
  urgency: "Same day" | "Before closeout" | "Scheduled follow-up";
  scopeSummary: string;
  laborHours: number;
  laborRate: number;
  materials: MaterialLine[];
  markupRate: number;
  photos: Attachment[];
  officeNote: string;
  approvalSentAt?: string;
  approval: {
    state: DecisionState;
    signerName: string;
    signerTitle: string;
    responseNote: string;
    respondedAt?: string;
  };
};

export const DEMO_STORAGE_KEY = "change-order-tracker-demo";

export const defaultDraft: ChangeOrderDraft = {
  trade: "Plumbing",
  jobName: "North Ridge tenant finish",
  clientName: "Alder & Pike Properties",
  clientContact: "marissa@alderpike.com",
  siteLocation: "1127 Fremont Ave, Bellevue, WA",
  changeTitle: "Add two hose bibs and reroute supply line",
  urgency: "Same day",
  scopeSummary:
    "Crew opened the south wall and found the planned path blocked by an existing gas run. Client also requested two exterior hose bibs while the wall is open. Extra work includes rerouting copper, adding shutoffs, and patch coordination.",
  laborHours: 6,
  laborRate: 145,
  materials: [
    { id: "copper", label: "Copper, shutoffs, and fittings", quantity: 1, unitCost: 265 },
    { id: "fixtures", label: "Two frost-proof hose bibs", quantity: 2, unitCost: 74 },
  ],
  markupRate: 18,
  photos: [
    {
      id: "photo-1",
      name: "blocked-wall-condition.jpg",
      url: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'%3E%3Crect width='600' height='420' fill='%231b3034'/%3E%3Crect x='52' y='48' width='496' height='324' rx='20' fill='%23294b51' stroke='%235bb8bd' stroke-width='6'/%3E%3Cpath d='M140 132h320M140 182h200M140 232h280' stroke='%23e9f5f5' stroke-width='10' stroke-linecap='round'/%3E%3Ccircle cx='456' cy='254' r='42' fill='%23b85d2d'/%3E%3Ctext x='110' y='334' fill='%23f4eee4' font-size='32' font-family='Arial'%3EExisting gas run blocks path%3C/text%3E%3C/svg%3E",
    },
  ],
  officeNote:
    "Approved records should be attached directly to the invoice packet for draw 03. PM wants client language to stay plain and non-technical.",
  approval: {
    state: "pending",
    signerName: "",
    signerTitle: "",
    responseNote: "",
  },
};

export function calculateMaterialTotal(materials: MaterialLine[]) {
  return materials.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
}

export function calculateLaborTotal(draft: ChangeOrderDraft) {
  return draft.laborHours * draft.laborRate;
}

export function calculateSubtotal(draft: ChangeOrderDraft) {
  return calculateLaborTotal(draft) + calculateMaterialTotal(draft.materials);
}

export function calculateMarkupTotal(draft: ChangeOrderDraft) {
  return calculateSubtotal(draft) * (draft.markupRate / 100);
}

export function calculateGrandTotal(draft: ChangeOrderDraft) {
  return calculateSubtotal(draft) + calculateMarkupTotal(draft);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTimestamp(value?: string) {
  if (!value) return "Not yet recorded";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
