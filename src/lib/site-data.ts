export type AccentTheme = {
  accent: string;
  accentSoft: string;
  accentDeep: string;
  panel: string;
};

export type SeoPage = {
  slug: string[];
  title: string;
  description: string;
  eyebrow: string;
  lead: string;
  proof: string[];
  checkpoints: string[];
  ctaLabel: string;
  theme: AccentTheme;
  table?: {
    headers: [string, string, string];
    rows: Array<[string, string, string]>;
  };
};

export const homeStats = [
  { value: "3 min", label: "to log a field change before it turns into a phone thread" },
  { value: "1 link", label: "for client approval, whether the crew is plumbing or AV" },
  { value: "0 margin leaks", label: "from verbal signoff and scattered job notes" },
];

export const workflowSteps = [
  {
    step: "01",
    title: "Capture the scope change onsite",
    body: "Techs log what changed, why it changed, and what labor or material impact it creates while the details are still fresh.",
  },
  {
    step: "02",
    title: "Send a clean client approval link",
    body: "Instead of text screenshots and verbal yeses, the client sees one summary, one price delta, and one clear decision.",
  },
  {
    step: "03",
    title: "Hand the office invoice-ready documentation",
    body: "Approved scope, labor, materials, photos, and signoff are packaged into one record the back office can bill from.",
  },
];

export const featureDeck = [
  {
    title: "Field-first mobile capture",
    body: "Large tap targets, fast note entry, and a layout built for one hand in a driveway or mechanical room.",
  },
  {
    title: "Trade-specific language",
    body: "Plumbers, AV installers, and small contractors do not need a bloated CRM to explain extra work and get paid for it.",
  },
  {
    title: "Invoice-ready documentation",
    body: "Every captured change rolls into a structured summary that the office can print, email, or attach to invoicing.",
  },
  {
    title: "Approval before the wrench turns",
    body: "The core product promise is simple: document the change, price it, and get a clear answer before scope expands.",
  },
];

export const testimonials = [
  {
    quote:
      "When a client adds two fixtures after demo, we need paperwork before the crew keeps moving. This would stop the margin bleed immediately.",
    person: "Owner, 6-truck plumbing shop",
  },
  {
    quote:
      "Install scope always changes in the room. I need the PM and client to see the impact without opening a giant project platform.",
    person: "Operations lead, commercial AV integrator",
  },
];

export const seoPages: SeoPage[] = [
  {
    slug: ["plumbers", "change-order-software"],
    title: "Change Order Software for Plumbers",
    description:
      "A lightweight plumber change order app for extra work approvals, scope changes, and invoice-ready documentation.",
    eyebrow: "Plumbing Shops",
    lead:
      "Residential and light commercial plumbers lose money when extra fixtures, reroutes, or access issues get handled by text. This page is tuned to the exact workflow small plumbing shops need.",
    proof: [
      "Document added fixtures, reroutes, trenching, wall access, or code-required adjustments onsite.",
      "Show labor hours, material cost, and markup before the crew continues.",
      "Keep office billing clean with approved scope, client notes, and job photos in one record.",
    ],
    checkpoints: [
      "Extra work approval form built for plumbing crews",
      "One-tap summary for owner-operators and office managers",
      "Cleaner backup for invoices when disputes show up weeks later",
    ],
    ctaLabel: "Open plumber workflow",
    theme: {
      accent: "#b85d2d",
      accentSoft: "rgba(184, 93, 45, 0.24)",
      accentDeep: "#5f2d18",
      panel: "rgba(252, 244, 235, 0.84)",
    },
  },
  {
    slug: ["av-installers", "change-order-software"],
    title: "Change Order Software for AV Installers",
    description:
      "Commercial audiovisual scope-change tracking with client approval links and documentation your PM can actually use.",
    eyebrow: "AV Integrators",
    lead:
      "AV install teams constantly hit scope drift: added drops, bracket changes, rack adjustments, cable path surprises, and site readiness gaps. The workflow here stays narrow and practical.",
    proof: [
      "Track added equipment, labor overruns, cable reroutes, and install blockers from the field.",
      "Send one polished approval view to the client instead of fragmented notes across PM, field, and GC threads.",
      "Create a project log the office can reference when billing or closing out change events.",
    ],
    checkpoints: [
      "Built for commercial audiovisual scope changes",
      "Fast enough for onsite updates mid-install",
      "Clear enough for clients who just need the delta and the price impact",
    ],
    ctaLabel: "Open AV workflow",
    theme: {
      accent: "#5bb8bd",
      accentSoft: "rgba(91, 184, 189, 0.22)",
      accentDeep: "#12383d",
      panel: "rgba(235, 249, 249, 0.84)",
    },
  },
  {
    slug: ["field-service", "change-order-template"],
    title: "Field Service Change Order Template",
    description:
      "Use a field service change order template that captures scope, pricing impact, client approval, and invoice backup in one record.",
    eyebrow: "Template",
    lead:
      "For teams still using loose PDFs and text threads, the right template is the first step toward a consistent approval process. This page shows the structure every field change should include.",
    proof: [
      "Change summary, labor impact, material impact, client contact, and attachments all belong in the same template.",
      "A good template avoids generic paperwork and focuses on extra-work approval before work proceeds.",
      "The same structure can be used by plumbers, electricians, AV installers, and other small field service trades.",
    ],
    checkpoints: [
      "Designed around onsite scope-change capture",
      "Client-friendly approval section included",
      "Invoice-ready documentation block at the end",
    ],
    ctaLabel: "Use the live template",
    theme: {
      accent: "#7a9258",
      accentSoft: "rgba(122, 146, 88, 0.22)",
      accentDeep: "#354426",
      panel: "rgba(245, 249, 236, 0.84)",
    },
  },
  {
    slug: ["client-approval", "extra-work"],
    title: "Client Approval for Extra Work",
    description:
      "Get clear extra-work approval from clients before crews continue, with pricing, photos, scope notes, and a simple decision view.",
    eyebrow: "Approval Flow",
    lead:
      "The business problem is not just documentation. It is getting a clear yes before scope expands. This page focuses on the approval layer that keeps small contractors from eating surprise work.",
    proof: [
      "Clients see the exact change, the price delta, and the reason it matters before they approve.",
      "Field teams stop relying on verbal go-aheads that disappear when the invoice lands.",
      "The office gets a timestamped decision and client note alongside the change record.",
    ],
    checkpoints: [
      "Simple enough to sign from a phone",
      "Detailed enough to avoid billing ambiguity",
      "Connected directly to the final documentation packet",
    ],
    ctaLabel: "Preview client approval",
    theme: {
      accent: "#b1453c",
      accentSoft: "rgba(177, 69, 60, 0.22)",
      accentDeep: "#571f1c",
      panel: "rgba(252, 239, 236, 0.84)",
    },
  },
  {
    slug: ["compare", "jobber-vs-change-order-tracker"],
    title: "Jobber vs Change Order Tracker",
    description:
      "A narrow comparison for teams evaluating Jobber against a purpose-built scope-change approval workflow.",
    eyebrow: "Comparison",
    lead:
      "Jobber validates the market, but its center of gravity is broad field service operations. This comparison isolates the specific change-order workflow small crews need to move faster onsite.",
    proof: [
      "Jobber is stronger as a general FSM platform for scheduling, quoting, and invoicing.",
      "Change Order Tracker is intentionally narrower: extra work capture, approval, and invoice backup.",
      "Teams that mainly need scope-change control can avoid buying more operating system than they will use.",
    ],
    checkpoints: [
      "Broad FSM versus narrow field-change workflow",
      "Faster field entry for unplanned scope changes",
      "Simpler client approval handoff",
    ],
    ctaLabel: "Try the focused workflow",
    theme: {
      accent: "#946b2d",
      accentSoft: "rgba(148, 107, 45, 0.22)",
      accentDeep: "#4a3415",
      panel: "rgba(252, 246, 232, 0.84)",
    },
    table: {
      headers: ["Criteria", "Jobber", "Change Order Tracker"],
      rows: [
        ["Primary focus", "Full field service management", "Scope-change approval and documentation"],
        ["Best use case", "All-in-one scheduling and operations", "Extra work capture before margin leaks"],
        ["Field speed", "Broader workflow to navigate", "Lean, purpose-built capture flow"],
        ["Client approval", "Part of a larger system", "Front-and-center workflow"],
      ],
    },
  },
  {
    slug: ["compare", "housecall-pro-vs-change-order-tracker"],
    title: "Housecall Pro vs Change Order Tracker",
    description:
      "Compare Housecall Pro with a narrow extra-work approval tool for small contractor teams that need speed in the field.",
    eyebrow: "Comparison",
    lead:
      "Housecall Pro is strong when the business needs a broad operating layer. The alternative presented here is for crews who specifically need a better way to handle scope drift, pricing, and approval.",
    proof: [
      "Housecall Pro serves wider dispatch, scheduling, and customer management needs.",
      "Change Order Tracker is built around one painful job: document extra work and get a clear answer fast.",
      "The narrower scope means less interface weight when a crew is already onsite and blocked.",
    ],
    checkpoints: [
      "Small-team workflow with lower operational overhead",
      "Client signoff emphasized over back-office breadth",
      "Cleaner approval packet for disputed invoices",
    ],
    ctaLabel: "Launch the field demo",
    theme: {
      accent: "#4f7c8b",
      accentSoft: "rgba(79, 124, 139, 0.22)",
      accentDeep: "#183640",
      panel: "rgba(236, 245, 248, 0.84)",
    },
    table: {
      headers: ["Criteria", "Housecall Pro", "Change Order Tracker"],
      rows: [
        ["Primary focus", "Broad home service operations", "Narrow scope-change control"],
        ["Workflow depth", "Scheduling, dispatch, invoicing, CRM", "Capture, approval, documentation"],
        ["Field friction", "More system context required", "Focused entry path for extra work"],
        ["Best buyer", "Teams standardizing operations", "Teams tired of unpaid change events"],
      ],
    },
  },
  {
    slug: ["compare", "buildertrend-vs-change-order-tracker"],
    title: "Buildertrend vs Change Order Tracker",
    description:
      "Compare Buildertrend with a lighter change-order workflow for small field service contractors and AV installers.",
    eyebrow: "Comparison",
    lead:
      "Buildertrend proves change orders matter, but it is built with a heavier construction-management posture. Small service teams often need the job without the platform bulk.",
    proof: [
      "Buildertrend fits larger construction coordination and project-management workflows.",
      "Change Order Tracker strips the workflow down to field capture, client decision, and invoice backup.",
      "That makes more sense for fast-moving service calls and commercial install crews.",
    ],
    checkpoints: [
      "Lighter than construction software",
      "Better fit for service-style jobs and install crews",
      "Faster to learn for owner-operators",
    ],
    ctaLabel: "See the lighter workflow",
    theme: {
      accent: "#7f6547",
      accentSoft: "rgba(127, 101, 71, 0.22)",
      accentDeep: "#382a1d",
      panel: "rgba(248, 242, 235, 0.84)",
    },
    table: {
      headers: ["Criteria", "Buildertrend", "Change Order Tracker"],
      rows: [
        ["Primary focus", "Construction project management", "Field-service change events"],
        ["Complexity", "Heavier implementation footprint", "Lean startup for small teams"],
        ["Trade fit", "Builders and remodel workflows", "Plumbers, AV installers, and service contractors"],
        ["Decision speed", "Works within a larger PM stack", "Designed for rapid onsite approval"],
      ],
    },
  },
  {
    slug: ["use-cases", "invoice-ready-job-documentation"],
    title: "Invoice-Ready Job Documentation",
    description:
      "Turn onsite scope changes into invoice-ready documentation with approved pricing, notes, photos, and timestamps.",
    eyebrow: "Use Case",
    lead:
      "The real win is not capturing the change. It is making the billing packet so clean that the office can invoice confidently and defend the charge later.",
    proof: [
      "Approved labor and material deltas stay attached to the same change record.",
      "Photos, field notes, and client remarks travel with the invoice backup instead of living in different systems.",
      "Back-office teams can print or export a complete summary without reconstructing the story.",
    ],
    checkpoints: [
      "Built for invoicing and dispute defense",
      "Supports both residential and commercial workflows",
      "Turns messy field events into a billable artifact",
    ],
    ctaLabel: "Open documentation preview",
    theme: {
      accent: "#4d7868",
      accentSoft: "rgba(77, 120, 104, 0.22)",
      accentDeep: "#1a342c",
      panel: "rgba(237, 247, 242, 0.84)",
    },
  },
  {
    slug: ["use-cases", "onsite-scope-change-approval"],
    title: "Onsite Scope Change Approval",
    description:
      "Handle onsite scope changes with a simple approval flow that gives contractors proof before work continues.",
    eyebrow: "Use Case",
    lead:
      "When scope changes while the crew is already on the job, speed matters. The approval flow must be clear enough for the client and fast enough for the field team to keep moving.",
    proof: [
      "Capture the reason for the change while the crew is standing in front of the issue.",
      "Translate the impact into labor, materials, and schedule language the client can understand.",
      "Get a timestamped answer before additional work proceeds.",
    ],
    checkpoints: [
      "Reduces verbal approvals and memory gaps",
      "Protects margin before the work is performed",
      "Feeds directly into final billing documentation",
    ],
    ctaLabel: "Preview approval screen",
    theme: {
      accent: "#9b4b28",
      accentSoft: "rgba(155, 75, 40, 0.22)",
      accentDeep: "#4b1f12",
      panel: "rgba(251, 240, 233, 0.84)",
    },
  },
];

export const siteLinks = [
  { href: "/plumbers/change-order-software", label: "Plumbers" },
  { href: "/av-installers/change-order-software", label: "AV Installers" },
  { href: "/field-service/change-order-template", label: "Template" },
  { href: "/studio", label: "Live Workflow" },
];

export const allStaticRoutes = [
  "/",
  "/studio",
  "/approve/demo",
  "/docs/demo",
  ...seoPages.map((page) => `/${page.slug.join("/")}`),
];

export function getSeoPage(slug: string[]) {
  return seoPages.find((page) => page.slug.join("/") === slug.join("/"));
}
