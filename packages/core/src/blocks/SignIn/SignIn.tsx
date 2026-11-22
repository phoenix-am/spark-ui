import React, { useState } from 'react';
import { Card } from '../../Card';
import { Textfield } from '../../Textfield';
import { Checkbox } from '../../Checkbox';
import { Button } from '../../Button';
import { Alert } from '../../Alert';

export interface SignInProps {
  /** Return an error message to show it, or nothing on success. */
  onSubmit?: (values: { email: string; password: string; remember: boolean }) => Promise<string | void> | string | void;
  /** Shown above the form. */
  brand?: React.ReactNode;
}

/**
 * Sign-in block: email and password with validation, "remember me", a
 * submit button that shows progress, an error alert, and links to reset
 * the password or sign up. Works as a plain form too (`name` on every
 * field), so server actions can read it. Copy with `npx sparkwire add sign-in`.
 */
export function SignIn({ onSubmit, brand = <strong className="sp-block-brand">Sparkwire</strong> }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailError = touched && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : undefined;
  const passwordError = touched && password.length < 8 ? 'Use at least 8 characters.' : undefined;

  return (
    <div className="sp-block-auth">
      <Card padding="large" className="sp-block-auth__card">
        <form
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            setTouched(true);
            if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return;
            setBusy(true);
            setError(null);
            const result = await onSubmit?.({ email, password, remember });
            setBusy(false);
            if (typeof result === 'string') setError(result);
          }}
        >
          <div className="sp-block-auth__head">
            {brand}
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard.</p>
          </div>
          {error && (
            <Alert tone="error" onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}
          <Textfield label="Email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={!!emailError} helperText={emailError} />
          <Textfield label="Password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} error={!!passwordError} helperText={passwordError} />
          <div className="sp-block-auth__row">
            <Checkbox label="Remember me" name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <a href="#reset" className="sp-block-link">Forgot password?</a>
          </div>
          <Button type="submit" fullWidth disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className="sp-block-auth__foot">
            New here? <a href="#signup" className="sp-block-link">Create an account</a>
          </p>
        </form>
      </Card>
    </div>
  );
}
