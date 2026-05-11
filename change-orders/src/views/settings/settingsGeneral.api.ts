import {
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query';

import type { PrototypeToolSettings } from '@/mockServer/prototypeToolSettingsStore';

interface GetParams {
  companyId: string;
}

interface UpdateParams {
  companyId: string;
  body: Partial<PrototypeToolSettings>;
}

async function getPrototypeToolSettings(
  params: GetParams
): Promise<PrototypeToolSettings> {
  const res = await fetch(
    `/rest/v1.0/companies/${params.companyId}/prototype_tool_settings`
  );
  if (!res.ok) throw new Error('Failed to load prototype tool settings');
  const json = (await res.json()) as { data?: PrototypeToolSettings };
  if (!json.data) throw new Error('Invalid prototype tool settings response');
  return json.data;
}

async function updatePrototypeToolSettings(
  params: UpdateParams
): Promise<{ data: PrototypeToolSettings }> {
  const res = await fetch(
    `/rest/v1.0/companies/${params.companyId}/prototype_tool_settings`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: params.body }),
    }
  );
  if (!res.ok) throw new Error('Failed to save prototype tool settings');
  return res.json() as Promise<{ data: PrototypeToolSettings }>;
}

export function getPrototypeToolSettingsOptions(params: GetParams) {
  return queryOptions({
    enabled: Boolean(params.companyId),
    queryKey: ['prototype-tool-settings', params.companyId] as const,
    queryFn: () => getPrototypeToolSettings(params),
  });
}

export function useUpdatePrototypeToolSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePrototypeToolSettings,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries(
        getPrototypeToolSettingsOptions({ companyId: variables.companyId })
      );
    },
  });
}
