"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full h-14 px-5 border-b flex items-center justify-between">
      <div>
        <Image
          src="/logo.png"
          alt="logo"
          className="w-18"
          width={100}
          height={100}
          priority
          quality={90}
        />
      </div>

      <div>{/* <ThemeToggle /> */}</div>
    </header>
  );
}
