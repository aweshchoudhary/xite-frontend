import { ReactNode } from "react";

interface DetailPageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

export default function DetailPageHeader({
  title,
  subtitle,
  actions,
}: DetailPageHeaderProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="h1">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground font-normal">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </section>
  );
}
