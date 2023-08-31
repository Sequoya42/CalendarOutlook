<script lang="ts">
  export let byDays: any;
</script>

<div class="gridCal">
  {#each Object.entries(byDays) as [day, { timeSpent, subject }]}
    <div style="flex; justify-content: center;align-items: center;">
      <b>{day}</b>
    </div>
    <div>
      {timeSpent}h
    </div>

    <!-- {subject} -->
    <div class="calCell">
      {#each subject as sub, i}
        <div
          class:isMeeting={sub.isMeeting}
          class="subject"
          style="background-color: {i % 2 ? '#d3d3d342' : ''}"
        >
          {sub.subject}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .gridCal {
    max-width: 60vw;
    margin-top: 1vh;
    display: grid;
    grid-template-columns: 1fr 1fr 5fr;
    grid-row-gap: 2vh;
  }

  .calCell {
    margin: 2px;
    font-weight: bolder;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  .isMeeting {
    color: #3f51b5;
    /* font-weight: bolder; */
  }

  .subject {
    margin: 1vh 0.5vw;
  }
</style>
