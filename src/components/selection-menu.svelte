<script lang="ts">
  // @ts-nocheck
  import {
    calendars,
    fetchMonthly,
    selectedCal,
    categories,
    filterByCat,
    byDays,
    allEvents
  } from '$store';

  type Option = {name: string};

  let options: Option[] = $calendars;
  let selectedNames: any = [];

  function handleSelection(event: any) {
    selectedNames = Array.from(
      event.target.selectedOptions,
      (option: any) => option.textContent
    );
  }

  function handleCat(cat: any) {
    allEvents.set($allEvents.filter((e) => e.categories.includes(cat)));
    console.log({$allEvents}, cat);
  }

  $: selectedIds = selectedNames.map((selectedName: string) => {
    const option: any = options.find(
      (option: any) => option.name === selectedName
    );
    selectedCal.set(option);
    fetchMonthly(0);

    return option ? option.id : null;
  });
</script>

<div style="display:flex">
  <h2>Calendar</h2>
  <select multiple on:change={handleSelection}>
    {#each options as option}
      <option value={option.name}>{option.name}</option>
    {/each}
  </select>

  <!-- <h2>Categories</h2>
  <select multiple on:change={handleCat}>
    {#each $categories as option}
      <option value={option}>{option}</option>
    {/each}
  </select> -->
</div>
<p>Selected IDs: {selectedIds.join(', ')}</p>
<p>Selected names: {selectedNames.join(', ')}</p>

<style>
  button {
    margin-right: 1vw;
    border: 0px;
    box-shadow: 0px 0px 0px 0px;
    font-size: large;
    border-radius: 2%;
  }
</style>
