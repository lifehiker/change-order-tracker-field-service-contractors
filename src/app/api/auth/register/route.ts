import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { addDays } from "date-fns";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const slug = body.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        memberships: {
          create: {
            role: "ADMIN",
            workspace: {
              create: {
                name: body.companyName,
                slug: uniqueSlug,
                subscription: {
                  create: {
                    plan: "TRIAL",
                    status: "TRIALING",
                    trialEndsAt: addDays(new Date(), 14),
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
