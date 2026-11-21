import React from 'react';
import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Switch, Select, Modal, Tabs, TabList, Tab, TabPanel, Textfield, Field, SparkProvider, Calendar, Tooltip } from '..';

describe('Switch', () => {
  test('toggles with click and keyboard, and submits its value while on', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Switch label="Power" name="power" />
      </form>,
    );
    const sw = screen.getByRole('switch', { name: 'Power' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(container.querySelector('input[name="power"]')).toBeNull();
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(container.querySelector('input[name="power"]')).toHaveValue('on');
    act(() => sw.focus());
    await user.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Select (React Aria)', () => {
  const options = [
    { value: 'mum', label: 'Mumbai' },
    { value: 'sgp', label: 'Singapore' },
    { value: 'fra', label: 'Frankfurt' },
  ];
  test('opens, moves with arrows, and picks with Enter', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Select label="Region" options={options} onChange={onChange} />);
    const trigger = screen.getByRole('button', { name: /region/i });
    act(() => trigger.focus());
    await user.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getAllByRole('option')).toHaveLength(3);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('sgp');
    expect(trigger).toHaveTextContent('Singapore');
  });
  test('typeahead jumps to an option while closed', async () => {
    const user = userEvent.setup();
    render(<Select label="Region" options={options} />);
    const trigger = screen.getByRole('button', { name: /region/i });
    act(() => trigger.focus());
    await user.keyboard('f');
    expect(trigger).toHaveTextContent('Frankfurt');
  });
});

describe('Modal (React Aria)', () => {
  function Demo() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <Modal open={open} onClose={() => setOpen(false)} title="Cut the power?" actions={<button onClick={() => setOpen(false)}>Cancel</button>} />
      </>
    );
  }
  test('labels the dialog, closes on Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Cut the power?' });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    // React Aria restores focus on the next animation frame.
    await waitFor(() => expect(opener).toHaveFocus());
  });
});

describe('Tabs', () => {
  test('arrow keys move selection and show the right panel', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Demo">
          <Tab value="a">One</Tab>
          <Tab value="b">Two</Tab>
        </TabList>
        <TabPanel value="a">Panel one</TabPanel>
        <TabPanel value="b">Panel two</TabPanel>
      </Tabs>,
    );
    act(() => screen.getByRole('tab', { name: 'One' }).focus());
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });
});

describe('Calendar', () => {
  test('arrow keys and Enter pick a day', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Calendar value={new Date(2026, 10, 10)} onChange={onChange} autoFocus locale="en-US" />);
    await user.keyboard('{ArrowRight}{Enter}');
    const picked: Date = onChange.mock.calls[0][0];
    expect(picked.getDate()).toBe(11);
  });
});

describe('Textfield', () => {
  test('works uncontrolled, like React Hook Form register', async () => {
    const user = userEvent.setup();
    render(<Textfield label="Email" name="email" defaultValue="a@b.co" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveValue('a@b.co');
    await user.clear(input);
    await user.type(input, 'x@y.dev');
    expect(input).toHaveValue('x@y.dev');
    (input as HTMLInputElement).value = '';
    expect(input).toHaveValue('');
  });
});

describe('Field', () => {
  test('links label and error to a custom control', () => {
    render(
      <Field label="Notes" error="Required">
        <textarea />
      </Field>,
    );
    const box = screen.getByLabelText('Notes');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription('Required');
  });
});

describe('SparkProvider', () => {
  test('applies app-wide default props and slot classes; instance props win', () => {
    render(
      <SparkProvider components={{ Button: { defaultProps: { variant: 'outlined' } }, Switch: { classNames: { bulb: 'my-bulb' } } }}>
        <Button>Default</Button>
        <Button variant="contained">Override</Button>
        <Switch label="Power" />
      </SparkProvider>,
    );
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('data-variant', 'outlined');
    expect(screen.getByRole('button', { name: 'Override' })).toHaveAttribute('data-variant', 'contained');
    expect(document.querySelector('.sp-switch__bulb')).toHaveClass('my-bulb');
  });
});

describe('Tooltip (React Aria)', () => {
  test('shows on keyboard focus, describes the trigger, hides on Escape', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Before</button>
        <Tooltip title="Restarts every service">
          <Button>Restart</Button>
        </Tooltip>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Before' }));
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Restart' });
    expect(trigger).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Restarts every service');
    expect(trigger).toHaveAccessibleDescription('Restarts every service');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
