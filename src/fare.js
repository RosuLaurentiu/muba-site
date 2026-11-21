import { appConfig } from "./config.js";

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
