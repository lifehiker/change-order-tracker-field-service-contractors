import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);

  return lines.length ? lines : [""];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const changeOrder = await prisma.changeOrder.findFirst({
    where: { id, workspaceId: wsData.workspace.id },
    include: {
      job: true,
      workspace: true,
      attachments: true,
      approvalRequests: { orderBy: { createdAt: "desc" }, take: 1 },
      events: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!changeOrder) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const width = page.getWidth();
  let y = 748;

  page.drawRectangle({
    x: 36,
    y: 700,
    width: width - 72,
    height: 56,
    color: rgb(0.11, 0.2, 0.2),
  });
  page.drawText(changeOrder.workspace.name, {
    x: 52,
    y: 730,
    size: 12,
    font: regular,
    color: rgb(0.89, 0.95, 0.95),
  });
  page.drawText("CHANGE ORDER RECORD", {
    x: 52,
    y: 710,
    size: 20,
    font: bold,
    color: rgb(1, 1, 1),
  });

  y = 668;
  page.drawText(changeOrder.title, {
    x: 36,
    y,
    size: 24,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 28;
  page.drawText(`${changeOrder.job.customerName} • ${changeOrder.job.siteAddress}`, {
    x: 36,
    y,
    size: 11,
    font: regular,
    color: rgb(0.35, 0.35, 0.35),
  });

  y -= 34;
  const stats = [
    ["Status", changeOrder.status],
    ["Urgency", changeOrder.urgency.replace("_", " ")],
    ["Total", formatMoney(changeOrder.totalCents, changeOrder.workspace.currency)],
  ];

  stats.forEach(([label, value], index) => {
    const boxX = 36 + index * 180;
    page.drawRectangle({
      x: boxX,
      y: y - 42,
      width: 164,
      height: 50,
      color: rgb(0.96, 0.93, 0.88),
      borderColor: rgb(0.82, 0.74, 0.65),
      borderWidth: 1,
    });
    page.drawText(label, {
      x: boxX + 12,
      y: y - 10,
      size: 9,
      font: regular,
      color: rgb(0.43, 0.34, 0.28),
    });
    page.drawText(value, {
      x: boxX + 12,
      y: y - 28,
      size: 13,
      font: bold,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  y -= 72;
  page.drawText("Scope Description", {
    x: 36,
    y,
    size: 12,
    font: bold,
    color: rgb(0.79, 0.42, 0.2),
  });

  y -= 18;
  for (const line of wrapText(changeOrder.description || "No field description was saved for this change order.", 90)) {
    page.drawText(line, {
      x: 36,
      y,
      size: 11,
      font: regular,
      color: rgb(0.24, 0.24, 0.24),
    });
    y -= 15;
  }

  y -= 14;
  page.drawText("Cost Breakdown", {
    x: 36,
    y,
    size: 12,
    font: bold,
    color: rgb(0.79, 0.42, 0.2),
  });

  const rows = [
    ["Labor", formatMoney(changeOrder.laborImpactCents, changeOrder.workspace.currency)],
    ["Materials", formatMoney(changeOrder.materialImpactCents, changeOrder.workspace.currency)],
    ["Other", formatMoney(changeOrder.otherImpactCents, changeOrder.workspace.currency)],
    ["Total", formatMoney(changeOrder.totalCents, changeOrder.workspace.currency)],
  ];

  y -= 22;
  rows.forEach(([label, value]) => {
    page.drawText(label, {
      x: 36,
      y,
      size: 11,
      font: regular,
      color: rgb(0.28, 0.28, 0.28),
    });
    page.drawText(value, {
      x: 420,
      y,
      size: 11,
      font: bold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 16;
  });

  const latestApproval = changeOrder.approvalRequests[0];
  y -= 8;
  page.drawText("Approval Status", {
    x: 36,
    y,
    size: 12,
    font: bold,
    color: rgb(0.79, 0.42, 0.2),
  });

  y -= 18;
  const approvalLines = [
    `Recipient: ${latestApproval?.recipientName || latestApproval?.recipientEmail || "Not sent"}`,
    `Signer: ${latestApproval?.signerName || "Pending"}`,
    `Viewed: ${latestApproval?.viewedAt ? new Date(latestApproval.viewedAt).toLocaleString() : "Not yet"}`,
  ];

  for (const line of approvalLines) {
    page.drawText(line, {
      x: 36,
      y,
      size: 11,
      font: regular,
      color: rgb(0.24, 0.24, 0.24),
    });
    y -= 15;
  }

  if (changeOrder.events.length > 0) {
    y -= 8;
    page.drawText("Activity", {
      x: 36,
      y,
      size: 12,
      font: bold,
      color: rgb(0.79, 0.42, 0.2),
    });
    y -= 18;

    for (const event of changeOrder.events.slice(0, 8)) {
      if (y < 60) break;
      page.drawText(
        `${new Date(event.createdAt).toLocaleString()} — ${event.type.replace(/_/g, " ")}`,
        {
          x: 36,
          y,
          size: 10,
          font: regular,
          color: rgb(0.3, 0.3, 0.3),
        },
      );
      y -= 13;
    }
  }

  page.drawText(
    `${changeOrder.attachments.length} attachment${changeOrder.attachments.length === 1 ? "" : "s"} on file`,
    {
      x: 36,
      y: 28,
      size: 9,
      font: regular,
      color: rgb(0.45, 0.45, 0.45),
    },
  );

  const bytes = await pdf.save();
  const filename = `${slugify(changeOrder.title || "change-order") || "change-order"}.pdf`;

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
