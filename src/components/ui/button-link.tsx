// src/components/ui/button-link.tsx
import Link from "next/link";
import { buttonStyles } from "./button";

type Props = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "outline" | undefined;
};

export function ButtonLink({ variant = "primary", className, ...props }: Props) {
  return <Link className={buttonStyles(variant, className)} {...props} />;
}