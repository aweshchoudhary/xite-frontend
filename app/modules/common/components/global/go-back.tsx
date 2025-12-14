"use client";
import { useRouter } from "next/navigation";

export default function GoBack({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div onClick={() => router.back()} className="flex items-center gap-2">
      {children}
    </div>
  );
}
