import { env } from "#config/env.js";
import { Profile } from "#modules/profile/schema.js";

export const makeAvatarUrl = (image: null | string) => {
  return image ?? `${env.PUBLIC_URL}/images/smiley-cyrus.jpeg`;
};
export const profileWithImage = (profile: Profile): Profile => {
  return { ...profile, image: makeAvatarUrl(profile.image) };
};
