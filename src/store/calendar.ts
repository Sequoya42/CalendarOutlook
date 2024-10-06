
import { get, writable, type Writable } from "svelte/store";
import { aggregateEvents, getEvents, getCalendars } from "$lib/graph.js";
import type { ByDays, CalcMoula, SelectedCal } from "$lib/types";
import { categories, filterByCat } from "$store";


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
  const taxPercentage = localStorage.getItem('taxPercentage') || 20;
  const moula = allTimeSpent * 75;
  const tax = (moula * +taxPercentage) / 100;
  const afterTax = moula - tax;
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
  let filterCat = get(filterByCat)
  if (filterCat) {
    if (filterCat == 'none') {
      allEvents.set(events.value.filter((e: any) => !e.categories.length));
    } else if (filterCat == 'all') {
      allEvents.set(events.value)
    } else
      allEvents.set(events.value.filter((e: any) => e.categories.includes(get(filterByCat))));
  }
  else allEvents.set(events.value)
  console.log({ events })
  let cat: any = events.value.map((e: any) => e.categories).flat();
  categories.set(Array.from(new Set(cat)));
  calendars.set(allCalendars.value)
  let agreggated = aggregateEvents(get(allEvents), currentPerson);
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