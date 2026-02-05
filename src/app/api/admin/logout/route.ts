import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Clear the admin token cookie
  cookieStore.delete("admin_token");

  return NextResponse.json({ success: true });
}
