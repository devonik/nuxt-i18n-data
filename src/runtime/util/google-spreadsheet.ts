import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { I18nDataGoogleConfig } from '../types'

export async function getI18nData(configuration: I18nDataGoogleConfig) {
  console.log('configuration', configuration)
  if (
    !configuration.providerKey
    || !configuration.credentials
    || (!configuration.credentials.privateKey
      && !configuration.credentials.email
      && !configuration.credentials.apiKey)
  )
    throw new Error('nuxt-i18n-data google config is not valid')

  const doc = new GoogleSpreadsheet(configuration.providerKey)
  if (configuration.credentials.apiKey) {
    doc.useApiKey(configuration.credentials.apiKey)
  }
  else {
    await doc.useServiceAccountAuth({
      client_email: configuration.credentials.email,
      private_key: configuration.credentials.privateKey,
    })
  }
  await doc.loadInfo()

  // If no gid provided we load the first tab
  const worksheet = configuration.spreadsheetId
    ? doc.sheetsById[configuration.spreadsheetId]
    : doc.sheetsByIndex[0]

  if (!worksheet) {
    throw new Error(
      `Unable to find ${configuration.spreadsheetId || 'first'} worksheet tab`,
    )
  }

  const rows = await worksheet.getRows()

  const messages = []

  for (const [index, row] of Object.entries(rows)) {
    for (const header of Object.keys(row)) {
      if (!header.startsWith('_') && header !== 'KEYS' && row[header]) {
        messages.push({
          key: row.KEYS,
          value: row[header],
          localeCode: header.toLowerCase(),
        })
      }
    }
  }
  console.log(`Extract: ${rows.length} rows`, messages)

  return messages
}
