import { createFileRoute } from '@tanstack/react-router';
import RegisterForm from '@/features/auth/ui/registerForm';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
