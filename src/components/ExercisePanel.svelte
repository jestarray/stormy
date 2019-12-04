<script>
  import { createEventDispatcher } from "svelte";
  import { onMount, beforeUpdate, afterUpdate } from "svelte";
  export let data;
  export let index;

  const dispatch = createEventDispatcher();

  $: is_selected_question = i => {
    return i === index;
  };

  let chosen_answer = "";
  let enable_next = false;
  function check_answer() {
    let answers = Object.values(data);
    let answer = answers[index].answer;
    //warning! coersion checking answers
    let result = answer == chosen_answer;
    if (chosen_answer === "") {
      result = false;
    }
    if (result === true) {
      enable_next = true;
      dispatch("correct");
    }
    return result;
  }
  $: is_submittable = chosen_answer === "";
  let enter_for_next = false;
</script>

<style>
  .hidden {
    display: none;
  }
  .choice {
    margin: 1em;
  }
</style>

<div
  on:keydown={e => {
    if (e.keyCode === 13) {
      check_answer();
      if (enter_for_next === true) {
        dispatch('next');
        enable_next = false;
        chosen_answer = '';
        enter_for_next = false;
      } else if (enter_for_next === false) {
        enter_for_next = true;
      }
    }
  }}>
  {#each Object.entries(data) as [question, data], i}
    <div id={i} class={is_selected_question(i) ? '' : 'hidden'}>
      <h2>{question}</h2>
      {#if data.type === 'choice'}
        {#each data.options as choice, choice_index}
          <div class="choice">
            <input
              type="radio"
              name="choice"
              value={choice_index}
              on:click={() => {
                chosen_answer = choice_index;
              }} />
            <label>{choice}</label>
          </div>
        {/each}
      {/if}
      {#if data.type === 'fill'}
        <div class="choice">
          <input type="text" placeholder="answer" bind:value={chosen_answer} />
        </div>
      {/if}
    </div>
  {/each}
  {#if enable_next}
    <button
      on:click={() => {
        dispatch('next');
        enable_next = false;
        chosen_answer = '';
      }}>
      next
    </button>
  {:else}
    <button on:click={check_answer} disabled={is_submittable} on:keydown>
      submit
    </button>
    <i>(or hit enter key)</i>
  {/if}
</div>
