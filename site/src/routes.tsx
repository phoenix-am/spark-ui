import React from 'react';
import { Route, Routes } from 'react-router';
import { App, DocsLayout } from './App';
import { Home } from './pages/Home';
import { GuidePage } from './pages/GuidePage';
import { ComponentPage } from './pages/ComponentPage';
import { NotFound } from './pages/NotFound';

export function SiteRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<Home />} />
        <Route element={<DocsLayout />}>
          <Route path="docs/:slug" element={<GuidePage />} />
          <Route path="components/:name" element={<ComponentPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
