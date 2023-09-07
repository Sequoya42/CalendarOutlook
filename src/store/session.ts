import { writable, type Writable } from "svelte/store";
import { browser } from '$app/environment';

const msalAccount: Writable<string | null>
  = writable(null);

const msalName: Writable<string | null>
  = writable(null);

if (browser) {
  let msal: string | null = sessionStorage.getItem("msalAccount");
  let name: string | null = sessionStorage.getItem('msalName');
  msalAccount.set(msal);
  msalName.set(name);
}

export {
  msalAccount,
  msalName
}