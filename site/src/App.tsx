import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { ThemeProvider } from '@sparkwire/system';
import { SparkProvider, Drawer, ToggleGroup, ToggleGroupItem, Tooltip } from '@sparkwire/core';
import { byCategory, guides } from './lib/catalog';
import { Icon } from './components/Icon';
import { LogoMark } from './components/Logo';
import { SiteSearch } from './components/SiteSearch';

type Mode = 'dark' | 'light';
type Energy = 'off' | 'calm' | 'default' | 'electric';
interface Site {
  mode: Mode;
  setMode: (m: Mode) => void;
  energy: Energy;
  setEnergy: (e: Energy) => void;
  openSearch: () => void;
}
const SiteContext = createContext<Site | null>(null);
export const useSite = () => useContext(SiteContext)!;

const read = <T extends string>(key: string, fallback: T): T => {
  try {
    return (localStorage.getItem(key) as T) || fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage can be unavailable; the choice just won't be remembered */
  }
};

export const GITHUB = 'https://github.com/phoenix-am/spark-ui';
export const NPM = 'https://www.npmjs.com/package/@sparkwire/core';

export function App() {
  const [mode, setModeState] = useState<Mode>(() => read<Mode>('sw-mode', 'dark'));
  const [energy, setEnergyState] = useState<Energy>(() => read<Energy>('sw-energy', 'default'));
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname, hash } = useLocation();

  const setMode = (m: Mode) => (setModeState(m), write('sw-mode', m));
  const setEnergy = (e: Energy) => (setEnergyState(e), write('sw-energy', e));

  useEffect(() => {
    document.documentElement.setAttribute('data-spark-theme', mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);
  useEffect(() => {
    document.querySelectorAll('[data-linked]').forEach((el) => el.removeAttribute('data-linked'));
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) {
      target.scrollIntoView();
      // CSS :target misses router navigation, so mark the linked row ourselves.
      if (target.tagName === 'TR') target.setAttribute('data-linked', '');
    } else if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  const site: Site = { mode, setMode, energy, setEnergy, openSearch: () => setSearchOpen(true) };

  return (
    <SiteContext.Provider value={site}>
      <ThemeProvider mode={mode}>
        <SparkProvider energy={energy}>
          <div className="sw-app">
            <Header />
            <Outlet />
          </div>
          <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
        </SparkProvider>
      </ThemeProvider>
    </SiteContext.Provider>
  );
}

function Header() {
  const { mode, setMode, energy, setEnergy, openSearch } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className="sw-header">
      <div className="sw-header__inner">
        <button type="button" className="sw-icon-btn sw-only-mobile" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>
        <Link to="/" className="sw-logo" aria-label="Sparkwire home">
          <LogoMark />
          <span>Sparkwire</span>
        </Link>
        <nav className="sw-header__nav" aria-label="Main">
          <NavLink to="/docs/getting-started">Docs</NavLink>
          <NavLink to="/components/button" className={() => (pathname.startsWith('/components') ? 'active' : '')}>
            Components
          </NavLink>
          <NavLink to="/theme-builder">Theme builder</NavLink>
        </nav>
        <button type="button" className="sw-search" onClick={openSearch} aria-label="Search the docs" aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}>
          <Icon name="search" />
          <span className="sw-search__text">Search</span>
          <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
        </button>
        <div className="sw-header__tools">
          {/* The home page has its own, bigger dial in the hero; one dial per page. */}
          {pathname !== '/' && (
          <ToggleGroup aria-label="Energy" size="small" value={energy} onChange={(v) => v && setEnergy(v as Energy)} className="sw-energy sw-hide-mobile">
            <ToggleGroupItem value="off" aria-label="Energy off">Off</ToggleGroupItem>
            <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
            <ToggleGroupItem value="default">Default</ToggleGroupItem>
            <ToggleGroupItem value="electric">
              <Icon name="bolt" size={14} />
              <span className="sw-visually-hidden">Electric</span>
            </ToggleGroupItem>
          </ToggleGroup>
          )}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <button type="button" className="sw-icon-btn" aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
              <Icon name={mode === 'dark' ? 'sun' : 'moon'} />
            </button>
          </Tooltip>
          <a className="sw-icon-btn sw-hide-mobile" href={GITHUB} target="_blank" rel="noreferrer" aria-label="Sparkwire on GitHub">
            <Icon name="github" />
          </a>
        </div>
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} placement="start" size="small" title="Sparkwire">
        <SideNav />
      </Drawer>
    </header>
  );
}

export function SideNav() {
  const groups = [...new Set(guides.map((g) => g.group))];
  return (
    <nav className="sw-sidenav" aria-label="Docs">
      {groups.map((group) => (
        <div key={group} className="sw-sidenav__group">
          <h2>{group}</h2>
          {guides
            .filter((g) => g.group === group)
            .map((g) => (
              <NavLink key={g.slug} to={`/docs/${g.slug}`}>
                {g.title}
              </NavLink>
            ))}
          {group === 'Customise' && <NavLink to="/theme-builder">Theme builder</NavLink>}
        </div>
      ))}
      {byCategory.map((group) => (
        <div key={group.category} className="sw-sidenav__group">
          <h2>{group.category}</h2>
          {group.entries.map((e) => (
            <NavLink key={e.name} to={`/components/${e.name}`}>
              {e.title}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

/** Sidebar + content, for guide and component pages. */
export function DocsLayout() {
  return (
    <div className="sw-docs-shell">
      <div className="sw-docs">
        <aside className="sw-docs__aside sw-hide-mobile">
          <SideNav />
        </aside>
        <main className="sw-docs__main" id="main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="sw-footer">
      <div className="sw-footer__inner">
      <p>
        Made with <span aria-label="love" role="img">❤️</span> by Anmol Mehta
      </p>
      <nav aria-label="Elsewhere">
        <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
        <a href={NPM} target="_blank" rel="noreferrer">npm</a>
        <a href={`${GITHUB}/blob/master/LICENSE`} target="_blank" rel="noreferrer">MIT licence</a>
      </nav>
      </div>
    </footer>
  );
}
