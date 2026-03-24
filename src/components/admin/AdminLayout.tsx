import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Star, MessageSquare, Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: ShoppingCart },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.to, link.end);
        return (
          <Button
            key={link.to}
            variant="ghost"
            asChild
            className={cn(
              'justify-start gap-3 h-10 px-3 rounded-xl font-medium text-sm',
              active
                ? 'bg-lilac-500/10 text-lilac-600 dark:text-lilac-400 hover:bg-lilac-500/15'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={onNavigate}
          >
            <Link to={link.to}>
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30 pt-[4.25rem]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card flex-shrink-0">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-kugile text-foreground">Admin</h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="mt-1 -ml-2 text-xs text-muted-foreground hover:text-foreground gap-1.5">
            <Link to="/">
              <ArrowLeft className="h-3 w-3" />
              Back to site
            </Link>
          </Button>
        </div>
        <Separator />
        <SidebarNav />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-[4.25rem] left-0 z-40 p-2">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl shadow-md bg-card">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SheetHeader className="px-5 py-4">
              <SheetTitle className="text-lg font-bold font-kugile">Admin</SheetTitle>
            </SheetHeader>
            <Separator />
            <SidebarNav onNavigate={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
