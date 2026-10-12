// src/components/profile/social-links.tsx
import { ExternalLink } from "lucide-react";
import { linkLabel, type SocialLink } from "@/lib/social";

export function SocialLinks({ links }: { links: readonly SocialLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul aria-label="Tautan sosial" className="flex flex-wrap gap-2">
      {links.map((link, i) => (
        <li key={`${link.url}-${i}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-canvas px-3 text-sm font-medium hover:border-ink"
          >
            {linkLabel(link)}
            <ExternalLink className="size-3.5 text-muted" aria-hidden="true" />
            <span className="sr-only"> (buka di tab baru)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}