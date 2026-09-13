import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingState } from './components/ui/LoadingState';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Lazy load storefront pages for better performance
const Home = React.lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Shop = React.lazy(() => import('./pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetail = React.lazy(() =>
  import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetail }))
);
const Cart = React.lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })));
const Category = React.lazy(() => import('./pages/Category').then((m) => ({ default: m.Category })));

// Lazy load admin pages — kept out of the main customer bundle
const AdminLogin = React.lazy(() =>
  import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const AdminLayout = React.lazy(() =>
  import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = React.lazy(() =>
  import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProducts = React.lazy(() =>
  import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts }))
);
const AdminProductForm = React.lazy(() =>
  import('./pages/admin/AdminProductForm').then((m) => ({ default: m.AdminProductForm }))
);
const AdminCategories = React.lazy(() =>
  import('./pages/admin/AdminCategories').then((m) => ({ default: m.AdminCategories }))
);
const AdminSettings = React.lazy(() =>
  import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings }))
);

function StorefrontLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Router>
            <Suspense fallback={<LoadingState />}>
              <Routes>
                {/* Storefront */}
                <Route
                  path="/"
                  element={
                    <StorefrontLayout>
                      <Home />
                    </StorefrontLayout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <StorefrontLayout>
                      <Shop />
                    </StorefrontLayout>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <StorefrontLayout>
                      <ProductDetail />
                    </StorefrontLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <StorefrontLayout>
                      <Cart />
                    </StorefrontLayout>
                  }
                />
                <Route
                  path="/category/:slug"
                  element={
                    <StorefrontLayout>
                      <Category />
                    </StorefrontLayout>
                  }
                />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AdminAuthProvider>
    </SettingsProvider>
  );
}

export default App;
