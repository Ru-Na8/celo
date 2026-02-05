import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Helper to check auth
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token && auth.verifyToken(token);
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = db.reviews.getAll();
  const stats = db.reviews.getStats();

  return NextResponse.json({ reviews, stats });
}

export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isVisible } = body;

    if (!id || typeof isVisible !== "boolean") {
      return NextResponse.json({ error: "ID and isVisible required" }, { status: 400 });
    }

    const updated = db.reviews.update(id, { isVisible });

    if (!updated) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
