import type { Meta, StoryObj } from '@storybook/react';
import { SparkProvider } from '../Provider';
import { Pagination } from '../Navigation';
import { Stepper } from '../Stepper';
import { DateRangePicker } from '../DatePicker';
import { FileUpload } from '../FileUpload';
import { Alert } from '../Alert';

/**
 * **Built-in text in your users' language.** Every label Spark UI writes itself
 * (buttons, screen-reader names, empty states, upload errors, date presets) follows
 * `SparkProvider locale`. Hindi, Gujarati and Tamil are built in next to English;
 * relative presets such as "Tomorrow" or "Last 30 days" come from the browser's own
 * `Intl` data, so they read naturally in any language.
 *
 * Override any wording, or add a language, with `messages`:
 * `<SparkProvider locale="fr" messages={{ close: 'Fermer', nextPage: 'Page suivante' }}>`.
 * Add `-u-nu-deva` (Devanagari), `-u-nu-gujr` or `-u-nu-tamldec` to the locale for native digits.
 */
const meta: Meta = { title: 'Foundations/Languages' };
export default meta;

const langs = [
  { locale: 'en-IN', name: 'English', steps: ['Cart', 'Address', 'Pay'] },
  { locale: 'hi-IN-u-nu-deva', name: 'हिन्दी', steps: ['कार्ट', 'पता', 'भुगतान'] },
  { locale: 'gu-IN-u-nu-gujr', name: 'ગુજરાતી', steps: ['કાર્ટ', 'સરનામું', 'ચુકવણી'] },
  { locale: 'ta-IN', name: 'தமிழ்', steps: ['கூடை', 'முகவரி', 'கட்டணம்'] },
];

export const SideBySide: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 16 }}>
      {langs.map(({ locale, name, steps }) => (
        <SparkProvider key={locale} locale={locale}>
          <section lang={locale.slice(0, 2)} aria-label={name} style={{ display: 'grid', gap: 16, padding: 16, borderRadius: 12, border: '1px solid var(--spark-surface-border)' }}>
            <strong>{name}</strong>
            <Stepper aria-label={`${name}: steps`} steps={steps.map((label) => ({ label }))} active={1} responsive={false} />
            <Pagination aria-label={`${name}: pages`} count={12} defaultPage={3} variant="compact" />
            <Pagination aria-label={`${name}: page numbers`} count={12} defaultPage={6} size="small" />
            <DateRangePicker label="📅" presets={['today', 'thisWeek', '-7d', '-30d', '+1m']} />
            <FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={3} />
            <Alert tone="success" onDismiss={() => {}}>✓</Alert>
          </section>
        </SparkProvider>
      ))}
    </div>
  ),
};
