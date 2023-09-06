// Create an authentication provider
import { Client } from "@microsoft/microsoft-graph-client";
import { getToken, ensureScope } from './auth.js';

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

export async function getEvents(num: number) {
  ensureScope('Calendars.read');
  console.log({ num })
  const today = new Date();
  const currentMonth = today.getMonth() - num;
  const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1);

  // Get the number of days in the current month
  const daysInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate();
  const lastDayOfMonth = new Date(today.getFullYear(), currentMonth + 1, 1);
  console.log({ firstDayOfMonth, lastDayOfMonth, daysInMonth });
  const query = `startDateTime=${firstDayOfMonth.toISOString()}&endDateTime=${lastDayOfMonth.toISOString()}`;

  return await graphClient
    .api('/me/calendarView').query(query)
    .select('subject,start,end, attendees')
    .orderby(`start/DateTime`)
    .top(100)
    .get();
}

function addGroup(
  byDay: any,
  day: string,
  subject: string,
  timeSpent: number,
  isMeeting: boolean
) {
  if (byDay[day]) {
    byDay[day].subject.push({ subject, isMeeting });
    byDay[day].timeSpent += +timeSpent;
  } else {
    byDay[day] = {
      subject: [{ subject, isMeeting }],
      timeSpent,
    };
  }
  byDay[day]["isMeeting"] = isMeeting;
  return byDay;
}

//TODO agregate by days (forEach, and object with [Day])
export function aggregateEvents(values: object[], allTimeSpent: number, msalAccount: any) {
  console.log({ values });
  let byDay = {};
  let data = values.map((event: any) => {
    let start = new Date(event.start.dateTime);
    let end = new Date(event.end.dateTime);
    let day = start.toISOString().split("T")[0];
    let isMeeting = event.attendees.length > 0;
    let attended = true;
    if (isMeeting) {
      let presence = event.attendees.find(
        (a: any) => a.emailAddress.address == msalAccount
      ).status.response;
      if (presence !== "accepted") attended = false;
    }
    let timeSpent = (+end - +start) / 3600000;
    allTimeSpent += timeSpent;
    let text = `${event.subject
      } - From  ${start.toLocaleString()} to ${end.toLocaleString()}
      For a total of ${timeSpent} hours`;
    if (!isMeeting || (isMeeting && attended))
      addGroup(byDay, day, event.subject, timeSpent, isMeeting);
    return text;
  });
  return { data, allTimeSpent, byDay };
}


// async function getAllCalendars() {
//   ensureScope('Calendars.read');
//   const allCalendars = await graphClient
//     .api('/me/calendars')
//     .get();
//   console.log({ allCalendars })
//   return allCalendars;
// }

// async function getKiwiCalendar() {
//   ensureScope('Calendars.read');
//   const today = new Date();
//   const currentMonth = today.getMonth();
//   const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1);

//   // Get the number of days in the current month
//   const daysInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate();
//   const lastDayOfMonth = new Date(today.getFullYear(), currentMonth, daysInMonth);
//   console.log({ firstDayOfMonth, lastDayOfMonth, daysInMonth });
//   const query = `startDateTime=${firstDayOfMonth.toISOString()}&endDateTime=${lastDayOfMonth.toISOString()}`;

//   return await graphClient
//     .api('/users/rdantzer@educam.be/calendarView').query(query)
//     .select('start,end')
//     .orderby(`start/DateTime`)
//     .top(100)
//     .get();
// }