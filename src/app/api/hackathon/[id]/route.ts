// src/app/api/hackathon/[id]/route.ts

import { NextResponse } from "next/server";
import { getMockHackathonById } from "@/mocks/hackathons.mock";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  // Await the params object
  const id = (await params).id;
  const hackathon = getMockHackathonById(id);
  if (!hackathon)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });

  return NextResponse.json(hackathon);
}
