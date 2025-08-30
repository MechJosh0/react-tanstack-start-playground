import { createFileRoute } from '@tanstack/react-router';
import LoginForm from '@/features/auth/ui/loginForm';

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
