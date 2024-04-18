import { ObjectDirective } from 'vue';

type EventHandler = (event: MouseEvent) => void;

interface ClickOutsideDirective extends ObjectDirective {
  instance?: {
    clickOutsideEvent?: EventHandler;
  };
}

const clickOutsideDirective: ClickOutsideDirective = {
  beforeMount(el, binding, vnode) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },

  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.body.removeEventListener('click', el.clickOutsideEvent);
    }
  },
};

export default clickOutsideDirective;
