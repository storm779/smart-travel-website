import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Package } from '@/lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';

interface PackageForm {
  title: string;
  destination: string;
  description: string;
  price_per_person: number;
  duration_days: number;
  duration_nights: number;
  theme: string;
  category: 'domestic' | 'international';
}

const emptyForm: PackageForm = {
  title: '',
  destination: '',
  description: '',
  price_per_person: 0,
  duration_days: 1,
  duration_nights: 0,
  theme: '',
  category: 'domestic',
};

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Failed to load packages', 'error');
    } else {
      setPackages(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      destination: pkg.destination,
      description: pkg.description,
      price_per_person: pkg.price_per_person,
      duration_days: pkg.duration_days,
      duration_nights: pkg.duration_nights,
      theme: pkg.theme,
      category: pkg.category,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.destination) {
      showToast('Title and destination are required', 'error');
      return;
    }

    setSaving(true);
    if (editingId) {
      const { error } = await supabase
        .from('packages')
        .update(form)
        .eq('id', editingId);
      if (error) {
        showToast('Failed to update package', 'error');
      } else {
        showToast('Package updated', 'success');
        setDialogOpen(false);
        fetchPackages();
      }
    } else {
      const { error } = await supabase
        .from('packages')
        .insert({ ...form, images: [], inclusions: [], exclusions: [], detailed_itinerary: [], rating: 0, total_ratings: 0, is_active: true });
      if (error) {
        showToast('Failed to create package', 'error');
      } else {
        showToast('Package created', 'success');
        setDialogOpen(false);
        fetchPackages();
      }
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('packages')
      .update({ is_active: !currentActive })
      .eq('id', id);

    if (error) {
      showToast('Failed to update package', 'error');
    } else {
      showToast(`Package ${!currentActive ? 'activated' : 'deactivated'}`, 'success');
      fetchPackages();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('packages').delete().eq('id', deleteId);
    if (error) {
      showToast('Failed to delete package', 'error');
    } else {
      showToast('Package deleted', 'success');
      fetchPackages();
    }
    setDeleteId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold font-kugile text-foreground">Packages</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Package
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lilac-500" />
            </div>
          ) : packages.length === 0 ? (
            <p className="text-muted-foreground text-sm py-10 text-center">No packages found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.title}</TableCell>
                      <TableCell>{pkg.destination}</TableCell>
                      <TableCell>₹{pkg.price_per_person?.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="whitespace-nowrap">{pkg.duration_days}D / {pkg.duration_nights}N</TableCell>
                      <TableCell>
                        <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleActive(pkg.id, pkg.is_active)}
                            title={pkg.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <Power className={`h-4 w-4 ${pkg.is_active ? 'text-green-600' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(pkg)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                            onClick={() => setDeleteId(pkg.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-kugile">{editingId ? 'Edit Package' : 'Add Package'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price per person (₹)</Label>
                <Input id="price" type="number" value={form.price_per_person} onChange={(e) => setForm({ ...form, price_per_person: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Input id="theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="days">Days</Label>
                <Input id="days" type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nights">Nights</Label>
                <Input id="nights" type="number" value={form.duration_nights} onChange={(e) => setForm({ ...form, duration_nights: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(val: 'domestic' | 'international') => setForm({ ...form, category: val })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this package? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
