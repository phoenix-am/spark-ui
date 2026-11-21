import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm, Controller } from 'react-hook-form';
import { Textfield } from '../Textfield';
import { Checkbox } from '../Checkbox';
import { Switch } from '../Switch';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { RadioGroup } from '../RadioGroup';
import { Slider } from '../Slider';
import { Button } from '../Button';
import { Field } from '../Field';

/** Every input submits with a plain `<form>` and works with React Hook Form. */
const meta: Meta = { title: 'Foundations/Forms' };
export default meta;

const plans = [
  { value: 'spark', label: 'Spark' },
  { value: 'surge', label: 'Surge' },
];
const regions = [
  { value: 'mum', label: 'Mumbai' },
  { value: 'sgp', label: 'Singapore' },
];

/** No JavaScript form library: values come straight from FormData. */
export const NativeFormData: StoryObj = {
  render: function Render() {
    const [sent, setSent] = useState<Record<string, string> | null>(null);
    return (
      <form
        style={{ maxWidth: 440 }}
        onSubmit={(e) => {
          e.preventDefault();
          setSent(Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>);
        }}
      >
        <Textfield label="Project name" name="project" defaultValue="spark-app" />
        <Select label="Region" name="region" options={regions} defaultValue="mum" />
        <DatePicker label="Launch date" name="launch" />
        <RadioGroup label="Plan" name="plan" options={plans} defaultValue="spark" />
        <div style={{ height: 12 }} />
        <Slider label="Instances" name="instances" min={1} max={10} defaultValue={3} />
        <div style={{ display: 'grid', gap: 10, margin: '16px 0' }}>
          <Switch label="Auto-deploy" name="autodeploy" defaultChecked />
          <Checkbox label="Send me updates" name="updates" />
        </div>
        <Field label="Notes">
          <textarea name="notes" />
        </Field>
        <Button type="submit">Create project</Button>
        {sent && (
          <pre style={{ marginTop: 16, padding: 12, background: 'var(--spark-surface-raised)', borderRadius: 6, fontSize: 13 }}>
            {JSON.stringify(sent, null, 2)}
          </pre>
        )}
      </form>
    );
  },
};

type Values = { email: string; password: string; region: string; start: Date | null; terms: boolean };

/** `register` for native inputs, `Controller` for the rest; errors flow into each field. */
export const ReactHookForm: StoryObj = {
  render: function Render() {
    const { register, control, handleSubmit, reset, formState } = useForm<Values>({
      defaultValues: { email: '', password: '', region: '', start: null, terms: false },
    });
    const [sent, setSent] = useState<string | null>(null);
    return (
      <form style={{ maxWidth: 440 }} onSubmit={handleSubmit((v) => setSent(JSON.stringify(v, null, 2)))}>
        <Textfield
          label="Email"
          {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+/, message: 'Enter a valid email' } })}
          error={!!formState.errors.email}
          helperText={formState.errors.email?.message}
        />
        <Textfield
          label="Password"
          type="password"
          charge={(v) => v.length / 8}
          {...register('password', { minLength: { value: 8, message: 'Use 8 or more characters' } })}
          error={!!formState.errors.password}
          helperText={formState.errors.password?.message}
        />
        <Controller
          name="region"
          control={control}
          rules={{ required: 'Pick a region' }}
          render={({ field, fieldState }) => (
            <Select label="Region" options={regions} value={field.value || null} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          name="start"
          control={control}
          render={({ field }) => <DatePicker label="Start date" value={field.value} onChange={field.onChange} />}
        />
        <Checkbox label="I accept the terms" {...register('terms', { required: 'Required' })} error={!!formState.errors.terms} helperText={formState.errors.terms?.message} />
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <Button type="submit">Submit</Button>
          <Button variant="text" onClick={() => reset()}>Reset</Button>
        </div>
        {sent && <pre style={{ marginTop: 16, padding: 12, background: 'var(--spark-surface-raised)', borderRadius: 6, fontSize: 13 }}>{sent}</pre>}
      </form>
    );
  },
};
