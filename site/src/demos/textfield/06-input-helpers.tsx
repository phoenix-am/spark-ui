/** Format as people type: `formatPhoneNumber` groups digits, and `cardDetection` names the card network inside the field. */
import { Textfield } from '@sparkwire/core';

const phone = (v: string) => v.replace(/\D/g, '').slice(0, 10).replace(/(\d{5})(\d{1,5})/, '$1 $2');
const network = (v: string) => (/^4/.test(v) ? 'Visa' : /^5[1-5]/.test(v) ? 'Mastercard' : /^6/.test(v) ? 'RuPay' : '');

export default function InputHelpers() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 340 }}>
      <Textfield label="Mobile" type="tel" prepend="+91" formatPhoneNumber={phone} />
      <Textfield label="Card number" inputMode="numeric" cardDetection={network} />
    </div>
  );
}
