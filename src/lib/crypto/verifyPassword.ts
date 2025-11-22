import argon2 from "argon2";

export const verifyPassword = async (hash: string, password: string) => {
  return await argon2.verify(hash, password);
};
