<template>
  <component :is="tag" class="badge" :class="classes">
    <slot>
      <i v-if="icon" :class="icon"></i>
    </slot>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  tag: {
    type: String,
    default: "span",
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  circle: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "default",
  },
  size: {
    type: String,
    default: "",
  },
});

const classes = computed(() => [
  `badge-${props.type}`,
  props.rounded ? "badge-pill" : "",
  props.circle && "badge-circle",
  { [`badge-${props.size}`]: props.size },
]);
</script>

<style>
.badge.badge-sm {
  font-size: 0.55rem;
}
</style>
