const subjects = {
  en: { receipt: "Ride request received", confirmed: "Ride confirmed", changed: "Ride time changed", trip_changed: "Ride details updated",
    declined: "Ride request declined", cancelled: "Ride cancelled", driver_new: "New booking request" },
  fr: { receipt: "Demande de trajet reçue", confirmed: "Trajet confirmé", changed: "Horaire du trajet modifié", trip_changed: "Trajet mis à jour",
    declined: "Demande de trajet refusée", cancelled: "Trajet annulé", driver_new: "Nouvelle demande de réservation" }
};

const labels = {
  en: { reference: "Reference", pickupAt: "Pickup", returnAt: "Return", pickup: "Pickup address", destination: "Destination",
    passengers: "Passengers", agreedFare: "Agreed fare", estimatedFare: "Estimated fare", tracking: "Private tracking link",
    updated: "These are the updated details of your confirmed ride." },
  fr: { reference: "Référence", pickupAt: "Départ", returnAt: "Retour", pickup: "Adresse de départ", destination: "Destination",
    passengers: "Passagers", agreedFare: "Tarif convenu", estimatedFare: "Tarif estimé", tracking: "Lien privé de suivi",
    updated: "Voici les nouveaux détails de votre trajet confirmé." }
};

function formatFare(cents, locale) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: cents % 100 ? 2 : 0 })
    .format(cents / 100);
}

// The trip as it was when the email was queued. Passenger names and phone numbers stay out of emails.
function tripLines(job, template, label, locale) {
  const fare = ["declined", "cancelled"].includes(template) ? null
    : job.agreed_fare_cents != null ? [label.agreedFare, job.agreed_fare_cents]
      : job.estimated_fare_cents != null && ["receipt", "driver_new"].includes(job.kind) ? [label.estimatedFare, job.estimated_fare_cents] : null;
  return [
    job.pickup && `${label.pickup}: ${job.pickup}`,
    job.destination && `${label.destination}: ${job.destination}`,
    job.passengers && `${label.passengers}: ${job.passengers}`,
    fare && `${fare[0]}: ${formatFare(fare[1], locale)}`
  ];
}

export function bookingEmailMessage(job, config) {
  const language = job.language === "fr" ? "fr" : "en";
  const locale = language === "fr" ? "fr-FR" : "en-GB";
  const label = labels[language];
  const time = new Intl.DateTimeFormat(locale, { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" });
  const template = job.template === "confirmed_receipt" ? "confirmed" : (job.template ?? job.kind);
  const subject = subjects[language][template];
  let rideLink;
  let trackingLink;
  if (job.kind === "driver_new" && config.appUrl) {
    const url = new URL(config.appUrl);
    url.search = new URLSearchParams({ driver: "", ride: job.reference }).toString();
    rideLink = url.href;
  }
  if (job.kind === "receipt" && job.receipt_key) {
    const url = new URL(config.appUrl);
    const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !local) throw new Error("Invalid booking app URL");
    url.search = "?booking";
    url.hash = new URLSearchParams({ key: job.receipt_key }).toString();
    trackingLink = `${label.tracking}: ${url.href}`;
  }
  return {
    from: config.from,
    to: [job.recipient],
    subject: `${subject} #${job.reference}`,
    text: [
      subject,
      `${label.reference} #${job.reference}`,
      `${label.pickupAt}: ${time.format(new Date(job.pickup_at))} (Paris)`,
      job.return_at && `${label.returnAt}: ${time.format(new Date(job.return_at))} (Paris)`,
      ...tripLines(job, template, label, locale),
      template === "trip_changed" && label.updated,
      rideLink,
      trackingLink
    ].filter(Boolean).join("\n")
  };
}

export function bookingEmailHandler(config, fetcher = fetch) {
  async function rpc(name, args) {
    const response = await fetcher(`${config.supabaseUrl}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: config.serviceKey, Authorization: `Bearer ${config.serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("Booking email database request failed");
    if (name === "claim_booking_email" || name === "claim_booking_codes") return response.json();
  }

  async function deliver(id, payload) {
    try {
      const response = await fetcher(config.emailApiUrl ?? "https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": id },
        body: JSON.stringify(payload), redirect: "error", signal: AbortSignal.timeout(10000)
      });
      return response.ok;
    } catch {
      // The provider may have accepted a timed-out request. A retry keeps its ID.
      return false;
    }
  }

  return async (request) => {
    if (request.method !== "POST") return new Response(null, { status: 405 });
    if (!config.workerToken || request.headers.get("Authorization") !== `Bearer ${config.workerToken}`) {
      return new Response(null, { status: 401 });
    }
    if (!config.from || !config.apiKey) return new Response(null, { status: 503 });

    try {
      const jobs = await rpc("claim_booking_email", {});
      let sent = 0;
      for (const job of jobs) {
        // A delayed worker must leave time for the provider request before another worker takes over.
        if (Date.parse(job.next_attempt) <= Date.now() + 10000) continue;
        let delivered = false;
        try {
          delivered = await deliver(job.id, bookingEmailMessage(job, config));
        } catch {
          // Invalid message configuration must not acknowledge this job.
        }
        await rpc("finish_booking_email", { p_id: job.id, p_lease: job.lease, p_sent: delivered });
        if (delivered) sent += 1;
      }
      const codes = await rpc("claim_booking_codes", {});
      for (const job of codes) {
        const french = job.language === "fr";
        const accepted = await deliver(job.id, {
          from: config.from, to: [job.recipient],
          subject: french ? "Code de vérification Private Taxi Paris" : "Private Taxi Paris verification code",
          text: [french ? "Copiez ce code dans le formulaire de réservation dans les 15 minutes."
            : "Copy this code into the booking form within 15 minutes.", job.code,
          french ? "Si vous n'avez pas demandé ce code, ignorez ce message. Aucun trajet n'a été réservé."
            : "If you did not request this code, ignore this email. No ride has been booked."].join("\n\n")
        });
        if (accepted) {
          await rpc("finish_booking_code", { p_id: job.id });
          sent += 1;
        }
      }
      return Response.json({ sent, failed: jobs.length + codes.length - sent });
    } catch {
      return new Response(null, { status: 503 });
    }
  };
}
