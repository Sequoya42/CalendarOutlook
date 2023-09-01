<script lang="ts">
  import { signIn } from "$lib/toolbox/auth.js";
  import { aggregateEvents, getEvents } from "$lib/toolbox/graph.js";
  import TimeSheet from "$lib/time-sheet.svelte";

  let test = login();
  let pastMonth = 1;
  let hideRest = false;
  let msalAccount: any = null;
  let calcMoula = {
    allTimeSpent: 0,
    moula: 0,
    tax: 0,
    afterTax: 0,
  };
  let byDays = {};

  async function fetchMonthly(num = 0) {
    let events = await getEvents(num);
    let { data, allTimeSpent, byDay } = aggregateEvents(
      events.value,
      0,
      msalAccount
    );
    byDays = byDay;
    let moula = allTimeSpent * 75;
    let tax = (moula * 20) / 100;
    let afterTax = moula - tax;
    calcMoula = { allTimeSpent, moula, tax, afterTax };
    console.log({ calcMoula });
    return data;
  }
  async function login() {
    msalAccount = await sessionStorage.getItem("msalAccount");
    console.log("Login called", msalAccount);
    if (msalAccount) {
      console.log("GOT ACCOUNT", msalAccount);
    } else {
      await signIn();
    }
    return await fetchMonthly(0);
    // let events = await getEvents();
    // let { data, allTimeSpent, byDay } = aggregateEvents(
    //   events.value,
    //   0,
    //   msalAccount
    // );
    // byDays = byDay;
    // let moula = allTimeSpent * 75;
    // let tax = (moula * 20) / 100;
    // let afterTax = moula - tax;
    // calcMoula = { allTimeSpent, moula, tax, afterTax };
    // return data;
  }
</script>

<div style="display:{hideRest ? 'none' : ''}">
  <button on:click={() => (hideRest = true)}>View as timeSheet</button>
  <h1>Bloatamax calendar ™</h1>
  <input type="number" min="1" bind:value={pastMonth} />
  <button on:click={() => fetchMonthly(pastMonth)}>Fetch past months</button>
</div>

<div style="margin-left: 15vw">
  {#await test}
    Fetching data...
  {:then test}
    {#if !hideRest}
      <div style="container; font-size: x-large; margin-bottom: 2vh">
        Brut: <span>{calcMoula.moula} Є</span>
        Total time :
        <span style="margin-right: 2vw">{calcMoula.allTimeSpent}h</span>
        Tax (20%): <span>{calcMoula.tax} Є</span>
        Net: <span>{calcMoula.afterTax} Є</span>
      </div>
    {/if}
    <TimeSheet {byDays} />
  {:catch _someError}
    <button id="signin" on:click={() => (test = login())}>
      Login MicroBloat
    </button>
  {/await}
</div>

<style>
  span {
    color: green;
    padding-right: 1vw;
  }

  .container {
    font-size: large;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
