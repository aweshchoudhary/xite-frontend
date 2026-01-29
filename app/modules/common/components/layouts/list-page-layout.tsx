import { ReactNode } from "react";
import { CARD_PADDING } from "@/modules/common/lib/spacing-config";

interface ListPageLayoutProps {
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
}

export default function ListPageLayout({
  title,
  children,
  headerActions,
}: ListPageLayoutProps) {
  return (
    <div className="w-full h-full">
      <div className={`bg-card shadow-sm rounded-lg ${CARD_PADDING}`}>
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {headerActions}
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
