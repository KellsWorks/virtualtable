<template>
  <SlideYUpTransition :duration="animationDuration">
    <div class="modal fade"
         @mousedown.self="closeModal"
         :class="[{'show d-block': show}, {'d-none': !show}, {'modal-mini': type === 'mini'}]"
         v-show="show"
         tabindex="-1"
         role="dialog"
         :aria-hidden="!show">

      <div class="modal-dialog modal-dialog-centered"
           :class="[{'modal-notice': type === 'notice', [`modal-${size}`]: size}, modalClasses]">
        <div class="modal-content" :class="[gradient ? `bg-gradient-${gradient}` : '',modalContentClasses]">

          <div class="modal-header" :class="[headerClasses]" v-if="$slots.header">
            <slot name="header"></slot>
            <slot name="close-button">
              <button type="button"
                      class="close"
                      v-if="showClose"
                      @click="closeModal"
                      data-dismiss="modal"
                      aria-label="Close">
                <span :aria-hidden="!show">×</span>
              </button>
            </slot>
          </div>

          <div class="modal-body" :class="bodyClasses">
            <slot></slot>
          </div>
<!--
          <div class="modal-footer" :class="footerClasses">
            <slot name="footer"></slot>
          </div> -->
        </div>
      </div>

      <div v-show="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </SlideYUpTransition>
</template>
<script>
  import { SlideYUpTransition } from "vue3-transitions";

  export default {
    name: "modal",
    components: {
      SlideYUpTransition
    },
    props: {
      show: Boolean,
      showClose: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: "",
        validator(value) {
          let acceptedValues = ["", "notice", "mini"];
          return acceptedValues.indexOf(value) !== -1;
        },
        description: 'Modal type (notice|mini|"") '
      },
      modalClasses: {
        type: [Object, String],
        description: "Modal dialog css classes"
      },
      size: {
        type: String,
        description: 'Modal size',
        validator(value) {
          let acceptedValues = ["", "sm", "lg"];
          return acceptedValues.indexOf(value) !== -1;
        },
      },
      modalContentClasses: {
        type: [Object, String],
        description: "Modal dialog content css classes"
      },
      gradient: {
        type: String,
        description: "Modal gradient type (danger, primary etc)"
      },
      headerClasses: {
        type: [Object, String],
        description: "Modal Header css classes"
      },
      bodyClasses: {
        type: [Object, String],
        description: "Modal Body css classes"
      },
      footerClasses: {
        type: [Object, String],
        description: "Modal Footer css classes"
      },
      animationDuration: {
        type: Number,
        default: 500,
        description: "Modal transition duration"
      }
    },
    methods: {
      closeModal() {
        this.$emit("update:show", false);
        this.$emit("close");
      }
    },
    watch: {
      show(val) {
        let documentClasses = document.body.classList;
        if (val) {
          documentClasses.add("modal-open");
        } else {
          documentClasses.remove("modal-open");
        }
      }
    }
  };
</script>
<style>
  .modal {
    z-index: 4000;
  }
  .modal-dialog.big {
    max-width: 95%;
    margin-bottom: 100px;
  }
  .modal-dialog.margin-bottom {
    margin-bottom: 300px;
  }
  .modal-footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    border-radius: 0;
    background-color: white;
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  }

  .modal.show {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>
