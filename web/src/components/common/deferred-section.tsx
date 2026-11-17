import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Mounts children only when near the viewport — keeps below-the-fold
 * JS/media out of the critical path on first paint.
 */
export function DeferredSection({
  children,
  rootMargin = '280px 0px',
  minHeight,
  className,
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number | string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
}
