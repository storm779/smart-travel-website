import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalBookings: number;
  activePackages: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalBookings: 0, activePackages: 0, totalUsers: 0 });
  const [recentBookings, setRecentBookings] = useState<(Booking & { packages?: { title: string } | null; profiles?: { full_name: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [bookingsRes, packagesRes, usersRes, recentRes] = await Promise.all([
      supabase.from('bookings').select('total_price, booking_status'),
      supabase.from('packages').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('bookings').select('*, packages(title), profiles(full_name)').order('created_at', { ascending: false }).limit(10),
    ]);

    const bookings = bookingsRes.data || [];
    const totalRevenue = bookings
      .filter(b => b.booking_status === 'confirmed')
      .reduce((sum, b) => sum + (b.total_price || 0), 0);

    setStats({
      totalRevenue,
      totalBookings: bookings.length,
      activePackages: packagesRes.count || 0,
      totalUsers: usersRes.count || 0,
    });

    setRecentBookings(recentRes.data || []);
    setLoading(false);
  };

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: ShoppingCart, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Packages', value: stats.activePackages, icon: Package, color: 'text-lilac-600 dark:text-lilac-400', bg: 'bg-lilac-500/10' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const statusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default' as const;
      case 'pending': return 'secondary' as const;
      case 'cancelled': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lilac-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-kugile text-foreground">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-xl font-bold text-foreground">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-kugile">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">{booking.booking_reference}</TableCell>
                      <TableCell>{booking.profiles?.full_name || booking.contact_name}</TableCell>
                      <TableCell>{booking.packages?.title || (booking.booking_type === 'custom' ? 'Custom Itinerary' : '—')}</TableCell>
                      <TableCell>₹{booking.total_price?.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(booking.booking_status)}>
                          {booking.booking_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(booking.created_at).toLocaleDateString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
