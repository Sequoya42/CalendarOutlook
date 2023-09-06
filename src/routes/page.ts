import { signIn } from "$lib/auth.js";
import { aggregateEvents, getEvents } from "$lib/graph.js";
import TimeSheet from "$components/time-sheet.svelte";

let test = login();
let pastMonth = 1;
let hideRest = false;
let showInvoice = false;
let msalAccount: any = null;
let calcMoula = {
  allTimeSpent: 0,
  moula: 0,
  tax: 0,
  afterTax: 0,
};
let byDays = {};

async function fetchMonthly(num = 0) {
  let events = await getEvents(num);
  let { data, allTimeSpent, byDay } = aggregateEvents(
    events.value,
    0,
    msalAccount
  );
  byDays = byDay;
  let moula = allTimeSpent * 75;
  let tax = (moula * 20) / 100;
  let afterTax = moula - tax;
  calcMoula = { allTimeSpent, moula, tax, afterTax };
  console.log({ calcMoula });
  return data;
}
async function login() {
  msalAccount = await sessionStorage.getItem("msalAccount");
  console.log("Login called", msalAccount);
  if (msalAccount) {
    console.log("GOT ACCOUNT", msalAccount);
  } else {
    await signIn();
  }
  return await fetchMonthly(0);
}
