import { useQuery } from '@tanstack/react-query';
import { userGet } from '@/features/user/api/userGet.server';

export function useUsersProfile() {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: userGet,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
  };
}
