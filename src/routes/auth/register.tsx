import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { emailSchema, passwordSchema } from '@/validation/account.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/tanstack/form/input';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { hashPassword, verifyPassword } from '@/lib/hashing';
import prisma from '@/lib/prisma';
import { setHeader, getCookie } from '@tanstack/react-start/server';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

interface RegisterForm {
  email: string;
  password: string;
}

const defaultUser: RegisterForm = {
  email: 'my@email.com',
  password: 'Password1!',
};

const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const postCreateUser = createServerFn({ method: 'POST' })
  .validator(createUserSchema)
  .handler(async ({ data }) => {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
      },
      select: { id: true },
    });

    return user;
  });

const getValidateEmailIsUnique = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      email: emailSchema,
    }),
  )
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      select: { id: true },
      where: { email: data.email },
    });

    return !user;
  });

const postUserLogin = createServerFn({ method: 'POST' })
  .validator(loginUserSchema)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      select: { id: true, password: true },
      where: { email: data.email },
    });

    if (!user || !(await verifyPassword(user.password, data.password))) {
      throw new Error('Invalid credentials');
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_DURATION),
        token: crypto.randomUUID(),
      },
    });

    setHeader(
      'Set-Cookie',
      `session=${session.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION / 1000}`,
    );

    return true;
  });

const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const sessionToken = getCookie('session');

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    // select: { user: { id: true}  },
    where: { token: sessionToken, expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  if (!session) return null;

  // TODO Move into middleware
  // Auto-extend session if close to expiry
  await prisma.session.update({
    where: { id: session.id },
    data: { expiresAt: new Date(Date.now() + SESSION_DURATION) },
  });

  return { id: session.user.id, email: session.user.email };
});

const postUserLogout = createServerFn({ method: 'POST' }).handler(async () => {
  const sessionToken = getCookie('session');

  if (!sessionToken) return null;

  await prisma.session.delete({ where: { token: sessionToken } });

  setHeader(
    'Set-Cookie',
    `session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
  );

  return true;
});

function RouteComponent() {
  const callPostCreateUser = useServerFn(postCreateUser);
  const callGetValidateEmailIsUnique = useServerFn(getValidateEmailIsUnique);
  const callPostUserLogin = useServerFn(postUserLogin);
  const callGetUser = useServerFn(getUser);
  const callPostUserLogout = useServerFn(postUserLogout);

  const validateEmailIsUnique = async (email: string) => {
    const isUnique = await callGetValidateEmailIsUnique({ data: { email } });

    return !isUnique ? 'This email address is already registered' : null;
  };

  const { mutate: createUser } = useMutation({
    mutationFn: async (data: RegisterForm) => {
      await callPostCreateUser({ data });
      console.log('User created');

      await callPostUserLogin({ data });
      console.log('Logged user in');

      const user = await callGetUser();
      console.log('Found user', user);

      await callPostUserLogout();
      console.log('Logged user out');

      const user2 = await callGetUser();
      console.log('Found user2', user2);
    },
    onSuccess: function (response) {
      console.log('mutation succcess', response);
    },
  });

  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: createUserSchema,
    },
    onSubmit: ({ value }) => createUser(value),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 md:p-8 space-y-8"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <form.Field
            name="email"
            validators={{
              onChangeAsyncDebounceMs: 1000,
              onChangeAsync: ({ value }) => validateEmailIsUnique(value),
            }}
          >
            {(field) => (
              <Input
                field={field}
                label="Email address"
                placeholder="smith@example.com"
                autoComplete="email"
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Input
                field={field}
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                help="At least 8 characters."
              />
            )}
          </form.Field>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="default" type="submit">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
