// src/components/feedback/success-banner.tsx
import { CheckCircle2 } from "lucide-react";

type Props = { title: string; children?: React.ReactNode };

export function SuccessBanner({ title, children }: Props) {
  return (
    <div role="status" className="flex gap-3 rounded-2xl border border-cobalt bg-canvas p-4">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cobalt" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-semibold">{title}</p>
        {children ? <div className="text-sm text-muted">{children}</div> : null}
      </div>
    </div>
  );
}