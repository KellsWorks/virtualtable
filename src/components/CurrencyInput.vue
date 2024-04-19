<template>
  <base-input
    name="currency"
    v-bind="$attrs"
    step="0.01"
    type="number"
    :disabled="isDisabled"
    prepend-icon="fas fa-euro-sign"
    tabindex="0"
    v-model="inputValue"
    @blur="onBlur"
  ></base-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, PropType } from "vue";
import BaseInput from "@/components/inputs/BaseInput.vue";

export default defineComponent({
  components: {
    BaseInput,
  },
  name: "currency-input",
  props: {
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    value: {
      type: [Number, String] as PropType<number | string>,
    },
  },
  setup(props, { emit }) {
    const inputValue = ref<string>("0");

    const format = (value: string, blur: boolean = true) => {
      if (!value) {
        emit("input", "0");
        return;
      }
      const val = parseFloat(value);
      inputValue.value = val.toFixed(2);
      emit("input", val);
      if (blur) emit("blur");
    };

    watch(
      () => props.value,
      (newValue) => {
        inputValue.value = String(newValue);
        format(inputValue.value, false);
      }
    );

    onMounted(() => {
      inputValue.value = String(props.value);
      format(inputValue.value, false);
    });

    return {
      inputValue,
      isDisabled: props.disabled,
      onBlur: () => format(inputValue.value),
    };
  },
});
</script>
