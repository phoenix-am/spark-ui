/** Four tones for four kinds of news. Errors are announced straight away; the rest wait their turn. */
import { Alert } from '@sparkwire/core';

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 520 }}>
      <Alert tone="info" title="Heads up">Maintenance is planned for Sunday at 2 am.</Alert>
      <Alert tone="success" title="Payment received">Your invoice has been paid.</Alert>
      <Alert tone="warning" title="Almost out of storage">You've used 92% of your plan.</Alert>
      <Alert tone="error" title="Deploy failed">The build step exited with code 1.</Alert>
    </div>
  );
}
