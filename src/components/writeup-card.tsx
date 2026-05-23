import Link from "next/link";
import { categoryColor, difficultyColor, formatDate } from "@/lib/utils";

interface WriteupCardProps {
  id: string;
  title: string;
  challenge: string;
  ctf: string;
  category: string;
  difficulty: string;
  submittedBy: string | null;
  createdAt: string;
}

export function WriteupCard(props: WriteupCardProps) {
  return (
    <Link href={`/writeups/${props.id}`} className="block">
      <div className="border border-border bg-card p-4 hover:border-primary/50 transition-none group">
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className={categoryColor(props.category)}>
            [{props.category}]
          </span>
          <span className={difficultyColor(props.difficulty)}>
            [{props.difficulty}]
          </span>
        </div>
        <h3 className="mb-1 text-sm font-normal leading-snug group-hover:text-primary transition-none">
          {props.title}
        </h3>
        <p className="mb-2 text-xs text-muted-foreground">
          {props.ctf} / {props.challenge}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(props.createdAt)}</span>
          {props.submittedBy && <span>by {props.submittedBy}</span>}
        </div>
      </div>
    </Link>
  );
}
