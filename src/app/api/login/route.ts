import {alovaServerInstance} from "@/request/alova/server";
import {NextResponse} from "next/server";
import {ResponseResultType} from "@/request/alova/type";
import {LoginResp} from "@/alova/globals";

export async function POST(request: Request) {
    const body = await request.json();
    const {username, password} = body;
    const result = await alovaServerInstance.Post<ResponseResultType<LoginResp>, unknown>(
        "/user/login",
        {username, password,}
    );
    return NextResponse.json(result, {
        headers: {
            "Set-Cookie": `token=${result.data}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax; Secure`,
        },
    });
}
