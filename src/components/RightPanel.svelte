<script>
  import { stores } from "@sapper/app";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  import ExercisePanel from "./ExercisePanel.svelte";
  const { page } = stores();
  export let src;
  let show_panel = false;
  let exercises = {};

  let MAX_INDEX = 0;
  let index_num = 0;
  let prefetched = new Map();
  let prefetched_problems = new Map();
  let isHandlerDragging = false;
  let hide_content = true;
  $: progress = [];
  function updateProgress() {
    progress[index_num] = true;
    localStorage.setItem(src, JSON.stringify(progress));
  }

  function setProgress(src) {
    let item = localStorage.getItem(src);
    let contents = JSON.parse(item);
    if (item) {
      progress = contents;
      prefetched_problems.set(src, contents);
    } else {
      //if not found, initalize
      let initial = [];
      for (let i = 0; i < Object.keys(exercises).length; i++) {
        initial.push(false);
      }
      localStorage.setItem(src, JSON.stringify(initial));
    }
  }
  onMount(async function() {
    let response = await fetch(`exercises/${src}.json`);
    exercises = await response.json();
    prefetched.set(src, exercises);
    let exercise_questions = Object.keys(exercises);
    MAX_INDEX = exercise_questions.length;

    setProgress(src);

    let wrapper = document.getElementById("area");
    let left_panel = document.getElementById("main");
    let handler = document.getElementById("right-panel-controller");
    let right_panel = document.getElementById("right-panel");

    left_panel.style.flexGrow = 1;

    document.addEventListener("mouseup", e => {
      isHandlerDragging = false;
    });
    document.addEventListener("touchend", e => {
      isHandlerDragging = false;
    });

    let adjust = e => {
      var width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      let clientX = e.clientX;
      if (isHandlerDragging) {
        if (e.touches) {
          clientX = e.touches[0].clientX;
        } else {
          e.preventDefault();
        }

        // Get offset
        let containerOffsetLeft = wrapper.getBoundingClientRect().left;
        // Get x-coordinate of pointer relative to container
        let pointerRelativeXpos = clientX - containerOffsetLeft;
        // * Set flex-grow to 0 to prevent it from growing
        left_panel.style.width = pointerRelativeXpos + "px";
        left_panel.style.flexGrow = 0;

        let right_panel_width = width - clientX;
        right_panel.style.width = right_panel_width + "px";
        right_panel.style.flexGrow = 0;
      }
    };

    document.addEventListener("mousemove", adjust);
    document.addEventListener("touchmove", adjust);
  });
  function increment() {
    if (index_num < MAX_INDEX - 1) {
      index_num++;
    } else if (index_num >= MAX_INDEX - 1) {
      index_num = 0;
    }
  }
  function decrement() {
    if (index_num > 0) {
      index_num--;
    } else if (index_num <= 0) {
      index_num = MAX_INDEX - 1;
    }
  }
  afterUpdate(async function() {
    if (!prefetched.has(src)) {
      let response = await fetch(`exercises/${src}.json`);
      exercises = await response.json();
      MAX_INDEX = Object.keys(exercises).length;
      prefetched.set(src, exercises);
    } else if (prefetched.has(src)) {
      exercises = prefetched.get(src);
      MAX_INDEX = Object.keys(exercises).length;
    }
    if (!prefetched_problems.has(src)) {
      setProgress(src);
    }
  });
</script>

<style>
  button {
    -webkit-appearance: none;
    background: transparent;
    border: 0;
    outline: 0;
  }

  .arrow {
    cursor: pointer;
  }

  .left:hover polyline,
  .left:focus polyline {
    stroke-width: 3;
  }

  .left:active polyline {
    stroke-width: 6;
    transition: all 100ms ease-in-out;
  }

  .right:hover polyline,
  .right:focus polyline {
    stroke-width: 3;
  }

  .right:active polyline {
    stroke-width: 6;
    transition: all 100ms ease-in-out;
  }

  polyline {
    transition: all 250ms ease-in-out;
  }

  /*
  Hide radio button (the round disc)
  we will use just the label to create pushbutton effect
*/
  input[type="radio"] {
    display: none;
    margin: 10px;
  }

  /*
  Change the look'n'feel of labels (which are adjacent to radiobuttons).
  Add some margin, padding to label
*/
  .default-radio {
    display: inline-block;
    margin: -2px;
    padding: 4px 12px;
    background-color: #e7e7e7;
    border-color: #ddd;
  }

  .correct-radio {
    display: inline-block;
    margin: -2px;
    padding: 4px 12px;
    background-color: greenyellow;
    border-color: #ddd;
  }
  /*
 Change background color for label next to checked radio button
 to make it look like highlighted button
*/
  input[type="radio"]:checked + label {
    background-image: none;
    background-color: skyblue;
  }

  #content {
    flex: 1 1;
  }
  .hidden * {
    display: none;
    width: 0px;
  }
  #right-panel-controller {
    /*   border: none;
    width: 1em;
    background-color: #ff9900;
    cursor: pointer; */
    width: 1em;
    padding: 0;
    cursor: ew-resize;
    flex: 0 0 auto;
    background-color: #ff9900;
  }

  #right-panel {
    display: flex;
  }
  #wrapper {
    display: flex;
    justify-content: space-between;
  }
  #show-exercise-panel {
    display: flex;
    flex: 0 0 auto;
    width: 50%;
  }
  #radio-selector {
    display: flex;
    flex: 0 0;
  }
</style>

<div id="right-panel">
  <div
    id="right-panel-controller"
    on:mousedown={() => {
      isHandlerDragging = true;
      hide_content = false;
    }}
    on:touchstart={() => {
      isHandlerDragging = true;
      hide_content = false;
    }} />
  <div id="wrapper" class={hide_content ? 'hidden' : ''}>
    <button class="arrow left" on:click={decrement}>
      <svg width="60px" height="80px" viewBox="0 0 50 80" xml:space="preserve">
        <polyline
          fill="none"
          stroke="#000000"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          points=" 45.63,75.8 0.375,38.087 45.63,0.375 " />
      </svg>
    </button>
    <div id="content">
      <div id="radio-selector">
        {#each Object.entries(exercises) as [question, data], i}
          <input
            type="radio"
            id={i}
            name="radios"
            value={i}
            checked={index_num === i}
            class={progress[i] ? 'correct-radio' : 'default-radio'}
            on:click={() => {
              index_num = i;
            }} />
          <label
            class={progress[i] ? 'correct-radio' : 'default-radio'}
            for={i}>
            {i}
          </label>
        {/each}
      </div>
      <ExercisePanel
        data={exercises}
        index={index_num}
        on:next={() => {
          increment();
        }}
        on:correct={() => {
          updateProgress();
        }} />
    </div>
    <button class="arrow right" on:click={increment}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="60px"
        height="80px"
        viewBox="0 0 50 80"
        xml:space="preserve">
        <polyline
          fill="none"
          stroke="#000000"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          points=" 0.375,0.375 45.63,38.087 0.375,75.8 " />
      </svg>
    </button>
  </div>
</div>
