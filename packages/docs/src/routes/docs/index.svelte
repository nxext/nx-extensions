<script lang="ts">
  import Transition from '$lib/Transition.svelte';
  let showMobileNav = false;

  function toggleMobileNav() {
    showMobileNav = !showMobileNav;
  }
</script>

<div class="h-screen overflow-hidden bg-gray-100 flex flex-col">
  <!-- Top nav-->
  <header class="flex-shrink-0 relative h-16 bg-white flex items-center">
    <!-- Logo area -->
    <div class="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
      <a href="#" class="flex items-center justify-center h-16 w-16 bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:w-20">

      </a>
    </div>

    <!-- Picker area -->
    <div class="mx-auto md:hidden">
      <div class="relative">
        <label for="inbox-select" class="sr-only">Choose inbox</label>
        <select id="inbox-select" class="rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-indigo-600">
          <option>Open</option>

          <option>Archive</option>

          <option>Customers</option>

          <option>Flagged</option>

          <option>Spam</option>

          <option>Drafts</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-2">
          <!-- Heroicon name: solid/chevron-down -->
          <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Menu button area -->
    <div class="absolute inset-y-0 right-0 pr-4 flex items-center sm:pr-6 md:hidden">
      <!-- Mobile menu button -->
      <button on:click={toggleMobileNav} type="button" class="-mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
        <span class="sr-only">Open main menu</span>
        <!-- Heroicon name: outline/menu -->
        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Desktop nav area -->
    <div class="hidden md:min-w-0 md:flex-1 md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <div class="max-w-2xl relative text-gray-400 focus-within:text-gray-500">
          <label for="search" class="sr-only">Search</label>
          <input id="search" type="search" placeholder="Search" class="block w-full border-transparent pl-12 placeholder-gray-500 focus:border-transparent sm:text-sm focus:ring-0">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4">
            <!-- Heroicon name: solid/search -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div class="ml-10 pr-4 flex-shrink-0 flex items-center space-x-10">
        <div class="flex items-center space-x-8">

        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide this `div` based on menu open/closed state -->

    <Transition
      toggle={showMobileNav}
      transitions="transition transform"
      inTransition="ease-out duration-1000"
      inState="opacity-0"
      onState="opacity-100"
      outState="opacity-0"
      outTransition="ease-in duration-1000"
    >

    <div class="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
      <!--
        Off-canvas menu overlay, show/hide based on off-canvas menu state.

        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="hidden sm:block sm:fixed sm:inset-0 sm:bg-gray-600 sm:bg-opacity-75" aria-hidden="true"></div>

      <!--
        Mobile menu, toggle classes based on menu state.

        Entering: "transition ease-out duration-150 sm:ease-in-out sm:duration-300"
          From: "transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
          To: "transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100"
        Leaving: "transition ease-in duration-150 sm:ease-in-out sm:duration-300"
          From: "transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
          To: "transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100"
      -->
      <nav class="fixed z-40 inset-0 h-full w-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-sm sm:w-full sm:shadow-lg" aria-label="Global">
        <div class="h-16 flex items-center justify-between px-4 sm:px-6">
          <a href="#">
            <img class="block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500" alt="Workflow">
          </a>
          {showMobileNav}
          <button on:click={toggleMobileNav} type="button" class="-mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
            <span class="sr-only">Close main menu</span>
            <!-- Heroicon name: outline/x -->
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-2 max-w-8xl mx-auto px-4 sm:px-6">
          <div class="relative text-gray-400 focus-within:text-gray-500">
            <label for="search" class="sr-only">Search all inboxes</label>
            <input id="search" type="search" placeholder="Search all inboxes" class="block w-full border-gray-300 rounded-md pl-10 placeholder-gray-500 focus:border-indigo-600 focus:ring-indigo-600">
            <div class="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
              <!-- Heroicon name: solid/search -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div class="max-w-8xl mx-auto py-3 px-2 sm:px-4">
          <a href="#" class="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100">Inboxes</a>

          <a href="#" class="block rounded-md py-2 pl-5 pr-3 text-base font-medium text-gray-500 hover:bg-gray-100">Technical Support</a>

          <a href="#" class="block rounded-md py-2 pl-5 pr-3 text-base font-medium text-gray-500 hover:bg-gray-100">Sales</a>

          <a href="#" class="block rounded-md py-2 pl-5 pr-3 text-base font-medium text-gray-500 hover:bg-gray-100">General</a>

          <a href="#" class="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100">Reporting</a>

          <a href="#" class="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100">Settings</a>
        </div>
      </nav>
    </div>
    </Transition>
  </header>

  <!-- Bottom section -->
  <div class="min-h-0 flex-1 flex overflow-hidden">
    <!-- Narrow sidebar-->
    <nav aria-label="Sidebar" class="hidden md:block md:flex-shrink-0 md:bg-gray-800 md:overflow-y-auto">
      <div class="relative w-20 flex flex-col p-3 space-y-3">
        <a href="#" class="bg-gray-900 text-white flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg">
          <span class="sr-only">Open</span>
          <!-- Heroicon name: outline/inbox -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </a>

        <a href="#" class="text-gray-400 hover:bg-gray-700 flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg">
          <span class="sr-only">Archive</span>
          <!-- Heroicon name: outline/archive -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </a>

        <a href="#" class="text-gray-400 hover:bg-gray-700 flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg">
          <span class="sr-only">Customers</span>
          <!-- Heroicon name: outline/user-circle -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>

        <a href="#" class="text-gray-400 hover:bg-gray-700 flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg">
          <span class="sr-only">Flagged</span>
          <!-- Heroicon name: outline/flag -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </a>

        <a href="#" class="text-gray-400 hover:bg-gray-700 flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg">
          <span class="sr-only">Spam</span>
          <!-- Heroicon name: outline/ban -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </a>

        <a href="#" class="text-gray-400 hover:bg-gray-700 flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg">
          <span class="sr-only">Drafts</span>
          <!-- Heroicon name: outline/pencil-alt -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </a>
      </div>
    </nav>

    <!-- Main area -->
    <main class="min-w-0 flex-1 border-t border-gray-200 lg:flex">
      <!-- Primary column -->
      <section aria-labelledby="primary-heading" class="min-w-0 flex-1 h-full flex flex-col overflow-hidden lg:order-last">
        <h1 id="primary-heading" class="sr-only">Home</h1>
        <!-- Your content -->
      </section>

      <!-- Secondary column (hidden on smaller screens) -->
      <aside class="hidden lg:block lg:flex-shrink-0 lg:order-first">
        <div class="h-full relative flex flex-col w-96 border-r border-gray-200 bg-gray-100">
          <!-- Your content -->
        </div>
      </aside>
    </main>
  </div>
</div>
