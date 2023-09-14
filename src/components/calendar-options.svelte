<script lang="ts">
  import {fetchMonthly} from '$store';

  let pastMonth = 1;
  export let hideRest: boolean;
  export let showInvoice: boolean;
</script>

<div style="display:{hideRest ? 'none' : ''}">
  <button on:click={() => (hideRest = true)}>Printable version</button>
  <button on:click={() => (showInvoice = !showInvoice)}
    >View as {!showInvoice ? 'invoice' : 'timesheet'}
  </button>
  <input type="number" min="1" bind:value={pastMonth} />
  <button on:click={() => fetchMonthly(pastMonth)}>Fetch past months</button>
  <h1>Bloatamax calendar ™</h1>
</div>

<style>
  button {
    margin-right: 1vw;
    border: 0px;
    box-shadow: 0px 0px 0px 0px;
    font-size: large;
    border-radius: 2%;
  }
</style>
