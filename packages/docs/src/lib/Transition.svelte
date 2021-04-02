<script lang="ts">
  import { onMount, tick } from 'svelte';
  export let toggle = undefined;
  export let transitions = '';
  export let inTransition = '';
  export let outTransition = inTransition;
  export let inState = '';
  export let onState = '';
  export let outState = inState;
  export let offVisible = false;
  let div;
  let slot;
  let parent;
  let mounted;
  const STATE = {
    IDLE: 0,
    ENTERING: 1,
    LEAVING: 2,
  };
  let state = STATE.IDLE;
  onMount(async () => {
    mounted = true;
    await tick();
    slot = div.nextElementSibling;
    if (toggle === undefined) {
      slot.hidden = true;
      if (document.readyState === 'complete') {
        setTimeout(initTogglelessTransition, 50);
      } else {
        window.addEventListener('load', () => {
          setTimeout(initTogglelessTransition, 50);
        }, { once: true });
      }
    } else {
      initTransition();
    }
  });
  const initTogglelessTransition = async () => {
    searchParentTransition();
    toggle = parent ? parent.toggle : false;
    initTransition();
    if (! parent) {
      setTimeout(() => { toggle = true }, 200);
    }
  };
  const searchParentTransition = () => {
    let element = slot.parentElement;
    while (
      parent === undefined
      && element
      && document.body !== element
      ) {
      if (element.toggle !== undefined) {
        parent = element;
        parentObserver();
      } else {
        element = element.parentElement;
      }
    }
  };
  const parentObserver = () => {
    new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        toggle = mutation.target.toggle;
      }
    }).observe(parent, {
      attributes: true,
      attributeFilter: [ 'class' ]
    });
  };
  const setClasses = (...classes) => {
    const toRemove = clean(transitions, inTransition, outTransition, inState, onState, outState);
    slot.classList.value = clean(slot.classList.value).split(' ').filter(c => ! toRemove.includes(c)).join(' ') + ' ' + classes.join(' ');
  }
  const clean = (...args) => args.join(' ').replace(/\s+/g, ' ').trim();
  const initTransition = () => {
    slot.toggle = toggle;
    if (toggle) {
      setClasses(transitions, outTransition, onState);
      transitionEndListener();
    } else {
      slot.hidden = ! parent && ! offVisible;
      setClasses(transitions, inState);
      setTimeout(() => {
        setClasses(transitions, inTransition, inState);
        transitionEndListener();
      }, 250);
    }
    if (! toggle) {
      slot.hidden = ! parent && ! offVisible;
    }
    transitionEndListener();
  };
  const transitionEndListener = () => {
    slot.addEventListener('transitionend', (event) => {
      if (
        (event.target.toggle !== undefined)
        && (inTransition === '' || event.target === slot)
        && ((toggle && state === STATE.ENTERING) || (! toggle && state === STATE.LEAVING))
      ) {
        state = STATE.IDLE;
        if (! toggle) {
          setClasses(transitions, inTransition, inState);
          slot.hidden = ! parent && ! offVisible;
        }
      }
    });
  };
  let initialized = false;
  let firstToggleState = toggle;
  $: firstToggleState !== toggle && (initialized = true);
  $: initialized && event(toggle);
  const event = (toggle) => {
    slot.toggle = toggle;
    toggle ? enterEvent() : leaveEvent();
  };
  const enterEvent = () => {
    if (slot.hidden) {
      slot.hidden = false;
      setTimeout(enterEvent, 50);
    } else {
      state = STATE.ENTERING;
      setClasses(transitions, inTransition, onState);
    }
  };
  const leaveEvent = () => {
    state = STATE.LEAVING;
    setClasses(transitions, outTransition, outState);
  };
</script>

<style>
  :global([hidden]) {
    display: none !important;
  }
</style>

<div
  bind:this={div}
  hidden
/>

{#if mounted}
  <slot />
{/if}
