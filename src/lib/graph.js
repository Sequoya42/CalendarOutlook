// Create an authentication provider
import { Client } from "@microsoft/microsoft-graph-client";
import { getToken, ensureScope } from '$lib/auth.js';

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

export async function getEvents() {
  ensureScope('Calendars.read');
  const today = new Date();
  const currentMonth = today.getMonth();
  const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1);

  // Get the number of days in the current month
  const daysInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate();
  const lastDayOfMonth = new Date(today.getFullYear(), currentMonth, daysInMonth);
  console.log({ firstDayOfMonth, lastDayOfMonth, daysInMonth });
  const query = `startDateTime=${firstDayOfMonth.toISOString()}&endDateTime=${lastDayOfMonth.toISOString()}`;

  return await graphClient
    .api('/me/calendarView').query(query)
    .select('subject,start,end, attendees')
    .orderby(`start/DateTime`)
    .top(100)
    .get();
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