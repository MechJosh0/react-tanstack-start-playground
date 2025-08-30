import type { Prisma } from '@prisma/client';
import db from '@/lib/server/prisma';
import { SESSION_DURATION } from '@/lib/utils';

export const sessionRepo = {
  async create({ userId, select }: { userId: number; select?: Prisma.SessionSelect }) {
    return db.session.create({
      select: { id: true, ...select },
      data: {
        userId,
        expiresAt: new Date(Date.now() + SESSION_DURATION),
        token: crypto.randomUUID(),
      },
    });
  },
  async update(id: string) {
    return db.session.update({
      where: { id },
      data: { expiresAt: new Date(Date.now() + SESSION_DURATION) },
    });
  },
  async delete(token: string) {
    return db.session.delete({ where: { token } });
  },
  async getByToken({ token, select }: { token: string; select?: Prisma.SessionSelect }) {
    return db.session.findUnique({
      select: { id: true, ...select },
      where: { token, expiresAt: { gt: new Date() } },
    });
  },
};
