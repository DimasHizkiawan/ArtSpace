// src/components/feedback/empty-state.tsx
import { ButtonLink } from "@/components/ui/button-link";

type Props = { title: string; description: string; actionHref: string; actionLabel: string };

export function EmptyState({ title, description, actionHref, actionLabel }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-line bg-surface px-6 py-16 text-center">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="max-w-sm text-muted">{description}</p>
      <ButtonLink href={actionHref} variant="outline" className="mt-2">
        {actionLabel}
      </ButtonLink>
    </div>
  );
}