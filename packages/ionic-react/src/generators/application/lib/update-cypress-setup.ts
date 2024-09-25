import { getWorkspaceLayout, joinPathFragments, names, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

function getParameters(options: NormalizedSchema) {
  const files = {
    blank: { elem: 'strong', title: 'Ready to create an app?' },
    list: { elem: 'ion-title', title: 'Inbox' },
    sidemenu: { elem: 'ion-title', title: 'Inbox' },
    tabs: { elem: 'strong', title: 'Tab 1' },
  };

  return files[options.template];
}

export function updateCypressSetup(tree: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return;
  }

  updateFiles(tree, options);
}

function updateFiles(tree: Tree, options: NormalizedSchema) {
  const { appsDir } = getWorkspaceLayout(tree);

  const name = `${options.name}-e2e`;
  const e2eProjectRoot = options.directory
    ? joinPathFragments(appsDir, names(options.directory).fileName, name)
    : joinPathFragments(appsDir, name);

  const { elem, title } = getParameters(options);

  tree.write(
    joinPathFragments(e2eProjectRoot, 'src/support/app.po.ts'),
    `export const getGreeting = () => cy.get('${elem}');`
  );

  const testContent = `
import { getGreeting } from '../support/app.po';

describe('app-blank', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Custom command example, see \`../support/commands.ts\` file
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see \`../support/app.po.ts\` file
    getGreeting().contains('${title}');
  });
});
  `;
  const testFiles = [
    joinPathFragments(e2eProjectRoot, 'src/integration/app.spec.ts'),
    joinPathFragments(e2eProjectRoot, 'src/e2e/app.cy.ts'),
  ];
  for (const testFile of testFiles) {
    if (tree.exists(testFile)) {
      tree.write(testFile, testContent);
    }
  }
}
