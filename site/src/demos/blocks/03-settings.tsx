/** A settings page with sections, a form and toasts on save. It expects a ToastProvider somewhere above it, usually at your app's root. */
import { ToastProvider } from '@sparkwire/core';
import { Settings } from '@/components/spark-ui/blocks/Settings';

export default function SettingsBlock() {
  return (
    <ToastProvider>
      <div style={{ width: '100%' }}>
        <Settings />
      </div>
    </ToastProvider>
  );
}
