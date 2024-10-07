<main>
  <CalendarOptions bind:showInvoice bind:hideRest />
  {#if isLoggedIn}
    {#await monthlyData}
      Fetching data...
    {:then resolvedData}
      {#if !hideRest}
        <SelectionMenu bind:hideRest />
        <div class="header-image">
          <img width="64" height="64" src="akelhurlatun.png" alt="akelhur">
        </div>

      {/if}
      <div style="margin-left: 15vw">
        <div style="display: contents; font-size: x-large; margin-bottom: 2vh">
          Brut: <span>{$calcMoula.moula} Є</span>
          Total time: <span style="margin-right: 2vw">{$calcMoula.allTimeSpent}h</span>
          Tax (<input type="number" bind:value={$taxPercentage} min="0" max="100" style="width: 3em;" />%): <span>{$calcMoula.tax} Є</span>
          Net: <span>{$calcMoula.afterTax} Є</span>
        </div>
        <button style="display:{hideRest ? 'none' : ''}" class="no-print" on:click="{printElement}">print as PDF</button>
        <p class="print-instructions">
          Note: Please select "Save as PDF" in the print dialog to save this content as a PDF.
        </p>
        <div id="pdf-content">
        {#if !showInvoice}
          <TimeSheet />
        {:else}
          <Invoice />
        {/if}
        </div>
      </div>
    {/await}
  {:else}
    <button id="signin" on:click={login}>
      Login MicroBloat (fix this one day)
    </button>
  {/if}
</main>

<script lang="ts">
  import { signIn } from '$lib/auth.js';
  import TimeSheet from '$components/time-sheet.svelte';
  import CalendarOptions from '$components/calendar-options.svelte';
  import { msalAccount, calcMoula, fetchMonthly, currentMonth } from '$store'; // Import currentMonth store
  import Invoice from '$components/invoice.svelte';
  import SelectionMenu from '$components/selection-menu.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const taxPercentage = writable(0); // Default to 20%
  let monthlyData: Promise<any>; // Initialize without fetch
  let hideRest = false;
  let showInvoice = false;
  let isLoggedIn = false;
  let disabled = false; // State to manage the button's disabled status

  // Utility function to check localStorage availability
  function isLocalStorageAvailable() {
    try {
      const test = '_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Load the tax percentage and check login status on mount (client-side only)
  onMount(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      const savedTaxPercentage = localStorage.getItem('taxPercentage');
      if (savedTaxPercentage !== '') {
        taxPercentage.set(Number(savedTaxPercentage));
      }
      checkLogin();
    }
  });

  // Subscribe to taxPercentage updates to store in localStorage (client-side only)
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    taxPercentage.subscribe(value => {
      if (value)
        localStorage.setItem('taxPercentage', value.toString());
    });
  }

  // Reactive statements to update tax and afterTax calculations
  $: {
    if ($calcMoula) {
      calcMoula.update(moulas => {
        const newTax = moulas.moula * $taxPercentage / 100;
        return { ...moulas, tax: newTax, afterTax: moulas.moula - newTax };
      });
    }
  }

  async function checkLogin() {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      const account = localStorage.getItem('msalAccount');
      if (account) {
        msalAccount.set(account);
        isLoggedIn = true;
        monthlyData = fetchMonthly(0);
      } else {
        isLoggedIn = false;
      }
    }
  }

  async function login() {
    await signIn();
    await checkLogin();
  }

  function printElement() {
    const elementId = 'pdf-content'
    // Get the original body content
    const originalContent = document.body.innerHTML;
    // Get the HTML of the specified element
    const printContent = document.getElementById(elementId)?.outerHTML;

    if (printContent) {
      // Set the body to the content of the specified element
      document.body.innerHTML = printContent;
      // Trigger the print dialog
      window.print();
      // Restore the original body content
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  }


</script>

<style>
  span {
    color: green;
    padding-right: 1vw;
  }
  input {
    text-align: center;
  }
  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;

  }

  @media print {
    .no-print {
      display: none !important;
    }

    /* Add any print-specific styles here */
    #pdf-content {
      /*font-family: 'Arial, sans-serif';*/
      padding: 10mm;
    }
  }

</style>