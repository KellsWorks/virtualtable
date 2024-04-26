<template>
  <div v-if="props.prop">
    <template>
      Naam: {{ props.prop.name }}<br />
      Datum: {{ dateFormat(props.prop.delivery_date) }}<br />
      Beschikbaar: {{ props.prop.amount_available }} / {{ props.prop.amount }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { dateFormat } from "../../utils/functions";

const props = defineProps({
    editing : {
        type: Boolean
    },
    prop: {
        type: Object,
        default: () => {}
    }
});
</script>
