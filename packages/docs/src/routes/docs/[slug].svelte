<script context="module">
  export async function load({ page, fetch }) {
    const res = await fetch(`/docs/${page.params.slug}.json`);
    if (res.ok) {
      const { post, next, prev } = await res.json();
      return { props: { post, next, prev } };
    }
    return {
      status: res.status,
      error: new Error(`Could not find article '${page.params.slug}'`)
    };
  }
</script>

<script>
  export let post;
  export let next;
  export let prev;
  $: pagePrevious = prev ? { url: `/docs/${prev.slug}`, subtitle: prev.title } : undefined;
  $: pageNext = next ? { url: `/docs/${next.slug}`, subtitle: next.title } : undefined;
</script>

<svelte:head>
  <meta property="og:type" content="article" />
</svelte:head>

<div>
  Titel: {post.title}
  Description: {post.description}

  Post:

  {@html post.html}
</div>
