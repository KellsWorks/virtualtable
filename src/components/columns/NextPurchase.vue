<template>
  <div v-if="props.prop">
    <template>
      Naam: {{ props.prop.name }}<br />
      Datum: {{ dateFormat(prop.delivery_date) }}<br />
      Beschikbaar: {{ prop.amount_available }} / {{ prop.amount }}
    </template>
  </div>
</template>

<script setup lang="ts">
import dateFormat from "@/utils/functions";
import { defineProps } from 'vue';

const props = defineProps({
    editing: {
      type: Boolean
    },
    prop: {
      type: Object,
      default: () => {}
    }
})
</script>
