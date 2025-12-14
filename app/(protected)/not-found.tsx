import { buttonVariants } from "@/modules/common/components/ui/button";
import { cn } from "@/modules/common/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="h1">404 Page Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
