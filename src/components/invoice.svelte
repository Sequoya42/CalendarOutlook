<script>
  // @ts-nocheck
  export let byDays;
  let test = 'toto';
  let totalDays;
  $: currentMonth = new Date(Object.keys(byDays)[0]).toLocaleString('default', {
    month: 'long'
  });
  console.log('in time sheet', byDays);
  $: totalTime = Object.values(byDays).reduce((a, d) => (a += d.timeSpent), 0);
  $: totalDays = (totalTime / 8).toFixed(2);
</script>
