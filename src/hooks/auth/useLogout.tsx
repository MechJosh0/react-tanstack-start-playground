import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { userLogout } from '@/features/auth/api/userLogout.server';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const callUserLogout = useServerFn(userLogout);

  return useMutation({
    mutationFn: () => callUserLogout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });

      router.navigate({ to: '/' });
    },
  });
}
