import { useSyncExternalStore } from "react";

export type StoredSession = {
  email: string;
  name: string;
};

const SESSION_KEY = "pulseboard-session";
const SESSION_EVENT = "pulseboard-session-change";

export function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<StoredSession>;

    if (typeof parsed.email !== "string" || typeof parsed.name !== "string") {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return {
      email: parsed.email,
      name: parsed.name,
    };
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: StoredSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) {
      onStoreChange();
    }
  };
  const localHandler = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handler);
  window.addEventListener(SESSION_EVENT, localHandler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SESSION_EVENT, localHandler);
  };
}

function getClientSnapshot() {
  return readStoredSession();
}

function getServerSnapshot() {
  return undefined;
}

export function useStoredSessionSnapshot() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
