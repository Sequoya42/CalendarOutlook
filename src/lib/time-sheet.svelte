<script lang="ts">
  type Subject = {
    subject: string;
    isMeeting: boolean;
  };
  type ByDay = {
    timeSpent: number;
    subject: Subject[];
    isMeeting: boolean;
  };
  type ByDays = Record<string, ByDay>;
  export let byDays: ByDays;

  let msalName = sessionStorage.getItem("msalName");
  let currentMonth = new Date(Object.keys(byDays)[0]).toLocaleString(
    "default",
    { month: "long" }
  );

  let totalTime = Object.values(byDays).reduce((a, d) => (a += d.timeSpent), 0);
  let totalDays = Math.ceil(totalTime / 8);
  function transform(sub: any) {
    return sub.map((e: Subject) => e.subject).join(" and ");
  }
</script>

<!-- /*------------- Html -----------*/ -->
<main class="timeSheet">
  <h2>Timesheet of {msalName} for the month of {currentMonth}</h2>
  <div class="gridCal">
    <div class="header">Day</div>
    <div class="header">Time</div>
    <div class="header">Activity</div>
  </div>
  <div class="gridCal">
    {#each Object.entries(byDays) as [day, { timeSpent, subject }], i}
      <div
        class:uneven={i % 2}
        style="flex; justify-content: center; align-items: center;"
      >
        <b>{day}</b>
      </div>
      <div class:uneven={i % 2}>
        {timeSpent}h
      </div>
      <div contentEditable="true" class:uneven={i % 2}>
        {transform(subject)}
      </div>
    {/each}
  </div>
  <div class="gridCal" style="margin: 5vh 0">
    <div />
    <div>Totals: {totalTime}h</div>
    <div style="text-align: end">Total: {totalDays} days invoiced</div>
  </div>
  <div>
    <span style="font-size: larger"> Approved by : </span>
  </div>
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
    grid-template-rows: 1fr;
    grid-row-gap: 2vh;
  }
  .gridCal > div {
    /* border-left: 1px solid red; */
    padding: 0 5px;
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
