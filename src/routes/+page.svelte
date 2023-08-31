<script lang="ts">
  import { signIn } from "$lib/toolbox/auth.js";
  import { aggregateEvents, getEvents } from "$lib/toolbox/graph.js";
  import TimeSheet from "$lib/time-sheet.svelte";

  let test = login();
  let msalAccount: any = null;
  let calcMoula = {
    allTimeSpent: 0,
    moula: 0,
    tax: 0,
    afterTax: 0,
  };
  let byDays = {};

  async function login() {
    msalAccount = await sessionStorage.getItem("msalAccount");
    console.log("Login called", msalAccount);
    if (msalAccount) {
      console.log("GOT ACCOUNT", msalAccount);
    } else {
      await signIn();
    }

    type ByDay = {
      timeSpent: number;
      subject: string[];
      isMeeting: boolean;
    };

    type ByDays = Record<string, ByDay>;

    let events = await getEvents();
    let { data, allTimeSpent, byDay } = aggregateEvents(
      events.value,
      0,
      msalAccount
    );
    console.log({ byDay });
    byDays = byDay as ByDays;
    let moula = allTimeSpent * 75;
    let tax = (moula * 20) / 100;
    let afterTax = moula - tax;
    calcMoula = { allTimeSpent, moula, tax, afterTax };
    return data;
  }
</script>

<h1>Bloatamax calendar ™</h1>
<div class="container" style="font-size: large">
  {#await test}
    Fetching data...
  {:then test}
    <div style="font-size: x-large; margin-bottom: 2vh">
      Brut: <span>{calcMoula.moula} Є</span>
      Total time :
      <span style="margin-right: 2vw">{calcMoula.allTimeSpent}h</span>
      Tax (20%): <span>{calcMoula.tax} Є</span>
      Net: <span>{calcMoula.afterTax} Є</span>
    </div>
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

  .gridCal {
    max-width: 60vw;
    margin-top: 1vh;
    display: grid;
    grid-template-columns: 1fr 1fr 5fr;
    grid-row-gap: 2vh;
  }

  .calCell {
    margin: 2px;
    font-weight: bolder;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  .isMeeting {
    color: #3f51b5;
    /* font-weight: bolder; */
  }

  .subject {
    margin: 1vh 0.5vw;
  }
</style>
