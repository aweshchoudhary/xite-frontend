"use client";
import { Button } from "@/modules/common/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/modules/common/authentication/firebase/action";

export default function SignOutBtn() {
  return (
    <Button onClick={() => logoutAction()}>
      <LogOut className="size-5 shrink-0" />
      Sign Out
    </Button>
  );
}
