import {alovaServerInstance} from "@/request/alova/server";

export async function ServerHealth(){
    return alovaServerInstance.Get("/coderhub/health");
}