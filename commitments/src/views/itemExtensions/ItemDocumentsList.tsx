import React, { useEffect, useState } from 'react';
import { Box } from '@procore/core-react';

export function ItemDocumentsList() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/rest/v1.0/companies/1/items/1/documents')
      .then((r) => r.json())
      .then((d) => setDocs(d.data || []));
  }, []);

  return (
    <Box style={{ padding: 16 }}>
      <h3>Documents ({docs.length})</h3>
      {docs.map((doc: any) => (
        <Box
          key={doc.id}
          style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}
        >
          <strong>{doc.filename}</strong> ({doc.version})
          <Box>
            Uploaded by: {doc.uploaded_by} | Size:{' '}
            {Math.round(doc.size_bytes / 1024)} KB
          </Box>
        </Box>
      ))}
    </Box>
  );
}
