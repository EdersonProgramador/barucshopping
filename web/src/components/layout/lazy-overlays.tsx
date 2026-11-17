import { lazy, Suspense, useEffect, useState } from 'react';
import { useUiStore } from '@/stores/ui-store';

const SearchCommand = lazy(() =>
  import('@/components/layout/search-command').then((m) => ({ default: m.SearchCommand }))
);
const CartDrawer = lazy(() =>
  import('@/components/layout/cart-drawer').then((m) => ({ default: m.CartDrawer }))
);

/**
 * Mounts search/cart overlays only after the first open — keeps their
 * framer-motion + command UI out of the critical first paint.
 * Still listens for Ctrl/Cmd+K so the shortcut works before first mount.
 */
export function LazyOverlays() {
  const cartOpen = useUiStore((s) => s.cartOpen);
  const searchOpen = useUiStore((s) => s.searchOpen);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const [cartReady, setCartReady] = useState(false);
  const [searchReady, setSearchReady] = useState(false);

  useEffect(() => {
    if (cartOpen) setCartReady(true);
  }, [cartOpen]);

  useEffect(() => {
    if (searchOpen) setSearchReady(true);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchReady(true);
        setSearchOpen(!useUiStore.getState().searchOpen);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  return (
    <Suspense fallback={null}>
      {searchReady ? <SearchCommand /> : null}
      {cartReady ? <CartDrawer /> : null}
    </Suspense>
  );
}
