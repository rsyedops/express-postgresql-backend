import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};
