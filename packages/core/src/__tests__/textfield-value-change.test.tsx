import { render, screen, fireEvent } from '@testing-library/react';
import { Textfield } from '../Textfield';

test('onValueChange gets the text first, and onChange still gets the event', () => {
  const onValueChange = jest.fn();
  const onChange = jest.fn();
  render(<Textfield label="Name" onChange={onChange} onValueChange={onValueChange} />);
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Asha' } });
  expect(onValueChange).toHaveBeenCalledWith('Asha', expect.objectContaining({ type: 'change' }));
  expect(onChange.mock.calls[0][0].target.value).toBe('Asha');
});
