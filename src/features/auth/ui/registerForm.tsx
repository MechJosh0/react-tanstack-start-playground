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

export interface RegisterForm {
  email: string;
  password: string;
}

export const defaultUser: RegisterForm = {
  email: 'my@email.com',
  password: 'Password1!',
};

export default function RegisterForm() {
  const callPostCreateUser = useServerFn(userCreate);
  const callGetValidateEmailIsUnique = useServerFn(userValidateEmailIsUnique);
  const callPostUserLogin = useServerFn(userLogin);
  const callGetUser = useServerFn(userGet);
  const callPostUserLogout = useServerFn(userLogout);

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

      return 'asdf';
    },
    onSuccess: function (response) {
      console.log('mutation succcess', response);
    },
  });

  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: userCreateSchema,
    },
    onSubmit: ({ value }) => createUser(value),
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
        <Button variant="default" type="submit">
          Register
        </Button>
      </div>
    </form>
  );
}
