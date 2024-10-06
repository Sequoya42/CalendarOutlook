<script lang="ts">
  import { onMount } from "svelte";
  import { calcMoula, totalDays, msalName } from '$store';
  import type { ProfileData } from '$dtos/ProfileDataInterface'; // Use the alias

  let C: ProfileData | null = null;
  let profileLoaded = false;
  let wordsOfNotice = '';

  onMount(() => {
    const storedProfile = localStorage.getItem('profileData');
    if (storedProfile) {
      try {
        C = JSON.parse(storedProfile) as ProfileData;
        profileLoaded = true;
        wordsOfNotice = `This total amount is due, upon reception of this invoice, and payable in its entirety
                        per bank transfer to the account of ${$msalName || ''} at ${C.BANK}
                        IBAN: ${C.IBAN} Swift/BIC: ${C.SWIFT}
                        A late payment compound interest of 1% will be charged per started late month`;
      } catch (error) {
        console.error('Error parsing stored profile data:', error);
        profileLoaded = false;
      }
    } else {
      profileLoaded = false;
    }

    const storedInvoiceNbr = localStorage.getItem('invoiceNbr');
    invoiceNbr = storedInvoiceNbr || '01/001';
  });

  let today = new Date().toLocaleString('default', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let invoiceNbr = '01/001';

  function updateInvoiceNbr(event: Event) {
    const target = event.target as HTMLDivElement;
    invoiceNbr = target.innerText;
    localStorage.setItem('invoiceNbr', invoiceNbr);
  }
</script>

{#if profileLoaded && C}
  <container>
    <b>{$msalName}</b>
    <b>{C.taxNumber}</b>
    <i>{C.address}</i>
    <div>{C.workStatus}</div>
    <hr />
    <br />
    <div>to the attention of:</div>
    <br />
    <div class="lines">
      <span>{C.recipientName}</span>
      <span>{C.recipientTitle}</span>
      <span>{C.recipientCompany}</span>
    </div>
    <div class="lines">
      <span>{C.recipientAddress}</span>
      <span>{C.recipientCountry}</span>
      <span>{C.recipientLicense}</span>
    </div>
    <hr />
    <br />
    <div contenteditable="true" on:input={updateInvoiceNbr}>invoice nr: {invoiceNbr}</div>
    <b contenteditable="true">{today}</b>
    <div contenteditable="true">Ref: {C.reference}</div>
    <br />
    <b class="job-title">{C.jobTitle}</b>
    <br />
    <i>{$totalDays} days at {C.ratePerDay} eur per day</i>
    <b>{$calcMoula.moula} eur</b>
    <div class="disclaimer">{C.disclaimer}</div>
    <br />
    <i>{C.taxDisclaimer}</i>
    <br />
    <div>Total TTC</div>
    <div>{$calcMoula.moula} eur</div>
  </container>
  <em class="notice">{wordsOfNotice}</em>
{:else}
  <div class="setup-notice">
    Go setup your profile first
  </div>
{/if}

<style>
  div {
    font-size: larger;
  }

  container {
    margin-top: 5vh;
    display: grid;
    line-spacing: 1;
    grid-template-columns: 2fr 1fr;
    max-width: 65vw;
  }

  hr {
    border: 1px solid rgb(100, 106, 118);
    clear: both;
    display: block;
    width: 50%;
    height: 1px;
  }

  .lines {
    font-size: large;
    display: grid;
    grid-template-rows: repeat(1fr);
    margin: 1vh 0 2vh;
  }

  .job-title {
    margin: 1vh 0 2vh;
  }

  .disclaimer {
    font-size: 0.7em;
    margin: 3vh 0 5vh 1vw;
  }

  .notice {
    width: 65vw;
    margin-top: 3vh;
    font-size: small;
    font-style: italic;
    display: block;
  }

  .setup-notice {
    font-size: larger;
    color: red;
    text-align: center;
    margin-top: 20vh;
  }
</style>