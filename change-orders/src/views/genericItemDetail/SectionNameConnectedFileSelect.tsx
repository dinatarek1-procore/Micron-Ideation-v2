import React from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { ConnectedFileSelect, sourceTypes } from '@procore/labs-file-select';

type RouteParams = {
  companyId?: string | number;
  projectId?: string | number;
};

/** `ConnectedFileSelect` is typed with a `Pick<>` ref surface where TS treats many HTML props as required; runtime props are fine. */
const LabsConnectedFileSelect = ConnectedFileSelect as any;

/** Same reference every render — inline `[]` retriggers FileSelect's initialValues sync effect and can close the attacher modal immediately. */
const STABLE_EMPTY_INITIAL_VALUES: unknown[] = [];

const STABLE_GENERIC_ITEM_SOURCES = [sourceTypes.LOCAL, sourceTypes.DOCUMENTS];

/**
 * Connected file select inside the Section Name placeholder — local uploads + project Documents
 * (see `@procore/labs-file-select` README; Documents uses Mirage / built-in mock when not pointed at staging).
 */
export function SectionNameConnectedFileSelect() {
  const { params } = useViewContext({ strict: false });
  const p = params as RouteParams;
  const companyId = String(p.companyId ?? '1');
  const projectId = Number(p.projectId ?? '1');

  return (
    <LabsConnectedFileSelect
      company={{ id: Number(companyId), name: 'Prototype company' }}
      project={{ id: projectId, name: 'Prototype project' }}
      consumerId="PrototypeTool:GenericItem"
      environment="development"
      initialValues={STABLE_EMPTY_INITIAL_VALUES}
      sources={STABLE_GENERIC_ITEM_SOURCES}
    />
  );
}
