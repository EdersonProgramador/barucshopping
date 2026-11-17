import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from '@/components/common/link';
import { SplitReveal } from '@/components/common/split-reveal';
import { Magnetic } from '@/components/common/magnetic';

const VIDEO_SRC = '/bg-hero.mp4';

function canLoadHeroVideo() {
  if (typeof window === 'undefined') return false;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return false;
  if (
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g' ||
    connection?.effectiveType === '3g'
  ) {
    return false;
  }
  // Skip the heavy clip on narrow viewports — gradient covers mobile LCP
  if (window.matchMedia('(max-width: 900px)').matches) return false;
  return true;
}

export function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);

  // Defer video until after first paint so text/LCP wins the network
  useEffect(() => {
    if (!canLoadHeroVideo()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setLoadVideo(true);
    };

    const ric = window.requestIdleCallback?.(start, { timeout: 2500 });
    const fallback = window.setTimeout(start, 2000);

    return () => {
      cancelled = true;
      if (ric != null) window.cancelIdleCallback?.(ric);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="relative flex h-[92vh] min-h-[560px] items-end overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0">
        <div
          aria-hidden
          className="absolute inset-0 animate-slow-zoom bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.28),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(47,107,255,0.22),transparent_50%),linear-gradient(160deg,#050B18_0%,#0A1128_55%,#0F1A33_100%)]"
        />

        {loadVideo && !videoFailed && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        )}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" aria-hidden />

      <div className="container relative pb-20 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-white/80"
        >
          Baruc Shopping
        </motion.p>

        <h1 className="max-w-4xl font-heading text-5xl uppercase leading-[0.95] tracking-[0.04em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:text-7xl md:text-8xl">
          <SplitReveal
            text="Seu"
            by="chars"
            onMount
            delay={0.15}
            stagger={0.035}
            className="text-white"
          />{' '}
          <SplitReveal
            text="shopping online"
            by="chars"
            onMount
            delay={0.4}
            stagger={0.03}
            className="text-[#E0C05A]"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 max-w-md text-base text-white/80 sm:text-lg"
        >
          Praticidade, <span className="text-brand-300">confiança</span> e{' '}
          <span className="text-brand-300">ofertas</span> para você. Sua experiência premium começa
          aqui.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Magnetic>
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-full gradient-brand px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-navy-950 shadow-glow transition-transform active:scale-[0.98]"
            >
              Comprar agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>

          <Magnetic strength={0.25}>
            <Link
              href="/products?sort=newest"
              className="flex items-center rounded-full border border-brand-400/70 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-300 backdrop-blur-sm transition-colors hover:border-brand-300 hover:bg-brand-400/10"
            >
              Ver coleção
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.2, y: { repeat: Infinity, duration: 1.8 } }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden
      >
        <ChevronDown className="h-6 w-6 text-white/50" />
      </motion.div>
    </section>
  );
}
