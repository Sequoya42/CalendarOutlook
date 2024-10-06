  <div class="container" style="display:{hideRest ? 'none' : ''}">
    <div class="dropdown">
      <label for="calendarSelect">Calendar</label>
      <select id="calendarSelect" on:change={handleSelection}>
        {#each options as option}
          <option value={option.name}>{option.name}</option>
        {/each}
      </select>
    </div>

    <div class="dropdown">
      <label for="categoriesSelect">Categories</label>
      <select id="categoriesSelect" on:change={handleCat}>
        {#each ['all', 'none', ...$categories] as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  </div>

<script lang="ts">
  export let hideRest: boolean;
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

  <style>
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      background-color: #f9f9f9;
      border-radius: 8px;
      gap: 4vw;
      border-bottom: 1px solid #ddd;
      padding-bottom: 2vh;
      margin-bottom: 2vh;
    }
    .dropdown {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    label {
      font-size: 1em;
      color: #333;
    }
    select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
      background-color: #fff;
      appearance: none;
      cursor: pointer;
    }
    /*option {*/
    /*  padding: 10px;*/
    /*}*/
    /*option:hover {*/
    /*  background-color: #f0f0f0;*/
    /*}*/
    /*option:active {*/
    /*  background-color: #e0e0e0;*/
    /*}*/
  </style>