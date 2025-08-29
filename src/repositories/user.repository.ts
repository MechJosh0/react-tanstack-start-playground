import { hashPassword } from '@/lib/hashing';
import db from '@/lib/server/prisma';

export const userRepo = {
  async create(email: string, password: string) {
    return db.user.create({
      data: {
        email: email,
        password: await hashPassword(password),
      },
      select: { id: true },
    });
  },
  async getByEmail(email: string) {
    return db.user.findUnique({
      //   select: { id: true },
      // TODO - Can select be here and outside?
      select: { id: true, password: true },
      where: { email },
    });
  },
};
