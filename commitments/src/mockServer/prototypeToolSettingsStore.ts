/** Domain-neutral demo payload for the settings General form (shape only). */
export interface PrototypeToolSettings {
  settings_1: string;
  settings_2: string;
  settings_3: string;
  settings_4: string;
}

const defaults: PrototypeToolSettings = {
  settings_1: 'option_a',
  settings_2: 'Default text for settings 2.',
  settings_3: 'Default text for settings 3.',
  settings_4: 'Default text for settings 4.',
};

const byCompany = new Map<string, PrototypeToolSettings>();

function clone(s: PrototypeToolSettings): PrototypeToolSettings {
  return { ...s };
}

export function getPrototypeToolSettings(
  companyId: string
): PrototypeToolSettings {
  const existing = byCompany.get(companyId);
  if (existing) return clone(existing);
  return clone(defaults);
}

export function patchPrototypeToolSettings(
  companyId: string,
  patch: Partial<PrototypeToolSettings>
): PrototypeToolSettings {
  const next = { ...getPrototypeToolSettings(companyId), ...patch };
  byCompany.set(companyId, next);
  return clone(next);
}

export function resetPrototypeToolSettingsStore() {
  byCompany.clear();
}
