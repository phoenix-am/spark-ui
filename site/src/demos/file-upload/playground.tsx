import { FileUpload } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: FileUpload, props: { label: 'Attachments', multiple: true, previews: true, hint: 'PNG or JPG, up to 5 MB' }, wrap: (n) => <div style={{ width: '100%', maxWidth: 420 }}>{n}</div> } satisfies PlaygroundConfig;
