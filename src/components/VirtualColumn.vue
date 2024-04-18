<template>
  <div
    class="virtual__column"
    :class="{ editable }"
    ref="tdRef"
    @click="enableEdit"
    v-click-outside="blur"
  >
    <template v-if="column">
      <div v-if="editable && !editing" class="edit">
        <i class="fa fa-pencil-alt" />
      </div>
      <component
        v-on="emits"
        v-if="column.component"
        :is="column.component"
        :prop="prop"
        :item="item"
        :editing="editing"
        ref="inputRef"
        @input="blur"
      />
      <template v-else-if="editing">
        <el-select
          :value="localValue"
          ref="inputRef"
          v-if="column.type === 'select'"
          automatic-dropdown
          @input="blur"
        >
          <el-option
            v-for="option in column.options || []"
            :key="typeof option === 'string' ? option : option.value"
            :value="typeof option === 'string' ? option : option.value"
            :label="typeof option === 'string' ? option : option.label"
          ></el-option>
        </el-select>
        <flat-pickr
          v-else-if="column.type === 'date'"
          ref="inputRef"
          :config="{
            allowInput: true,
            altFormat: 'd-m-Y',
            altInput: true,
            utc: true,
            dateFormat: 'Z',
          }"
          class="form-control datepicker"
          v-model="localValue"
          @click.prevent.stop
          @on-change="blur"
        />
        <flat-pickr
          v-else-if="column.type === 'datetime'"
          ref="inputRef"
          :config="{
            allowInput: true,
            altFormat: 'd-m-Y H:i',
            altInput: true,
            enableTime: true,
            time_24hr: true,
          }"
          class="form-control datepicker"
          v-model="localValue"
          @click.prevent.stop
          @on-change="blur"
        />
        <base-switch
          v-else-if="column.type && column.type.startsWith('bool')"
          ref="inputRef"
          v-model="localValue"
          class="mr-1"
          on-text="Ja"
          off-text="Nee"
          @changed="blur"
        ></base-switch>
        <currency-input
          v-else-if="column.type === 'currency'"
          ref="inputRef"
          v-model="localValue"
          @blur="blur"
        />
        <input
          v-else-if="column.type === 'checkbox'"
          ref="inputRef"
          type="checkbox"
          v-model="localValue"
          @input="blur"
        />
        <el-input
          v-else-if="column.type === 'number'"
          ref="inputRef"
          type="number"
          @click.prevent
          :max="column.max"
          :min="column.min"
          v-model="localValue"
          @blur="blur"
        />
        <el-input
          v-else
          ref="inputRef"
          v-model="localValue"
          @click.prevent
          @blur="blur"
        ></el-input>
      </template>
      <template v-else>
        <p
          v-if="column.type && column.type.startsWith('bool')"
          class="badge badge-sm m-0"
          :class="{
            'badge-success': prop && typeof prop === 'boolean',
            'badge-danger': !prop && typeof prop === 'boolean',
            'badge-primary': typeof prop !== 'boolean',
          }"
        >
          {{
            typeof prop === "boolean" ? (prop ? "Ja" : "Nee") : "Niet ingevuld"
          }}
        </p>
        <p
          v-else-if="column.type === 'currency'"
          v-html="euro(prop)"
          class="m-0"
        ></p>
        <p v-else-if="column.type === 'date'" class="m-0">
          {{ dateFormat(prop) }}
        </p>
        <p v-else-if="column.type === 'datetime'" class="m-0">
          {{ dateTimeFormat(prop) }}
        </p>
        <a
          :href="column.url.replace(':id', (typeof item === 'object' && item !== null && 'id' in item) ? item.id : '')"
          v-else-if="column.url"
          class="m-0"
          >{{ prop }}</a
        >
        <p v-else-if="column.type === 'select'" class="m-0">
          {{
            (column.options.find((o: any) => o.value === prop) || { label: prop })
              .label
          }}
        </p>
        <a v-else-if="column.type === 'phone'" :href="`tel:${prop}`">{{
          prop
        }}</a>
        <a v-else-if="column.type === 'email'" :href="`mailto:${prop}`">{{
          prop
        }}</a>
        <p v-else class="m-0">{{ prop }}</p>
      </template>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  toRefs,
  PropType,
  defineProps,
  defineEmits,
} from "vue";
import {
  isChildOfClass,
  euro,
  dateFormat,
  dateTimeFormat,
  dateFormatISO,
} from "@/utils/functions";
import CurrencyInput from "@/components/CurrencyInput.vue";

const emits = defineEmits(["input"]);
const props = defineProps({
  item: {
    type: [Object, String] as PropType<Object | String>,
    required: true,
  },
  column: {
    type: Object,
    required: true,
  },
  value: {
    type: [String, Number, Boolean, Array] as PropType<
      string | number | boolean | any[]
    >,
    default: () => "",
  },
});

const { item, column } = toRefs(props);
const tdRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const localValue = ref<any>(null);
const editing = ref(false);

watch(editing, (__new__) => {
  if (__new__ && props.value !== localValue.value) localValue.value = props.value;
});

watch(
  () => props.value,
  () => {
    localValue.value = props.value;
  },
  { immediate: true }
);

const editable = computed(() => {
  if (!column.value) return false;

  if (typeof column.value.editable === "function") {
    return column.value.editable(item.value);
  }
  return column.value.editable;
});

const prop = computed(() => {
  if (!column.value) return undefined;
  return getProp(column.value.prop);
});

const blur = (value: any) => {
  if (
    value &&
    value.target &&
    isChildOfClass(value.target, "flatpickr-calendar")
  )
    return;
  if (!editing.value) return;
  if (Array.isArray(value)) {
    const [date] = value;
    emits("input", date ? dateFormatISO(date) : null);
  } else {
    if ((value && value.target) || typeof value === "undefined") {
      emits("input", localValue.value);
    } else {
      emits("input", value);
    }
  }
  setTimeout(() => (editing.value = false), 100);
};

const getProp = (name?: string, prop = item.value) => {
  if (!name) {
    if (typeof column.value?.formatter === "function") {
      return column.value.formatter(prop);
    } else {
      return prop;
    }
  }
  const keys = name.split(".");
  const key = keys.shift();
  const value = prop[key as keyof typeof prop];

  if (keys.length > 0) {
    return getProp(keys.join("."), value);
  }
  if (typeof column.value?.formatter === "function") {
    return column.value.formatter(value);
  }
  return value;
};

// const onClick = () => {
//   if (editing.value) return;
//   if (!column.value) return;
//   if (!editable.value) return;
//   editing.value = !editing.value;
// };

const enableEdit = () => {
  setTimeout(() => {
    if (editing.value) return;
    if (!editable.value) return;
    editing.value = true;

    queueMicrotask(() => {
      if (inputRef.value && inputRef.value.focus) {
        inputRef.value.focus();
        return;
      }

      const input = tdRef.value?.querySelector('input:not([type="hidden"])');
      if (input instanceof HTMLInputElement && input.focus) {
        input.focus();
        return;
      }

      const tabIndexElement = tdRef.value?.querySelector(
        '*[tabindex]:not([type="hidden"])'
      );
      if (tabIndexElement instanceof HTMLElement && tabIndexElement.focus) {
        tabIndexElement.focus();
        return;
      }

      if (tdRef.value) {
        tdRef.value.focus();
      }
    });
  }, 50);
};
</script>

<style>
.virtual__column {
  /* border-left: 1px solid rgb(150, 150, 150); */
  /*border-right: 1px solid rgb(224, 224, 224);*/
  border-bottom: 1px solid rgb(224, 224, 224);
  /* border: 1px solid black; */
  display: flex;
  align-items: center;
  /* min-height: 56px; */
  position: relative;
  padding: 0.2rem;

  z-index: 11;
  overflow-y: visible;
  overflow-x: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.virtual__column *:not(.badge) {
  margin-bottom: 0;
}

.virtual__column.editable:hover {
  background-color: rgb(241, 241, 241);
}
.virtual__column:hover .edit {
  display: flex;
}

.edit {
  display: none;
  align-items: center;
  position: absolute;
  right: 0;
  margin-right: 1rem;
  height: 100%;
}
</style>
