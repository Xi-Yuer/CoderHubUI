import { HealthResp } from "@/alova/globals";
import { alovaServerInstance } from "@/request/alova/server";
import { ResponseResultType } from "@/request/alova/type";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await alovaServerInstance.Get<
    ResponseResultType<HealthResp>,
    unknown
  >("/coderhub/health");
  return NextResponse.json(res);
}
