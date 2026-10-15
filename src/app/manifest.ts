import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SoloFi — Automated Financial Hub',
    short_name: 'SoloFi',
    description: 'Smart business checking with built-in bookkeeping and automatic tax withholding for solopreneurs.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0B0D10',
    theme_color: '#059669',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
