import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 text-xs text-muted-foreground">
        <span className="text-primary">$</span> ls writeups/ | grep -i "not-found"
      </p>
      <p className="mb-1 text-lg text-muted-foreground">
        ls: <span className="text-primary">writeups/not-found</span>: No such file
      </p>
      <Link href="/" className="mt-6 text-xs text-muted-foreground hover:text-primary transition-none">
        [cd ~/]
      </Link>
    </div>
  );
}
