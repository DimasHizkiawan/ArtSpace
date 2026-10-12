// src/components/ui/user-avatar.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = { sm: "size-8 text-sm", md: "size-12 text-lg", lg: "size-24 text-3xl" } as const;
const PIXELS = { sm: 32, md: 48, lg: 96 } as const;

type Props = {
  name: string;
  src?: string | null | undefined;
  size?: keyof typeof SIZES;
  className?: string | undefined;
};

/** Foto profil, atau huruf pertama nama jika belum ada foto. Nama sudah tampil di dekatnya, jadi dekoratif. */
export function UserAvatar({ name, src, size = "md", className }: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={PIXELS[size]}
        height={PIXELS[size]}
        unoptimized
        className={cn("shrink-0 rounded-full object-cover", SIZES[size], className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-ink font-bold text-canvas",
        SIZES[size],
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}