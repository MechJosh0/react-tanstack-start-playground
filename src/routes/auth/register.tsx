import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { emailSchema, passwordSchema } from '@/validation/account.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/tanstack/form/input';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { hashPassword } from '@/lib/hashing';
import prisma from '@/lib/prisma';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

interface RegisterForm {
  email: string;
  password: string;
}

const defaultUser: RegisterForm = {
  email: 'my@email.com',
  password: 'Password1!',
};

const accountSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const serverCreateUser = createServerFn({ method: 'POST' })
  .validator(accountSchema)
  .handler(async ({ data }) => {
    const row = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
      },
      select: { id: true },
    });

    return row;
  });

function RouteComponent() {
  const callCreateUser = useServerFn(serverCreateUser);

  const { mutate: createUser } = useMutation({
    mutationFn: (data: RegisterForm) => callCreateUser({ data }),
    onSuccess: function (response) {
      console.log('mutation succcess', response);
    },
  });

  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: accountSchema,
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
          <form.Field name="email">
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
