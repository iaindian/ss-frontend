export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function pageview(url: string) {
  if (!GA_ID || typeof window === 'undefined') return;
  window.gtag?.('config', GA_ID, { page_path: url });
}

type GtagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
};
export function gaEvent({ action, category, label, value, params }: GtagEvent) {
  if (!GA_ID || typeof window === 'undefined') return;
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...params,
  });
}
