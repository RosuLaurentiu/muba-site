import { useSyncExternalStore } from "react";
import { getParisInstant } from "./booking";
import { moveDay, parisDay } from "./schedule";

function currentDay() {
  return parisDay(Date.now());
}

function subscribe(onChange) {
  let timer;
  function sync() {
    clearTimeout(timer);
    const now = Date.now();
    const tomorrow = moveDay(parisDay(now), 1);
    timer = setTimeout(sync, getParisInstant(tomorrow + "T00:00") - now);
    onChange();
  }
  sync();
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pageshow", sync);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("pageshow", sync);
  };
}

export function useParisDay() {
  return useSyncExternalStore(subscribe, currentDay);
}
