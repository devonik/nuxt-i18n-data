export interface I18nDataRaw {
  key: string | undefined
  value: string | undefined
  localeCode: string
}
// Module options TypeScript inteface definition
export interface I18nDataGoogleConfigCredentials {
  apiKey?: string
  email?: string
  privateKey?: string
}
export interface I18nDataGoogleConfig {
  spreadsheetId?: string
  providerKey?: string
  credentials?: I18nDataGoogleConfigCredentials
}
export interface I18nDataApiConfig {
  url?: string
  apiKey?: string
  headers?: any
  google?: I18nDataGoogleConfig
}
export interface I18nDataConfig {
  api: I18nDataApiConfig
  // Default: true. When auto is true the library will load message into vue-i18n context in build time. If you want manually set the i18n config and want to use the server apis from the library you can set this to false
  auto: boolean
}
