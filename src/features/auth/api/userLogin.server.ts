import { createServerFn } from '@tanstack/react-start';
import { setHeader } from '@tanstack/react-start/server';
import { verifyPassword } from '@/lib/hashing';
import { SESSION_DURATION } from '@/lib/utils';
import { userRepo } from '@/repositories/user.repository';
import { sessionRepo } from '@/repositories/session.repository';
import { userLoginSchema } from '../schema/userLoginSchema';

export const userLogin = createServerFn({ method: 'POST' })
  .validator(userLoginSchema)
  .handler(async ({ data }) => {
    const user = await userRepo.getByEmail(data.email);

    if (!user || !(await verifyPassword(user.password, data.password))) {
      throw new Error('Invalid credentials');
    }

    const session = await sessionRepo.create(user.id);

    setHeader(
      'Set-Cookie',
      `session=${session.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION / 1000}`,
    );

    return true;
  });
