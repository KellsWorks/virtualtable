<template>
  <ValidationProvider
    ref="form"
    :rules="rules"
    :name="name"
    v-bind="$attrs"
    v-slot="{ errors, valid, invalid, validated }"
    tag="div"
  >
    <div
      class="form-group"
      :class="{ 'is-invalid': validated && invalid, row: inline }"
    >
      <slot name="label">
        <div class="d-flex justify-content-between">
          <label v-if="label" :class="labelClasses" :for="name">
            {{ label }}
          </label>
          <slot name="labelHint"></slot>
        </div>
      </slot>
      <div
        :class="[
          { 'input-group': hasIcon },
          { focused: focused },
          { 'input-group-alternative': alternative },
          { 'has-label': label || $slots.label },
          inputGroupClasses,
        ]"
      >
        <div v-if="prependIcon || $slots.prepend" class="input-group-prepend">
          <span class="input-group-text">
            <slot name="prepend">
              <i :class="prependIcon"></i>
            </slot>
          </span>
        </div>
        <slot v-bind="slotData">
          <input
            v-if="type !== 'textarea'"
            :disabled="disabled"
            :type="type"
            ref="input"
            v-on="listeners"
            v-bind="$attrs"
            :valid="valid"
            :required="required"
            class="form-control"
            :class="[
              { 'is-valid': valid && validated && successMessage },
              { 'is-invalid': invalid && validated },
              inputClasses,
            ]"
          />
          <textarea
            v-else
            v-on="listeners"
            :disabled="disabled"
            :id="name"
            v-bind="$attrs"
            :valid="valid"
            :required="required"
            style="resize: none"
            class="form-control"
            :class="[
              { 'is-valid': valid && validated && successMessage },
              { 'is-invalid': invalid && validated },
              inputClasses,
            ]"
          ></textarea>
        </slot>
        <div
          v-if="appendIcon || $slots.append"
          class="input-group-append"
          @click="onAppendClick"
        >
          <a
            v-if="appendIconLink"
            :href="appendIconLink"
            class="input-group-text"
          >
            <slot name="append">
              <i :class="appendIcon"></i>
            </slot>
          </a>
          <span
            v-else
            class="input-group-text"
            :tabindex="hasAppendListener ? 0 : -1"
            @keypress.enter="onAppendClick"
            @keypress.space.prevent="onAppendClick"
          >
            <slot name="append">
              <i :class="appendIcon"></i>
            </slot>
          </span>
        </div>
        <slot name="infoBlock"></slot>
      </div>
      <slot name="success">
        <div class="valid-feedback" v-if="valid && validated">
          {{ successMessage }}
        </div>
      </slot>
      <slot name="error">
        <div
          v-html="errors[0] || serverErrors[0] || '&nbsp;'"
          class="invalid-feedback"
          :style="hideFeedback ? 'display:none;' : 'display: block;'"
        ></div>
      </slot>
    </div>
  </ValidationProvider>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';
import ValidationProvider from "vee-validate"

const props = defineProps<{
  name: string;
  inline?: boolean;
  disabled?: boolean;
  required?: boolean;
  group?: boolean;
  alternative?: boolean;
  hideFeedback?: boolean;
  label?: string;
  successMessage?: string;
  labelClasses?: string;
  inputClasses?: string;
  inputGroupClasses?: string;
  type?: string;
  appendIcon?: string;
  appendIconLink?: string;
  prependIcon?: string;
  rules?: string[] | string | object;
}>();

const emit = defineEmits(['input', 'focus', 'blur', 'appendclick']);
const store = useStore();
const focused = ref(false);
const errors = computed(() => store.getters["errors/errors"]);
const hasAppendListener = computed(() => !!((emit as any)['appendclick']));

const serverErrors = computed(() => {
  const currentInput = (error: any) => error.property === props.name;
  const firstConstraintError = (error: any) => Object.values(error.constraints)[0];
  return errors.value.filter(currentInput).map(firstConstraintError);
});

const listeners = {
  ...emit,
  input: (evt: Event) => updateValue(evt),
  focus: (evt: FocusEvent) => onFocus(evt),
  blur: (evt: FocusEvent) => onBlur(evt),
};

const slotData = computed(() => ({
  focused: focused.value,
  error: serverErrors.value,
  ...listeners,
}));

const hasIcon = computed(() => {
  return (
    !!props.appendIcon ||
    !!props.prependIcon ||
    !!props.group
  );
});

const updateValue = (evt: Event) => {
  let value = (evt.target as HTMLInputElement).value;
  emit('input', value);
  store.dispatch("errors/removeError", props.name);
};

const onFocus = (evt: FocusEvent) => {
  focused.value = true;
  emit('focus', evt);
};

const onBlur = (evt: FocusEvent) => {
  focused.value = false;
  emit('blur', evt);
};

const onAppendClick = () => {
  if (!hasAppendListener.value) return;
  emit('appendclick');
};

</script>


<style></style>
