import React from 'react';
import { colors } from '@procore/core-react';
import { PlaceholderIcon, Plus } from '@procore/core-icons';

/** Matches `item_details.tsx` `Title.Assets` + `Title.Text` (PlaceholderIcon beside H1). */
const titlePlaceholderIconWrap: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.black,
  flexShrink: 0,
  lineHeight: 0,
};

/** Title row: wireframe placeholder icon + record label (Toolinator renders inside DetailPage `<H1>`). */
export const genericItemDetailPageTitle = (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
    }}
  >
    <span aria-hidden style={titlePlaceholderIconWrap}>
      <PlaceholderIcon size="md" />
    </span>
    <span>Item Name</span>
  </span>
);

export const genericItemDetailBreadcrumbs = [
  { title: 'Tool Name', view: 'home' as const },
  { title: 'Item Name' },
];

const exportMenuChildren = [{ title: 'CSV' }, { title: 'PDF' }];

/**
 * Prototype-navigation actions appended to the General tab so demo reviewers
 * can jump between related prototype shells. **Flat at the top level on
 * purpose** — Toolinator's title-actions template automatically slices after
 * the rule-of-3 and renders the rest in an overflow `DropdownFlyout`. Do NOT
 * wrap them in a single parent action with an `EllipsisVertical` icon to fake
 * a kebab menu (see `.cursor/rules/ix-actions.mdc`).
 */
const prototypeNavActionsFlat = [
  { title: 'Project Hub', view: 'hub' as const },
  { title: 'Home', view: 'home' as const },
  { title: 'New tool (prototype)', view: 'list' as const },
  { title: 'Demo item detail', view: 'genericItemDetail' as const },
];

/** Shared title action for mirage item detail → generic demo shell navigation. */
export const genericItemDetailPrototypeNavAction = prototypeNavActionsFlat[3]!;

/**
 * Title actions per tab — mirrors `item_details.tsx` `Title.Actions` branches
 * (general vs related vs emails vs history). Actions beyond the first 3 are
 * automatically collapsed into the overflow flyout by Toolinator.
 */
export const genericItemDetailHeaderActionsGeneral = [
  { title: 'Action [Item name]', variant: 'primary' as const },
  { title: 'Edit' },
  { title: 'Export', children: [...exportMenuChildren] },
  ...prototypeNavActionsFlat,
];

export const genericItemDetailHeaderActionsRelated = [
  {
    title: 'Link Related Item',
    variant: 'primary' as const,
    icon: <Plus />,
  },
];

export const genericItemDetailHeaderActionsEmails = [
  { title: 'Compose Email', variant: 'primary' as const },
  { title: 'Settings', variant: 'secondary' as const },
];

export const genericItemDetailHeaderActionsHistory = [
  {
    title: 'Export',
    variant: 'secondary' as const,
    children: [...exportMenuChildren],
  },
];

/** @alias General tab — same as `genericItemDetailHeaderActionsGeneral` */
export const genericItemDetailHeaderActions =
  genericItemDetailHeaderActionsGeneral;
