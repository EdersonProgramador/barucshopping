import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type LazyVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> & {
  src: string;
  /** Start downloading only when near viewport (default true). */
  defer?: boolean;
  rootMargin?: string;
};

/**
 * Background/ambient video that waits for IntersectionObserver before
 * attaching the source — avoids competing with LCP on first load.
 */
export function LazyVideo({
  src,
  defer = true,
  rootMargin = '200px 0px',
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  ...props
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(!defer);

  useEffect(() => {
    if (!defer) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [defer, rootMargin]);

  useEffect(() => {
    if (!active || !autoPlay) return;
    const video = ref.current;
    if (!video) return;
    void video.play().catch(() => {
      /* autoplay may be blocked — silent fallback to poster/gradient */
    });
  }, [active, autoPlay, src]);

  return (
    <video
      ref={ref}
      className={cn(className)}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={active ? 'metadata' : 'none'}
      {...props}
    >
      {active ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
