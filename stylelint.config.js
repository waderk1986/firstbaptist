export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**', '.astro/**', 'node_modules/**', '_legacy/**'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'theme',
          'variants',
          'responsive',
          'screen',
          'utility',
          'custom-variant',
          'source',
          'plugin',
          'reference',
          'config',
        ],
      },
    ],
    'import-notation': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'value-keyword-case': null,
    'media-feature-range-notation': null,
  },
};
