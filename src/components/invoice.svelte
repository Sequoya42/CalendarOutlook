<script lang="ts">
  import {calcMoula, totalDays, msalName} from '$store';
  import C from '$lib/constantInvoice.json';
  // TODO put some of this stuff in localStorage, ability to save as a client?
  // automatically keep track of invoice?
  let today = new Date().toLocaleString('default', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let invoiceNbr = '01/001';
  let wordsOfNotice = `This total amount is due, upon reception of this invoice, and payable in its entirety						
per bank transfer to the account of ${$msalName} at ${C.BANK}
IBAN: ${C.IBAN}      Swift/BIC: ${C.SWIFT}						
A late payment compound interest of 1% will be charged per started late month`;
</script>

<!-- NOTE br tag will be used as an empty column in the grid -->
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
  <div contenteditable="true">invoice nr: {invoiceNbr}</div>
  <b contenteditable="true">{today}</b>
  <div contenteditable="true">Ref: {C.reference}</div>
  <br />
  <b style="margin-bottom: 2vh; margin-top: 1vh">{C.jobTitle}</b>
  <br />
  <i>{$totalDays} days at {C.ratePerDay} eur per day</i>
  <b>{$calcMoula.moula} eur</b>
  <div style="font-size: 0.7em; margin: 3vh 0vw 5vh 1vw">
    {C.disclaimer}
  </div>
  <br />
  <i>{C.taxDisclaimer}</i>
  <br />
  <div>Total TTC</div>
  <div>{$calcMoula.moula} eur</div>
</container>
<em class="notice">{wordsOfNotice}</em>

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
  h5 {
    width: 50vw;
    margin: 2vh 1vw;
  }

  i {
    margin-bottom: 1vh;
  }

  .lines {
    font-size: large;
    display: grid;
    grid-template-rows: repeat(1fr);
    margin-bottom: 2vh;
    margin-top: 1vh;
  }

  .notice {
    width: 65vw;
    margin-top: 3vh;
    font-size: small;
    font-style: italic;
    display: block;
  }
</style>
