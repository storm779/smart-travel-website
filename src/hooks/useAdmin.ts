import { useAuth } from '../contexts/AuthContext';

export function useAdmin() {
  const { isAdmin } = useAuth();
  return { isAdmin };
}
