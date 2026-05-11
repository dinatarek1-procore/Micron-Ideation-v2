/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

import { ItemDetailGeneral } from './ItemDetailGeneral';

const mockUseViewContext = jest.fn();

const capturedForms: Array<{
  id: string;
  schema: unknown;
  uiSchema: unknown;
  initialData: unknown;
}> = [];

jest.mock('@procore/json-toolinator', () => ({
  ...jest.requireActual('@procore/json-toolinator'),
  useViewContext: (...args: unknown[]) => mockUseViewContext(...args),
}));

jest.mock('@procore/json-formulator', () => {
  const actual = jest.requireActual('@procore/json-formulator');
  return {
    ...actual,
    Form: (props: {
      schema: unknown;
      uiSchema: unknown;
      initialData: unknown;
    }) => {
      const schemaProps = (
        props.schema as { properties?: Record<string, unknown> } | undefined
      )?.properties;
      const id =
        schemaProps && 'ballInCourt' in schemaProps ? 'general' : 'commercial';
      capturedForms.push({
        id,
        schema: props.schema,
        uiSchema: props.uiSchema,
        initialData: props.initialData,
      });
      return <div data-testid={`formulator-form-${id}`} />;
    },
  };
});

describe('ItemDetailGeneral', () => {
  beforeEach(() => {
    capturedForms.length = 0;
    mockUseViewContext.mockReturnValue({
      queries: {
        item: {
          data: {
            data: {
              referenceCode: 'ITEM-1001',
              summary: 'Sample record',
              description: 'Seeded description for overview tab.',
              notes: 'Internal notes line.',
              priority: 'High',
              recordedOn: '2025-01-10',
              responsibleOrg: 'GC North',
              divisionCode: '09',
              cost: 125000,
              number: '#1001',
              dueDate: '2025-01-01',
              manager: 'Alex Manager',
              status: 'Open',
              receivedFrom: 'Vendor Co',
              assignees: ['Alice Johnson'],
              distributionList: ['Team A'],
              ballInCourt: 'Bob',
              contractor: 'Build LLC',
              specSection: '03 30 00',
              location: 'Site A',
              createdBy: 'System Admin',
              subJob: 'SJ-1',
              dateInitiated: '2025-01-02',
              costCode: 'CC-9',
              scheduleImpact: 'N/A',
              costImpact: 'N/A',
              reference: 'REF-1',
              privateChecked: false,
            },
          },
        },
      },
    });
  });

  it('renders two formulator forms for General Information and Commercial', () => {
    render(<ItemDetailGeneral />);
    expect(screen.getByTestId('formulator-form-general')).toBeTruthy();
    expect(screen.getByTestId('formulator-form-commercial')).toBeTruthy();
    expect(capturedForms).toHaveLength(2);
  });

  it('passes read-only commercial initialData including priority and cost', () => {
    render(<ItemDetailGeneral />);
    const commercial = capturedForms.find((c) => c.id === 'commercial');
    expect(commercial?.initialData).toMatchObject({
      priority: 'High',
      cost: 125000,
      referenceCode: 'ITEM-1001',
      summary: 'Sample record',
    });
    const general = capturedForms.find((c) => c.id === 'general');
    expect(general?.initialData).toMatchObject({
      number: '#1001',
      status: 'Open',
    });
  });

  it('renders description and notes copy', () => {
    render(<ItemDetailGeneral />);
    expect(
      screen.getByText('Seeded description for overview tab.')
    ).toBeTruthy();
    expect(screen.getByText('Internal notes line.')).toBeTruthy();
  });
});
