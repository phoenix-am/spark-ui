import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '../../packages/core/src/styles/index.css';
import './site.css';
import { SiteRoutes } from './routes';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const app = (
  <React.StrictMode>
    <BrowserRouter basename={base}>
      <SiteRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
const root = document.getElementById('root')!;
// Pages are prerendered to HTML at build time; hydrate them, or render fresh in dev.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
