// @ts-nocheck
//MSAL configuration
import * as msal from "@azure/msal-browser";
import {msalAccount} from '$store';
//TODO env
const msalConfig = {
  auth: {
    clientId: 'a39479b4-1119-44d3-900b-44162c8624ea',
    // comment out if you use a multi-tenant AAD app
    authority: 'https://login.microsoftonline.com/2bb672ce-7d3c-4374-b4b5-672693ef6c08',
    redirectUri: 'https://calendabloat.netlify.app'
  },
  cache: {
    cacheLocation: "localStorage"
  }
};
const msalRequest = {scopes: []};

export function ensureScope(scope) {
  if(!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
    msalRequest.scopes.push(scope);
  }
}
//Initialize MSAL client
const msalClient = new msal.PublicClientApplication(msalConfig);
(async _ => await msalClient.initialize())()


// Log the user in
export async function signIn() {
  const authResult = await msalClient.loginPopup(msalRequest);
  // console.log({authResult});
  localStorage.setItem('msalAccount',authResult.account.username);
  localStorage.setItem('msalName',authResult.account.name);
  msalAccount.set(authResult.account.username);
}

//Get token from Graph
export async function getToken() {
  let account;
  account = localStorage.getItem('msalAccount');

  if(!account) {
    throw new Error(
      'User info cleared from session. Please sign out and sign in again.');
  }
  try {
    // First, attempt to get the token silently
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)
    };

    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch(silentError) {
    // If silent requests fails with InteractionRequiredAuthError,
    // attempt to get the token interactively
    // console.log({silentError})
    if(silentError instanceof msal.InteractionRequiredAuthError) {
      const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
      return interactiveResult.accessToken;
    } else {
      throw silentError;
    }
  }
}
