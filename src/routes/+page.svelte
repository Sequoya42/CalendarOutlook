<main>
  <CalendarOptions bind:showInvoice bind:hideRest />
  {#if isLoggedIn}
    {#await monthlyData}
      Fetching data...
    {:then resolvedData}
      {#if !hideRest}
        <SelectionMenu bind:hideRest />
      {/if}
      <div style="margin-left: 15vw">
        <div style="display: contents; font-size: x-large; margin-bottom: 2vh">
          Brut: <span>{$calcMoula.moula} Є</span>
          Total time: <span style="margin-right: 2vw">{$calcMoula.allTimeSpent}h</span>
          Tax (<input type="number" bind:value={$taxPercentage} min="0" max="100" style="width: 3em;" />%): <span>{$calcMoula.tax} Є</span>
          Net: <span>{$calcMoula.afterTax} Є</span>
        </div>
        <div id="pdf-content">
        {#if !showInvoice}
          <TimeSheet />
        {:else}
          <Invoice />
        {/if}
        </div>

      </div>
      <button on:click={saveAsPDF} {disabled}>Save as PDF</button> <!-- Bind 'disabled' -->
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
  import jsPDF from 'jspdf';
  import html2canvas from "html2canvas";

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

  // Function to save the content as a PDF
  async function saveAsPDF() {
    if (typeof window === 'undefined') return; // Ensure code runs only in the browser

    const content = document.getElementById('pdf-content');

    if (content) {
      const year = new Date().getFullYear();
      const filename = `${$currentMonth}_${year}.pdf`;

      // Disable the button
      let disabled = true;

      try {
        const canvas = await html2canvas(content, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', putOnlyUsedFonts: true });

        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'JPEG', 10, 10, pdfWidth, pdfHeight);
        doc.setFont('times', 'bold');
        doc.save(filename);
      } finally {
        setTimeout(() => {
          // Enable the button after 1 second
          disabled = false;
        }, 1000);
      }
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
</style>