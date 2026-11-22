import { appConfig } from "./config.js";

export function parseAgreedFare(input) {
  const match = /^(\d{1,8})(?:[.,](\d{1,2}))?$/.exec(input.trim());
  if (!match) return null;
  const cents = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
  return cents > 0 && cents <= 2147483647 ? cents : null;
}

export function formatFareCents(cents, language) {
  const { currency, locale } = appConfig.pricing;
  return new Intl.NumberFormat(locale[language] ?? locale.en, {
    style: "currency", currency, minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2
  }).format(cents / 100);
}

export function routeEstimate(leg) {
  const distanceKm = leg?.distance?.value / 1000;
  const durationMinutes = (leg?.duration_in_traffic?.value ?? leg?.duration?.value) / 60;
  if (!Number.isFinite(distanceKm) || !Number.isFinite(durationMinutes) || distanceKm <= 0 || durationMinutes <= 0) {
    return null;
  }

  const { shortTrip, longTrip, durationFloor } = appConfig.pricing;
  const rate = distanceKm >= shortTrip.longTripThresholdKm ? longTrip : shortTrip;
  const distancePrice = Math.max(rate.minimumFare, distanceKm * rate.perKilometer);
  const durationPrice = (durationMinutes / 60) * durationFloor.minimumPerHour;
  return { distanceKm, durationMinutes, fareOneWay: Math.max(distancePrice, durationPrice) };
}

export function getRouteTotals(route, roundTrip) {
  if (!route) return null;
  const multiplier = roundTrip ? 2 : 1;
  return {
    distanceKm: route.distanceKm * multiplier,
    durationMinutes: route.durationMinutes * multiplier,
    fare: route.fareOneWay * multiplier
  };
}
