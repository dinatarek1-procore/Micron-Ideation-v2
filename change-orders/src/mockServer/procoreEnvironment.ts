export const environmentEndpoint =
  '/rest/v1.0/companies/:companyId/procore_environment';

export function getProcoreEnvironment(companyId: number) {
  return {
    company_id: companyId,
    company_name: 'PnT Construction Co.',
    project_id: null,
    project_name: null,
    user_id: 4906023,
    locale: 'en',
    currency_symbol: '$',
    currency_display: null,
    currency_iso_code: null,
    time_zone: 'America/Los_Angeles',
    date_format: 'mm/dd/yy',
  };
}
