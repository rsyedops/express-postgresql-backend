import { randomBytes } from "crypto";
import slugify from "slugify";

export const makeSlug = (val: string) => {
  // random bytes to ensure slug uniqueness for duplicate titles
  const suffix = randomBytes(6).toString("hex");
  return slugify.default(`${val} ${suffix}`, {
    lower: true,
    strict: true,
  });
};
