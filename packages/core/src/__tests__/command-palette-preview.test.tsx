import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CommandPalette } from '..';

const items = [{ heading: 'Pages', items: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta', disabled: true }, { id: 'c', label: 'Gamma' }] }];

describe('CommandPalette preview and toolbar', () => {
  test('the preview follows the highlighted command', () => {
    render(<CommandPalette open hotkey={false} items={items} preview={(c) => <p>Showing {c?.label ?? 'nothing'}</p>} />);
    expect(screen.getByRole('region', { name: 'Preview' })).toHaveTextContent('Showing Alpha');
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    // Beta is disabled, so the highlight skips to Gamma.
    expect(screen.getByRole('region', { name: 'Preview' })).toHaveTextContent('Showing Gamma');
  });
  test('the preview gets undefined when nothing matches', () => {
    render(<CommandPalette open hotkey={false} items={items} preview={(c) => <p>Showing {c?.label ?? 'nothing'}</p>} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByRole('region', { name: 'Preview' })).toHaveTextContent('Showing nothing');
  });
  test('the toolbar renders under the search box', () => {
    render(<CommandPalette open hotkey={false} items={items} toolbar={<button type="button">Only pages</button>} />);
    expect(screen.getByRole('button', { name: 'Only pages' })).toBeInTheDocument();
  });
  test('without preview the panel is unchanged', () => {
    const { baseElement } = render(<CommandPalette open hotkey={false} items={items} />);
    expect(baseElement.querySelector('.sp-command__panel')?.hasAttribute('data-preview')).toBe(false);
    expect(screen.queryByRole('region', { name: 'Preview' })).toBeNull();
  });
  test('with preview and toolbar it has no axe violations', async () => {
    const { baseElement } = render(<CommandPalette open hotkey={false} items={items} toolbar={<button type="button">Only pages</button>} preview={(c) => <p>{c?.label}</p>} />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
