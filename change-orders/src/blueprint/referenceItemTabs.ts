import tabsDef from '../../blueprints/reference-scaffold/tabs.json';

/**
 * Item detail tab strip from `blueprints/reference-scaffold/tabs.json`.
 * Titles resolve at runtime via i18n using each row's `titleKey`.
 */
export const itemDetailTabs = tabsDef.map((tab) => ({
  title: ({ i18n }: { i18n: { t: (...args: unknown[]) => string } }) =>
    i18n.t(tab.titleKey),
  view: tab.view,
})) as any;
