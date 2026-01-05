export default function UnauthorizedPageError({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="spacing">
      <div className="flex items-center justify-center">
        <h1 className="h1 text-destructive">
          {message ?? "You are not authorized to access this page"}
        </h1>
      </div>
    </div>
  );
}
