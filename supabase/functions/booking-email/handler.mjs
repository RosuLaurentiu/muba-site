const subjects = {
  en: { receipt: "Ride request received", confirmed: "Ride confirmed", changed: "Ride time changed", trip_changed: "Ride details updated",
    declined: "Ride request declined", cancelled: "Ride cancelled", driver_new: "New booking request" },
  fr: { receipt: "Demande de trajet recue", confirmed: "Trajet confirme", changed: "Horaire du trajet modifie", trip_changed: "Trajet mis a jour",
    declined: "Demande de trajet refusee", cancelled: "Trajet annule", driver_new: "Nouvelle demande de reservation" }
};

function message(job, config) {
  const french = job.language === "fr";
  const time = new Intl.DateTimeFormat(french ? "fr-FR" : "en-GB", {
    timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short"
  });
  const template = job.template === "confirmed_receipt" ? "confirmed" : (job.template ?? job.kind);
  const subject = subjects[job.language][template];
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
    trackingLink = `${french ? "Lien prive de suivi" : "Private tracking link"}: ${url.href}`;
  }
  return {
    from: config.from,
    to: [job.recipient],
    subject: `${subject} #${job.reference}`,
    text: [
      subject,
      `Reference #${job.reference}`,
      `${french ? "Depart" : "Pickup"}: ${time.format(new Date(job.pickup_at))} (Paris)`,
      job.return_at && `${french ? "Retour" : "Return"}: ${time.format(new Date(job.return_at))} (Paris)`,
      template === "trip_changed" && (french
        ? "Utilisez le lien prive de votre premier e-mail pour verifier les adresses et les horaires de votre trajet confirme."
        : "Use the private link in your first email to check the addresses and times for your confirmed ride."),
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
          delivered = await deliver(job.id, message(job, config));
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
          subject: french ? "Code de verification Private Taxi Paris" : "Private Taxi Paris verification code",
          text: [french ? "Copiez ce code dans le formulaire de reservation dans les 15 minutes."
            : "Copy this code into the booking form within 15 minutes.", job.code,
          french ? "Si vous n'avez pas demande ce code, ignorez ce message. Aucun trajet n'a ete reserve."
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
