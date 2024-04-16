<template>
  <validation-provider
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
  </validation-provider>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useValidationProvider } from "vee-validate";

const { errors, setErrors } = useValidationProvider();
const focused = ref(false);
const emits = defineEmits(["focus", "blur", "appendClick", "input"]);

const serverErrors = computed(() => {
  const currentInput = (error) => error.property === name;
  const firstConstraintError = (error) => Object.values(error.constraints)[0];
  return errors.value.filter(currentInput).map(firstConstraintError);
});

const hasAppendListener = computed(() => {
  return !!emits['appendclick'];
});

const listeners = {
  ...emits,
  input: updateValue,
  focus: onFocus,
  blur: onBlur,
};

const slotData = computed(() => {
  return {
    focused: focused.value,
    error: error,
    ...listeners,
  };
});


const hasIcon = computed(() => {
  const { append, prepend } = $slots;
  return (
    append !== undefined ||
    prepend !== undefined ||
    appendIcon !== undefined ||
    prependIcon !== undefined ||
    group
  );
});

function updateValue(evt) {
  const value = evt.target.value;
  emits("input", value);
  setErrors();
}

function onFocus(evt) {
  focused.value = true;
  emits("focus", evt);
}

function onBlur(evt) {
  focused.value = false;
  emits("blur", evt);
}

function onAppendClick() {
  if (!hasAppendListener.value) return;
  emits("appendclick");
}
</script>

<style scoped></style>
