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
  const today = new Date();
  const currentMonth = today.getMonth() - num;
  const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1);

  // Get the number of days in the current month
  const daysInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate();
  const lastDayOfMonth = new Date(today.getFullYear(), currentMonth + 1, 1);
  console.log({ firstDayOfMonth, lastDayOfMonth, daysInMonth });
  const query = `startDateTime=${firstDayOfMonth.toISOString()}&endDateTime=${lastDayOfMonth.toISOString()}`;
  console.log({ graphClient })
  return await graphClient
    .api('/me/calendarView').query(query)
    .select('subject,start,end, attendees, organizer, responseStatus')
    .orderby(`start/DateTime`)
    .top(100)
    .get();
}


function groupByDays(byDay: any, day: string,
  subject: string, timeSpent: number, isMeeting: boolean) {
  byDay[day] ||= { subject: [], timeSpent: 0 };

  byDay[day].subject.push({ subject, isMeeting });
  byDay[day].timeSpent += timeSpent;
  byDay[day]["isMeeting"] = isMeeting;
  return byDay;
}

function attendance(event: any, msalAccount: string) {
  let isMeeting = event.attendees?.length > 0;
  let attended = true;
  let organizer = event.organizer.emailAddress.address;
  console.log({ organizer, msalAccount })
  if (organizer === msalAccount)
    return attended;

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
  allTimeSpent: number, msalAccount: any) {
  let byDay = {};
  values.forEach((event: any) => {
    let start = new Date(event.start.dateTime);
    let end = new Date(event.end.dateTime);
    let day = start.toISOString().split("T")[0];
    let isMeeting = event.attendees.length > 0;
    let attended = attendance(event, msalAccount);
    let timeSpent = (+end - +start) / 3600000;
    if (event.subject.trim().toLowerCase() == 'minus') {
      timeSpent *= -1;
    }
    allTimeSpent += timeSpent;
    if (attended)
      groupByDays(byDay, day, event.subject, timeSpent, isMeeting);
    return event;
  });

  return { allTimeSpent, byDay };
}

