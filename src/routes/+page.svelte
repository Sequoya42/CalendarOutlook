<script lang="ts">
  import {signIn} from '$lib/auth.js';
  import TimeSheet from '$components/time-sheet.svelte';
  import CalendarOptions from '$components/calendar-options.svelte';
  import {msalAccount, calcMoula, fetchMonthly} from '$store';
  import Invoice from '$components/invoice.svelte';

  let monthlyData: any = fetchMonthly(0);
  let hideRest: boolean = false;
  let showInvoice: boolean = true;
  /* TODO
the await block makes no sense.
Needs to fetch data if logged in, need to login if not logged in.
Different things.
Use a load function instead of await block ?
or keep the await block but sub components, not logged or logged
instead of this catch block
 */
  async function login() {
    $msalAccount = await sessionStorage.getItem('msalAccount');
    if ($msalAccount) {
      console.log('GOT ACCOUNT', $msalAccount);
    } else {
      await signIn();
    }
  }
</script>

<CalendarOptions bind:showInvoice bind:hideRest />
<div style="margin-left: 15vw">
  {#await monthlyData}
    Fetching data...
  {:then monthlyData}
    {#if !hideRest}
      <div style="container; font-size: x-large; margin-bottom: 2vh">
        Brut: <span>{$calcMoula.moula} Є</span>
        Total time :
        <span style="margin-right: 2vw">{$calcMoula.allTimeSpent}h</span>
        Tax (20%): <span>{$calcMoula.tax} Є</span>
        Net: <span>{$calcMoula.afterTax} Є</span>
      </div>
    {/if}
    {#if !showInvoice}
      <TimeSheet />
    {:else}
      <Invoice />
    {/if}
  {:catch _someError}
    <button id="signin" on:click={() => (monthlyData = login())}>
      Login MicroBloat
      {_someError}
    </button>
  {/await}
</div>

<style>
  span {
    color: green;
    padding-right: 1vw;
  }
</style>
