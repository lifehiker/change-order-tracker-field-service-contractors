"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Link2,
  Plus,
  Printer,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateGrandTotal,
  calculateLaborTotal,
  calculateMarkupTotal,
  calculateMaterialTotal,
  calculateSubtotal,
  defaultDraft,
  DEMO_STORAGE_KEY,
  formatCurrency,
  formatTimestamp,
  type Attachment,
  type ChangeOrderDraft,
  type MaterialLine,
} from "@/lib/demo-store";

async function filesToAttachments(fileList: FileList): Promise<Attachment[]> {
  const files = Array.from(fileList);

  return Promise.all(
    files.map(
      (file) =>
        new Promise<Attachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: crypto.randomUUID(),
              name: file.name,
              url: String(reader.result),
            });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

function statusTone(state: ChangeOrderDraft["approval"]["state"]) {
  switch (state) {
    case "approved":
      return "bg-emerald-100 text-emerald-900";
    case "needs_changes":
      return "bg-amber-100 text-amber-900";
    case "declined":
      return "bg-rose-100 text-rose-900";
    default:
      return "bg-stone-200 text-stone-900";
  }
}

export function ChangeOrderStudio() {
  const [draft, setDraft] = useState<ChangeOrderDraft>(defaultDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);

    if (raw) {
      try {
        setDraft(JSON.parse(raw) as ChangeOrderDraft);
      } catch {
        window.localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(draft));
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [draft, hydrated]);

  const totals = useMemo(
    () => ({
      labor: calculateLaborTotal(draft),
      materials: calculateMaterialTotal(draft.materials),
      subtotal: calculateSubtotal(draft),
      markup: calculateMarkupTotal(draft),
      grand: calculateGrandTotal(draft),
    }),
    [draft],
  );

  function patchDraft<K extends keyof ChangeOrderDraft>(key: K, value: ChangeOrderDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateMaterial(
    id: string,
    field: keyof Omit<MaterialLine, "id">,
    value: string | number,
  ) {
    setDraft((current) => ({
      ...current,
      materials: current.materials.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;

    try {
      const attachments = await filesToAttachments(event.target.files);
      setDraft((current) => ({
        ...current,
        photos: [...current.photos, ...attachments],
      }));
      toast.success("Photos attached to the change request.");
    } catch {
      toast.error("The photo upload failed. Try a smaller image.");
    } finally {
      event.target.value = "";
    }
  }

  function resetDemo() {
    setDraft(defaultDraft);
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaultDraft));
    toast.success("Demo reset to the seeded sample request.");
  }

  function sendApproval() {
    const approvalSentAt = new Date().toISOString();
    setDraft((current) => ({
      ...current,
      approvalSentAt,
    }));
    toast.success("Approval link prepared for the client preview.");
  }

  function removePhoto(photoId: string) {
    setDraft((current) => ({
      ...current,
      photos: current.photos.filter((photo) => photo.id !== photoId),
    }));
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[color:var(--brand-deep)]">
              Live workflow
            </Badge>
            <Badge className={`rounded-full px-3 py-1 ${statusTone(draft.approval.state)}`}>
              Approval: {draft.approval.state.replace("_", " ")}
            </Badge>
            <span className="label-chip text-[color:var(--ink-soft)]">
              Autosave {hydrated ? "active" : "starting"}
            </span>
          </div>
          <h1 className="headline mt-5 text-6xl text-foreground sm:text-7xl">
            Build the change event while the crew is still onsite.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)]">
            This is the product wedge from the PRD turned into a working frontend: capture
            the scope change, price the delta, send an approval link, and generate the
            office packet.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Labor", formatCurrency(totals.labor)],
              ["Materials", formatCurrency(totals.materials)],
              ["Change total", formatCurrency(totals.grand)],
            ].map(([label, value]) => (
              <Card
                key={label}
                className="rounded-[1.45rem] border-[color:var(--line)] bg-white/60"
              >
                <CardContent className="space-y-2 p-4">
                  <p className="label-chip text-[color:var(--ink-soft)]">{label}</p>
                  <p className="headline text-4xl text-[color:var(--brand)]">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="blueprint-panel rounded-[2rem] p-6 text-[#f4eee4] sm:p-8">
          <div className="space-y-4">
            <p className="label-chip text-[#88c8ca]">Next actions</p>
            <div className="grid gap-3">
              <Button
                onClick={sendApproval}
                className="h-12 justify-start rounded-full bg-[#88c8ca] px-5 text-sm font-semibold text-[#12383d] hover:bg-[#9cd5d7]"
              >
                <Link2 className="mr-2 h-4 w-4" />
                Prepare client approval link
              </Button>
              <Button
                asChild
                className="h-12 justify-start rounded-full border border-white/12 bg-white/6 px-5 text-sm font-semibold text-[#f4eee4] hover:bg-white/10"
              >
                <Link href="/approve/demo">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Open approval screen
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 justify-start rounded-full border border-white/12 bg-white/6 px-5 text-sm font-semibold text-[#f4eee4] hover:bg-white/10"
              >
                <Link href="/docs/demo">
                  <Printer className="mr-2 h-4 w-4" />
                  Open invoice-ready document
                </Link>
              </Button>
              <Button
                onClick={resetDemo}
                className="h-12 justify-start rounded-full border border-white/12 bg-transparent px-5 text-sm font-semibold text-white/82 hover:bg-white/8"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset seeded sample
              </Button>
            </div>
            <div className="rounded-[1.45rem] border border-white/12 bg-white/6 p-4">
              <p className="label-chip text-white/55">Approval link status</p>
              <p className="mt-3 text-base leading-7 text-white/75">
                {draft.approvalSentAt
                  ? `Prepared ${formatTimestamp(draft.approvalSentAt)}`
                  : "Not sent yet. Generate the approval view once pricing is clean."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5">
          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="trade">Trade</Label>
                  <select
                    id="trade"
                    value={draft.trade}
                    onChange={(event) =>
                      patchDraft(
                        "trade",
                        event.target.value as ChangeOrderDraft["trade"],
                      )
                    }
                    className="mt-2 flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-white/70 px-3 text-sm"
                  >
                    <option>Plumbing</option>
                    <option>Commercial AV</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="jobName">Job name</Label>
                  <Input
                    id="jobName"
                    className="mt-2 bg-white/70"
                    value={draft.jobName}
                    onChange={(event) => patchDraft("jobName", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Client name</Label>
                  <Input
                    id="clientName"
                    className="mt-2 bg-white/70"
                    value={draft.clientName}
                    onChange={(event) => patchDraft("clientName", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientContact">Client contact</Label>
                  <Input
                    id="clientContact"
                    className="mt-2 bg-white/70"
                    value={draft.clientContact}
                    onChange={(event) => patchDraft("clientContact", event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteLocation">Site location</Label>
                  <Input
                    id="siteLocation"
                    className="mt-2 bg-white/70"
                    value={draft.siteLocation}
                    onChange={(event) => patchDraft("siteLocation", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="changeTitle">Change title</Label>
                  <Input
                    id="changeTitle"
                    className="mt-2 bg-white/70"
                    value={draft.changeTitle}
                    onChange={(event) => patchDraft("changeTitle", event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <select
                    id="urgency"
                    value={draft.urgency}
                    onChange={(event) =>
                      patchDraft(
                        "urgency",
                        event.target.value as ChangeOrderDraft["urgency"],
                      )
                    }
                    className="mt-2 flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-white/70 px-3 text-sm"
                  >
                    <option>Same day</option>
                    <option>Before closeout</option>
                    <option>Scheduled follow-up</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="officeNote">Office note</Label>
                  <Textarea
                    id="officeNote"
                    className="mt-2 min-h-[120px] bg-white/70"
                    value={draft.officeNote}
                    onChange={(event) => patchDraft("officeNote", event.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div>
                <Label htmlFor="scopeSummary">Scope summary</Label>
                <Textarea
                  id="scopeSummary"
                  className="mt-2 min-h-[160px] bg-white/70"
                  value={draft.scopeSummary}
                  onChange={(event) => patchDraft("scopeSummary", event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="laborHours">Labor hours</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    min={0}
                    step="0.5"
                    className="mt-2 bg-white/70"
                    value={draft.laborHours}
                    onChange={(event) =>
                      patchDraft("laborHours", Number(event.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="laborRate">Hourly rate</Label>
                  <Input
                    id="laborRate"
                    type="number"
                    min={0}
                    className="mt-2 bg-white/70"
                    value={draft.laborRate}
                    onChange={(event) =>
                      patchDraft("laborRate", Number(event.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="markupRate">Markup %</Label>
                  <Input
                    id="markupRate"
                    type="number"
                    min={0}
                    className="mt-2 bg-white/70"
                    value={draft.markupRate}
                    onChange={(event) =>
                      patchDraft("markupRate", Number(event.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    Material impact
                  </p>
                  <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
                    Keep material lines visible so the client sees what changed.
                  </p>
                </div>
                <Button
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      materials: [
                        ...current.materials,
                        {
                          id: crypto.randomUUID(),
                          label: "New material line",
                          quantity: 1,
                          unitCost: 0,
                        },
                      ],
                    }))
                  }
                  className="rounded-full border border-[color:var(--line)] bg-white/65 text-sm text-foreground hover:bg-white"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add line
                </Button>
              </div>
              <div className="grid gap-3">
                {draft.materials.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-[1.35rem] border border-[color:var(--line)] bg-white/55 p-4 md:grid-cols-[1.7fr_0.5fr_0.6fr_auto]"
                  >
                    <Input
                      className="bg-white/80"
                      value={item.label}
                      onChange={(event) =>
                        updateMaterial(item.id, "label", event.target.value)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      className="bg-white/80"
                      value={item.quantity}
                      onChange={(event) =>
                        updateMaterial(item.id, "quantity", Number(event.target.value) || 0)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      className="bg-white/80"
                      value={item.unitCost}
                      onChange={(event) =>
                        updateMaterial(item.id, "unitCost", Number(event.target.value) || 0)
                      }
                    />
                    <Button
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          materials: current.materials.filter(
                            (material) => material.id !== item.id,
                          ),
                        }))
                      }
                      className="rounded-full border border-[color:var(--line)] bg-white/70 text-foreground hover:bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    Photos and field evidence
                  </p>
                  <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
                    Attach conditions, access issues, and added-scope proof directly to the
                    request.
                  </p>
                </div>
                <Label
                  htmlFor="photos"
                  className="inline-flex cursor-pointer items-center rounded-full border border-[color:var(--line)] bg-white/65 px-4 py-2 text-sm font-medium text-foreground"
                >
                  <ImagePlus className="mr-1.5 h-4 w-4" />
                  Add photos
                </Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {draft.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-[1.35rem] border border-[color:var(--line)] bg-white/70"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.name}
                      width={960}
                      height={528}
                      unoptimized
                      className="h-44 w-full object-cover"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                    <div className="flex items-center justify-between gap-3 p-4">
                      <p className="truncate text-sm text-[color:var(--ink-soft)]">
                        {photo.name}
                      </p>
                      <Button
                        onClick={() => removePhoto(photo.id)}
                        className="rounded-full border border-[color:var(--line)] bg-white/70 text-foreground hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div>
                <p className="label-chip text-[color:var(--brand)]">Live approval packet</p>
                <h2 className="headline mt-4 text-5xl text-foreground">Client-facing summary</h2>
              </div>
              <div className="rounded-[1.45rem] border border-[color:var(--line)] bg-white/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                      {draft.trade}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      {draft.changeTitle}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
                      {draft.jobName} • {draft.siteLocation}
                    </p>
                  </div>
                  <Badge className={`rounded-full px-3 py-1 ${statusTone(draft.approval.state)}`}>
                    {draft.approval.state.replace("_", " ")}
                  </Badge>
                </div>
                <Separator className="my-5 bg-[color:var(--line)]" />
                <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
                  {draft.scopeSummary}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
                    <p className="label-chip text-[color:var(--brand-deep)]">Labor</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {draft.laborHours} hrs at {formatCurrency(draft.laborRate)}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
                    <p className="label-chip text-[color:var(--brand-deep)]">Total request</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {formatCurrency(totals.grand)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  ["Prepared", draft.approvalSentAt ? formatTimestamp(draft.approvalSentAt) : "Not sent"],
                  ["Urgency", draft.urgency],
                  ["Client contact", draft.clientContact],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[1.2rem] border border-[color:var(--line)] bg-white/55 px-4 py-3"
                  >
                    <p className="label-chip text-[color:var(--ink-soft)]">{label}</p>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <p className="label-chip text-[color:var(--brand)]">Pricing breakdown</p>
              {[
                ["Labor", totals.labor],
                ["Materials", totals.materials],
                ["Subtotal", totals.subtotal],
                [`Markup (${draft.markupRate}%)`, totals.markup],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--ink-soft)]">{label}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(Number(value))}
                  </span>
                </div>
              ))}
              <Separator className="bg-[color:var(--line)]" />
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold tracking-tight text-foreground">
                  Approved amount
                </span>
                <span className="headline text-4xl text-[color:var(--brand)]">
                  {formatCurrency(totals.grand)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="h-5 w-5 text-[color:var(--brand)]" />
                <p className="text-base font-semibold tracking-tight text-foreground">
                  Office handoff note
                </p>
              </div>
              <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{draft.officeNote}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
