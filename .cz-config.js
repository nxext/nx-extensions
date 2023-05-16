module.exports = {
  types: [
    { value: 'feat', name: 'feat:       A new feature' },
    { value: 'fix', name: 'fix:        A bug fix' },
    { value: 'docs', name: 'docs:       Documentation only changes' },
    { value: 'refactor', name: 'refactor:   Refactoring of a feature' },
    {
      value: 'cleanup',
      name: 'cleanup:    A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'chore',
      name: "chore:      Other changes that don't modify src or test files",
    },
  ],

  scopes: [
    { name: 'nxext', description: 'Whole repo' },
    { name: 'docs', description: 'Docs specific' },
    { name: 'stencil', description: 'Stencil specific' },
    { name: 'svelte', description: 'Svelte specific' },
    { name: 'sveltekit', description: 'Sveltekit specific' },
    { name: 'solid', description: 'SolidJS specific' },
    { name: 'preact', description: 'Preact specific' },
    { name: 'capacitor', description: 'capacitor specific' },
    { name: 'ionic-angular', description: 'ionic-angular specific' },
    { name: 'ionic-react', description: 'ionic-react specific' },
    { name: 'vue', description: 'vue specific' },
  ],

  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberRegExp: '\\d{1,5}',

  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject:
      'Write a SHORT, IMPERATIVE (lowercase) description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['ticketNumber'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
