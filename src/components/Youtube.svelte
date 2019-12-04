<script>
  export let src = "";
  src = src.replace("watch?v=", "/embed/");
  let is_loaded = false;
</script>

<style>
  .youtube-container {
    height: 100%;
    width: 100%;
    background-color: grey;
    position: relative;
  }
  .load-button {
    position: absolute;
    top: 50%;
    right: 50%;
    font-style: bold;
    color: white;
  }
</style>

<div class="youtube-container">
  {#if !is_loaded}
    <h2>video content</h2>
    <button class="load-button" on:click={() => (is_loaded = !is_loaded)}>
      SHOW
    </button>
  {/if}
  {#if is_loaded}
    <iframe
      title=""
      width="100%"
      height="100%"
      {src}
      frameborder="0"
      allowfullscreen />
  {/if}
</div>
