"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  changeOrderId: string;
  jobSiteAddress: string;
  defaultTitle: string;
  currentStatus: string;
  defaultEmail: string;
  defaultName: string;
};

export function SendApprovalForm({
  changeOrderId,
  jobSiteAddress,
  defaultTitle,
  currentStatus,
  defaultEmail,
  defaultName,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [form, setForm] = useState({
    recipientName: defaultName,
    recipientEmail: defaultEmail,
    message: "",
  });

  function patch(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/change-orders/${changeOrderId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string; approvalUrl?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Failed to send approval request.");
        return;
      }
      if (data.approvalUrl) {
        setApprovalUrl(data.approvalUrl);
        toast.success("Approval link ready — copy it to share with the client.");
      } else {
        toast.success("Approval request sent.");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
      <CardContent className="p-6 space-y-4">
        <p className="label-chip text-[color:var(--brand)]">
          {currentStatus === "DRAFT" ? "Send for approval" : "Resend reminder"}
        </p>
        <p className="text-sm leading-6 text-[color:var(--ink-soft)]">
          Send <span className="font-medium text-foreground">{defaultTitle}</span> for signoff at{" "}
          {jobSiteAddress}.
        </p>
        <form onSubmit={handleSend} className="space-y-3">
          <div>
            <Label htmlFor="recipientName">Recipient name</Label>
            <Input
              id="recipientName"
              value={form.recipientName}
              onChange={(e) => patch("recipientName", e.target.value)}
              className="mt-1.5 bg-white/70"
              placeholder="Client name"
            />
          </div>
          <div>
            <Label htmlFor="recipientEmail">Recipient email</Label>
            <Input
              id="recipientEmail"
              type="email"
              required
              value={form.recipientEmail}
              onChange={(e) => patch("recipientEmail", e.target.value)}
              className="mt-1.5 bg-white/70"
              placeholder="client@example.com"
            />
          </div>
          <div>
            <Label htmlFor="message">Optional note</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => patch("message", e.target.value)}
              className="mt-1.5 min-h-[80px] bg-white/70"
              placeholder="Please review and approve the additional scope…"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
          >
            {currentStatus === "DRAFT" ? (
              <Send className="mr-1.5 h-4 w-4" />
            ) : (
              <RefreshCcw className="mr-1.5 h-4 w-4" />
            )}
            {loading ? "Sending…" : currentStatus === "DRAFT" ? "Send approval request" : "Resend reminder"}
          </Button>
        </form>
        {approvalUrl ? (
          <div className="rounded-[1.2rem] border border-[color:var(--line)] bg-white/65 p-3">
            <p className="label-chip text-[color:var(--ink-soft)]">Share link</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Input readOnly value={approvalUrl} className="bg-white" />
              <Button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(approvalUrl);
                  toast.success("Approval link copied.");
                }}
                className="rounded-full border border-[color:var(--line)] bg-white text-foreground hover:bg-white/90"
              >
                Copy link
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
