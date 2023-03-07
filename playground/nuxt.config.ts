export default defineNuxtConfig({
  runtimeConfig: {
    i18nData: {
      url: "https://api.devnik.dev/storage",
      google: {
        apiKey: process.env.I18N_DATA_GOOGLE_SHEET_API_KEY,
        spreadsheetId: process.env.I18N_DATA_GOOGLE_SHEET_SPREADSHEET_ID
      }
    },
  },
  modules: ['../src/module',
    [
      '@nuxtjs/i18n',
      {
        strategy: 'prefix_except_default',
        defaultLocale: 'de'
      }
    ]
  ],
  myModule: {
    api: {
      url: "https://api.devnik.dev/storage",
      google: {
        apiKey: process.env.I18N_DATA_GOOGLE_SHEET_API_KEY,
        spreadsheetId: process.env.I18N_DATA_GOOGLE_SHEET_SPREADSHEET_ID
      }
    }
  }
})
