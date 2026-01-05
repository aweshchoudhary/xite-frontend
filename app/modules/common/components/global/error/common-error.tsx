import Link from "next/link";
import { Button, buttonVariants } from "../../ui/button";

export default function CommonError({ reset }: { reset: () => void }) {
  return (
    <div className="spacing min-h-screen flex flex-col items-center justify-center gap-5">
      <div>
        <h1 className="h1 text-center text-destructive">
          Something went wrong!
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Something went wrong from our side. Please try again later.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
