import React from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { colors } from '@procore/core-react';
import { Link, useParams } from '@tanstack/react-router';
import styled from 'styled-components';

import { GUARDRAILS } from '../../shared/guardrails';
import type { Item } from '@/mockServer/itemsStore';

export const ItemTitleLink = styled(Link)`
  color: ${colors.blue50};
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.92);
  }
`;

type CellParams = Readonly<{
  data?: { id?: number | string };
  value?: unknown;
}>;

export function listItemBasePath(companyId: string | undefined): string {
  const id = String(companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID);
  return GUARDRAILS.DEMO_ROUTE.BASE_PATH.replace('$companyId', id);
}

export function TitleCellRenderer(params: CellParams) {
  const { companyId } = useParams({ strict: false });
  const id = String(params.data?.id ?? '');
  const raw = params.value;
  const value =
    raw == null
      ? ''
      : typeof raw === 'string' || typeof raw === 'number'
        ? String(raw)
        : '';
  const base = listItemBasePath(companyId);
  return (
    <ItemTitleLink
      data-testid="item-title-link"
      to={`${base}/items/${id}`}
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </ItemTitleLink>
  );
}

/** Smart Grid / AG Grid cell: same link behavior as {@link TitleCellRenderer}. */
export function SmartGridSummaryLinkCell(
  params: CustomCellRendererProps<Item, string>
) {
  const { companyId } = useParams({ strict: false });
  const id = String(params.data?.id ?? '');
  const value =
    params.value == null
      ? ''
      : typeof params.value === 'string' || typeof params.value === 'number'
        ? String(params.value)
        : '';
  const base = listItemBasePath(companyId);
  const linkTestId =
    (params as { cellRendererParams?: { linkTestId?: string } })
      .cellRendererParams?.linkTestId ?? 'item-title-link';
  return (
    <ItemTitleLink
      data-testid={linkTestId}
      to={`${base}/items/${id}`}
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </ItemTitleLink>
  );
}
