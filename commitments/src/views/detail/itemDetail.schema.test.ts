/**
 * @jest-environment jsdom
 */
import type { Item } from '@/mockServer/itemsStore';

import {
  getItemDetailCommercialSchema,
  getItemDetailGeneralSchema,
  getItemDetailGeneralUiSchema,
  getToolLandingDetailSchema,
  pickItemDetailFormData,
  pickToolLandingDetailFormData,
} from './itemDetail.schema';

describe('itemDetail.schema', () => {
  it('marks every general field read-only in the JSON schema', () => {
    const schema = getItemDetailGeneralSchema();
    expect(schema.type).toBe('object');
    const props = schema.properties;
    expect(props).toBeTruthy();
    for (const def of Object.values(props!)) {
      expect(def).toMatchObject({ readOnly: true });
    }
  });

  it('hides the submit button in the general uiSchema', () => {
    const ui = getItemDetailGeneralUiSchema();
    expect(ui['ui:submitButtonOptions']).toEqual({ norender: true });
  });

  it('marks every commercial field read-only', () => {
    const schema = getItemDetailCommercialSchema();
    const props = schema.properties;
    expect(props).toBeTruthy();
    for (const def of Object.values(props!)) {
      expect(def).toMatchObject({ readOnly: true });
    }
  });

  it('marks every tool landing detail field read-only', () => {
    const schema = getToolLandingDetailSchema();
    const props = schema.properties;
    expect(props).toBeTruthy();
    for (const def of Object.values(props!)) {
      expect(def).toMatchObject({ readOnly: true });
    }
  });

  it('pickItemDetailFormData maps edit + commercial fields from an Item', () => {
    const item = {
      id: 1,
      number: '#1',
      dueDate: '2025-02-01',
      manager: 'Pat',
      status: 'Open',
      receivedFrom: 'Vendor',
      assignees: ['Alice Johnson'],
      distributionList: ['Team A'],
      ballInCourt: 'Bob',
      contractor: 'Co',
      specSection: '01',
      location: 'A',
      createdBy: 'Sys',
      subJob: 'S',
      dateInitiated: '2025-01-01',
      costCode: 'C',
      scheduleImpact: 'N/A',
      costImpact: 'N/A',
      reference: 'R',
      privateChecked: true,
      referenceCode: 'REF-9',
      summary: 'Sum',
      divisionCode: 'D1',
      assignee: 'Jamie',
      description: 'Desc',
      recordedOn: '2025-03-01',
      responsibleOrg: 'Org',
      priority: 'High',
      cost: 99,
      notes: 'N',
    } as Item;

    const picked = pickItemDetailFormData(item);
    expect(picked.number).toBe('#1');
    expect(picked.assignees).toEqual(['Alice Johnson']);
    expect(picked.referenceCode).toBe('REF-9');
    expect(picked.summary).toBe('Sum');
    expect(picked.cost).toBe(99);
    expect(picked.priority).toBe('High');
  });

  it('pickToolLandingDetailFormData extracts panel fields only', () => {
    const picked = pickToolLandingDetailFormData({
      status: 'Open',
      assignee: 'Alex',
      dueDate: '2026-01-01',
      description: 'Hello',
      responsibleOrg: 'Org',
      recordedOn: '2026-01-02',
      divisionCode: 'Ops',
      priority: 'Normal',
    });
    expect(picked).toEqual({
      status: 'Open',
      dueDate: '2026-01-01',
      assignee: 'Alex',
      description: 'Hello',
      responsibleOrg: 'Org',
      recordedOn: '2026-01-02',
      divisionCode: 'Ops',
      priority: 'Normal',
    });
  });
});
