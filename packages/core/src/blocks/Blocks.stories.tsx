import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';
import { SignIn } from './SignIn';
import { Settings } from './Settings';
import { ToastProvider } from '../Toast';

/**
 * **Blocks:** whole pages built from Spark UI components. They are not in the npm
 * package: copy one into your app and make it yours.
 *
 * ```bash
 * npx sparkwire add dashboard     # or sign-in, settings
 * npx shadcn add @sparkwire/dashboard
 * ```
 */
const meta: Meta = { title: 'Blocks', parameters: { layout: 'fullscreen' } };
export default meta;

export const DashboardPage: StoryObj = { name: 'Dashboard', render: () => <div style={{ margin: -24 }}><Dashboard /></div> };
export const SignInPage: StoryObj = {
  name: 'Sign in',
  render: () => (
    <div style={{ margin: -24 }}>
      <SignIn onSubmit={async ({ email }) => { await new Promise((r) => setTimeout(r, 900)); return email.endsWith('@example.com') ? undefined : 'That email and password don’t match an account.'; }} />
    </div>
  ),
};
export const SettingsPage: StoryObj = { name: 'Settings', render: () => <ToastProvider><Settings /></ToastProvider> };
