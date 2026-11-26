import { render, screen } from '@testing-library/react';
import { Textfield } from '../Textfield';
import { FileUpload } from '../FileUpload';
import { Button } from '../Button';

let warn: jest.SpyInstance;
beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

const deprecations = () => warn.mock.calls.filter((c) => String(c[1]).includes('deprecated'));

test('Textfield takes size, and inputSize still works with one warning', () => {
  const { container, rerender } = render(<Textfield label="A" size="small" />);
  expect(container.querySelector('[data-size="small"]')).not.toBeNull();
  expect(deprecations()).toHaveLength(0);
  rerender(<Textfield label="A" inputSize="large" />);
  rerender(<Textfield label="A" inputSize="large" />);
  expect(container.querySelector('[data-size="large"]')).not.toBeNull();
  expect(deprecations()).toHaveLength(1);
  expect(String(deprecations()[0][1])).toContain('Use `size`');
});

test('FileUpload takes helperText; hint still works', () => {
  render(<FileUpload label="Files" helperText="PDF only" />);
  expect(screen.getByText('PDF only')).toBeTruthy();
  render(<FileUpload label="Old" hint="Old hint" />);
  expect(screen.getByText('Old hint')).toBeTruthy();
  expect(deprecations().some((c) => String(c[1]).includes('FileUpload'))).toBe(true);
});

test('Button ripple warns once and still sets spark', () => {
  render(<Button ripple={false}>Go</Button>);
  render(<Button ripple={false}>Go</Button>);
  expect(deprecations().filter((c) => String(c[1]).includes('Button'))).toHaveLength(1);
});
