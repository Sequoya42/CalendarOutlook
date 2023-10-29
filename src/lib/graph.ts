// Create an authentication provider
import { Client } from "@microsoft/microsoft-graph-client";
import { getToken, ensureScope } from './auth.js';
import { setCalcAndDays } from "$store";

const authProvider = {
  getAccessToken: async () => {
    // Call getToken in auth.js
    return await getToken();
  }
};
// Initialize the Graph client
const graphClient = Client.initWithMiddleware({ authProvider });
//Get user info from Graph
export async function getUser() {
  ensureScope('user.read');
  return await graphClient
    .api('/me')
    .select('id,displayName')
    .get();
}
export async function getAllEvents() {
  return await graphClient
    .api('/me/events')
    // "AAMkADc0OTZkNjRkLTliYzMtNGJmOS04NGUyLTY5M2M1NTk0NDdmOQBGAAAAAABzPfP-IkPwSoK9sAma2egeBwBsnue3XEXsQaK9hNYRjD1kAAAAAAEGAABsnue3XEXsQaK9hNYRjD1kAAA9JjmLAAA="
    // .api(`/me/calendars/${calId}/events`)
    .select('subject,categories, start,end, attendees, organizer, responseStatus')
    .orderby(`start/DateTime`)
    .top(1000)
    .get();

}

export async function getEvents(num: number, calId: string) {
  ensureScope('Calendars.read');
  const today = new Date();
  const currentMonth = today.getMonth() - num;
  const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1);
  const lastDayOfMonth = new Date(today.getFullYear(), currentMonth + 1, 1);
  const query = `startDateTime=${firstDayOfMonth.toISOString()}&endDateTime=${lastDayOfMonth.toISOString()}`;
  return await graphClient
    .api(`/me/calendars/${calId}/calendarView`)
    .query(query)
    .select('subject,categories, start,end, attendees, organizer, responseStatus')
    .orderby(`start/DateTime`)
    .top(100)
    .get();
}

export async function getCalendars() {
  return await graphClient
    .api('/me/calendars')
    .select('id,name,owner')
    .get();

}


function groupByDays(byDay: any, day: string,
  event: any, timeSpent: number, isMeeting: boolean) {
  byDay[day] ||= { subject: [], timeSpent: 0 };

  byDay[day].subject.push({ subject: event.subject, isMeeting });
  byDay[day].timeSpent += timeSpent;
  byDay[day]["isMeeting"] = isMeeting;
  return byDay;
}

function attendance(event: any, msalAccount: string) {
  let isMeeting = event.attendees?.length > 0;
  let attended = true;
  let organizer = event.organizer.emailAddress.address;
  // console.log({ organizer, msalAccount, isMeeting, event })
  if (organizer === msalAccount)
    return attended;
  console.log({ msalAccount })
  // NOTE true by default, as if not a meeting, attended
  if (isMeeting) {
    let presence = event.attendees.find(
      (a: any) => a.emailAddress.address == msalAccount
    ).status.response;
    if (presence !== "accepted") attended = false;
  }
  return attended;
}

export function aggregateEvents(values: object[],
  person: any) {
  let agreggated = {};
  let allTimeSpent = 0;
  console.log({ person })
  values.forEach((event: any) => {
    console.log(event.subject, { event })
    let start = new Date(event.start.dateTime);
    let end = new Date(event.end.dateTime);
    let day = start.toISOString().split("T")[0];
    let isMeeting = event.attendees.length > 0;
    let attended = attendance(event, person);
    let timeSpent = (+end - +start) / 3600000;
    if (event.subject.trim().toLowerCase() == 'minus') {
      timeSpent *= -1;
    }
    if (attended) {
      allTimeSpent += timeSpent;
      groupByDays(agreggated, day, event, timeSpent, isMeeting);
    }
    // return event;
  });
  setCalcAndDays(agreggated, allTimeSpent);
  return agreggated;
}

