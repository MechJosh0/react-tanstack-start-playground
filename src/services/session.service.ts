import { sessionRepo } from '@/repositories/session.repository';

export const sessionService = {
  async extend(token: string) {
    const session = await sessionRepo.getByToken(token);

    if (!session) return null;

    await sessionRepo.update(session.id);

    return session;
  },
};
