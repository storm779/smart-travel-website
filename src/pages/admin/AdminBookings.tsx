import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle } from 'lucide-react';

type BookingWithRelations = Booking & {
  packages?: { title: string } | null;
  profiles?: { full_name: string } | null;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase
      .from('bookings')
      .select('*, packages(title), profiles(full_name)')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('booking_status', filter);
    }

    const { data, error } = await query;
    if (error) {
      showToast('Failed to load bookings', 'error');
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
      .from('bookings')
      .update({ booking_status: status })
      .eq('id', id);

    if (error) {
      showToast('Failed to update status', 'error');
    } else {
      showToast(`Booking ${status}`, 'success');
      fetchBookings();
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default' as const;
      case 'pending': return 'secondary' as const;
      case 'cancelled': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold font-kugile text-foreground">Bookings</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lilac-500" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground text-sm py-10 text-center">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Travelers</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">{booking.booking_reference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.profiles?.full_name || booking.contact_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.contact_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.packages?.title || (booking.booking_type === 'custom' ? 'Custom Itinerary' : '—')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(booking.travel_dates_start).toLocaleDateString('en-IN')} – {new Date(booking.travel_dates_end).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>{booking.num_travelers}</TableCell>
                      <TableCell className="font-medium">₹{booking.total_price?.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(booking.booking_status)}>
                          {booking.booking_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {booking.booking_status !== 'confirmed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              title="Confirm"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {booking.booking_status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
