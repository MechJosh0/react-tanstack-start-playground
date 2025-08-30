import { getCookie, setHeader } from '@tanstack/react-start/server';
import type { UserValidateEmailInput } from '@/features/auth/schema/userValidateEmailSchema';
import type { UserCreateInput } from '@/features/auth/schema/userCreateSchema';
import type { UserLoginInput } from '@/features/auth/schema/userLoginSchema';
import { verifyPassword } from '@/lib/hashing';
import { SESSION_DURATION } from '@/lib/utils';
import { userRepo } from '@/repositories/user.repository';
import { sessionRepo } from '@/repositories/session.repository';

export const userService = {
  async register(data: UserCreateInput) {
    await this.emailIsUnique(data.email);

    const user = await userRepo.create({
      email: data.email,
      password: data.password,
      select: { password: true },
    });

    if (!user || !(await verifyPassword(user.password, data.password))) {
      throw new Error('Invalid credentials');
    }

    const session = await sessionRepo.create({ userId: user.id, select: { token: true } });

    setHeader('Set-Cookie', `session=${session.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION / 1000}`);

    return true;
  },
  async login(data: UserLoginInput) {
    const user = await userRepo.getByEmail({
      email: data.email,
      select: { password: true },
    });

    if (!user || !(await verifyPassword(user.password, data.password))) {
      throw new Error('Invalid credentials');
    }

    const session = await sessionRepo.create({ userId: user.id, select: { token: true } });

    setHeader('Set-Cookie', `session=${session.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION / 1000}`);

    return true;
  },
  async logout() {
    const sessionToken = getCookie('session');

    if (!sessionToken) return null;

    await sessionRepo.delete(sessionToken);

    setHeader('Set-Cookie', `session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);

    return true;
  },
  async emailIsUnique(email: UserValidateEmailInput) {
    const user = await userRepo.getByEmail({
      email,
    });

    if (user) {
      throw new Error('This email address is already registered');
    }

    return true;
  },
  async profile(userId: number) {
    const user = await userRepo.getById({ id: userId, select: { firstName: true, lastName: true, email: true } });

    return user;
  },
};
