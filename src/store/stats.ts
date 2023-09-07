import { derived } from "svelte/store";
import { byDays } from "./calendar";


let currentMonth = derived(byDays, days =>
  new Date(Object.keys(days)[0]).toLocaleString(
    'default',
    { month: 'long' }
  ))

let totalTime = derived(byDays, $byDays =>
  Object.values($byDays).reduce((a, d) => (a += d.timeSpent), 0));

let totalDays = derived(totalTime, totalTime =>
  (totalTime / 8).toFixed(2));



export {
  currentMonth,
  totalTime,
  totalDays
}
