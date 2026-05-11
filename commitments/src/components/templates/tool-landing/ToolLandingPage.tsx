import {
  Button,
  Dropdown,
  Form,
  H1,
  I18nProvider,
  Tabs,
  Title,
  ToolLandingPage,
  Typography,
  colors,
} from '@procore/core-react';
import { Plus } from '@procore/core-icons';
import { useState } from 'react';
import styled from 'styled-components';
import type { ToolLandingPageViewProps } from './ToolLandingPage.types';
import { StyledToolLandingPageBodyContent } from './ToolLandingPage.styles';
import { TearsheetShell } from '@/components/templates/tearsheet';

/**
 * Storybook demo of Pattern 2 Full-Workspace with a Pattern 3 Slide-Out (Create)
 * composed via `TearsheetShell`. For production Toolinator-wired Creates, see
 * `src/views/create/CreateFormTearsheetView.tsx` — it uses `@procore/json-formulator`
 * with `localStorageKey` for client-side refresh recovery. This demo uses the
 * core-react `<Form>` (Formik-backed) so both entry points are visible.
 *
 * Full rules: `.cursor/rules/ix-tearsheet.mdc`.
 */

const TEARSHEET_TITLE_ID = 'tool-landing-create-tearsheet-title';
const FORM_ID = 'tool-landing-create-form';

const FormBody = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionLabel = styled(Typography)`
  padding-bottom: 8px;
  padding-top: 16px;
  border-bottom: 1px solid ${colors.gray94};
  margin-bottom: 4px;
`;

type StatusOption = { id: string; label: string };
type PriorityOption = { id: string; label: string };

const STATUS_OPTIONS: StatusOption[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'active', label: 'Active' },
  { id: 'on_hold', label: 'On Hold' },
  { id: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS: PriorityOption[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'critical', label: 'Critical' },
];

interface FormValues {
  title: string;
  description: string;
  status: StatusOption | null;
  priority: PriorityOption | null;
  assigned_to: string;
  due_date: string;
  cost: number | null;
  notes: string;
}

const INITIAL_VALUES: FormValues = {
  title: '',
  description: '',
  status: null,
  priority: null,
  assigned_to: '',
  due_date: '',
  cost: null,
  notes: '',
};

const tabItems = [
  { id: '1', label: 'Item 1', href: '/tool-landing-page', selected: true },
  { id: '2', label: 'Item 2', href: '/tool-landing-page' },
  { id: '3', label: 'Item 3', href: '/tool-landing-page' },
  { id: '4', label: 'Item 4', href: '/tool-landing-page' },
  { id: '5', label: 'Item 5', href: '/tool-landing-page' },
  { id: '6', label: 'Item 6 longer text', href: '/tool-landing-page' },
];

function ToolLandingPageView({
  heading = 'Tool landing',
  settingsLink = '#',
}: ToolLandingPageViewProps) {
  const [tearsheetOpen, setTearsheetOpen] = useState(false);

  function handleSubmit(values: FormValues) {
    console.log('Form submitted:', values);
    setTearsheetOpen(false);
  }

  return (
    <I18nProvider locale="en" enableCDN={false}>
      <ToolLandingPage>
        <ToolLandingPage.Main>
          <ToolLandingPage.Header>
            <ToolLandingPage.Title settingsLink={settingsLink}>
              <Title>
                <Title.Text>
                  <H1>{heading}</H1>
                </Title.Text>
                <Title.Actions>
                  <Button
                    variant="primary"
                    icon={<Plus />}
                    onClick={() => setTearsheetOpen(true)}
                  >
                    Primary
                  </Button>
                  <Button variant="secondary" type="button">
                    Secondary
                  </Button>
                  <Dropdown variant="tertiary" />
                </Title.Actions>
              </Title>
            </ToolLandingPage.Title>
            <ToolLandingPage.Tabs>
              <Tabs>
                {tabItems.map(({ id, label, href, selected }) => (
                  <Tabs.Tab
                    key={id}
                    role="link"
                    href={href}
                    as={(p) => <a {...p} />}
                    selected={selected}
                  >
                    <Tabs.Link>{label}</Tabs.Link>
                  </Tabs.Tab>
                ))}
              </Tabs>
            </ToolLandingPage.Tabs>
          </ToolLandingPage.Header>
          <ToolLandingPage.Body>
            <StyledToolLandingPageBodyContent>
              <Typography intent="body">
                Storybook demo: the real prototype list at <code>/new</code>{' '}
                uses a custom Toolinator feature with{' '}
                <code>@procore/json-tabulator</code> <code>Table</code>{' '}
                (server-side) and the prototype-tool blueprint list schema
                against <code>/rest/v1.0/companies/…/items</code>. Run the app
                shell for the live table.
              </Typography>
            </StyledToolLandingPageBodyContent>
          </ToolLandingPage.Body>
        </ToolLandingPage.Main>
      </ToolLandingPage>

      <TearsheetShell
        open={tearsheetOpen}
        onClose={() => setTearsheetOpen(false)}
        title="Create Item"
        titleId={TEARSHEET_TITLE_ID}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTearsheetOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} variant="primary">
              Create
            </Button>
          </>
        }
      >
        <Form
          initialValues={INITIAL_VALUES}
          onSubmit={(vals, actions) => {
            handleSubmit(vals as FormValues);
            actions.setSubmitting(false);
            return Promise.resolve();
          }}
          view="create"
        >
          <Form.Form id={FORM_ID}>
            <FormBody>
              <SectionLabel intent="label" color="gray45">
                General
              </SectionLabel>
              <Form.Text name="title" label="Title" colStart={1} required />
              <Form.TextArea
                name="description"
                label="Description"
                colStart={1}
              />

              <SectionLabel intent="label" color="gray45">
                Classification
              </SectionLabel>
              <Form.Select
                name="status"
                label="Status"
                colStart={1}
                options={STATUS_OPTIONS}
                getLabel={(o: StatusOption | null) => o?.label ?? ''}
                getId={(o: StatusOption | null) => o?.id ?? ''}
                required
              />
              <Form.Select
                name="priority"
                label="Priority"
                colStart={1}
                options={PRIORITY_OPTIONS}
                getLabel={(o: PriorityOption | null) => o?.label ?? ''}
                getId={(o: PriorityOption | null) => o?.id ?? ''}
              />

              <SectionLabel intent="label" color="gray45">
                Assignment &amp; Schedule
              </SectionLabel>
              <Form.Text name="assigned_to" label="Assigned To" colStart={1} />
              <Form.Text
                name="due_date"
                label="Due Date"
                colStart={1}
                placeholder="MM/DD/YYYY"
              />

              <SectionLabel intent="label" color="gray45">
                Financials
              </SectionLabel>
              <Form.Number name="cost" label="Estimated Cost" colStart={1} />

              <SectionLabel intent="label" color="gray45">
                Additional Details
              </SectionLabel>
              <Form.TextArea name="notes" label="Notes" colStart={1} />
            </FormBody>
          </Form.Form>
        </Form>
      </TearsheetShell>
    </I18nProvider>
  );
}

export default ToolLandingPageView;
