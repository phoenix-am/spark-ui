/** With React Hook Form: `register` works on text fields and checkboxes, and `Controller` connects inputs that hold richer values, like the dropdown and the date picker. */
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Textfield, Dropdown, DatePicker, Checkbox, Button } from '@sparkwire/core';

interface Booking {
  name: string;
  room: string;
  date: Date | null;
  breakfast: boolean;
}

export default function ReactHookForm() {
  const [result, setResult] = useState<Booking>();
  const { register, control, handleSubmit, formState: { errors } } = useForm<Booking>({
    defaultValues: { name: '', room: 'deluxe', date: null, breakfast: true },
  });
  return (
    <form onSubmit={handleSubmit(setResult)} style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <Textfield label="Guest name" error={Boolean(errors.name)} helperText={errors.name?.message} {...register('name', { required: 'Please enter a name.' })} />
      <Controller
        name="room"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Room"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'deluxe', label: 'Deluxe' },
              { value: 'suite', label: 'Suite' },
            ]}
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        rules={{ required: 'Pick a check-in date.' }}
        render={({ field, fieldState }) => (
          <DatePicker label="Check-in" value={field.value} onChange={field.onChange} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />
        )}
      />
      <Checkbox label="Include breakfast" {...register('breakfast')} />
      <Button type="submit">Book</Button>
      {result && <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
