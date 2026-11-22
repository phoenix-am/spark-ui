import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload, UploadFile } from '.';

/** Drop zone plus file list. Checks type, size and count; you run the upload in `onAdd` and feed progress back via `files`. */
const meta: Meta<typeof FileUpload> = {
  title: 'Inputs/FileUpload',
  component: FileUpload,
  decorators: [(S) => <div style={{ maxWidth: 520 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

const mk = (name: string, size: number, type: string) => new File([new Uint8Array(Math.min(size, 64))], name, { type });
const sample: UploadFile[] = [
  { id: 'a', file: Object.defineProperty(mk('invoice-oct.pdf', 0, 'application/pdf'), 'size', { value: 248_000 }), status: 'done' },
  { id: 'b', file: Object.defineProperty(mk('team-photo.jpg', 0, 'image/jpeg'), 'size', { value: 3_400_000 }), status: 'uploading', progress: 62 },
  { id: 'c', file: Object.defineProperty(mk('budget-2027.xlsx', 0, 'application/vnd.ms-excel'), 'size', { value: 92_000 }), status: 'error', error: 'Network error. Try again.' },
];
export const Basic: Story = { args: { label: 'Attachments', accept: 'image/*,.pdf', maxSize: 5 * 1024 * 1024, maxFiles: 5 } };
export const WithFiles: Story = { args: { label: 'Attachments', defaultFiles: sample } };

/** Simulated upload: progress ticks up after you add files. */
export const SimulatedUpload: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const tick = (ids: string[]) => {
      const t = setInterval(() => {
        setFiles((fs) => {
          const next = fs.map((f) => (ids.includes(f.id) && f.status !== 'done' ? { ...f, status: (f.progress ?? 0) >= 90 ? 'done' : 'uploading', progress: Math.min(100, (f.progress ?? 0) + 15) } as UploadFile : f));
          if (next.filter((f) => ids.includes(f.id)).every((f) => f.status === 'done')) clearInterval(t);
          return next;
        });
      }, 300);
    };
    return <FileUpload label="Photos" accept="image/*" files={files} onChange={setFiles} onAdd={(added) => tick(added.map((a) => a.id))} />;
  },
};
export const SingleFile: Story = { args: { label: 'Resume', accept: '.pdf,.docx', multiple: false, maxSize: 2 * 1024 * 1024 } };
