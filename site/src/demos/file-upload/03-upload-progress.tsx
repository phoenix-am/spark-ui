/** You run the upload: start it in `onAdd`, then report progress and status back through `files`. Here a timer stands in for your API. */
import { useState } from 'react';
import { FileUpload, type UploadFile } from '@sparkwire/core';

export default function UploadProgress() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const update = (id: string, patch: Partial<UploadFile>) => setFiles((all) => all.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <FileUpload
        label="Attachments"
        multiple
        files={files}
        onChange={setFiles}
        onAdd={(added) =>
          added.forEach((f) => {
            let progress = 0;
            const timer = setInterval(() => {
              progress += 20;
              update(f.id, progress >= 100 ? { progress: 100, status: 'done' } : { progress, status: 'uploading' });
              if (progress >= 100) clearInterval(timer);
            }, 300);
          })
        }
        onReject={(rejected) => console.log('Rejected', rejected)}
        onRemove={(f) => console.log('Removed', f.file.name)}
        maxSize={2 * 1024 * 1024}
        hint="Up to 2 MB each"
      />
    </div>
  );
}
