import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
} from '@/validation/account.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/tanstack/form/input';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

interface RegisterForm {
  firstName: string;
  lastName: string;
  password: string;
}

const defaultUser: RegisterForm = {
  firstName: 'Sarah',
  lastName: 'Smith',
  password: 'Password1!',
};

const accountSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  password: passwordSchema,
});

function RouteComponent() {
  const { mutate: createUser } = useMutation({
    mutationFn: (todo: RegisterForm) =>
      fetch('/api/demo-tq-todos', {
        method: 'POST',
        body: JSON.stringify(todo),
      }).then((res) => res.json()),
    onSuccess: function () {
      console.log('User created!');
    },
  });

  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: accountSchema,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await createUser(value);
    },
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
          <form.Field name="firstName">
            {(field) => (
              <Input
                field={field}
                label="First name"
                placeholder="Jane"
                autoComplete="given-name"
              />
            )}
          </form.Field>

          <form.Field name="lastName">
            {(field) => (
              <Input
                field={field}
                label="Last name"
                placeholder="Doe"
                autoComplete="family-name"
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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
