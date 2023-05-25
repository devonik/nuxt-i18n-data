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
- ⛰ &nbsp;Nuxt 3 module using the newest version of @nuxtjs/i18n
- ⛰ &nbsp;Nuxt plugin ($i18nData)
- 🚠 &nbsp;Local json files for vue-i18n are not needed
- 🌲 &nbsp;Typescript friendly

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
  ],
  i18nData: {
    api: {
      url: 'https://...', /* This url will be taken for http calls. The initial GET at nuxt build and the api/i18n server handler. If google key exists this option will be ignored for GET calls. Post will still using this. */
      apiKey: 'Bearer 1234', /* If this key exists the http calls will be made with 'Authorization' header. If google key exists this option will be ignored */
      headers: { header1: 'test', header2: 'test1' }, /* If this header exists this header wil be sent to http endpoints. If google key exists this option will be ignored */
      google: { /* This key contains Google sheet credentials and will be used for http calls. If this key exists the api.url will be ignored. See #Google sheet config for more */
        providerKey: process.env.I18N_DATA_GOOGLE_SHEET_PROVIDER_KEY,
        spreadsheetId: process.env.I18N_DATA_GOOGLE_SHEET_SPREADSHEET_ID,
        credentials: { // You can use this to authentificate with oauth service account
          email: process.env.I18N_DATA_GOOGLE_CLIENT_EMAIL,
          privateKey: process.env.I18N_DATA_GOOGLE_CLIENT_PRIVATE_KEY_BASE_64 // Or directly use a private key value instead of Buffer
            ? Buffer.from(
              process.env.I18N_DATA_GOOGLE_CLIENT_PRIVATE_KEY_BASE_64,
              'base64',
            ).toString('ascii')
            : undefined,
        },
      }
    }
  }
})
```

That's it! You can now use Nuxt i18n data module in your Nuxt app ✨

## Plugin
This module add a nuxt plugin and can be accessed via $i18nData within nuxt context
### Methods
Refresh all messages. See /playground for example 
```
$i18nData.refreshAllMessages()
```
Merge one message to vue-i18n instance. See src/runtime/components/I18nItem.vue for example 
```
$i18nData.addMessage(localeCode, key, value)
```

## Components
This module provides simple Vue commponents to GET all loaded messages, POST them and DELETE. See /playground for more

## Server routes
> You have to set runtime config (same format as module config) to use this

### GET - /api/i18n/
1. Google sheet config (runtimeConfig: i18nData.google). Example spreadsheet https://docs.google.com/spreadsheets/d/1Th8vT5gAVqmkXyoGtxOhgtPYL-6QwDfH8viZyuKphwI/edit#gid=0
2. Custom API (runtimeConfig: i18nData.api.url)
Return from custom api must be
```json
[
  {
    "key": "layout.menuSecondary.test1",
    "value": "testChild",
    "localeCode": "de"
  }
]
```

### POST - /api/i18n/
> POST / update a message is currently only possible with custom API. For google post support the project have to use the google sdk cause of oauth needed
1. Custom API (runtimeConfig: i18nData.api.url)
The DTO post from client have to be
```json
[
  {
    "key": "layout.menuSecondary.test1",
    "value": "testChildUpdate",
    "localeCode": "de"
  }
]
```

### DELETE - /api/i18n/
> DELETE a message is currently only possible with custom API. For google post support the project have to use the google sdk cause of oauth needed
!!!Not maintained yet!!!

## Google sheet config
You can either using a self managed api with get endpoint to get all local messages or you can use google sheet to easily manage locale message and get this messages as json via [Google Sheet API](https://developers.google.com/sheets/api/reference/rest) 

When you want to use the get from google sheet api you have to take some actions to enable this
1. [Create](https://console.cloud.google.com/projectcreate) a google cloud project (if not already exists)
2. Enable google sheet api 
- Select your project -> APIs & Services -> Library -> Search for "Google Sheet API" -> Enable
3. Create api key
- Select your project -> APIs & Services -> Credentials -> Create credentials -> API key
4. Add module config
- Add the google config in your nuxt.config. I recommend to save this sensitive data in the local .env file
```js
export default defineNuxtConfig({
  modules: [
    'nuxt-i18n-data'
  ],
  i18nData: {
    api: {
      url: 'https://...', /* This url will be taken for http calls. The initial GET at nuxt build and the api/i18n server handler. If google key exists this option will be ignored for GET calls. Post will still using this. */
      google: {
        // This api key you created in #Google sheet config 3.
        apiKey: process.env.I18N_DATA_GOOGLE_SHEET_API_KEY,
        // This id you can grab out oft the google spreadsheet url https://docs.google.com/spreadsheets/d/...COPY THE ID FROM HERE.../
        spreadsheetId: process.env.I18N_DATA_GOOGLE_SHEET_SPREADSHEET_ID
      }
    }
  }
})
```

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
