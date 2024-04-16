<template>
  <BaseCard class="card-stats" :loading="loading" :show-footer-line="true">
    <div class="row">
      <div class="col">
        <slot>
          <h5 class="card-title text-uppercase text-muted mb-0" v-if="title">
            {{ title }}
          </h5>
          <span class="h2 font-weight-bold mb-0" v-if="subTitle">{{
            subTitle
          }}</span>
        </slot>
      </div>

      <div class="col-auto" v-if="$slots.icon || icon">
        <slot name="icon">
          <div
            class="icon icon-shape text-white rounded-circle shadow"
            :class="[`bg-${type}`, iconClasses]"
          >
            <i :class="icon"></i>
          </div>
        </slot>
      </div>
    </div>

    <p class="mt-3 mb-0 text-sm">
      <slot name="footer"> </slot>
    </p>
  </BaseCard>
</template>
<script>
import BaseCard from "./BaseCard.vue";

export default {
  name: "stats-card",
  components: {
    BaseCard,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    loading: Boolean,
    icon: String,
    title: String,
    subTitle: String,
    iconClasses: [String, Array],
  },
};
</script>
<style></style>
