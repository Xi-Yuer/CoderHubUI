import { alovaServerInstance } from "@/request/alova/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await alovaServerInstance.user_auth.ChangePassword({
    data: body,
  });
  return NextResponse.json(result);
}
