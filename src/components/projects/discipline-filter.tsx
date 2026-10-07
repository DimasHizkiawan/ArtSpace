"use client";

import { useRouter } from "next/navigation";
import { DISCIPLINES, type Discipline } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tab =
  "inline-flex min-h-11 shrink-0 items-center border-b-2 px-1 text-sm font-medium";

type Props = {
  active: Discipline | undefined;
};

export function DisciplineFilter({ active }: Props) {
  const router = useRouter();

  const items: Array<{
    value: Discipline | undefined;
    label: string;
  }> = [
    {
      value: undefined,
      label: "Semua",
    },
    ...DISCIPLINES.map((discipline) => ({
      value: discipline.value as Discipline,
      label: discipline.label,
    })),
  ];

  function selectDiscipline(value: Discipline | undefined) {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("disiplin", value);
    } else {
      params.delete("disiplin");
    }

    const query = params.toString();

    router.replace(query ? `/?${query}` : "/", {
      scroll: false,
    });
  }

  return (
    <nav
      aria-label="Filter disiplin"
      className="border-b border-line"
    >
      <ul className="-mb-px flex gap-6 overflow-x-auto">
        {items.map((item) => {
          const current = item.value === active;

          return (
            <li key={item.label}>
              <button
                type="button"
                aria-current={current ? "page" : undefined}
                aria-pressed={current}
                onClick={() => selectDiscipline(item.value)}
                className={cn(
                  tab,
                  current
                    ? "border-iris text-ink"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}