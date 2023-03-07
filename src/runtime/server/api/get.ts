import { useHelper } from '../../helper'
import { i18nDataDto } from '../../types'
const helper = useHelper()
const config = useRuntimeConfig()
export default defineEventHandler(async (event: any) => {
    if(!config.i18nData) throw new Error('Missing runtime config key "i18nData"')
    if(!config.i18nData.url && !config.i18nData.google) throw new Error('Missing runtime config key "i18nData.url" or "i18nData.google"')

    if(config.i18nData.google && !config.i18nData.google.apiKey) throw new Error('Missing runtime config key "i18nData.google.apiKey"')

    const query = await getQuery(event)
    let isGoogleConfig = config.i18nData.google
    let url = config.i18nData.url

    if(config.i18nData.google) {
        isGoogleConfig = true
        url = `https://sheets.googleapis.com/v4/spreadsheets/${config.i18nData.google.spreadsheetId}/values:batchGet?ranges=A1:AC1&ranges=A2:AC1000&key=${config.i18nData.google.apiKey}`
    }

    let headers = config.i18nData.headers || null
    if(!headers && config.i18nData.apiKey) {
        headers = {
            'Authorization': config.i18nData.apiKey
        }
    }
        
    try{
        let apiResponse: any = null
        if(headers) apiResponse = await $fetch(url, {
            headers
        })
        else apiResponse = await $fetch(url)

        if(isGoogleConfig){
            const spreadsheetHeaders = apiResponse.valueRanges[0]
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

            return query.raw ? messages : helper.groupByLocalCode(messages)
        }

        return query.raw ? apiResponse : helper.groupByLocalCode(apiResponse)

    }catch (error: any){
        throw new Error("Could not read response from fetch call in module nuxt-i18n-data /get: " + error)
    }
})