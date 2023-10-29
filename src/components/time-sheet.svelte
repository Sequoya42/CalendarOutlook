<script lang="ts">
  import type {Subject} from '$lib/types';
  import {byDays, msalName, selectedCal} from '$store';
  import {currentMonth, totalTime, totalDays} from '$store/stats';

  function transform(sub: any) {
    sub = sub.map((e: Subject) => {
      return !e.isMeeting ? e.subject : `[${e.subject}]`;
    });
    sub = [...new Set(sub)];
    return sub
      .filter(
        (e: string) =>
          !['extension', 'overtime', 'minus'].includes(e.trim().toLowerCase())
      )
      .join(' and ');
  }
</script>

<!-- /*------------- Html -----------*/ -->
<main class="timeSheet">
  <h2>
    Timesheet of {$selectedCal.owner.name} for the month of {$currentMonth}
  </h2>
  <small>Meetings are between []</small>
  <div class="gridCal">
    <div class="header">Day</div>
    <div class="header">Time</div>
    <div class="header">Activity</div>

    {#each Object.entries($byDays) as [day, { timeSpent, subject }], i}
      <div class:uneven={i % 2} style="">
        <b>{day}</b>
      </div>
      <div class:uneven={i % 2}>
        {timeSpent}h
      </div>
      <div contentEditable="true" class:uneven={i % 2}>
        {transform(subject)}
      </div>
    {/each}

    <div class="my-5" />
    <div>Totals: {$totalTime}h</div>
    <div style="text-align: end">Total: {$totalDays} days invoiced</div>
  </div>

  <span style="font-size: larger"> Approved by : </span>
  <div style="margin-top: 5px;">On :</div>
</main>

<style>
  .timeSheet {
    font-size: larger;
    margin: 6vh 0;
  }
  .gridCal {
    width: 70vw;
    margin-top: 1vh;
    display: grid;
    grid-template-columns: 1fr 1fr 5fr;
    grid-row-gap: 2vh;
  }

  .my-5 {
    margin: 5vh 0;
  }

  .uneven {
    background-color: #d3d3d340;
  }

  .header {
    border-bottom: 1px solid black;
    width: fit-content;
    font-size: larger;
  }
</style>
