import { useEffect } from 'react';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Sparkwire` : 'Sparkwire: React components with a live wire';
  }, [title]);
}
