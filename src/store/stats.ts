import { derived } from "svelte/store";
import { byDays } from "./calendar";


let currentMonth = derived(byDays, days =>
  new Date(Object.keys(days)[0]).toLocaleString(
    'default',
    { month: 'long' }
  ))

let totalTime = derived(byDays, $byDays =>
  Object.values($byDays).reduce((a, d) => {
    (a += d.timeSpent)
    // console.log({ d })
    return a;
  }, 0));

let totalDays = derived(totalTime, totalTime =>
  (totalTime / 8).toFixed(1));



export {
  currentMonth,
  totalTime,
  totalDays
}
