import { alovaServerInstance } from "@/request/alova/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await alovaServerInstance.user_public.Login({
    data: body,
  });
  return NextResponse.json(result, {
    headers: {
      "Set-Cookie": `token=${result.data}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax; Secure`,
    },
  });
}
