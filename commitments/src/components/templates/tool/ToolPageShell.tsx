import Head from 'next/head';
import { ToolLandingPage, Typography } from '@procore/core-react';

export default function ToolPageShell() {
  return (
    <>
      <Head>
        <title>List view — prototype</title>
      </Head>
      <ToolLandingPage>
        <ToolLandingPage.Main>
          <ToolLandingPage.Body>
            <Typography intent="body">
              The prototype app list uses Toolinator&apos;s{' '}
              <code>feature: &apos;table&apos;</code> with dummy data. Run{' '}
              <code>yarn dev</code> and open the tool route to see the data
              grid.
            </Typography>
          </ToolLandingPage.Body>
        </ToolLandingPage.Main>
      </ToolLandingPage>
    </>
  );
}
