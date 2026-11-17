import { lazy, Suspense, type ComponentProps } from 'react';
import { usePageMeta } from '@/hooks/use-page-meta';
import { Hero } from '@/features/home/hero';
import { Marquee } from '@/features/home/marquee';
import { ProductRail } from '@/features/home/product-rail';
import { DeferredSection } from '@/components/common/deferred-section';

const CategoriesSection = lazy(() =>
  import('@/features/home/categories-section').then((m) => ({ default: m.CategoriesSection }))
);
const TechShowcase = lazy(() =>
  import('@/features/home/tech-showcase').then((m) => ({ default: m.TechShowcase }))
);
const BigType = lazy(() =>
  import('@/features/home/big-type').then((m) => ({ default: m.BigType }))
);
const PromoBanner = lazy(() =>
  import('@/features/home/promo-banner').then((m) => ({ default: m.PromoBanner }))
);
const Testimonials = lazy(() =>
  import('@/features/home/testimonials').then((m) => ({ default: m.Testimonials }))
);
const Newsletter = lazy(() =>
  import('@/features/home/newsletter').then((m) => ({ default: m.Newsletter }))
);

function SectionFallback({ height = 320 }: { height?: number }) {
  return <div className="w-full animate-pulse bg-muted/40" style={{ minHeight: height }} aria-hidden />;
}

function DeferredRail(props: ComponentProps<typeof ProductRail> & { minHeight?: number }) {
  const { minHeight = 360, ...railProps } = props;
  return (
    <DeferredSection minHeight={minHeight}>
      <ProductRail {...railProps} />
    </DeferredSection>
  );
}

export default function HomePage() {
  usePageMeta();

  return (
    <>
      <Hero />
      <Marquee />

      <ProductRail
        eyebrow="Acabou de chegar"
        title="Lançamentos"
        description="Os drops mais recentes da temporada — antes que esgotem."
        href="/products?sort=newest"
        filters={{ sort: 'newest', limit: 4 }}
      />

      <DeferredSection minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <CategoriesSection />
        </Suspense>
      </DeferredSection>

      <DeferredSection minHeight={560}>
        <Suspense fallback={<SectionFallback height={560} />}>
          <TechShowcase />
        </Suspense>
      </DeferredSection>

      <DeferredRail
        eyebrow="Seleção Baruc"
        title="Destaques da semana"
        description="A curadoria do nosso time com o melhor da loja."
        href="/products?featured=true"
        filters={{ featured: true, limit: 8 }}
        minHeight={420}
      />

      <DeferredSection minHeight={220}>
        <Suspense fallback={<SectionFallback height={220} />}>
          <BigType />
        </Suspense>
      </DeferredSection>

      <DeferredSection minHeight={520}>
        <Suspense fallback={<SectionFallback height={520} />}>
          <PromoBanner />
        </Suspense>
      </DeferredSection>

      <DeferredRail
        eyebrow="Por tempo limitado"
        title="Ofertas imperdíveis"
        description="Descontos reais nos produtos mais desejados."
        href="/products?onSale=true"
        filters={{ onSale: true, sort: 'discount', limit: 4 }}
      />

      <DeferredRail
        eyebrow="Os queridinhos"
        title="Mais vendidos"
        href="/products?sort=bestselling"
        filters={{ sort: 'bestselling', limit: 4 }}
      />

      <DeferredSection minHeight={360}>
        <Suspense fallback={<SectionFallback height={360} />}>
          <Testimonials />
        </Suspense>
      </DeferredSection>

      <DeferredSection minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <Newsletter />
        </Suspense>
      </DeferredSection>
    </>
  );
}
