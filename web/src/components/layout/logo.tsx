import { useId } from 'react';
import Link from '@/components/common/link';
import { cn } from '@/lib/utils';

/** Ícone Baruc — sacola dourada (identidade das artes oficiais). */
export function BarucIcon({ className }: { className?: string }) {
  const gradId = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('h-9 w-9 shrink-0 transition-transform duration-300 group-hover:rotate-6', className)}
    >
      <defs>
        <linearGradient id={gradId} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5E6A8" />
          <stop offset="0.45" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#A8841C" />
        </linearGradient>
      </defs>
      <path
        d="M20 24h24l-2.2 26.5a3 3 0 0 1-3 2.5H25.2a3 3 0 0 1-3-2.5L20 24Z"
        stroke={`url(#${gradId})`}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M26 24c0-5.2 3.4-9 6-9s6 3.8 6 9"
        stroke={`url(#${gradId})`}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M20 24h24" stroke={`url(#${gradId})`} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-2.5', className)}
      aria-label="Baruc Shopping — Início"
    >
      <BarucIcon />
      {stacked ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.22em] gradient-text">
            Baruc
          </span>
          <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-shopping">
            Shopping
          </span>
        </span>
      ) : (
        <span className="flex flex-col leading-none sm:flex-row sm:items-baseline sm:gap-2">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.18em] gradient-text">
            Baruc
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-shopping sm:text-xs">
            Shopping
          </span>
        </span>
      )}
    </Link>
  );
}
