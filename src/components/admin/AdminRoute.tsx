import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lilac-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4 px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10">
          <ShieldX className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold font-kugile text-foreground">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have permission to access the admin dashboard. Please contact an administrator if you believe this is an error.
        </p>
        <Button asChild className="mt-2">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
