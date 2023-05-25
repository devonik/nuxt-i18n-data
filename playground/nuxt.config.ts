import { Buffer } from 'node:buffer'

export default defineNuxtConfig({
  runtimeConfig: {
    i18nData: {
      api: {
        url: 'https://api.devnik.dev/storage',
        google: {
          providerKey: process.env.I18N_DATA_GOOGLE_SHEET_PROVIDER_KEY,
          spreadsheetId: process.env.I18N_DATA_GOOGLE_SHEET_SPREADSHEET_ID,
          credentials: {
            email: process.env.I18N_DATA_GOOGLE_CLIENT_EMAIL,
            privateKey: process.env.I18N_DATA_GOOGLE_CLIENT_PRIVATE_KEY_BASE_64
              ? Buffer.from(
                process.env.I18N_DATA_GOOGLE_CLIENT_PRIVATE_KEY_BASE_64,
                'base64',
              ).toString('ascii')
              : undefined,
          },
        },
      },
    },
  },
  modules: [
    '../src/module',
    [
      '@nuxtjs/i18n',
      {
        strategy: 'prefix_except_default',
        defaultLocale: 'de',
      },
    ],
  ],
  i18nData: {
    api: {
      url: 'https://api.devnik.dev/storage',
      google: {
        providerKey: process.env.I18N_DATA_GOOGLE_SHEET_PROVIDER_KEY,
        spreadsheetId: process.env.I18N_DATA_GOOGLE_SHEET_SPREADSHEET_ID,
        credentials: {
          email: process.env.I18N_DATA_GOOGLE_CLIENT_EMAIL,
          privateKey: process.env.I18N_DATA_GOOGLE_CLIENT_PRIVATE_KEY_BASE_64
            ? Buffer.from(
              process.env.I18N_DATA_GOOGLE_CLIENT_PRIVATE_KEY_BASE_64,
              'base64',
            ).toString('ascii')
            : undefined,
        },
      },
    },
  },
})
