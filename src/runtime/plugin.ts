import { defineNuxtPlugin } from "#app";
import { useFetch } from "#imports";
import { useHelper } from "./util/helper";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      i18nData: {
        async refreshAllMessages() {
          const helper = useHelper();

          const { data: messages } = await useFetch("/api/i18n");

          Object.keys(messages.value).forEach((localeCode) => {
            nuxtApp.$i18n.setLocaleMessage(
              localeCode,
              messages.value[localeCode]
            );
          });
        },
        refreshMessageByLocalCode(localeCode: string) {},
        async addMessage(localeCode: string, key: string, value: string) {
          const helper = useHelper();
          try {
            const { data: messages } = await useFetch("/api/i18n", {
              method: "POST",
              body: [
                {
                  key,
                  value,
                  localeCode,
                },
              ],
            });
            nuxtApp.$i18n.mergeLocaleMessage(
              localeCode,
              helper.unflattenObject({ [key]: value })
            );
          } catch (error) {
            createError({
              statusMessage: "Could not post /api/i18n: " + error,
              statusCode: 500,
            });
          }
        },
      },
    },
  };
});
