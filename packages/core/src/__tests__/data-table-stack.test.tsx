import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '..';

const rows = [
  { id: 1, name: 'payments', cost: 3 },
  { id: 2, name: 'api-gateway', cost: 1 },
  { id: 3, name: 'search', cost: 2 },
];
const columns = [
  { key: 'name', header: 'Service', sortable: true },
  { key: 'cost', header: 'Cost', sortable: true },
];

/** jsdom has no layout: give every DataTable root the width we want. */
const width = (w: number) =>
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return { width: this.classList.contains('sp-data-table') ? w : 0, height: 0, top: 0, left: 0, right: w, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  });
const root = (c: HTMLElement) => c.querySelector('.sp-data-table') as HTMLElement;

describe('DataTable stacking', () => {
  afterEach(() => jest.restoreAllMocks());

  test('wide enough: a grid, and no sort picker (headers sort)', () => {
    width(900);
    const { container } = render(<DataTable aria-label="Services" data={rows} columns={columns} pageSize={0} />);
    expect(root(container)).toHaveAttribute('data-stacked', 'false');
    expect(screen.queryByRole('button', { name: /Sort by/ })).toBeNull();
  });
  test('stackBelow is honoured: 900px wide stacks when stackBelow is 1000', () => {
    width(900);
    const { container } = render(<DataTable aria-label="Services" data={rows} columns={columns} pageSize={0} stackBelow={1000} />);
    expect(root(container)).toHaveAttribute('data-stacked', 'true');
  });
  test('responsive="scroll" never stacks', () => {
    width(300);
    const { container } = render(<DataTable aria-label="Services" data={rows} columns={columns} pageSize={0} responsive="scroll" />);
    expect(root(container)).not.toHaveAttribute('data-stacked');
  });
  test('stacked: a visible picker sorts the cards', async () => {
    width(400);
    const user = userEvent.setup();
    render(<DataTable aria-label="Services" data={rows} columns={columns} pageSize={0} />);
    const names = () => screen.getAllByRole('row').slice(1).map((r) => r.querySelector('[data-label="Service"]')?.textContent);
    await user.click(screen.getByRole('button', { name: /Sort by/ }));
    await user.click(screen.getByRole('option', { name: 'Service, ascending' }));
    expect(names()).toEqual(['api-gateway', 'payments', 'search']);
    await user.click(screen.getByRole('button', { name: /Sort by/ }));
    await user.click(screen.getByRole('option', { name: 'Cost, descending' }));
    expect(names()).toEqual(['payments', 'search', 'api-gateway']);
  });
});
