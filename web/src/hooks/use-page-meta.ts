import { useEffect } from 'react';

const SITE_NAME = 'Baruc Shopping';
const DEFAULT_DESCRIPTION =
  'Praticidade, confiança e ofertas para você. Sua experiência premium começa na Baruc Shopping.';

/** SPA equivalent of per-page metadata: keeps <title> and description in sync. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Seu shopping online`;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description ?? DEFAULT_DESCRIPTION;

    return () => {
      document.title = `${SITE_NAME} — Seu shopping online`;
    };
  }, [title, description]);
}
