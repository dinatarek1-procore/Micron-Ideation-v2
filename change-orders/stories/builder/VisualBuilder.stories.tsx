import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { Tool } from '@procore/json-toolinator';

import { config } from '../../src/app.config';
import { mockServer } from '../../src/mockServer/mockServer';
import { resetItemsStore } from '../../src/mockServer/itemsStore';
import { resetItemExtensionResourceStores } from '../../src/mockServer/resetItemExtensionResourceStores';
import { resetUserPermissionsStore } from '../../src/mockServer/userPermissionsStore';

const CanvasShell = styled.div`
  min-height: 800px;
  height: min(90vh, 1200px);
  overflow: auto;
  background: #fff;
`;

function MirageDecorator({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const serverRef = useRef<ReturnType<typeof mockServer> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    resetItemsStore();
    resetUserPermissionsStore();
    resetItemExtensionResourceStores();
    serverRef.current = mockServer({ logging: false });
    setReady(true);
    return () => {
      serverRef.current?.shutdown();
      serverRef.current = null;
      setReady(false);
    };
  }, []);

  if (!ready) {
    return <div style={{ padding: 16, color: '#666' }}>Starting mock API…</div>;
  }

  return <>{children}</>;
}

type Props = { initialEntries: string[] };

function VisualBuilderDemo({ initialEntries }: Readonly<Props>) {
  return (
    <MirageDecorator>
      <CanvasShell>
        <Tool
          bugsnagApiKey=""
          config={config}
          getTranslations={async () => ({})}
          getTranslationsPath={() => '/locales'}
          localTranslations={{ en: {} }}
          UNSAFE_useMemoryRouter={true}
          UNSAFE_initialEntries={initialEntries}
        />
      </CanvasShell>
    </MirageDecorator>
  );
}

const meta: Meta<typeof VisualBuilderDemo> = {
  title: 'Builder/Visual Builder',
  component: VisualBuilderDemo,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof VisualBuilderDemo>;

export const FromHome: Story = {
  name: 'From home',
  args: { initialEntries: ['/companies/1/tools/prototype/'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromList: Story = {
  name: 'From list',
  args: { initialEntries: ['/companies/1/tools/prototype/'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromDetail: Story = {
  name: 'From detail',
  args: { initialEntries: ['/companies/1/tools/prototype/items/1'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromEdit: Story = {
  name: 'From edit',
  args: { initialEntries: ['/companies/1/tools/prototype/items/1/edit'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromCreate: Story = {
  name: 'From create',
  args: { initialEntries: ['/companies/1/tools/prototype/create'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromEmails: Story = {
  name: 'From emails tab',
  args: { initialEntries: ['/companies/1/tools/prototype/items/1/emails'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromHistory: Story = {
  name: 'From history tab',
  args: { initialEntries: ['/companies/1/tools/prototype/items/1/history'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromHub: Story = {
  name: 'From hub',
  args: { initialEntries: ['/companies/1/tools/prototype/hub'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromDocuments: Story = {
  name: 'From documents tab',
  args: { initialEntries: ['/companies/1/tools/prototype/items/1/documents'] },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromRelatedItems: Story = {
  name: 'From related items tab',
  args: {
    initialEntries: ['/companies/1/tools/prototype/items/1/related-items'],
  },
  render: (args) => <VisualBuilderDemo {...args} />,
};

export const FromPermissions: Story = {
  name: 'From permissions',
  args: {
    initialEntries: ['/companies/1/tools/prototype/settings/permissions'],
  },
  render: (args) => <VisualBuilderDemo {...args} />,
};
