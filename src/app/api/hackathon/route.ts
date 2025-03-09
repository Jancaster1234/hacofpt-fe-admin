// src/app/api/hackathon/route.ts
import { NextResponse } from "next/server";
import { hackathonsMock } from "@/mocks/hackathons.mock";

export async function GET() {
  return NextResponse.json(hackathonsMock);
}
