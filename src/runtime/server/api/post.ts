export default defineEventHandler(async (event: any) => {
    const config = useRuntimeConfig()

    if(!config.i18nData) throw createError({ statusCode: 500, statusMessage: 'Missing runtime config key "i18nData"' })
    if(!config.i18nData.url) throw createError({ statusCode: 500, statusMessage: 'Missing runtime config key "i18nData.url"' })

    const body = await readBody(event)

    let headers = config.i18nData.headers || null
    if(!headers && config.i18nData.apiKey) {
        headers = {
            'Authorization': config.i18nData.apiKey
        }
    }
        
    let apiResponse = null
    if(headers) apiResponse = await $fetch(config.i18nData.url, {
        method: 'post',
        headers,
        body
    })
    else apiResponse = await $fetch(config.i18nData.url, {
        method: 'post',
        body
    })

    return apiResponse

})