import { ReactNode } from "react";

interface InfoSectionProps {
  children: ReactNode;
  className?: string;
}

export default function InfoSection({ children, className }: InfoSectionProps) {
  return (
    <section className={`xl:p-8 p-5 bg-background rounded-lg ${className || ""}`}>
      <div className="flex justify-around xl:gap-14 gap-10">{children}</div>
    </section>
  );
}
