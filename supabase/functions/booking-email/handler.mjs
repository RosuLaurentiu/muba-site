const subjects = {
  en: { receipt: "Ride request received", confirmed: "Ride confirmed", changed: "Ride time changed",
    declined: "Ride request declined", cancelled: "Ride cancelled", driver_new: "New booking request" },
  fr: { receipt: "Demande de trajet recue", confirmed: "Trajet confirme", changed: "Horaire du trajet modifie",
    declined: "Demande de trajet refusee", cancelled: "Trajet annule", driver_new: "Nouvelle demande de reservation" }
};

function message(job, config) {
  const french = job.language === "fr";
  const time = new Intl.DateTimeFormat(french ? "fr-FR" : "en-GB", {
    timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short"
  });
  const subject = subjects[job.language][job.kind];
  let rideLink;
  if (job.kind === "driver_new" && config.appUrl) {
    const url = new URL(config.appUrl);
    url.search = new URLSearchParams({ driver: "", ride: job.reference }).toString();
    rideLink = url.href;
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
      rideLink
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
    if (name === "claim_booking_email") return response.json();
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
        let delivered = false;
        try {
          const response = await fetcher(config.emailApiUrl ?? "https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": job.id },
            body: JSON.stringify(message(job, config)),
            redirect: "error",
            signal: AbortSignal.timeout(10000)
          });
          delivered = response.ok;
        } catch {
          // A timeout can follow acceptance. The next attempt uses the same message ID.
        }
        await rpc("finish_booking_email", { p_id: job.id, p_lease: job.lease, p_sent: delivered });
        if (delivered) sent += 1;
      }
      return Response.json({ sent, failed: jobs.length - sent });
    } catch {
      return new Response(null, { status: 503 });
    }
  };
}
