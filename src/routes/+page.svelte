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

  //TODO agregate by days (forEach, and object with [Day])
  function aggregateEvents(values: object[], allTimeSpent: number) {
    let data = values.map((event: any) => {
      let start = new Date(event.start.dateTime);
      let end = new Date(event.end.dateTime);
      let timeSpent = (+end - +start) / 3600000;
      allTimeSpent += timeSpent;
      let text = `${
        event.subject
      } - From  ${start.toLocaleString()} to ${end.toLocaleString()}
      For a total of ${timeSpent} hours`;
      return text;
    });
    return { data, allTimeSpent };
  }

  async function login() {
    msalAccount = await sessionStorage.getItem("msalAccount");
    console.log("Login called", msalAccount);
    if (msalAccount) {
      console.log("GOT ACCOUNT", msalAccount);
    } else {
      await signIn();
    }

    let events = await getEvents();
    let { data, allTimeSpent } = aggregateEvents(events.value, 0);

    let moula = allTimeSpent * 75;
    let tax = (moula * 20) / 100;
    let afterTax = moula - tax;
    calcMoula = { allTimeSpent, moula, tax, afterTax };
    return data;
  }
</script>

<h1>Welcome to Calendar</h1>
<p>
  {#await test}
    Fetching data...
  {:then test}
    {#each test as event}
      <pre>
      {event}
    </pre>
    {/each}
    <div style="font-size: x-large">
      Total time : <span>{calcMoula.allTimeSpent}</span>
      Earned: <span>{calcMoula.afterTax}</span>
      Total moula: <span>{calcMoula.moula}</span> including
      <span>{calcMoula.tax}</span> tax
    </div>
  {:catch _someError}
    <button id="signin" on:click={() => (test = login())}>
      Login MicroBloat
    </button>
  {/await}
</p>

<style>
  span {
    color: green;
  }
</style>
