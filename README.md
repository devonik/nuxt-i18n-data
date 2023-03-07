<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt i18n data module
- Package name: nuxt-i18n-data
- Description: This nuxt 3 module can be used to load locale messages in the vue-i18n instance. The api configured in the config will be called initial after nuxt build and can be called again via plugin that is provided by this module - access via $i18nData
-->

# Nuxt i18n data module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> This nuxt 3 module can be used to load locale messages in the vue-i18n instance. The api configured in the config will be called initial after nuxt build and can be called again via plugin that is provided by this module - access via $i18nData

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

## Quick Setup

1. Add `nuxt-i18n-data` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-i18n-data

# Using yarn
yarn add --dev nuxt-i18n-data

# Using npm
npm install --save-dev nuxt-i18n-data
```

2. Add `nuxt-i18n-data` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-i18n-data'
  ]
})
```

That's it! You can now use Nuxt i18n data module in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-i18n-data/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-i18n-data

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-i18n-data.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-i18n-data

[license-src]: https://img.shields.io/npm/l/nuxt-i18n-data.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-i18n-data
