import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-6xl font-serif font-bold text-primary">404</h1>
        <h2 className="text-3xl font-serif font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for has been lost in the nine realms.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to Asgard</Link>
        </Button>
      </div>
    </div>
  );
}
