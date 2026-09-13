import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, Settings, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 flex-shrink-0 border-r border-border bg-muted/40 p-4 hidden md:flex flex-col">
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      <div className="flex-1 p-6 md:p-8 overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
}
