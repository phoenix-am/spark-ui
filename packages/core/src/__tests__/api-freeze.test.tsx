import { render, screen } from '@testing-library/react';
import { Textfield } from '../Textfield';
import { FileUpload } from '../FileUpload';
import { Calendar } from '../DatePicker';

test('Textfield size sets the height', () => {
  const { container } = render(<Textfield label="A" size="small" />);
  expect(container.querySelector('[data-size="small"]')).not.toBeNull();
});

test('FileUpload shows helperText', () => {
  render(<FileUpload label="Files" helperText="PDF only" />);
  expect(screen.getByText('PDF only')).toBeTruthy();
});

test('Calendar todayLabel renames the Today button and logs nothing', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Calendar aria-label="Day" todayLabel="Aaj" />);
  expect(screen.getByRole('button', { name: 'Aaj' })).toBeTruthy();
  expect(warn).not.toHaveBeenCalled();
  warn.mockRestore();
});
