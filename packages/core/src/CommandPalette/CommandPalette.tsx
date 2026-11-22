import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMessages } from '../internal/messages';
import { useDialog } from 'react-aria';
import { Overlay } from '../base/Overlay';
import { InputBase } from '../base/InputBase';
import { ListItemContent } from '../base/ListBox';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface Command {
  /** Unique id. */
  id: string;
  label: string;
  /** Extra words that should find this command, e.g. ['preferences'] for "Settings". */
  keywords?: string[];
  icon?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Shortcut hint shown at the end, e.g. "⌘S". Display only. */
  shortcut?: string;
  disabled?: boolean;
  /** Run when chosen. */
  onSelect?: () => void;
  /** Navigate when chosen (rendered as a link). */
  href?: string;
}

export interface CommandGroup {
  /** Heading for the group. */
  heading: string;
  items: Command[];
}

export interface CommandPaletteProps {
  /** Commands, or groups of commands with a heading. */
  items: Array<Command | CommandGroup>;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Keyboard shortcut that opens and closes the palette. Default `mod+k` (⌘K on Mac, Ctrl+K elsewhere). `false` to turn off. */
  hotkey?: string | false;
  /** Called with the search text, e.g. to fetch results from a server (with `filter={false}`). */
  onSearchChange?: (search: string) => void;
  /** Match commands to the search yourself. Default `true` (case- and accent-insensitive, best matches first). */
  filter?: boolean;
  /** Called with the chosen command, after its own `onSelect`. */
  onSelect?: (command: Command) => void;
  /** Close after a command runs. Default `true`. */
  closeOnSelect?: boolean;
  placeholder?: string;
  /** Shown when nothing matches. Default "No results". */
  emptyState?: React.ReactNode;
  /** Show a loading line, e.g. while fetching. */
  loading?: boolean;
  /** Accessible name for the dialog. Default "Command palette". */
  'aria-label'?: string;
  /** Hide the keyboard hints at the bottom. */
  hideFooter?: boolean;
  className?: string;
  /** Extra classes for each part: panel, input, list, group, item, footer. */
  classNames?: ClassNames<'panel' | 'input' | 'list' | 'group' | 'item' | 'footer'>;
}

const isGroup = (x: Command | CommandGroup): x is CommandGroup => Array.isArray((x as CommandGroup).items);
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** 3 = label starts with the search, 2 = a word starts with it, 1 = contains it (label or keywords), 0 = no match. */
function score(cmd: Command, q: string) {
  if (!q) return 1;
  const label = fold(cmd.label);
  if (label.startsWith(q)) return 3;
  if (label.split(/[\s\-_/]+/).some((w) => w.startsWith(q))) return 2;
  if (label.includes(q) || cmd.keywords?.some((k) => fold(k).includes(q))) return 1;
  return 0;
}

/** Matches "mod+k", "ctrl+shift+p", "/" against a key event. `mod` is ⌘ on Mac, Ctrl elsewhere. */
function matchesHotkey(e: KeyboardEvent, hotkey: string) {
  const parts = hotkey.toLowerCase().split('+');
  const key = parts.pop();
  const mac = typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
  const want = { meta: parts.includes('meta') || (mac && parts.includes('mod')), ctrl: parts.includes('ctrl') || (!mac && parts.includes('mod')), shift: parts.includes('shift'), alt: parts.includes('alt') };
  return e.key.toLowerCase() === key && e.metaKey === want.meta && e.ctrlKey === want.ctrl && e.shiftKey === want.shift && e.altKey === want.alt;
}

/**
 * CommandPalette: a ⌘K launcher. Type to find a command or page; arrows move
 * the lit node, Enter runs it, Escape closes. Focus stays in the search box
 * (ARIA combobox with an active option), the dialog traps focus and returns
 * it when closed. Groups, keywords, icons, shortcuts, links and async
 * results. Built on the Overlay and InputBase base components and the
 * shared list-item look.
 *
 * Style hooks: `.sp-command`, `__panel`, `__input`, `__list`, `__group`,
 * `__heading`, `.sp-list-item[data-focused]`, `__empty`, `__footer`.
 */
export function CommandPalette(inProps: CommandPaletteProps) {
  const props = useDefaults('CommandPalette', inProps);
  const { open, defaultOpen = false, onOpenChange, hotkey = 'mod+k' } = props;
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const setOpen = (v: boolean) => {
    if (open === undefined) setInner(v);
    onOpenChange?.(v);
  };
  const openRef = useRef(isOpen);
  openRef.current = isOpen;

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if (matchesHotkey(e, hotkey)) {
        e.preventDefault();
        setOpen(!openRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // setOpen is recreated each render; the ref keeps the latest state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotkey, open]);

  return (
    <Overlay open={isOpen} onClose={() => setOpen(false)} className={slot('sp-command', undefined, 'root', props.className)} backdropClassName="sp-command__backdrop">
      {({ panelProps, panelRef }) => <Panel {...props} panelProps={panelProps} panelRef={panelRef} close={() => setOpen(false)} />}
    </Overlay>
  );
}

function Panel({
  items,
  onSearchChange,
  filter = true,
  onSelect,
  closeOnSelect = true,
  placeholder: placeholderProp,
  emptyState: emptyStateProp,
  loading,
  'aria-label': ariaLabelProp,
  hideFooter,
  classNames,
  panelProps,
  panelRef,
  close,
}: CommandPaletteProps & { panelProps: React.HTMLAttributes<HTMLElement>; panelRef: React.RefObject<HTMLDivElement>; close: () => void }) {
  const m = useMessages();
  const placeholder = placeholderProp ?? m.commandPlaceholder;
  const emptyState = emptyStateProp ?? m.noResults;
  const ariaLabel = ariaLabelProp ?? m.commandPalette;
  const { dialogProps } = useDialog({ 'aria-label': ariaLabel }, panelRef);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  // Filter and rank within each group; groups keep their order.
  const groups = useMemo(() => {
    const q = fold(search.trim());
    const raw = items.map((x) => (isGroup(x) ? x : { heading: '', items: [x] }));
    // Merge consecutive loose commands into one heading-less group.
    const merged: CommandGroup[] = [];
    for (const g of raw) {
      const last = merged[merged.length - 1];
      if (!g.heading && last && !last.heading) last.items = [...last.items, ...g.items];
      else merged.push({ heading: g.heading, items: [...g.items] });
    }
    return merged
      .map((g) => ({
        heading: g.heading,
        items: filter
          ? g.items
              .map((c, i) => ({ c, s: score(c, q), i }))
              .filter((x) => x.s > 0)
              .sort((a, b) => b.s - a.s || a.i - b.i)
              .map((x) => x.c)
          : g.items,
      }))
      .filter((g) => g.items.length);
  }, [items, search, filter]);

  const flat = groups.flatMap((g) => g.items);
  const enabled = flat.map((c, i) => (c.disabled ? -1 : i)).filter((i) => i >= 0);
  const current = flat[active];
  const optionId = (i: number) => `${listId}-opt-${i}`;

  useEffect(() => setActive(enabled[0] ?? 0), [search, items]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    listRef.current?.querySelector(`#${CSS.escape(optionId(active))}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = (cmd?: Command) => {
    if (!cmd || cmd.disabled) return;
    cmd.onSelect?.();
    onSelect?.(cmd);
    if (cmd.href) window.location.assign(cmd.href);
    if (closeOnSelect) close();
  };

  const move = (delta: number) => {
    if (!enabled.length) return;
    const pos = enabled.indexOf(active);
    setActive(enabled[(pos + delta + enabled.length) % enabled.length]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'Home' && e.ctrlKey) setActive(enabled[0] ?? 0);
    else if (e.key === 'End' && e.ctrlKey) setActive(enabled[enabled.length - 1] ?? 0);
    else if (e.key === 'PageDown') move(5);
    else if (e.key === 'PageUp') move(-5);
    else if (e.key === 'Enter') run(current);
    else return;
    e.preventDefault();
  };

  let index = -1;
  return (
    <div {...panelProps} {...dialogProps} ref={panelRef} className={slot('sp-command__panel', classNames, 'panel')}>
      <div aria-hidden="true" className="sp-command__current sp-current" data-live={search ? true : undefined} />
      <InputBase
        role="combobox"
        aria-label={m.searchCommands}
        aria-expanded={flat.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={current && !current.disabled ? optionId(active) : undefined}
        autoFocus
        variant="standard"
        size="large"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearchChange?.(e.target.value);
        }}
        onKeyDown={onKeyDown}
        classNames={{ root: slot('sp-command__input', classNames, 'input') }}
        startAdornment={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        }
        endAdornment={<kbd className="sp-command__esc">esc</kbd>}
      />
      <div ref={listRef} id={listId} role="listbox" aria-label={m.commands} className={slot('sp-command__list', classNames, 'list')}>
        {loading && (
          <div className="sp-command__status" role="status">
            <span className="sp-combobox__spinner" aria-hidden="true" /> Loading…
          </div>
        )}
        {!loading && flat.length === 0 && (
          <div className="sp-command__status sp-command__empty" role="status">
            {emptyState}
          </div>
        )}
        {groups.map((g, gi) => (
          <div key={`${g.heading}-${gi}`} role="group" aria-label={g.heading || undefined} className={slot('sp-command__group', classNames, 'group')}>
            {g.heading && (
              <div className="sp-command__heading sp-list-section__heading" aria-hidden="true">
                {g.heading}
              </div>
            )}
            {g.items.map((cmd) => {
              index += 1;
              const i = index;
              const Tag = (cmd.href ? 'a' : 'div') as 'div';
              return (
                <Tag
                  key={cmd.id}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  aria-disabled={cmd.disabled || undefined}
                  {...(cmd.href ? { href: cmd.href, tabIndex: -1 } : {})}
                  className={slot('sp-list-item sp-command__item', classNames, 'item')}
                  data-focused={i === active || undefined}
                  data-disabled={cmd.disabled || undefined}
                  onMouseMove={() => !cmd.disabled && i !== active && setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    if (cmd.href) e.preventDefault();
                    run(cmd);
                  }}
                >
                  <ListItemContent icon={cmd.icon} label={cmd.label} description={cmd.description} end={cmd.shortcut ? <kbd>{cmd.shortcut}</kbd> : undefined} />
                </Tag>
              );
            })}
          </div>
        ))}
      </div>
      {!hideFooter && (
        <div className={slot('sp-command__footer', classNames, 'footer')} aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> run</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      )}
      <div className="sp-visually-hidden" role="status" aria-live="polite">
        {search ? `${flat.length} result${flat.length === 1 ? '' : 's'}` : ''}
      </div>
    </div>
  );
}

export default CommandPalette;
