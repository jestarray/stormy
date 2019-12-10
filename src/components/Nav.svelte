<script>
  import { routes } from "@sapper/internal/manifest-client";
  import { stores } from "@sapper/app";
  import meta from "../meta.js";

  import { createEventDispatcher, onMount } from "svelte";
  let display_interactive = false;
  let dispatch = createEventDispatcher();
  $: cloned_meta = JSON.parse(JSON.stringify(meta.structure));
  const { page } = stores();
  const title = meta.title;
  export let segment;

  function is_exercise_page(str) {
    let result = meta.exercise_pages.includes(str);
    return result;
  }
  onMount(() => {
    let item = localStorage.getItem("progress");
    if (!item) {
      localStorage.setItem("progress", JSON.stringify(meta.structure));
    } else if (item) {
      // create a new updated progress that syncs with the latest page changes
      function sync_nav_bar_updates() {
        function exists(src, item) {
          let result = false;
          for (let i = 0; i < src.length; i++) {
            if (src[i].name === item.name) {
              result = true;
              return result;
            }
          }
          return result;
        }
        let stored = JSON.parse(item);

        Object.keys(stored).forEach(key => {
          if (cloned_meta.hasOwnProperty(key)) {
            let updated = cloned_meta[key].map(value => {
              let overwrite = stored[key].find(i => {
                if (i) {
                  return i.name === value.name;
                }
              });
              if (overwrite) {
                return overwrite;
              } else {
                return value;
              }
            });
            stored[key] = updated;
          } else {
            delete stored[key];
          }
        });
        return stored;
      }
      let updated = sync_nav_bar_updates();
      cloned_meta = Object.assign(cloned_meta, updated);
      localStorage.setItem("progress", JSON.stringify(cloned_meta));
    }
  });
  function update_reading_progress() {
    let sub = $page.path.substring(
      $page.path.lastIndexOf("/") + 1,
      $page.path.length
    ); /* 
    console.log(segment);
    console.log(meta.structure[segment]); */
    if (cloned_meta[segment]) {
      for (const p of cloned_meta[segment].values()) {
        if (p.name === sub) {
          p.has_read = !p.has_read;
          cloned_meta = cloned_meta;
          localStorage.setItem("progress", JSON.stringify(cloned_meta));
        }
      }
    }
  }
  /*   let href_paths = new Map();
  for (let route of routes) {
    let res = route.pattern
      .toString()
      .slice(4)
      .replace(/[`~!@#$%^&*()_|+\=?;,.<>\{\}\[\]\\]/gi, "")
      .slice(0, -2);

    //do not add the homepage to the sidebar
    if (res.length > 0) {
      let heading = res.substring(0, res.indexOf("/"));
      if (heading === "") {
        href_paths.set(res, []);
      } else {
        let sub_headings = href_paths.get(heading);
        if (sub_headings !== undefined) {
          sub_headings.push(res.substring(res.indexOf("/") + 1, res.length));
        }
      }
    }
  }
  let top_headings = href_paths.keys(); */

  let hide_nav = false;
</script>

<style>
  nav {
    padding: 0 3em 0 1em;
    background-color: #fafafa;
    width: 15em;
    overflow-y: auto;
    height: 100%;
  }
  .hidden {
    display: none;
  }

  #section {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }

  ol {
    list-style-type: decimal;
    margin: 0.75em;
  }

  /*   ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

 

  .selected::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }
*/
  .selected {
    background-color: rgb(237, 237, 237);
    position: relative;
    display: inline-block;
    width: 100%;
  }
  #sub_section {
    font-weight: normal;
  }
  a {
    text-decoration: none;
    color: #7897f3;
    /* padding: 1em 0.5em; */
  }
  a:hover {
    background-color: rgb(237, 237, 237);
    position: relative;
    display: inline-block;
    width: 100%;
  }
  .hide-bar-button {
    border: none;
    width: 1em;
    background-color: #ff9900;
    cursor: pointer;
  }
  #side-bar {
    display: flex;
    flex: 0 0 auto;
  }
  #tools {
    background-color: #ff9900;
    margin-bottom: 1em;
  }
</style>

<div id="side-bar">
  <button
    class="hide-bar-button"
    on:click={() => {
      hide_nav = !hide_nav;
    }} />
  <nav id="navbar" class={!hide_nav ? 'nav' : 'hidden'}>
    <a href="/">
      <h2>{title}</h2>
    </a>

    <button id="tools" on:click={update_reading_progress}>
      marked as read
    </button>
    <ol id="section">
      {#each meta.root as root_files}
        <h3>
          <a class={segment === root_files ? 'selected' : ''} href={root_files}>
            {root_files}
          </a>
        </h3>
      {/each}

      {#each Object.keys(cloned_meta) as heading}
        <li>
          <h3>
            <a class={segment === heading ? 'selected' : ''} href={heading}>
              {heading.replace(/-/gi, ' ')}
            </a>
          </h3>
          <ol id="sub_section">
            {#each cloned_meta[heading] as sub}
              <li>
                <a
                  rel="prefetch"
                  class={$page.path === '/' + heading + '/' + sub.name ? 'selected' : ''}
                  href={heading + '/' + sub.name}>
                  {sub.name.replace(/-/gi, ' ')}
                  {is_exercise_page(sub.name) ? '🏃' : ''}
                  {sub.has_read ? '✅' : ''}
                </a>
              </li>
            {/each}
          </ol>
        </li>
      {/each}
    </ol>
  </nav>
</div>
