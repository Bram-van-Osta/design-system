// `type(scope): FX-n description`, in English, one line under 100 characters, no body, no footer
// (so no attribution trailer either). The scope is left out for the workspace tooling: `chore: …`.
const SCOPES = ['tokens', 'ui', 'storybook', 'ci', 'docs'];

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'test', 'chore', 'ci', 'docs']],
    'scope-enum': [2, 'always', SCOPES],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    'body-empty': [2, 'always'],
    'footer-empty': [2, 'always'],
    'subject-has-ticket': [1, 'always'],
  },
  plugins: [
    {
      rules: {
        'subject-has-ticket': ({ subject }) => [
          /FX-\d+/.test(subject ?? ''),
          'Reference the ticket (FX-n) right after the scope when the change has one.',
        ],
      },
    },
  ],
};
