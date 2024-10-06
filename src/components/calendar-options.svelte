<script lang="ts">
  import { fetchMonthly } from '$store';
  import { onDestroy, onMount } from 'svelte';

  let pastMonth = 1;
  export let hideRest: boolean;
  export let showInvoice: boolean;
  $: backgroundColor = showInvoice ? '#b2dfb2' : '#b2dff5';

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      hideRest = false;
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyPress);
    }
  });

  function setPastMonthAndFetch(month: number) {
    pastMonth = month;
    fetchMonthly(pastMonth);
  }
</script>


<div class="container" style="display:{hideRest ? 'none' : ''}">
  <div class="header">
    <h1>Raccoon Inc Calendar ™</h1>
    <a href="/profile">
      <button>Go to Profile Page</button>
    </a>
  </div>
  <div class="controls">
<!--    <button on:click={() => (hideRest = true)}>Printable version <small>(esc to get out)</small></button>-->
    <button style="background-color: {backgroundColor}" on:click={() => (showInvoice = !showInvoice)}>View as {!showInvoice ? 'invoice' : 'timesheet'}</button>
    <div class="month-selector">
      <label for="monthInput">Past Month:</label>
      <div class="preset-buttons">
        {#each [0, 1, 2, 3] as month}
          <button on:click={() => setPastMonthAndFetch(month)}>{month}</button>
        {/each}
      </div>
      <input type="number" min="0" id="monthInput" bind:value={pastMonth} />
      <button on:click={() => fetchMonthly(pastMonth)}>Fetch past months</button>
    </div>
  </div>
</div>

<style>
  .container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 1.5em;
    color: #333;
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }
  /*button {*/
  /*  padding: 10px 15px;*/
  /*  border: 1px solid #ddd;*/
  /*  background-color: #fff;*/
  /*  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);*/
  /*  font-size: 1em;*/
  /*  border-radius: 8px;*/
  /*  cursor: pointer;*/
  /*  transition: background-color 0.3s ease, box-shadow 0.3s ease;*/
  /*}*/
  /*button:hover {*/
  /*  background-color: #f0f0f0;*/
  /*}*/
  /*button:active {*/
  /*  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);*/
  /*}*/
  .month-selector {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .month-selector label {
    font-size: 1em;
  }
  .month-selector input {
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
    text-align: center;
  }
  .preset-buttons {
    display: flex;
    gap: 5px;
  }
  .preset-buttons button {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 0.9em;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }
  .preset-buttons button:hover {
    background-color: #f0f0f0;
  }
  .preset-buttons button:active {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }
  @media (max-width: 600px) {
    .controls {
      flex-direction: column;
    }
    .month-selector {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>