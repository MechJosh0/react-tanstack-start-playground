import argon2 from 'argon2';

const ARGON2_OPTS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

export const hashPassword = async function (password: string): Promise<string> {
  return argon2.hash(password + process.env.PASSWORD_PEPPER, ARGON2_OPTS);
};

export const verifyPassword = async function (hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password + process.env.PASSWORD_PEPPER);
};
