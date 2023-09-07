import { get, writable, type Writable } from "svelte/store";
import { aggregateEvents, getEvents } from "$lib/graph.js";
import type { ByDays, CalcMoula } from "./types";
import { browser } from '$app/environment';

const msalAccount: Writable<string | null> = writable(null);
if (browser) {
  let msal: string | null = sessionStorage.getItem("msalAccount");
  msalAccount.set(msal);
}
let byDays: Writable<ByDays> = writable({});

let calcMoula: Writable<CalcMoula> = writable({
  allTimeSpent: 0,
  moula: 0,
  tax: 0,
  afterTax: 0
});


async function fetchMonthly(num = 0): Promise<string[]> {
  let events = await getEvents(num);
  console.log({ events })
  let agreggated = aggregateEvents(events.value, 0, get(msalAccount));
  console.log("ICI", { agreggated })
  let { data, allTimeSpent } = agreggated;
  byDays.set(agreggated.byDay);
  console.log("byDays should have been set", get(byDays))
  let moula = allTimeSpent * 75;
  let tax = (moula * 20) / 100;
  let afterTax = moula - tax;
  calcMoula.set({ allTimeSpent, moula, tax, afterTax });
  console.log({ calcMoula });
  return data;
}


export {
  msalAccount,
  calcMoula,
  fetchMonthly,
  byDays
}