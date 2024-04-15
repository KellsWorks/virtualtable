import { ObjectDirective, DirectiveBinding } from 'vue';

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void;
}

const clickOutside: ObjectDirective<ClickOutsideElement> = {
  beforeMount(el, binding) {
    const onClickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    // Save the event listener reference in the element's property
    el.clickOutsideEvent = onClickOutside;

    // Attach the event listener to the document body
    document.body.addEventListener('click', onClickOutside);
  },
  unmounted(el) {
    // Remove the event listener from the document body
    if (el.clickOutsideEvent) {
      document.body.removeEventListener('click', el.clickOutsideEvent);
    }
  },
};

export default clickOutside;
