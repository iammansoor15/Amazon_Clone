import {
  call,
  credentials,
  CLI,
  Events,
} from "@christianjuth/ts-cli-generator";

// MOCK API CALLS
function uuid() {
  const randomString = () => Math.random().toString(36).substring(2);
  return Array(4).fill(0).map(randomString).join("-");
}

async function getToken() {
  return (await credentials.get()).password;
}

function apiLogin(username: string, password: string) {
  // pretend this uuid is a auth token
  return uuid();
}
// END MOCK API CALLS

function login(username: string, password: string) {
  const token = apiLogin(username, password);
  credentials.set({
    login: username,
    password: token,
  });
}

async function exposeToken() {
  const token = getToken();
  console.log(await token);
}

async function logout() {
  await credentials.clear();
}

function iRequireAuth() {
  console.log("fetching protected data...");
}

const REQUIRES_AUTH = [iRequireAuth];

// __beforeFn__ is essentially middleware
// that runs before each command
const __beforeFn__: Events["__beforeFn__"] = async (fn) => {
  if (!REQUIRES_AUTH.includes(fn)) {
    return;
  }

  const token = await getToken();
  if (!token) {
    await call(login)();
  }
};

export const cli: CLI = {
  __beforeFn__,
  login,
  exposeToken,
  logout,
  iRequireAuth,
};
