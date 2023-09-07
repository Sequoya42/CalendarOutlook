<script lang="ts">
  import {fetchMonthly} from '$store/calendar';

  let pastMonth = 1;
  export let hideRest: boolean;
  export let showInvoice: boolean;
</script>

<div style="display:{hideRest ? 'none' : ''}">
  <button on:click={() => (hideRest = true)}>View as timeSheet</button>
  <button on:click={() => (showInvoice = true)}>View as invoice</button>
  <h1>Bloatamax calendar ™</h1>
  <input
    type="number"
    min="1"
    bind:value={pastMonth} />
  <button on:click={() => fetchMonthly(pastMonth)}>Fetch past months</button>
</div>

<style>
</style>
