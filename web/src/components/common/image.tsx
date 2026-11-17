import { forwardRef, useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const FALLBACK =
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=70';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
}

/**
 * Plain <img> with lazy loading, async decode, fetch priority for LCP
 * images, and a graceful error fallback.
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ fill, priority, className, alt = '', src, ...props }, ref) => {
    const [failed, setFailed] = useState(false);

    return (
      <img
        ref={ref}
        src={failed ? FALLBACK : src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
        className={cn(fill && 'absolute inset-0 h-full w-full', className)}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
