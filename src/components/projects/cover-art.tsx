// src/components/projects/cover-art.tsx
import type { Shape, Tone } from "@/types/project";
import { cn } from "@/lib/utils";

const PALETTE = {
  iris: { base: "bg-iris", a: "bg-berry", b: "bg-cobalt" },
  cobalt: { base: "bg-cobalt", a: "bg-iris", b: "bg-berry" },
  berry: { base: "bg-berry", a: "bg-cobalt", b: "bg-iris" },
} as const;

type Props = { tone: Tone; shape: Shape; className?: string | undefined };

export function CoverArt({ tone, shape, className }: Props) {
  const c = PALETTE[tone];
  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-[4/3] overflow-hidden", c.base, className)}
    >
      {shape === "circles" && (
        <>
          <span className={cn("absolute left-[12%] top-[26%] aspect-square w-[36%] rounded-full", c.a)} />
          <span className={cn("absolute left-[38%] top-[34%] aspect-square w-[36%] rounded-full", c.b)} />
        </>
      )}
      {shape === "bars" && (
        <div className="absolute inset-x-[14%] bottom-0 top-[22%] flex items-end gap-[4%]">
          <span className={cn("h-[50%] flex-1", c.a)} />
          <span className={cn("h-[85%] flex-1", c.b)} />
          <span className={cn("h-[65%] flex-1", c.a)} />
          <span className={cn("h-full flex-1", c.b)} />
        </div>
      )}
      {shape === "arc" && (
        <>
          <span className={cn("absolute bottom-0 left-0 aspect-square w-[55%] rounded-tr-full", c.a)} />
          <span className={cn("absolute right-[10%] top-[14%] aspect-square w-[22%]", c.b)} />
        </>
      )}
    </div>
  );
}