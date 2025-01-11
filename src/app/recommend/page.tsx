import React from "react";
import {AppLogin} from "../components";
import {ServerHealth} from "@/request/apis/server";

export default function Page() {
    ServerHealth()
    return (
        <div>
            <AppLogin/>
        </div>
    );
}
