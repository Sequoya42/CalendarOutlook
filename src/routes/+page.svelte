<script lang="ts">
  import { signIn } from "$lib/auth.js";
  import { getEvents } from "$lib/graph.js";

  let test = login();
  let msalAccount: any = null;
  let calcMoula = {
    allTimeSpent: 0,
    moula: 0,
    tax: 0,
    afterTax: 0,
  };
  let byDays = {};

  function addGroup(
    byDay: any,
    day: string,
    subject: string,
    timeSpent: number,
    isMeeting: boolean
  ) {
    if (byDay[day]) {
      byDay[day].subject.push({ subject, isMeeting });
      byDay[day].timeSpent += +timeSpent;
    } else {
      byDay[day] = {
        subject: [{ subject, isMeeting }],
        timeSpent,
      };
    }
    byDay[day]["isMeeting"] = isMeeting;
    return byDay;
  }
  //TODO agregate by days (forEach, and object with [Day])
  function aggregateEvents(values: object[], allTimeSpent: number) {
    console.log({ values });
    let byDay = {};
    let data = values.map((event: any) => {
      let start = new Date(event.start.dateTime);
      let end = new Date(event.end.dateTime);
      let day = start.toISOString().split("T")[0];
      let isMeeting = event.attendees.length > 0;
      let attended = true;
      if (isMeeting) {
        let presence = event.attendees.find(
          (a: any) => a.emailAddress.address == msalAccount
        ).status.response;
        if (presence !== "accepted") attended = false;
      }
      let timeSpent = (+end - +start) / 3600000;
      allTimeSpent += timeSpent;
      let text = `${
        event.subject
      } - From  ${start.toLocaleString()} to ${end.toLocaleString()}
      For a total of ${timeSpent} hours`;
      if (!isMeeting || (isMeeting && attended))
        addGroup(byDay, day, event.subject, timeSpent, isMeeting);
      return text;
    });
    return { data, allTimeSpent, byDay };
  }

  async function login() {
    msalAccount = await sessionStorage.getItem("msalAccount");
    console.log("Login called", msalAccount);
    if (msalAccount) {
      console.log("GOT ACCOUNT", msalAccount);
    } else {
      await signIn();
    }

    type ByDay = {
      timeSpent: number;
      subject: string[];
      isMeeting: boolean;
    };

    type ByDays = Record<string, ByDay>;

    let events = await getEvents();
    let { data, allTimeSpent, byDay } = aggregateEvents(events.value, 0);
    console.log({ byDay });
    byDays = byDay as ByDays;
    let moula = allTimeSpent * 75;
    let tax = (moula * 20) / 100;
    let afterTax = moula - tax;
    calcMoula = { allTimeSpent, moula, tax, afterTax };
    return data;
  }
</script>

<h1>Bloatamax calendar ™</h1>
<div class="container" style="font-size: large">
  {#await test}
    Fetching data...
  {:then test}
    <div style="font-size: x-large; margin-bottom: 2vh">
      Brut: <span>{calcMoula.moula} Є</span>
      Total time :
      <span style="margin-right: 2vw">{calcMoula.allTimeSpent}h</span>
      Tax (20%): <span>{calcMoula.tax} Є</span>
      Net: <span>{calcMoula.afterTax} Є</span>
    </div>
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
  {:catch _someError}
    <button id="signin" on:click={() => (test = login())}>
      Login MicroBloat
    </button>
  {/await}
</div>

<style>
  span {
    color: green;
    padding-right: 1vw;
  }

  .container {
    font-size: large;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

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
