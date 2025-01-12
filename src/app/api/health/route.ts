import { HealthResp } from "@/alova/globals";
import { alovaServerInstance } from "@/request/alova/server";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await alovaServerInstance.coderhub.AcademicHealth({});
  return NextResponse.json(res);
}
