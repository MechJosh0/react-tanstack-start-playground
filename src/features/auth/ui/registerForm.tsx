import { useServerFn } from '@tanstack/react-start';
import { userCreate } from '../api/userCreate.server';
import { userValidateEmailIsUnique } from '../api/userValidateEmailIsUnique.server';
import { userLogin } from '../api/userLogin.server';
import { userGet } from '../api/userGet.server';
import { userLogout } from '../api/userLogout.server';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { userCreateSchema } from '../schema/userCreateSchema';
import { Input } from '@/components/tanstack/form/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export interface RegisterForm {
  email: string;
  password: string;
}

export const defaultUser: RegisterForm = {
  email: 'my@email.com',
  password: 'Password1!',
};

export default function RegisterForm() {
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const callUserCreate = useServerFn(userCreate);
  const callUserValidateEmailIsUnique = useServerFn(userValidateEmailIsUnique);
  const callUserLogin = useServerFn(userLogin);
  const callUserGet = useServerFn(userGet);
  const callUserLogout = useServerFn(userLogout);

  const validateEmailIsUnique = async (email: string) => {
    const isUnique = await callUserValidateEmailIsUnique({ data: { email } });

    return !isUnique ? 'This email address is already registered' : null;
  };

  const { mutate: createUser } = useMutation({
    mutationFn: async (data: RegisterForm) => {
      await callUserCreate({ data });
      console.log('User created');

      await callUserLogin({ data });
      console.log('Logged user in');

      const user = await callUserGet();
      console.log('Found user', user);

      await callUserLogout();
      console.log('Logged user out');

      const user2 = await callUserGet();
      console.log('Found user2', user2);

      return user;
    },
    onSuccess: function (response) {
      console.log('mutation succcess', response);
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
        <Button variant="default" type="submit" errorMessage={formError}>
          Register
        </Button>
      </div>
    </form>
  );
}
