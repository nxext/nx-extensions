<script lang="ts">
  import Navigation from '$lib/Navigation.svelte';
  import { mode, ModeType } from '../store';
</script>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class:dark={$mode === ModeType.Dark}>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-700 dark:text-gray-200">

    <Navigation/>

      <!--<header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight">
            Dashboard
          </h1>
        </div>
      </header>-->
    <main>
      <slot/>
    </main>
  </div>
</div>
