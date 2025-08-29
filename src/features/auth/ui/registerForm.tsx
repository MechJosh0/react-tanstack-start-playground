import { useServerFn } from '@tanstack/react-start';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { userValidateEmailIsUnique } from '../api/userValidateEmailIsUnique.server';
import { userGet } from '../../user/api/userGet.server';
import { userCreateSchema } from '../schema/userCreateSchema';
import { userRegister } from '../api/userRegister.server';
import { Input } from '@/components/tanstack/form/input';
import { Button } from '@/components/ui/button';
// import { userLogout } from '../api/userLogout.server';
import { makeAsyncValidator } from '@/lib/utils';

export interface RegisterForm {
  email: string;
  password: string;
}

export const defaultUser: RegisterForm = {
  email: 'my@email.com',
  password: 'Password1!',
};

export default function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const callUserRegister = useServerFn(userRegister);
  const callUserValidateEmailIsUnique = useServerFn(userValidateEmailIsUnique);
  const callUserGet = useServerFn(userGet);
  // const callUserLogout = useServerFn(userLogout);

  const { mutate: createUser } = useMutation({
    mutationFn: async (data: RegisterForm) => {
      console.log('calling server');
      await callUserRegister({ data });
      console.log('Logged user in');

      const user = await callUserGet();
      console.log('Found user', user);

      // await callUserLogout();
      // console.log('Logged user out');

      // const user2 = await callUserGet();
      // console.log('Found user2', user2);

      return user;
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });

      router.navigate({ to: '/' });
    },
    onError: function (error: unknown) {
      console.log('error', error);
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
            onChangeAsync: makeAsyncValidator((value: string) => callUserValidateEmailIsUnique({ data: value })),
          }}
        >
          {(field) => <Input field={field} label="Email address" placeholder="smith@example.com" autoComplete="email" />}
        </form.Field>

        <form.Field name="password">{(field) => <Input field={field} label="Password" type="password" placeholder="••••••••" autoComplete="new-password" help="At least 8 characters." />}</form.Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="default" type="submit" errorMessage={formError}>
          Register
        </Button>
      </div>
    </form>
  );
}
