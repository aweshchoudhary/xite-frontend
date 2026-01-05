import { ReactNode } from "react";

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
    <article className="p-8 h-full flex flex-col w-full">
      <div className="2xl:p-10 shadow xl:p-8 lg:p-6 p-5 bg-background flex-1 rounded-xl overflow-hidden">
        <section>
          <div className="flex items-center justify-between">
            <h1 className="h1 flex items-center gap-2">{title}</h1>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </section>
        <section>
          <div>{children}</div>
        </section>
      </div>
    </article>
  );
}
