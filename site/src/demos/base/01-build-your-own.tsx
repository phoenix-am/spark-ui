/** The building blocks behind the components. ButtonBase gives you press handling, focus rings and sparks, and you supply the look. */
import { ButtonBase } from '@sparkwire/core/base';

export default function BuildYourOwn() {
  return (
    <ButtonBase
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: 'linear-gradient(90deg, #7c3aed, #db2777)', color: '#fff', fontWeight: 600 }}
    >
      A button of your own
    </ButtonBase>
  );
}
