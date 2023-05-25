import { useHelper } from "../../util/helper";
import { I18nDataApiConfig, i18nDataDto } from "../../types";
import { getI18nData } from "../../util/google-spreadsheet";
const helper = useHelper();
const config = useRuntimeConfig();

export default defineEventHandler(async (event: any) => {
  const moduleConfig: I18nDataApiConfig = config.i18nData.api;
  console.log("moduleConfig", moduleConfig);
  if (!moduleConfig.url && !moduleConfig.google)
    throw new Error(
      "You must add runtime config i18nData.api.url or i18nData.api.google"
    );

  let headers = moduleConfig.headers || null;
  if (!headers && moduleConfig.apiKey) {
    headers = {
      Authorization: moduleConfig.apiKey,
    };
  }

  const query = await getQuery(event);

  try {
    let apiResponse: any = [];
    if (moduleConfig.google) {
      apiResponse = await getI18nData(moduleConfig.google);
      console.log("apiResponse", apiResponse);
    } else {
      if (!moduleConfig.url)
        throw new Error(
          "Could not read build url by nuxt-i18n-data module config. Google config or any other get url must be filled"
        );
      if (headers)
        apiResponse = await $fetch(moduleConfig.url, {
          headers,
        });
      else apiResponse = await $fetch(moduleConfig.url);
    }

    return query.raw ? apiResponse : helper.groupByLocalCode(apiResponse);
  } catch (error: any) {
    throw new Error(
      "Could not read response from fetch call in module nuxt-i18n-data /get: " +
        error
    );
  }
});
