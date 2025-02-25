import { redirect } from "next/navigation";
import React from "react";

export default function Page() {
  return redirect("/creator/dashboard");
}
