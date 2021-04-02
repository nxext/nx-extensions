<script lang="ts">
  import { page } from '$app/stores';
  import ModeSwitch from '$lib/ModeSwitch.svelte';
  import NxextLogo from '$lib/NxextLogo.svelte';
  import { slide } from 'svelte/transition';

  let showMobileNav = false;

  function toggleMobileNav() {
    showMobileNav = !showMobileNav;
  }

  const routes = [
    {
      name: 'Dashboard',
      path: '/'
    },
    {
      name: 'Docs',
      path: '/docs'
    }
  ];
</script>

<nav class="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-500">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <NxextLogo />
        </div>
        <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
          {#each routes as route}
          <a href="{route.path}" class:border-yellow-500={$page.path === route.path} class="border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-4 text-sm font-medium">
            { route.name }
          </a>
          {/each}
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        <ModeSwitch />
      </div>
      <div class="-mr-2 flex items-center sm:hidden">
        <!-- Mobile menu button -->
        <button on:click={toggleMobileNav} type="button" class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <!--
            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          -->
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <!--
            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          -->
          <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  {#if showMobileNav}
  <div class="sm:hidden" id="mobile-menu" transition:slide|local>
    <div class="pt-2 pb-3 space-y-1">
      {#each routes as route}
      <a href="{route.path}" class:border-yellow-500={$page.path === route.path} class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
        {route.name}
      </a>
      {/each}
    </div>
  </div>
  {/if}
</nav>
