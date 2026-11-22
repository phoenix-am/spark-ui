import { FileUpload } from '@sparkwire/core';

export default function Single() {
  return (
    <div style={{ width: 420 }}>
      <FileUpload label="Resume" accept=".pdf,.docx" hint="PDF or Word" />
    </div>
  );
}
