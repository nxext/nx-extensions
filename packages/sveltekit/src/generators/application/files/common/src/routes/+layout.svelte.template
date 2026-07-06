<script lang="ts">
    import type { Snippet } from 'svelte';
    import { resolve } from '$app/paths';
    import '../app.css'

    let { children }: { children: Snippet } = $props();
</script>

<nav>
    <ul>
        <li>
            <a href={resolve('/')}>Home</a>
        </li>
    </ul>
</nav>

{@render children()}