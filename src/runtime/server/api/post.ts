import { useHelper } from '../../util/helper'

const helper = useHelper()
const config = useRuntimeConfig()
export default defineEventHandler(async (event: any) => {
  if (!config.i18nData)
    throw new Error('You must add runtime config "i18nData"')
  else if (!config.i18nData.api)
    throw new Error('You must add runtime config "i18nData.api"')

  const googleConfig = helper.getGoogleRuntimeConfig(config.i18nData.api)
  if (!config.i18nData.api.url && !googleConfig) {
    throw new Error(
      'You must add runtime config i18nData.api.url or i18nData.api.google',
    )
  }

  let headers = config.i18nData.headers || null
  if (!headers && config.i18nData.apiKey) {
    headers = {
      Authorization: config.i18nData.apiKey,
    }
  }

  const body = await readBody(event)
  let dto = Object.assign({}, body)
  if (googleConfig) {
    dto = {
      majorDimension: 'ROWS',
      range: 'Sheet1!A1:E1',
      values: [[body.key, body.value]],
    }
    if (Array.isArray(body)) {
      dto.values = body.map((item) => {
        return [item.key, item.value]
      })
    }
  }
  try {
    const url = googleConfig ? googleConfig.postUrl : config.i18nData.url
    let apiResponse: any = null
    if (headers) {
      apiResponse = await $fetch(url, {
        headers,
        method: 'post',
        body: dto,
      })
    }
    else {
      apiResponse = await $fetch(url, {
        method: 'post',
        body: dto,
      })
    }
    if (googleConfig) {
      /* const spreadsheetHeaders = apiResponse.valueRanges[0]
            const spreadsheetValues = apiResponse.valueRanges[1]
            if(!spreadsheetHeaders) throw new Error("Could not read response.valueRanges[0] from fetch call in module nuxt-i18n-data /get")
            else if(!spreadsheetValues) throw new Error("Could not read response.valueRanges[1] from fetch call in module nuxt-i18n-data /get")

            const headerValues = spreadsheetHeaders.values[0]
            const messages: Array<i18nDataDto> = []
            headerValues.forEach((header: string, headerIndex: number) => {
                    if(headerIndex === 0) return

                    spreadsheetValues.values.forEach(values => {
                        if(!values[0] || !values[headerIndex]) return
                        messages.push({
                            key: values[0],
                            value: values[headerIndex],
                            localeCode: header.toLowerCase()
                        })
                    })
                })

                console.log("messages", messages)
            return query.raw ? messages : helper.groupByLocalCode(messages) */
    }

    // return query.raw ? apiResponse : helper.groupByLocalCode(apiResponse)
    return null
  }
  catch (error: any) {
    throw new Error(
      `Could not read response from fetch call in module nuxt-i18n-data /post: ${error}`,
    )
  }
})
