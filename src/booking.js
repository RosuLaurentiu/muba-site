const parisClock = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Paris",
  dateStyle: "short",
  timeStyle: "short"
});

export function parisMinute(date) {
  return parisClock.format(new Date(date)).replace(" ", "T");
}

export function getParisInstant(localTime) {
  const wallClock = Date.parse(`${localTime}Z`);
  if (!Number.isFinite(wallClock)) return null;

  // Europe/Paris uses UTC+01:00 and UTC+02:00. Check standard time first
  // to match the database's choice when the autumn hour occurs twice.
  for (const offset of [1, 2]) {
    const candidate = new Date(wallClock - offset * 3600000);
    if (parisMinute(candidate) === localTime) return candidate;
  }
  return null;
}

export function validateBooking(form, capacity, now = new Date()) {
  const errors = {};
  if (!form.pickup.trim()) errors.pickup = "status.pickupRequired";
  if (!form.destination.trim()) errors.destination = "status.destinationRequired";
  if (!form.pickupDate) errors.pickupDate = "booking.pickupDateRequired";
  if (!form.pickupTime) errors.pickupTime = "booking.pickupTimeRequired";
  const pickup = getParisInstant(`${form.pickupDate}T${form.pickupTime}`);
  if (form.pickupDate && form.pickupTime) {
    if (!pickup) errors.pickupTime = "booking.invalidParisTime";
    else if (pickup <= now) errors.pickupTime = "booking.futurePickup";
  }
  if (form.roundTrip) {
    if (!form.returnDate) errors.returnDate = "status.returnDateRequired";
    if (!form.returnTime) errors.returnTime = "status.returnTimeRequired";
    if (form.returnDate && form.returnTime) {
      const returning = getParisInstant(`${form.returnDate}T${form.returnTime}`);
      if (!returning) errors.returnTime = "booking.invalidParisTime";
      else if (pickup && returning <= pickup) errors.returnTime = "booking.laterReturn";
    }
  }
  if (!Number.isInteger(Number(form.passengers)) || form.passengers < 1 || form.passengers > capacity) {
    errors.passengers = "booking.passengersRequired";
  }
  if (!form.customerName.trim()) errors.customerName = "status.nameRequired";
  const phone = form.customerPhone.trim();
  if (!/^[+]?[\d ().-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) {
    errors.customerPhone = "booking.validPhoneRequired";
  }
  const email = form.customerEmail?.trim();
  if (email && (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(email))) {
    errors.customerEmail = "booking.invalidEmail";
  }
  return errors;
}

export function bookingPayload(form, language) {
  return {
    language,
    pickup: form.pickup.trim(),
    destination: form.destination.trim(),
    pickup_time: `${form.pickupDate}T${form.pickupTime}`,
    return_time: form.roundTrip ? `${form.returnDate}T${form.returnTime}` : null,
    passengers: Number(form.passengers),
    passenger_name: form.customerName.trim(),
    passenger_phone: form.customerPhone.trim(),
    passenger_notes: form.notes.trim(),
    ...(form.customerEmail?.trim() ? { passenger_email: form.customerEmail.trim() } : {})
  };
}

export function formatParisTime(instant, language) {
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
    timeZone: "Europe/Paris",
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(instant));
}

export function getBookingConfig() {
  const { VITE_SUPABASE_URL: value, VITE_SUPABASE_PUBLISHABLE_KEY: key } = import.meta.env ?? {};
  try {
    const url = new URL(value);
    const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if ((url.protocol === "https:" || local) && key?.startsWith("sb_publishable_")) {
      return { url: url.origin, key };
    }
  } catch {
    // The booking form still works when the local or hosted API is unavailable.
  }
  return null;
}

export async function bookingRpc(name, body, token) {
  const config = getBookingConfig();
  if (!config) throw new Error("BOOKING_NOT_CONFIGURED");
  const headers = { "Content-Type": "application/json", apikey: config.key };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${config.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error("BOOKING_REQUEST_FAILED");
    error.code = result?.code;
    throw error;
  }
  return result;
}
