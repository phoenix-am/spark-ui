import React from 'react';
import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Switch, Select, Modal, Tabs, TabList, Tab, TabPanel, Textfield, Field, SparkProvider, Calendar, DatePicker, Tooltip, Slider } from '..';

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

describe('Tabs (React Aria)', () => {
  const renderTabs = (props: Partial<React.ComponentProps<typeof Tabs>> = {}) =>
    render(
      <Tabs defaultValue="a" {...props}>
        <TabList aria-label="Demo">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
          <Tab value="c" disabled>C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    );

  it('links tabs and panels with aria-controls and skips disabled tabs', async () => {
    const user = userEvent.setup();
    renderTabs();
    const [a, b] = screen.getAllByRole('tab');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', a.id);
    await user.click(a);
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    expect(b).toHaveAttribute('aria-selected', 'false');
  });

  it('uses Up/Down when vertical', async () => {
    const user = userEvent.setup();
    renderTabs({ orientation: 'vertical' });
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await user.click(screen.getAllByRole('tab')[0]);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });

  it('only switches on Enter with manual activation', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderTabs({ activation: 'manual', onChange });
    await user.click(screen.getAllByRole('tab')[0]);
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Panel A')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith('b');
  });

  it('mirrors arrow keys in right-to-left locales', async () => {
    const user = userEvent.setup();
    render(
      <SparkProvider locale="ar-EG">
        <Tabs defaultValue="a">
          <TabList aria-label="Demo">
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      </SparkProvider>,
    );
    await user.click(screen.getAllByRole('tab')[0]);
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });
});

describe('DatePicker (React Aria)', () => {
  it('accepts typed dates in the locale order and fills the ISO form value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<DatePicker label="Start" locale="en-IN" name="start" onChange={onChange} />);
    const day = screen.getAllByRole('spinbutton')[0];
    expect(day).toHaveAttribute('aria-label', expect.stringMatching(/day/i));
    await user.click(day);
    await user.keyboard('25122026');
    const picked: Date = onChange.mock.calls.at(-1)[0];
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 11, 25]);
    expect(container.querySelector('input[name="start"]')).toHaveValue('2026-12-25');
  });

  it('opens a calendar dialog, picks a day and clears', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DatePicker label="Start" locale="en-IN" defaultValue={new Date(2026, 10, 10)} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /calendar/i }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /12 November 2026/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onChange.mock.calls.at(-1)[0].getDate()).toBe(12);
    await user.click(screen.getByRole('button', { name: 'Clear date' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});

describe('Tabs from a Server Component', () => {
  it('works when children arrive as lazy references, as with React Server Components', async () => {
    const user = userEvent.setup();
    // RSC sends client components to the browser as lazy references, so
    // element.type is not the TabList function. Simulate that here.
    const lazyOf = <P,>(C: React.ComponentType<P>) => React.lazy(async () => ({ default: C }));
    const LTabList = lazyOf(TabList), LTab = lazyOf(Tab), LPanel = lazyOf(TabPanel);
    render(
      <React.Suspense fallback={null}>
        <Tabs defaultValue="b">
          <LTabList aria-label="Lazy">
            <LTab value="a">A</LTab>
            <LTab value="b">B</LTab>
          </LTabList>
          <LPanel value="a">Panel A</LPanel>
          <LPanel value="b">Panel B</LPanel>
        </Tabs>
      </React.Suspense>,
    );
    expect(await screen.findByText('Panel B')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    await user.click(screen.getByRole('tab', { name: 'A' }));
    expect(screen.getByText('Panel A')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });
});

describe('Slider (React Aria)', () => {
  it('moves with arrow keys and Home/End, and labels the value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Slider label="Brightness" defaultValue={50} formatValue={(v) => `${v}%`} onChange={onChange} />);
    const input = screen.getByRole('slider', { name: 'Brightness' });
    act(() => input.focus());
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(51);
    expect(input).toHaveAttribute('aria-valuetext', '51%');
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(100);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('range: two named knobs that cannot cross, and onChange gets a pair', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Slider label="Price" defaultValue={[20, 30]} step={10} onChange={onChange} />);
    const [lo, hi] = screen.getAllByRole('slider');
    expect(lo).toHaveAccessibleName(/Minimum/);
    expect(hi).toHaveAccessibleName(/Maximum/);
    act(() => lo.focus());
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith([30, 30]);
    act(() => hi.focus());
    await user.keyboard('{ArrowLeft}');
    expect(hi).toHaveValue('30');
  });

  it('submits values with plain forms, for one or two names', () => {
    const { container } = render(
      <form>
        <Slider label="One" name="one" defaultValue={7} />
        <Slider label="Range" name={['from', 'to']} defaultValue={[10, 90]} />
      </form>,
    );
    const data = new FormData(container.querySelector('form')!);
    expect([data.get('one'), data.get('from'), data.get('to')]).toEqual(['7', '10', '90']);
  });

  it('works with a register-style ref, name and onChange', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const onChangeEnd = jest.fn();
    render(<Slider label="Instances" name="instances" ref={ref} min={1} max={10} defaultValue={3} onChange={onChange} onChangeEnd={onChangeEnd} />);
    expect(ref.current).toHaveAttribute('name', 'instances');
    act(() => ref.current!.focus());
    await user.keyboard('{ArrowUp}');
    expect(ref.current).toHaveValue('4');
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(onChangeEnd).toHaveBeenLastCalledWith(4);
  });
});
