import globals from 'globals';
import pluginJs from '@eslint/js';
import js from '@eslint/js';


export default [
  js.configs.recommended,
  {files: ['src/**/*.js'], languageOptions: {sourceType: 'commonjs'}}, 
  {
    'rules': {
      'eqeqeq': 'error',
      'curly': 'error',
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
      'indent': ['error', 2],
      'no-console': 'warn',
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-var': 'error',
      'prefer-const': 'error',
      'quotes': [
        'error',
        'single'
      ]
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];

