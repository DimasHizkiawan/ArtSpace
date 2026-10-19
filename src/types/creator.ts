import type { SocialLink } from "@/lib/social";

export type Creator = {
  username: string;
  name: string;
  bio: string;
  links?: SocialLink[] | undefined;
};
