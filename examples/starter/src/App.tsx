import { useState } from 'react';
import {
  Badge, Button, Card, DataTable, DatePicker, Dropdown, LineChart, SparkProvider, Switch, Textfield,
  ToastProvider, ToggleGroup, ToggleGroupItem, useToast,
} from '@sparkwire/core';
import { ThemeProvider } from '@sparkwire/system';

type Energy = 'off' | 'calm' | 'default' | 'electric';

export function App() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [energy, setEnergy] = useState<Energy>('default');

  return (
    <ThemeProvider mode={mode} global>
      <SparkProvider energy={energy}>
        <ToastProvider>
          <main className="page">
            <header className="bar">
              <div>
                <h1>Sparkwire starter</h1>
                <p>Edit src/App.tsx and the page updates as you type.</p>
              </div>
              <div className="controls">
                <ToggleGroup aria-label="Energy" size="small" value={energy} onChange={(v) => v && setEnergy(v as Energy)}>
                  <ToggleGroupItem value="off">Off</ToggleGroupItem>
                  <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
                  <ToggleGroupItem value="default">Default</ToggleGroupItem>
                  <ToggleGroupItem value="electric">Electric</ToggleGroupItem>
                </ToggleGroup>
                <Switch label="Light mode" checked={mode === 'light'} onChange={(on) => setMode(on ? 'light' : 'dark')} />
              </div>
            </header>
            <div className="grid">
              <OrderForm />
              <Sales />
            </div>
            <Orders />
          </main>
        </ToastProvider>
      </SparkProvider>
    </ThemeProvider>
  );
}

function OrderForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [tried, setTried] = useState(false);
  const error = tried && name.trim() === '' ? 'Enter a name.' : undefined;

  return (
    <Card padding="large">
      <h2 className="card-title">New order</h2>
      <form
        className="stack"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (name.trim()) toast({ title: `Order placed for ${name}`, tone: 'success' });
        }}
      >
        <Textfield label="Customer name" value={name} onValueChange={setName} error={!!error} helperText={error} />
        <Dropdown
          label="Plan"
          defaultValue="pro"
          options={[
            { value: 'starter', label: 'Starter' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]}
        />
        <DatePicker label="Start date" presets={['today', 'tomorrow', '+7d']} />
        <Button type="submit">Place order</Button>
      </form>
    </Card>
  );
}

const sales = [
  { month: 'Jun', online: 18, stores: 12 },
  { month: 'Jul', online: 23, stores: 13 },
  { month: 'Aug', online: 24, stores: 15 },
  { month: 'Sep', online: 29, stores: 16 },
  { month: 'Oct', online: 30, stores: 18 },
  { month: 'Nov', online: 35, stores: 19 },
];

function Sales() {
  return (
    <Card padding="large">
      <h2 className="card-title">Sales, ₹ lakh</h2>
      <LineChart aria-label="Sales by month" data={sales} x="month" area series={[{ key: 'online', label: 'Online' }, { key: 'stores', label: 'Stores' }]} />
    </Card>
  );
}

type Order = { id: string; customer: string; amount: number; status: 'Paid' | 'Pending' | 'Refunded' };
const orders: Order[] = [
  { id: 'ORD-2041', customer: 'Aarav Shah', amount: 4999, status: 'Paid' },
  { id: 'ORD-2040', customer: 'Diya Patel', amount: 1299, status: 'Pending' },
  { id: 'ORD-2039', customer: 'Kabir Mehta', amount: 8450, status: 'Paid' },
  { id: 'ORD-2038', customer: 'Ananya Iyer', amount: 2150, status: 'Refunded' },
  { id: 'ORD-2037', customer: 'Rohan Verma', amount: 3200, status: 'Paid' },
];
const tone = { Paid: 'success', Pending: 'warning', Refunded: 'error' } as const;
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function Orders() {
  return (
    <Card padding="large">
      <h2 className="card-title">Recent orders</h2>
      <DataTable<Order>
        aria-label="Recent orders"
        searchable
        data={orders}
        getRowKey={(o) => o.id}
        columns={[
          { key: 'id', header: 'Order' },
          { key: 'customer', header: 'Customer', sortable: true },
          { key: 'amount', header: 'Amount', align: 'end', sortable: true, cell: (o) => inr.format(o.amount) },
          { key: 'status', header: 'Status', cell: (o) => <Badge tone={tone[o.status]} variant="soft" led>{o.status}</Badge> },
        ]}
      />
    </Card>
  );
}
