import { useQuery } from '@tanstack/react-query';
import { userGet } from '@/features/user/api/userGet.server';

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: userGet,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
