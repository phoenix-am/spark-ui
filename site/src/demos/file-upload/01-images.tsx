/** Drop files or browse. Size and type limits are checked as files arrive, with a clear reason when one is turned away. */
import { FileUpload } from '@sparkwire/core';

export default function Images() {
  return (
    <div style={{ width: 420 }}>
      <FileUpload label="Screenshots" accept="image/*" multiple maxFiles={4} maxSize={5 * 1024 * 1024} previews hint="Up to 4 images, 5 MB each" />
    </div>
  );
}
