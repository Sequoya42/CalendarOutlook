<script lang="ts">
  import { signIn } from "$lib/auth.js";
  import TimeSheet from "$components/time-sheet.svelte";
  import { msalAccount, calcMoula, byDays, fetchMonthly } from "$lib/store";
  import { get } from "svelte/store";

  let test = login();
  let pastMonth = 1;
  let hideRest = false;
  let showInvoice = false;

  async function login() {
    $msalAccount = await sessionStorage.getItem("msalAccount");
    console.log("Login called", get(msalAccount));
    if (get(msalAccount)) {
      console.log("GOT ACCOUNT", get(msalAccount));
    } else {
      await signIn();
    }
    return await fetchMonthly(0);
  }
</script>

<div style="display:{hideRest ? 'none' : ''}">
  <button on:click="{() => (hideRest = true)}">View as timeSheet</button>
  <button on:click="{() => (hideRest = true) && (showInvoice = true)}"
    >View as invoice</button
  >
  <h1>Bloatamax calendar ™</h1>
  <input type="number" min="1" bind:value="{pastMonth}" />
  <button on:click="{() => fetchMonthly(pastMonth)}">Fetch past months</button>
</div>

<div style="margin-left: 15vw">
  {#await test}
    Fetching data...
  {:then test}
    {#if !hideRest}
      <div style="container; font-size: x-large; margin-bottom: 2vh">
        Brut: <span>{$calcMoula.moula} Є</span>
        Total time :
        <span style="margin-right: 2vw">{$calcMoula.allTimeSpent}h</span>
        Tax (20%): <span>{$calcMoula.tax} Є</span>
        Net: <span>{$calcMoula.afterTax} Є</span>
      </div>
    {/if}
    <TimeSheet />
  {:catch _someError}
    <button id="signin" on:click="{() => (test = login())}">
      Login MicroBloat
    </button>
  {/await}
</div>

<style>
  span {
    color: green;
    padding-right: 1vw;
  }
</style>
