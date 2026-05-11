import {
  bundleToPlaygroundState,
  playgroundStateToBundle,
  referenceBlueprintBundle,
} from './bundle';

describe('playground bundle round-trip', () => {
  it('playgroundStateToBundle reverses bundleToPlaygroundState', () => {
    const base = referenceBlueprintBundle();
    const patch = bundleToPlaygroundState(base);
    const built = playgroundStateToBundle(
      patch.tabsJson,
      patch.featureJson,
      base
    );
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.bundle.tabs).toEqual(base.tabs);
    expect(built.bundle.seed).toEqual(base.seed);
    expect(built.bundle.formSchema.edit).toEqual(base.formSchema.edit);
  });
});
