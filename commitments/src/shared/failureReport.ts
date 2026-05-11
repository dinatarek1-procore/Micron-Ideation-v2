/**
 * Structured failure report template for the 9-step validation checklist.
 * Use this to capture blockers during validation runs.
 */

export interface FailureReport {
  hostRepo: string;
  commitOrBranch: string;
  nodeVersion: string;
  packageManager: string;
  toolinatorVersion: string;
  checklistStep: number;
  stepDescription: string;
  commandRun: string;
  expectedBehavior: string;
  actualBehavior: string;
  terminalOutput?: string;
  browserConsole?: string;
  networkRoute?: string;
  suspectedViewConfig?: string;
  suspectedMockStore?: string;
  suspectedStory?: string;
  reproSteps: string[];
}

export function formatFailureReport(report: FailureReport): string {
  return `## Toolinator Demo Failure

### Context

- Host repo: ${report.hostRepo}
- Commit/branch: ${report.commitOrBranch}
- Node version: ${report.nodeVersion}
- Package manager: ${report.packageManager}
- @procore/json-toolinator version: ${report.toolinatorVersion}

### Step that failed

- Checklist step: ${report.checklistStep}. ${report.stepDescription}
- Command run: \`${report.commandRun}\`

### Expected behavior

${report.expectedBehavior}

### Actual behavior

${report.actualBehavior}

### Error evidence

- Terminal output: ${report.terminalOutput ?? 'N/A'}
- Browser console: ${report.browserConsole ?? 'N/A'}
- Network/API route: ${report.networkRoute ?? 'N/A'}

### Suspected area

- View/config path: ${report.suspectedViewConfig ?? 'N/A'}
- Mock server/store path: ${report.suspectedMockStore ?? 'N/A'}
- Story path: ${report.suspectedStory ?? 'N/A'}

### Repro

${report.reproSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
}

export const FAILURE_REPORT_TEMPLATE = `## Toolinator Demo Failure

### Context

- Host repo:
- Commit/branch:
- Node version:
- Package manager:
- @procore/json-toolinator version:

### Step that failed

- Checklist step:
- Command run:

### Expected behavior

### Actual behavior

### Error evidence

- Terminal output:
- Browser console:
- Network/API route:
- Screenshot/video:

### Suspected area

- View/config path:
- Mock server/store path:
- Story path:

### Repro

1.
2.
3.
`;
