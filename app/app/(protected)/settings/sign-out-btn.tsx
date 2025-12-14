"use client";
import { Button } from "@/modules/common/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutBtn() {
  return (
    <Button onClick={() => signOut()}>
      <LogOut className="size-5 shrink-0" />
      Sign Out
    </Button>
  );
}
