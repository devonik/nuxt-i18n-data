export interface i18nDataDto {
    key: string | null,
    value: string | null,
    localeCode: string | null,
}
// Module options TypeScript inteface definition
export interface I18nDataGoogleConfig{
    apiKey?: string,
    spreadsheetId?: string
  }
  export interface I18nDataApiConfig {
    url?: string,
    apiKey?: string,
    headers?: any,
    google?: I18nDataGoogleConfig
  }
  export interface I18nDataConfig {
    api: I18nDataApiConfig
  }