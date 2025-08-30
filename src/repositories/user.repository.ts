import type { Prisma } from '@prisma/client';
import { hashPassword } from '@/lib/hashing';
import db from '@/lib/server/prisma';

export const userRepo = {
  async create({ email, password, select }: { email: string; password: string; select?: Prisma.UserSelect }) {
    return db.user.create({
      select: { id: true, ...select },
      data: {
        email: email,
        password: await hashPassword(password),
      },
    });
  },
  async getById({ id, select }: { id: number; select?: Prisma.UserSelect }) {
    return db.user.findUnique({
      select: { id: true, ...select },
      where: { id },
    });
  },
  getByEmail({ email, select }: { email: string; select?: Prisma.UserSelect }) {
    return db.user.findUnique({
      select: { id: true, ...select },
      where: { email },
    });
  },
};
