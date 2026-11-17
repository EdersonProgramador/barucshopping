import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AppProviders } from '@/providers/app-providers';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { Navbar } from '@/components/layout/navbar';
import { AnnouncementBar } from '@/features/home/announcement-bar';
import { LazyOverlays } from '@/components/layout/lazy-overlays';
import { DeferredSection } from '@/components/common/deferred-section';

import HomePage from '@/pages/home';

const ProductsPage = lazy(() => import('@/pages/products'));
const ProductPage = lazy(() => import('@/pages/product'));
const CartPage = lazy(() => import('@/pages/cart'));
const CheckoutPage = lazy(() => import('@/pages/checkout'));
const CheckoutSuccessPage = lazy(() => import('@/pages/checkout-success'));
const LoginPage = lazy(() => import('@/pages/auth/login'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password'));
const AccountLayout = lazy(() => import('@/layouts/account-layout'));
const ProfilePage = lazy(() => import('@/pages/account/profile'));
const OrdersPage = lazy(() => import('@/pages/account/orders'));
const OrderDetailPage = lazy(() => import('@/pages/account/order-detail'));
const AddressesPage = lazy(() => import('@/pages/account/addresses'));
const WishlistPage = lazy(() => import('@/pages/account/wishlist'));
const SecurityPage = lazy(() => import('@/pages/account/security'));
const RewardsPage = lazy(() => import('@/pages/account/rewards'));
const SharedWishlistPage = lazy(() => import('@/pages/shared-wishlist'));
const MaintenancePage = lazy(() => import('@/pages/maintenance'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

const AdminLayout = lazy(() => import('@/layouts/admin-layout'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'));
const AdminProductsPage = lazy(() => import('@/pages/admin/products'));
const NewProductPage = lazy(() => import('@/pages/admin/product-new'));
const EditProductPage = lazy(() => import('@/pages/admin/product-edit'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/orders'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/categories'));
const AdminCouponsPage = lazy(() => import('@/pages/admin/coupons'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users'));

const CustomCursor = lazy(() =>
  import('@/components/common/custom-cursor').then((m) => ({ default: m.CustomCursor }))
);
const ScrollProgress = lazy(() =>
  import('@/components/common/scroll-progress').then((m) => ({ default: m.ScrollProgress }))
);
const Footer = lazy(() =>
  import('@/components/layout/footer').then((m) => ({ default: m.Footer }))
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Carregando">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <ScrollToTop />
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
      <div className="grain max-md:hidden" aria-hidden />
      <div className="flex min-h-screen flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist/:token" element={<SharedWishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route path="/account" element={<AccountLayout />}>
                  <Route index element={<ProfilePage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="addresses" element={<AddressesPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="rewards" element={<RewardsPage />} />
                  <Route path="security" element={<SecurityPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<NewProductPage />} />
                  <Route path="products/:id" element={<EditProductPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                </Route>

                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <DeferredSection minHeight={280} rootMargin="400px 0px">
          <Suspense fallback={<div className="h-72 animate-pulse bg-muted/30" aria-hidden />}>
            <Footer />
          </Suspense>
        </DeferredSection>
      </div>
      <LazyOverlays />
    </AppProviders>
  );
}
