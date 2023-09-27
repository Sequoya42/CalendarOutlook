import { get, writable, type Writable } from "svelte/store";
import { aggregateEvents, getEvents } from "$lib/graph.js";
import type { ByDays, CalcMoula } from "$lib/types";
import { currentMonth, msalAccount } from "$store";

let calcMoula: Writable<CalcMoula> = writable({
  allTimeSpent: 0,
  moula: 0,
  tax: 0,
  afterTax: 0
});

let byDays: Writable<ByDays> = writable({});


async function fetchMonthly(num = 0): Promise<ByDays> {
  let events = await getEvents(num);
  let agreggated = aggregateEvents(events.value, 0, get(msalAccount));

  let { byDay, allTimeSpent } = agreggated;
  byDays.set(byDay);
  let moula = allTimeSpent * 75;
  let tax = (moula * 20) / 100;
  let afterTax = moula - tax;
  calcMoula.set({ allTimeSpent, moula, tax, afterTax });
  //TODO when num != 0, check with a currentMonth if in sessionStorage
  // Have a thing to aggregate all of that, a mega json past data
  // Don't need all, just pay/tax
  if (num !== 0) {
    sessionStorage.setItem(get(currentMonth), JSON.stringify({ byDay, calcMoula }))
  }
  console.log({ calcMoula });
  return get(byDays);
}


export {
  calcMoula,
  fetchMonthly,
  byDays,
}