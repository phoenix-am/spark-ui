import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { ThemeProvider } from '@sparkwire/system';
import { SparkProvider, CommandPalette, Drawer, ToggleGroup, ToggleGroupItem, Tooltip } from '@sparkwire/core';
import { byCategory, guides } from './lib/catalog';
import { Icon } from './components/Icon';

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
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const setMode = (m: Mode) => (setModeState(m), write('sw-mode', m));
  const setEnergy = (e: Energy) => (setEnergyState(e), write('sw-energy', e));

  useEffect(() => {
    document.documentElement.setAttribute('data-spark-theme', mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  const commands = useMemo(
    () => [
      { heading: 'Guides', items: guides.map((g) => ({ id: `g-${g.slug}`, label: g.title, description: g.group, onSelect: () => navigate(`/docs/${g.slug}`) })) },
      ...byCategory.map((group) => ({
        heading: group.category,
        items: group.entries.map((e) => ({
          id: `c-${e.name}`,
          label: e.title,
          description: e.components.length > 1 ? e.components.map((c) => c.name).join(', ') : undefined,
          keywords: [...e.components.map((c) => c.name), ...e.components.flatMap((c) => c.props.map((p) => p.name))],
          onSelect: () => navigate(`/components/${e.name}`),
        })),
      })),
    ],
    [navigate],
  );

  const site: Site = { mode, setMode, energy, setEnergy, openSearch: () => setSearchOpen(true) };

  return (
    <SiteContext.Provider value={site}>
      <ThemeProvider mode={mode}>
        <SparkProvider energy={energy}>
          <div className="sw-app">
            <Header />
            <Outlet />
          </div>
          <CommandPalette
            aria-label="Search the docs"
            placeholder="Search docs…"
            items={commands}
            open={searchOpen}
            onOpenChange={setSearchOpen}
          />
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
          <Icon name="bolt" />
          <span>Sparkwire</span>
        </Link>
        <nav className="sw-header__nav" aria-label="Main">
          <NavLink to="/docs/getting-started">Docs</NavLink>
          <NavLink to="/components/button" className={() => (pathname.startsWith('/components') ? 'active' : '')}>
            Components
          </NavLink>
        </nav>
        <button type="button" className="sw-search" onClick={openSearch}>
          <Icon name="search" />
          <span className="sw-search__text">Search</span>
          <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
        </button>
        <div className="sw-header__tools">
          <ToggleGroup aria-label="Energy" size="small" value={energy} onChange={(v) => v && setEnergy(v as Energy)} className="sw-energy sw-hide-mobile">
            <ToggleGroupItem value="off" aria-label="Energy off">Off</ToggleGroupItem>
            <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
            <ToggleGroupItem value="default" aria-label="Energy default">On</ToggleGroupItem>
            <ToggleGroupItem value="electric">
              <Icon name="bolt" size={14} />
              <span className="sw-visually-hidden">Electric</span>
            </ToggleGroupItem>
          </ToggleGroup>
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
    <div className="sw-docs">
      <aside className="sw-docs__aside sw-hide-mobile">
        <SideNav />
      </aside>
      <main className="sw-docs__main" id="main">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="sw-footer">
      <p>
        Made with <span aria-label="love" role="img">❤️</span> by Anmol Mehta
      </p>
      <nav aria-label="Elsewhere">
        <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
        <a href={NPM} target="_blank" rel="noreferrer">npm</a>
        <a href={`${GITHUB}/blob/master/LICENSE`} target="_blank" rel="noreferrer">MIT licence</a>
      </nav>
    </footer>
  );
}
