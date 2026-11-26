import { FileUpload } from '@sparkwire/core';

export default function Single() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <FileUpload label="Resume" accept=".pdf,.docx" helperText="PDF or Word" />
    </div>
  );
}
