"use client";

import { useSyncExternalStore } from "react";
import { nowInZagreb } from "@/lib/schedule";

/**
 * One clock for the whole site.
 *
 * The time is an external system, not React state, so it is read through a store rather than
 * pushed in from an effect. Three components need it — the board, the timetable and the season
 * note — and they now share a single thirty-second tick instead of running three of their own.
 *
 * The server snapshot is deliberately `null`. Every page here is prerendered at build time, so
 * baking a clock into the HTML would ship August's timetable to a September visitor. Callers
 * render a skeleton until the real clock arrives a tick after mount.
 */

export type Clock = { minutes: number; month: number };

let snapshot: Clock | null = null;
const listeners = new Set<() => void>();
let timer: number | undefined;

function refresh() {
  const now = nowInZagreb();
  /* Only publish when a displayed value actually changed — getSnapshot has to be referentially
     stable between notifications or React re-renders forever. */
  if (!snapshot || snapshot.minutes !== now.minutes || snapshot.month !== now.month) {
    snapshot = { minutes: now.minutes, month: now.month };
    listeners.forEach((l) => l());
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    refresh();
    timer = window.setInterval(refresh, 30_000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = (): Clock | null => null;

export function useZagrebClock(): Clock | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
