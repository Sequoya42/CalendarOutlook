
import { get, writable, type Writable } from "svelte/store";
import { aggregateEvents, getEvents, getCalendars } from "$lib/graph.js";
import type { ByDays, CalcMoula, SelectedCal } from "$lib/types";
import { categories } from "$store";


let calcMoula: Writable<CalcMoula> = writable({
  allTimeSpent: 0,
  moula: 0,
  tax: 0,
  afterTax: 0
});
let selectedCal: Writable<SelectedCal> = writable({
  id: '',
  owner: { address: '', name: '' }
});

let calendars = writable([])
let allEvents = writable([])
let byDays: Writable<ByDays> = writable({});

function setCalcAndDays(byDay: any, allTimeSpent: number) {
  byDays.set(byDay);
  console.log({ byDay })
  let moula = allTimeSpent * 75;
  let tax = (moula * 20) / 100;
  let afterTax = moula - tax;
  calcMoula.set({ allTimeSpent, moula, tax, afterTax });
}
async function fetchMonthly(num = 0): Promise<ByDays> {
  let allCalendars = await getCalendars();
  if (!get(selectedCal).id) {
    selectedCal.set(allCalendars.value[0])
  }

  let calId = get(selectedCal).id;
  let currentPerson = get(selectedCal).owner.address;
  let events = await getEvents(num, calId);
  allEvents.set(events.value);
  //TODO manage different calendars?
  console.log({ events })
  let cat: any = events.value.map((e: any) => e.categories).flat();
  categories.set(Array.from(new Set(cat)));
  calendars.set(allCalendars.value)
  let agreggated = aggregateEvents(events.value, currentPerson);
  return agreggated;
}


export {
  calcMoula,
  fetchMonthly,
  allEvents,
  byDays,
  calendars,
  selectedCal,
  setCalcAndDays
}