import React from 'react';
import { render, screen, within, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Switch, Select, Modal, Tabs, TabList, Tab, TabPanel, Textfield, Field, SparkProvider, Calendar, DatePicker, Tooltip, Slider, Dropdown, Combobox, Menu, LineChart, BarChart, DonutChart, Sparkline, Textarea, Alert, Breadcrumbs, Pagination, paginationRange, TimePicker, parseTime, ToggleGroup, Stepper, FileUpload, formatBytes, Spark, readEnergy, haptic, builtInMessages } from '..';

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

describe('Dropdown (base: Popover + ListBox)', () => {
  it('is the same component as Select', () => {
    expect(Select).toBe(Dropdown);
  });

  it('shows group headings, returns numbers as numbers, and submits through the hidden select', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(
      <form>
        <Dropdown
          label="Replicas"
          name="replicas"
          onChange={onChange}
          options={[{ label: 'Small', options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }] }, { label: 'Large', options: [{ value: 8, label: 'Eight' }] }]}
        />
      </form>,
    );
    await user.click(screen.getByRole('button', { name: /Replicas/ }));
    const list = await screen.findByRole('listbox');
    expect(within(list).getByRole('group', { name: 'Large' })).toBeInTheDocument();
    await user.click(within(list).getByRole('option', { name: 'Eight' }));
    expect(onChange).toHaveBeenLastCalledWith(8);
    expect(new FormData(container.querySelector('form')!).get('replicas')).toBe('8');
  });

  it('keeps the old Dropdown props working (error + helperText, prependIcon)', () => {
    render(<Dropdown label="Region" error helperText="Choose a region" prependIcon={<svg data-testid="icon" />} options={[{ value: 'a', label: 'A' }]} />);
    expect(screen.getByText('Choose a region')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Region/ })).toHaveAttribute('aria-describedby');
  });
});

describe('Combobox', () => {
  const cities = ['Amreli', 'Mumbai', 'Pune', 'São Paulo'].map((c) => ({ value: c.toLowerCase(), label: c }));

  it('filters ignoring case and accents, and picks with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<Combobox label="City" name="city" options={cities} onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'City' });
    await user.type(input, 'sao');
    const list = await screen.findByRole('listbox');
    expect(within(list).getAllByRole('option').map((o) => o.textContent)).toEqual(['São Paulo']);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('são paulo');
    expect(input).toHaveValue('São Paulo');
    expect(container.querySelector('input[name="city"]')).toHaveValue('são paulo');
  });

  it('shows the empty state and clears', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Combobox label="City" options={cities} defaultValue="pune" onChange={onChange} emptyState="Nothing here" />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Pune');
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenLastCalledWith(null);
    await user.type(input, 'zzz');
    expect(await screen.findByText('Nothing here')).toBeInTheDocument();
  });

  it('allows custom values', async () => {
    const user = userEvent.setup();
    const { container } = render(<Combobox label="Tag" name="tag" allowsCustomValue options={cities} />);
    await user.type(screen.getByRole('combobox'), 'brand-new');
    await user.tab();
    expect(container.querySelector('input[name="tag"]')).toHaveValue('brand-new');
  });
});

describe('Menu', () => {
  const items = [
    { key: 'edit', label: 'Edit', shortcut: '⌘E' },
    { key: 'archive', label: 'Archive', disabled: true },
    { key: 'share', label: 'Share', items: [{ key: 'email', label: 'Email' }, { key: 'copy', label: 'Copy link' }] },
    { key: 'delete', label: 'Delete', danger: true },
  ];

  it('opens from the trigger, skips disabled items, runs an action and returns focus', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    render(<Menu label="Actions" items={items} onAction={onAction} />);
    const trigger = screen.getByRole('button', { name: /Actions/ });
    act(() => trigger.focus());
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu', { name: 'Actions' });
    expect(within(menu).getByRole('menuitem', { name: /Archive/ })).toHaveAttribute('aria-disabled', 'true');
    expect(document.activeElement).toHaveTextContent('Edit');
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenLastCalledWith('delete');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('opens a submenu with the right arrow and runs its action', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    render(<Menu label="Actions" items={items} onAction={onAction} />);
    await user.click(screen.getByRole('button', { name: /Actions/ }));
    const share = await screen.findByRole('menuitem', { name: /Share/ });
    expect(share).toHaveAttribute('aria-haspopup', 'menu');
    act(() => share.focus());
    await user.keyboard('{ArrowRight}');
    const menus = await screen.findAllByRole('menu');
    expect(menus).toHaveLength(2);
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Email'));
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenLastCalledWith('copy');
  });

  it('supports multiple checkable items', async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    render(<Menu label="Columns" selectionMode="multiple" defaultSelectedKeys={['a']} onSelectionChange={onSelectionChange} items={[{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }]} />);
    await user.click(screen.getByRole('button', { name: /Columns/ }));
    const b = await screen.findByRole('menuitemcheckbox', { name: 'B' });
    await user.click(b);
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['a', 'b']));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

describe('headless hooks', () => {
  const { useSwitch, useSlider, useDatePicker } = jest.requireActual('../headless');

  it('useSwitch: role, keyboard toggle and data-state', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    function Demo() {
      const ref = React.useRef<HTMLInputElement>(null);
      const { inputProps, dataProps } = useSwitch({ 'aria-label': 'Wifi', onChange }, ref);
      return <label {...dataProps} data-testid="root"><input {...inputProps} ref={ref} /></label>;
    }
    render(<Demo />);
    act(() => screen.getByRole('switch').focus());
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByTestId('root')).toHaveAttribute('data-state', 'on');
  });

  it('useSlider: range values and CSS variables', () => {
    let result: { value: number[]; cssVars: Record<string, number> } | undefined;
    function Demo() {
      const trackRef = React.useRef<HTMLDivElement>(null);
      result = useSlider({ 'aria-label': 'Price', defaultValue: [20, 60] }, trackRef);
      return <div ref={trackRef} />;
    }
    render(<Demo />);
    expect(result!.value).toEqual([20, 60]);
    expect(result!.cssVars).toEqual({ '--sp-start': 20, '--sp-end': 60, '--sp-pct': 60 });
  });

  it('useDatePicker: Date in, Date and ISO out', () => {
    let result: { value: Date | null; isoValue: string } | undefined;
    function Demo() {
      const ref = React.useRef<HTMLDivElement>(null);
      result = useDatePicker({ 'aria-label': 'Start', defaultValue: new Date(2026, 11, 25) }, ref);
      return <div ref={ref} />;
    }
    render(<Demo />);
    expect(result!.isoValue).toBe('2026-12-25');
    expect(result!.value!.getDate()).toBe(25);
  });
});

describe('DataTable', () => {
  const { DataTable, useDataTable } = jest.requireActual('..');
  const rows = [
    { id: 'a', name: 'Éclair', qty: 10 },
    { id: 'b', name: 'apple', qty: 9 },
    { id: 'c', name: 'Banana', qty: 100 },
  ];
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'qty', header: 'Qty', sortable: true },
  ];
  const names = () => screen.getAllByRole('row').slice(1).map((r: HTMLElement) => within(r).getByRole('rowheader').textContent);

  it('renders an accessible grid from divs and sorts asc → desc → off', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Fruit" data={rows} columns={columns} pageSize={0} />);
    const grid = screen.getByRole('grid', { name: 'Fruit' });
    expect(grid.tagName).toBe('DIV');
    const header = screen.getByRole('columnheader', { name: /Name/ });
    await user.click(header);
    expect(names()).toEqual(['apple', 'Banana', 'Éclair']); // locale order, accent-insensitive
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    await user.click(header);
    expect(names()).toEqual(['Éclair', 'Banana', 'apple']);
    await user.click(header);
    expect(names()).toEqual(['Éclair', 'apple', 'Banana']);
  });

  it('sorts numbers numerically and searches ignoring accents', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Fruit" data={rows} columns={columns} pageSize={0} searchable />);
    await user.click(screen.getByRole('columnheader', { name: /Qty/ }));
    expect(names()).toEqual(['apple', 'Éclair', 'Banana']);
    await user.type(screen.getByRole('searchbox'), 'ecl');
    expect(names()).toEqual(['Éclair']);
  });

  it('pages, selects across the page and reports the selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    const many = Array.from({ length: 12 }, (_, i) => ({ id: `r${i}`, name: `Row ${i + 1}`, qty: i }));
    render(<DataTable aria-label="Rows" data={many} columns={columns} selectionMode="multiple" pageSize={5} onSelectionChange={onSelectionChange} pageSizeOptions={[]} />);
    expect(screen.getByText('1–5 of 12')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /Select All/i }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['r0', 'r1', 'r2', 'r3', 'r4']));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('6–10 of 12')).toBeInTheDocument();
    const rowsOnPage2 = screen.getAllByRole('row').slice(1);
    await user.click(within(rowsOnPage2[0]).getByRole('checkbox'));
    expect(onSelectionChange.mock.calls.at(-1)[0].size).toBe(6);
  });

  it('shows the empty state', () => {
    render(<DataTable aria-label="Nothing" data={[]} columns={columns} emptyState="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('useDataTable works headless with multi-column sort', () => {
    let t: ReturnType<typeof useDataTable>;
    function Demo() {
      t = useDataTable({ data: [{ g: 'x', n: 2 }, { g: 'y', n: 1 }, { g: 'x', n: 1 }], columns: [{ key: 'g', header: 'G' }, { key: 'n', header: 'N' }], defaultSort: [{ column: 'g', direction: 'ascending' }, { column: 'n', direction: 'ascending' }], pageSize: 0 });
      return null;
    }
    render(<Demo />);
    expect(t!.rows.map((r: { row: { g: string; n: number } }) => `${r.row.g}${r.row.n}`)).toEqual(['x1', 'x2', 'y1']);
  });
});

describe('Calendar presets and date rules', () => {
  const { Calendar, DateRangePicker, RangeCalendar } = jest.requireActual('..');
  const day = (n: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };

  it('shows presets as buttons, picks with them and marks the active one', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Calendar locale="en-IN" presets={['today', 'tomorrow', '+7d']} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'In 7 days' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tomorrow' }));
    expect(onChange.mock.calls.at(-1)[0].toDateString()).toBe(day(1).toDateString());
    expect(screen.getByRole('button', { name: 'Tomorrow' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables presets that land on a disabled date, and honours enabledDates', () => {
    render(<Calendar locale="en-IN" presets={['today', 'tomorrow']} disabledDates={[day(1)]} />);
    expect(screen.getByRole('button', { name: 'Tomorrow' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Today' })).toBeEnabled();
  });

  it('only allows enabledDates', () => {
    const allowed = day(2);
    render(<Calendar locale="en-IN" enabledDates={[allowed]} showToday={false} />);
    const cells = screen.getAllByRole('button').filter((b: HTMLElement) => b.className.includes('sp-calendar__day'));
    const enabled = cells.filter((b: HTMLElement) => b.getAttribute('aria-disabled') !== 'true' && !b.hasAttribute('data-unavailable') && !b.hasAttribute('data-outside'));
    expect(enabled.map((b: HTMLElement) => b.textContent)).toEqual([String(allowed.getDate())]);
  });

  it('RangeCalendar: a range preset selects start and end and lights the range', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(<RangeCalendar aria-label="Trip" locale="en-IN" presets={['+7d']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Next 7 days' }));
    const r = onChange.mock.calls.at(-1)[0];
    expect([r.start.toDateString(), r.end.toDateString()]).toEqual([day(0).toDateString(), day(6).toDateString()]);
    expect(container.querySelector('[data-range-start]')).toBeInTheDocument();
  });

  it('DateRangePicker: typed range fills the hidden inputs', async () => {
    const user = userEvent.setup();
    const { container } = render(<DateRangePicker label="Stay" locale="en-IN" name="stay" startName="in" endName="out" />);
    const segments = screen.getAllByRole('spinbutton');
    await user.click(segments[0]);
    await user.keyboard('01122026');
    await user.click(segments[3]);
    await user.keyboard('05122026');
    expect(container.querySelector('input[name="in"]')).toHaveValue('2026-12-01');
    expect(container.querySelector('input[name="out"]')).toHaveValue('2026-12-05');
    expect(container.querySelector('input[name="stay"]')).toHaveValue('2026-12-01/2026-12-05');
  });
});

describe('CommandPalette', () => {
  const { CommandPalette } = jest.requireActual('..');
  const run = jest.fn();
  const items = [
    { heading: 'Pages', items: [{ id: 'home', label: 'Home' }, { id: 'settings', label: 'Settings', keywords: ['preferences'], onSelect: run }] },
    { heading: 'Actions', items: [{ id: 'export', label: 'Export', disabled: true }, { id: 'cafe', label: 'Café menu' }] },
  ];

  it('opens with the hotkey, filters by label, keyword and accents, and runs with Enter', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<CommandPalette items={items} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.keyboard('{Control>}k{/Control}');
    const input = await screen.findByRole('combobox', { name: 'Search commands' });
    expect(input).toHaveFocus();
    await user.type(input, 'prefer');
    expect(screen.getAllByRole('option').map((o: HTMLElement) => o.textContent)).toEqual(['Settings']);
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option').id);
    await user.keyboard('{Enter}');
    expect(run).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('skips disabled commands with the arrows and matches without accents', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<CommandPalette items={items} defaultOpen onSelect={onSelect} />);
    const input = await screen.findByRole('combobox');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Café menu');
    await user.clear(input);
    await user.type(input, 'cafe');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'cafe' }));
  });

  it('shows the empty state', async () => {
    const user = userEvent.setup();
    render(<CommandPalette items={items} defaultOpen emptyState="Nothing found" />);
    await user.type(await screen.findByRole('combobox'), 'zzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });
});

describe('Drawer', () => {
  const { Drawer } = jest.requireActual('..');
  it('is a labelled dialog that traps focus, closes on Escape and the close button', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose} title="Filters" description="Narrow down" placement="start">
        <button>Inside</button>
      </Drawer>,
    );
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveAttribute('data-placement', 'start');
    expect(dialog).toHaveAccessibleDescription('Narrow down');
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('Sidebar', () => {
  const { Sidebar } = jest.requireActual('..');
  const items = [
    { id: 'home', label: 'Home', href: '#home' },
    { heading: 'Work', items: [{ id: 'projects', label: 'Projects', items: [{ id: 'web', label: 'Website' }, { id: 'app', label: 'App' }] }, { id: 'old', label: 'Old', disabled: true }] },
  ];

  it('is a labelled nav with the active link marked as the current page and its group open', () => {
    render(<Sidebar items={items} defaultValue="web" mobileBreakpoint={0} />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Website' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Projects/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Old' })).toBeDisabled();
  });

  it('selects items, toggles groups and collapses to a rail', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onCollapsedChange = jest.fn();
    render(<Sidebar items={items} onChange={onChange} onCollapsedChange={onCollapsedChange} mobileBreakpoint={0} />);
    const group = screen.getByRole('button', { name: /Projects/ });
    expect(group).toHaveAttribute('aria-expanded', 'false');
    await user.click(group);
    await user.click(screen.getByRole('button', { name: 'App' }));
    expect(onChange).toHaveBeenLastCalledWith('app');
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});

describe('NumberField', () => {
  const { NumberField } = jest.requireActual('..');
  it('formats Indian rupees, steps with buttons and keys, clamps, and submits the plain number', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { container } = render(
      <SparkProvider locale="en-IN">
        <NumberField label="Budget" name="budget" defaultValue={100000} step={1000} max={102000} formatOptions={{ style: 'currency', currency: 'INR', maximumFractionDigits: 0 }} onChange={onChange} />
      </SparkProvider>,
    );
    const input = screen.getByRole('textbox', { name: 'Budget' });
    expect(input).toHaveValue('₹1,00,000');
    await user.click(screen.getByRole('button', { name: /Increase/i }));
    expect(onChange).toHaveBeenLastCalledWith(101000);
    act(() => input.focus());
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(102000);
    expect(screen.getByRole('button', { name: /Increase/i })).toBeDisabled();
    expect(container.querySelector('input[name="budget"]')).toHaveValue('102000');
  });
});

describe('Charts', () => {
  const data = [{ m: 'Jan', a: 10, b: 4 }, { m: 'Feb', a: 20, b: 6 }, { m: 'Mar', a: 15, b: 9 }];
  const series = [{ key: 'a' as const, label: 'Alpha' }, { key: 'b' as const, label: 'Beta' }];

  it('LineChart: keyboard shows a tooltip; legend hides a series; table view lists rows', async () => {
    const user = userEvent.setup();
    render(<LineChart title="Trend" data={data} x="m" series={series} />);
    const plot = screen.getByRole('img', { name: /Trend: Alpha, Beta/ });
    plot.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('status')).toHaveTextContent(/Jan.*Alpha.*10|Jan.*Beta.*4/);
    await user.click(screen.getByRole('button', { name: 'Beta' }));
    expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('img', { name: /Trend: Alpha$/ })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('BarChart: stacked tooltip shows the total', async () => {
    const user = userEvent.setup();
    render(<BarChart title="Bars" data={data} x="m" series={series} stacked />);
    screen.getByRole('img', { name: /Bars/ }).focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('status')).toHaveTextContent('Feb · 26');
  });

  it('DonutChart: slices are focusable with value and share', async () => {
    render(<DonutChart title="Share" data={[{ label: 'A', value: 75 }, { label: 'B', value: 25 }]} />);
    expect(screen.getByRole('img', { name: 'A: 75, 75%' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('img', { name: 'B: 25, 25%' })).toBeInTheDocument();
  });

  it('Sparkline: names its range', () => {
    render(<Sparkline aria-label="Visits" data={[3, 9, 5]} />);
    expect(screen.getByRole('img', { name: 'Visits: from 3 to 5, low 3, high 9' })).toBeInTheDocument();
  });
});

describe('Small components', () => {
  it('Textarea: counts characters and links help text', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Bio" maxLength={10} showCount helperText="Short" />);
    const box = screen.getByLabelText('Bio');
    await user.type(box, 'hello');
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
    expect(box.getAttribute('aria-describedby')).toContain('helper');
  });
  it('Alert: errors are announced; dismiss hides it', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(<Alert tone="error" title="Failed" onDismiss={onDismiss} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(onDismiss).toHaveBeenCalled();
  });
  it('Breadcrumbs: last item is the current page; collapses', () => {
    render(<Breadcrumbs items={[{ label: 'A', href: '/a' }, { label: 'B', href: '/b' }, { label: 'C', href: '/c' }, { label: 'D' }]} maxItems={3} />);
    expect(screen.getByText('D')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.getByLabelText('2 more')).toBeInTheDocument();
  });
  it('Pagination: range with ellipses; next moves the page', async () => {
    expect(paginationRange(6, 20)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 20]);
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(paginationRange(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Pagination count={5} defaultPage={1} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('TimePicker', () => {
  it('parses times', () => {
    expect(parseTime('9:05')?.toString()).toBe('09:05:00');
    expect(parseTime('25:00')).toBeNull();
  });
  it('picks a suggestion from the list and respects blocked slots', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TimePicker label="Start" hourCycle={24} min="09:00" max="11:00" step={30} isTimeDisabled={(t) => t === '10:00'} onChange={onChange} name="start" />);
    await user.click(screen.getByRole('button', { name: 'Show times' }));
    const opts = screen.getAllByRole('option');
    expect(opts.map((o) => o.textContent)).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00']);
    expect(opts[2]).toHaveAttribute('aria-disabled', 'true');
    await user.click(opts[3]);
    expect(onChange).toHaveBeenLastCalledWith('10:30');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.querySelector('input[name="start"]')).toHaveValue('10:30');
  });
});

describe('ToggleGroup, Stepper, FileUpload', () => {
  it('ToggleGroup single: arrow keys move focus, click selects', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <ToggleGroup aria-label="Range" defaultValue="a" onChange={onChange}>
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      </ToggleGroup>,
    );
    const [a, b] = screen.getAllByRole('radio');
    expect(a).toHaveAttribute('aria-checked', 'true');
    await user.click(b);
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(b).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(a).toHaveFocus();
  });
  it('ToggleGroup multiple returns arrays', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <ToggleGroup aria-label="Style" selectionMode="multiple" onChange={onChange}>
        <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'B' }));
    await user.click(screen.getByRole('button', { name: 'I' }));
    expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    expect(screen.getByRole('button', { name: 'I' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('Stepper marks the current step and lets you go back', async () => {
    const user = userEvent.setup();
    const onStepClick = jest.fn();
    render(<Stepper steps={[{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]} active={1} onStepClick={onStepClick} />);
    expect(screen.getByText('Two', { selector: '.sp-stepper__label' }).closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /One/ }));
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
  it('FileUpload accepts, rejects and removes files', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onAdd = jest.fn();
    const { container } = render(<FileUpload label="Docs" accept=".pdf" maxSize={1000} onAdd={onAdd} />);
    const input = container.querySelector('input[type=file]') as HTMLInputElement;
    const ok = new File(['x'], 'a.pdf', { type: 'application/pdf' });
    const wrong = new File(['x'], 'b.png', { type: 'image/png' });
    const big = new File([new Uint8Array(2000)], 'c.pdf', { type: 'application/pdf' });
    await user.upload(input, [ok, wrong, big]);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0]).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent(/b\.png.*type.*c\.pdf.*larger than 1000 B/);
    expect(screen.getByText('a.pdf')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(screen.queryByText('a.pdf')).toBeNull();
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});

describe('Energy dial', () => {
  it('SparkProvider sets the attribute and readEnergy finds it', () => {
    render(
      <SparkProvider energy="calm" haptics>
        <span data-testid="inside">x</span>
      </SparkProvider>,
    );
    const el = screen.getByTestId('inside');
    expect(el.closest('[data-spark-energy]')).toHaveAttribute('data-spark-energy', 'calm');
    expect(readEnergy(el)).toBe('calm');
    expect(readEnergy(document.body)).toBe('default');
  });

  it('bursts scale with energy and are skipped when off', () => {
    const counts: Record<string, number> = {};
    for (const e of ['off', 'calm', 'default', 'electric'] as const) {
      const ref = React.createRef<{ burst: () => void }>();
      const { container, unmount } = render(
        <SparkProvider energy={e}>
          <Spark ref={ref} count={10} />
        </SparkProvider>,
      );
      act(() => ref.current!.burst());
      counts[e] = container.querySelectorAll('.sp-spark__particle').length;
      unmount();
    }
    expect(counts).toEqual({ off: 0, calm: 4, default: 10, electric: 18 });
  });

  it('haptics vibrate only when switched on and energy is not off', () => {
    const vibrate = jest.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });
    const { rerender } = render(<SparkProvider energy="default"><i data-testid="t" /></SparkProvider>);
    expect(haptic('toggle', screen.getByTestId('t'))).toBe(false);
    rerender(<SparkProvider energy="default" haptics><i data-testid="t" /></SparkProvider>);
    haptic('toggle', screen.getByTestId('t'));
    expect(vibrate).toHaveBeenCalledWith(10);
    vibrate.mockClear();
    rerender(<SparkProvider energy="off" haptics><i data-testid="t" /></SparkProvider>);
    expect(haptic('toggle', screen.getByTestId('t'))).toBe(false);
    expect(vibrate).not.toHaveBeenCalled();
  });
});

describe('Built-in text follows the locale', () => {
  it('Pagination and Stepper speak Hindi, with Devanagari digits on request', () => {
    render(
      <SparkProvider locale="hi-IN-u-nu-deva">
        <Pagination count={5} defaultPage={2} />
        <Stepper steps={[{ label: 'क' }, { label: 'ख' }]} active={0} />
      </SparkProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'पेज नेविगेशन' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'अगला पेज' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'पेज २' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('navigation', { name: 'प्रगति' })).toHaveTextContent('चरण १ / २');
  });

  it('FileUpload errors in Gujarati; overrides win', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { container } = render(
      <SparkProvider locale="gu-IN" messages={{ browse: 'ફાઇલ પસંદ કરો' }}>
        <FileUpload accept=".pdf" />
      </SparkProvider>,
    );
    expect(screen.getByText('ફાઇલ પસંદ કરો')).toBeInTheDocument();
    await user.upload(container.querySelector('input[type=file]') as HTMLInputElement, new File(['x'], 'a.png', { type: 'image/png' }));
    expect(screen.getByRole('alert')).toHaveTextContent('a.png: આ પ્રકારની ફાઇલ સ્વીકાર્ય નથી.');
  });

  it('every language defines every key', () => {
    const keys = Object.keys(builtInMessages.en).sort();
    for (const [lang, table] of Object.entries(builtInMessages)) expect([lang, Object.keys(table).sort()]).toEqual([lang, keys]);
  });
});
