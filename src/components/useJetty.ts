"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_JETTY, type JettyId } from "@/lib/jetties";

/**
 * Which jetty the guest is standing at — one value for the whole site.
 *
 * The board, the timetables and every tour page read it, so a guest says where they are staying
 * once and then never sees a time that is not theirs. It survives navigation because it lives in
 * module scope, and survives a reload because it is mirrored into localStorage.
 *
 * Modelled as an external store rather than React state: localStorage *is* an external system,
 * and reading it from an effect would mean rendering a guess first and correcting it after, which
 * is both a hydration hazard and a visible flicker on the busiest control on the page.
 */

const KEY = "vivado.jetty";

/** `null` until storage has been read, so nothing renders a default as if it were a choice. */
let snapshot: JettyId | null = null;
const listeners = new Set<() => void>();

function readStored(): JettyId {
  try {
    return (window.localStorage.getItem(KEY) as JettyId | null) ?? DEFAULT_JETTY;
  } catch {
    /* Private browsing throws on access. The default jetty is a perfectly good answer. */
    return DEFAULT_JETTY;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (snapshot === null) {
    snapshot = readStored();
    listeners.forEach((l) => l());
  }

  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = (): JettyId | null => null;

export function setJetty(id: JettyId) {
  if (snapshot === id) return;
  snapshot = id;
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* Losing the preference is not worth breaking the page over. */
  }
  listeners.forEach((l) => l());
}

export function useJetty(): { jetty: JettyId; setJetty: typeof setJetty; ready: boolean } {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { jetty: stored ?? DEFAULT_JETTY, setJetty, ready: stored !== null };
}
