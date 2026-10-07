import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  cardBase,
  cardBody,
  cardFooter,
  cardLink,
  cardTitle,
} from "@/components/ui/card-styles";
import type { Creator } from "@/types/creator";

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <article className={cardBase}>
      <div className={cardBody}>
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-lg font-bold text-canvas"
          >
            {creator.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className={cardTitle}>
              <Link href={`/creators/${creator.username}`} className={cardLink}>
                {creator.name}
              </Link>
            </h3>
            <p className="text-sm text-muted">@{creator.username}</p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm">{creator.bio}</p>

        <div className={cardFooter}>
          <span className="text-muted">Lihat profil</span>
          <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}