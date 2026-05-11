/**
 * Shared json-toolinator feature for the built-in permissions table.
 * Used by the standalone permissions route and the settings template Permissions tab.
 */
export const prototypePermissionsTableFeature = {
  component: 'permissions' as const,
  toolName: 'Prototype Tool',
  query: ({ params }: { params: { companyId?: string } }) => ({
    url: `/rest/v1.0/companies/${params.companyId}/user_permissions`,
    mappingFn: (response: any) => (response?.data ?? response) as any,
  }),
  mutation: ({ params }: { params: { companyId?: string } }) => ({
    url: `/rest/v1.0/companies/${params.companyId}/user_permissions`,
  }),
};
