export function getPermissionsManifest() {
  return {
    tools: [
      { id: 999, name: 'tool', access_level: 4 },
      { id: 1, name: 'dashboard', access_level: 4 },
      { id: 2, name: 'directory', access_level: 4 },
      { id: 3, name: 'drawings', access_level: 4 },
      { id: 4, name: 'documents', access_level: 4 },
      { id: 5, name: 'rfis', access_level: 4 },
      { id: 6, name: 'submittals', access_level: 4 },
    ],
  };
}
