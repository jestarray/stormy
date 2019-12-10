<script>
  import Nav from "../components/Nav.svelte";
  import RightPanel from "../components/RightPanel.svelte";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";

  import meta from "../meta.js";
  import { stores } from "@sapper/app";
  const { page } = stores();

  export let segment;
  let current_page_name;
  $: current_page_name = $page.path.substring(
    $page.path.lastIndexOf("/") + 1,
    $page.path.length
  );

  function is_exercise_page(src) {
    let result = meta.exercise_pages.includes(src);
    return result;
  }
  $: show_right_side_panel = is_exercise_page(current_page_name);
</script>

<style>
  main {
    margin: 1em 0 0 1em;
    flex: 1 1 auto;
    overflow: auto;
  }
  #area {
    display: flex;
    flex: 1 1 auto;
    height: 100vh; /* fixed sidebar may break remembering scroll position*/
    overflow: hidden;
  }
</style>

<div id="area">
  <Nav {segment} />
  <main id="main">
    <slot />
  </main>
  <!-- See Side.svelte for a per page implementation -->

  {#if show_right_side_panel}
    <RightPanel src={`${current_page_name}`} />
  {/if}
</div>
