import { useServerFn } from '@tanstack/react-start';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { userCreateSchema } from '../schema/userCreateSchema';
import { userLogin } from '../api/userLogin.server';
import { Input } from '@/components/tanstack/form/input';
import { Button } from '@/components/ui/button';

export interface LoginForm {
  email: string;
  password: string;
}

export const defaultUser: LoginForm = {
  email: 'my@email.com',
  password: 'Password1!',
};

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const callUserLogin = useServerFn(userLogin);

  const { mutate: createUser } = useMutation({
    mutationFn: async (data: LoginForm) => callUserLogin({ data }),
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });

      router.navigate({ to: '/' });
    },
    onError: function (error: unknown) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    },
  });

  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: userCreateSchema,
    },
    onSubmit: ({ value }) => {
      setFormError(undefined);
      createUser(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 md:p-8 space-y-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <form.Field name="email">{(field) => <Input field={field} label="Email address" placeholder="smith@example.com" autoComplete="email" />}</form.Field>
        <form.Field name="password">{(field) => <Input field={field} label="Password" type="password" placeholder="••••••••" autoComplete="new-password" help="At least 8 characters." />}</form.Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="default" type="submit" errorMessage={formError}>
          Login
        </Button>
      </div>
    </form>
  );
}
