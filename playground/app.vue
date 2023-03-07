<template>
  <div>
    Nuxt module playground!
    <I18nList />
    i18n: <pre>{{ i18n.messages }}</pre>
    Neuer translation key: {{ $t('layout.menuSecondary.cart') }}
    <button @click="$i18nData.refreshAllMessages()">
      Refresh all messages
    </button>
  </div>
</template>

<script setup>
import { useI18n, useLocalePath } from '#imports' 
   const i18n = useI18n()
</script>
