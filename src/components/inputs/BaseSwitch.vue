<template>
  <label
    class="custom-toggle"
    :class="switchClass"
    tabindex="0"
    @blur="$emit('blur')"
  >
    <input
      type="checkbox"
      v-model="model"
      :disabled="disabled"
      :id="id"
      @change="$emit('changed')"
    />
    <span
      class="custom-toggle-slider rounded-circle"
      :data-label-off="offText"
      :data-label-on="onText"
    >
    </span>
  </label>
</template>
<script>
export default {
  name: "base-switch",
  props: {
    id: String,
    disabled: Boolean,
    value: [Array, Boolean, String],
    type: String,
    onText: {
      type: String,
      default: "Ja",
    },
    offText: {
      type: String,
      default: "Nee",
    },
  },
  computed: {
    switchClass() {
      let baseClass = "custom-toggle-";
      if (this.type) {
        return baseClass + this.type;
      }
      return "";
    },
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    triggerToggle() {
      this.model = !this.model;
    },
  },
};
</script>
<style></style>
