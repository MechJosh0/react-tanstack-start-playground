import db from '@/lib/server/prisma';
import { SESSION_DURATION } from '@/lib/utils';

export const sessionRepo = {
  async create(userId: number) {
    return db.session.create({
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
  async getByToken(token: string) {
    return db.session.findUnique({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  },
};
