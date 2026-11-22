export const SUPPORTED_LANGUAGES = ["en", "fr"];
export const LANGUAGE_STORAGE_KEY = "muba-site-language";

export const translations = {
  en: {
    units: {
      kilometerShort: "km",
      hourShort: "h",
      minuteShort: "min",
      seatOne: "seat",
      seatMany: "seats"
    },
    meta: {
      title: "Private Taxi Paris | Paris Airport Transfers & Chauffeur Service",
      description: "Request a private transfer in Paris and review your trip before the driver confirms availability."
    },
    nav: {
      home: "Home",
      reserve: "Reserve",
      schedule: "Schedule",
      contact: "Contact",
      callNow: "Call now",
      whatsApp: "WhatsApp",
      languageLabel: "Language selector", skip: "Skip to main content"
    },
    hero: {
      title: "Minimal booking, smooth rides, and a premium first impression.",
      body: "This experience is designed for speed: clients can call you instantly, send an email, or plan their journey with a live route view before they confirm.",
      planRide: "Plan a ride",
      sendEmail: "Send email",
      note: "Need a fast pickup? Call directly. For planned rides, the form below is the clearest option.",
      response: "Response",
      coverage: "Coverage",
      specialty: "Specialty"
    },
    contactCard: {
      label: "Quick contact",
      title: "Give clients 3 simple choices.",
      phone: "Phone",
      email: "Email",
      hours: "Hours"
    },
    flow: {
      label: "Best booking flow",
      steps: [
        "Client enters pickup and destination.",
        "The site shows the route, distance, and travel time.",
        "They confirm by email, phone, or a Calendly booking slot."
      ]
    },
    benefits: [
      {
        title: "Clearer than a generic contact page",
        body: "People immediately understand what to do, which reduces drop-off and unnecessary back-and-forth."
      },
      {
        title: "More practical than a full custom booking system",
        body: "Calendly can handle confirmations and reminders now, while your route form keeps the taxi details organized."
      },
      {
        title: "Built to feel premium on mobile",
        body: "The design keeps actions large, readable, and calm so booking is easy even when clients are in a hurry."
      }
    ],
    calendar: {
      title: "Google Calendar", calendarId: "Calendar ID from Google Calendar settings",
      connect: "Connect calendar", reconnect: "Reconnect calendar", connected: "Connected calendar",
      retry: "Retry sync", unsynced: "unsynced rides", pending: "Waiting to sync", failed: "Sync failed",
      syncFailed: "Calendar sync could not finish. Your rides are saved.",
      connectionFailed: "Could not connect the calendar. Check access and try again."
    },
    schedule: {
      noUpcoming: "No upcoming pickup.",
      dayView: "Day schedule", parisDay: "Day in Paris", previous: "Previous day", nextDay: "Next day",
      calendar: "Reservation calendar", today: "Today", prevMonth: "Previous month", nextMonth: "Next month", entries: "Calendar entries",
      nextPickup: "Next pickup", openDay: "Open day", dayEmpty: "No rides or time blocks for this day.",
      calendarCount: "Day totals include rides, requests and time blocks.", timeBlocked: "Time blocked",
      workHours: "Working hours", workHoursNotSet: "Working hours not set", workHoursLoading: "Loading working hours...",
      workHoursUnavailable: "Could not load working hours. Try refreshing.", dayOff: "Day off",
      workHoursHelp: "Set a regular week in Paris time. Use Block time for a one-off change. Requests outside these hours still come through and are flagged for review.",
      workStart: "Start", workEnd: "End", followingDay: "Next day", overnightUntil: "Overnight shift until",
      invalidWorkHours: "Choose different start and end times.", missingWorkHours: "Enter a start and end time.", outsideWorkHours: "Pickup outside working hours",
      saveWorkHours: "Save working hours", workHoursSaved: "Working hours saved.",
      workHoursSaveFailed: "Could not save working hours. Try again.",
      workHoursChanged: "Working hours changed elsewhere. Go back and reopen Working hours before saving.",
      returnLeg: "Return leg", finish: "Estimated finish", finishUnknown: "Finish time unavailable",
      travelBetween: "Travel time between rides", travelUnknown: "Prior finish unknown",
      travelAvailable: "available for travel",
      travelTarget: "Draft travel target (minutes)", travelShort: "Below travel target",
      travelAdvisory: "Adjust the target for these locations. Check the gap before saving.",
      blocked: "Blocked until", addBlock: "Block time", removeBlock: "Remove block", confirmRemove: "Remove this time block?",
      start: "Start in Paris time", end: "End in Paris time", invalidBlock: "Choose a valid future end after the start.",
      saveBlock: "Save time block", removed: "Time block removed.",
      addRide: "Add ride", source: "Booking source", phone: "Phone", saveRide: "Save ride",
      reschedule: "Reschedule ride", cancelRide: "Cancel ride", confirmCancel: "Cancel this confirmed ride?",
      duration: "Estimated minutes per leg (optional)", durationInvalid: "Enter a whole number from 1 to 1440.",
      conflict: "Schedule conflict", legsOverlap: "The outbound and return rides overlap.",
      neighbors: "Adjacent rides", saved: "Saved.",
      checkTravel: "Check travel time between pickups.", otherEntries: "Other rides and time blocks",
      conflictChanged: "The schedule changed. Review the conflicts before trying again.",
      reopenEdit: "This ride changed. Reopen it to edit the latest schedule.",
      saveFailed: "Could not save the change. Check the current schedule.",
      retrySame: "Could not verify the save. Retry with the same details.", retry: "Retry save",
      saving: "Saving...", discard: "Discard changes"
    },
    driver: {
      title: "Driver workspace", signIn: "Driver sign-in", password: "Password", signOut: "Sign out",
      signingIn: "Signing in...", backToBooking: "Back to booking", refreshing: "Refreshing...", decision: "Booking decision",
      signInFailed: "Could not sign in. Check your email and password and try again.",
      googleSignIn: "Sign in with Google", googleSignInFailed: "Google sign-in did not finish. Try again or use your password.",
      emailFailed: "Booking emails awaiting retry:", emailRetryExpired: "Booking emails past the safe retry window:",
      emailStatusUnavailable: "Could not check booking emails.", checkEmailStatus: "Check email status",
      retryEmail: "Retry booking emails", emailRetryQueued: "Email retry queued.", emailRetryFailed: "Could not queue an email retry.",
      latestRequest: "Open latest request",
      signOutFailed: "Could not sign out. Try again.",
      loading: "Loading the driver workspace...", unavailable: "Driver access is unavailable.",
      denied: "This account does not have driver access.", loadFailed: "Could not load rides. Try refreshing.",
      scheduleStale: "Refresh failed. Showing the last loaded schedule.",
      notFound: "This ride could not be found.", back: "Back to rides", detail: "Ride details", reviewRequest: "Review request",
      pending: "Pending requests", pendingEmpty: "No pending requests.",
      confirmed: "Confirmed rides", confirmedEmpty: "No confirmed rides.",
      notes: "Driver notes", emailRider: "Email rider", call: "Call passenger", directions: "Pickup directions",
      quote: "Final quote", quoteInstructions: "Enter the final fare and send it to the rider by email or WhatsApp. Tick acceptance once the rider replies.",
      riderEstimate: "Estimate shown to the rider", roundTripTotal: "round-trip total", noRiderEstimate: "The rider did not see a fare estimate.",
      quoteNeedsFare: "Enter the final fare to prepare the quote message.",
      sendQuoteEmail: "Send quote by email", sendQuoteWhatsApp: "Send quote on WhatsApp",
      quoteSubject: "Your Private Taxi Paris quote #{reference}", quoteGreeting: "Hello {name},",
      quoteIntro: "Thank you for your ride request #{reference}.", quoteFare: "Final fare: {fare}.",
      quoteReply: "Please reply to accept this fare. I will then confirm your ride.",
      confirmNeeds: "To confirm, {items}.", needFare: "enter the final fare", needAcceptance: "tick the rider's acceptance",
      needDuration: "correct the estimated minutes", needNoConflict: "resolve the schedule conflict", riderLanguage: "Rider language",
      agreedFare: "Agreed fare", agreedFareInput: "Final fare in euros",
      invalidFare: "Enter a positive fare with up to two decimal places.",
      fareAccepted: "The rider accepted this fare by email or WhatsApp.", fareRequired: "Record the agreed fare and the rider's acceptance before confirming.",
      accept: "Confirm ride", decline: "Decline request", decisionSaved: "Decision saved.",
      staleDecision: "This ride changed since you opened it. Review the current status.",
      decisionFailed: "Could not verify the change. Check the current status before trying again.",
      trip: "Trip", passengerDetails: "Passenger details", passenger: "Passenger", passengerName: "Passenger name", refresh: "Refresh",
      confirmDecline: "Decline this request? The rider will be told the ride is unavailable."
    },
    booking: {
      appearance: "Appearance",
      light: "Light", dark: "Dark", review: "Review request", edit: "Edit trip",
      checkFare: "Review trip and fare",
      pickupAt: "Pickup in Paris time", returnAt: "Return in Paris time",
      pickupDateRequired: "Enter a pickup date.", pickupTimeRequired: "Enter a pickup time.",
      dateFormat: "DD/MM/YYYY", dateField: "Date", timeField: "Time", showCalendar: "Open calendar", clearDate: "Clear", invalidDate: "Enter a valid date.",
      invalidParisTime: "Choose a valid local time in Paris.", futurePickup: "Choose a future pickup time in Paris.", futureReturn: "Choose a future return time in Paris.",
      webNotice: "Request online at least {hours} hours before pickup. For a sooner ride, call or use WhatsApp.",
      shortNotice: "This pickup is too soon to book online. Choose a later time, call or use WhatsApp.",
      laterReturn: "Choose a return time after pickup.", passengersRequired: "Choose the number of passengers.",
      validPhoneRequired: "Enter a phone number with 7 to 15 digits.",
      emailRequired: "Enter an email address for the booking receipt.",
      invalidEmail: "Enter a valid email address.",
      estimating: "Calculating the fare estimate...", fareUnavailable: "Fare estimate unavailable. You can still request this ride.",
      confirmationNote: "Your driver sends the final fare by email or WhatsApp. Reply to accept it before the driver confirms your ride.",
      addressPrivacy: "Google Maps uses the addresses you enter to suggest locations and estimate the route.",
      mapsUnavailable: "Address suggestions are unavailable right now. Type the full addresses. You can still send your request.",
      agreedFare: "Agreed fare",
      contactPrivacy: "We use your trip and contact details to handle your request and contact you about your ride. We email your receipt, private tracking link and booking updates.",
      privacyTitle: "Privacy notice", privacyOperator: "Booking data is managed by",
      privacyUse: "We process the details needed to respond to your request and arrange your ride. A name, phone number and email address are required for bookings. Notes are optional.",
      privacyServices: "Supabase hosts booking data. Google Maps handles address and route lookups. The driver uses email or WhatsApp for quotes and replies. Our email provider sends your receipt and booking updates. The driver can mirror confirmed pickups to Google Calendar.",
      privacyRetention: "Booking data is scheduled for deletion 90 days after the scheduled ride ends or after we decline or cancel the booking. Encrypted backup copies are kept for seven days.",
      privacyRights: "Contact us to access or correct your data or to request deletion, restriction or portability where applicable. You can also complain to the CNIL.",
      send: "Send ride request", saving: "Sending...", retry: "Retry request",
      saveFailed: "We could not verify the save. Your details are still here. Retry the same request or contact the driver below.",
      savePaused: "Online ride requests are temporarily unavailable. Contact the driver below or retry later.",
      saveRejected: "We could not save the request. Check the details or try again later.",
      receipt: "Request received", reference: "Booking reference",
      keepLink: "Keep the private booking link to see the driver's decision.",
      copyLink: "Copy private link", linkCopied: "Link copied. Keep it to follow your request.",
      linkCopyFailed: "Could not copy the link. Open the booking and bookmark the page.",
      view: "View booking", another: "Start a new request", refresh: "Refresh status",
      contact: "Contact the driver", call: "Call",
      state: { pending: "Pending driver confirmation", confirmed: "Ride confirmed", declined: "Request declined", cancelled: "Ride cancelled" },
      lookup: { loading: "Loading booking...", missing: "This booking link is invalid or has expired.", error: "Could not load the booking. Try refreshing.", stale: "Refresh failed. Showing the last known status." }
    },
    planner: {
      startBooking: "Reserve a ride",
      title: "Private transfers",
      headlinePlace: "in Paris.",
      fleetImage: "A white Tesla sedan and a black Mercedes van on a Paris boulevard.",
      body: "Plan a city ride or an airport transfer. Your driver will confirm availability after you send your request.",
      introLabel: "Mobile booking flow",
      steps: ["1. Route", "2. Contact", "3. Confirm"],
      tripTitle: "Trip details",
      tripBody: "Start with the route and preferred pickup time.",
      contactTitle: "Passenger details",
      contactBody: "Enough information to call back quickly and confirm the ride.",
      labels: {
        pickup: "Pickup address",
        destination: "Destination",
        vehicle: "Vehicle",
        roundTrip: "Add a round trip",
        date: "Pickup date",
        time: "Pickup time in Paris",
        returnDate: "Return date",
        returnTime: "Return time in Paris",
        name: "Your name",
        email: "Email for the receipt and booking updates",
        phone: "Phone number",
        passengers: "Passengers",
        notes: "Extra details", optionalNotes: "Extra details (optional)"
      },
      placeholders: {
        pickup: "Airport, hotel, street address",
        destination: "Where should the ride end?",
        name: "Full name",
        phone: "+33...",
        notes: "Flight number, luggage, child seat, or any special request"
      },
      roundTripHint: "Round-trip estimates currently use the same route in reverse, so the total updates instantly.",
      calculateTrip: "Calculate route and fare",
      prepareEmail: "Prepare booking email",
      footnote: "Tip: if a client prefers speaking directly, they can send the trip on WhatsApp instead of filling everything in."
    },
    map: {
      label: "Live route preview",
      badgeWaiting: "Waiting for Google Maps",
      badgeAddKey: "Add API key",
      badgeReady: "Live route ready",
      badgeUnavailable: "Map unavailable",
      placeholderMissingKey: "Add your Google Maps API key in config.js to enable autocomplete, map display, and driving distance calculation.",
      placeholderLoading: "Connecting Google Maps...",
      placeholderError: "Google Maps could not load. Check billing, the enabled APIs, and the allowed website referrers for your API key."
    },
    summary: {
      label: "Trip summary",
      tag: "Ready to send",
      readyLabel: "Current estimate",
      distance: "Distance",
      duration: "Duration",
      fare: "Estimated fare",
      vehicle: "Vehicle",
      tripType: "Trip type",
      oneWay: "One way",
      roundTrip: "Round trip",
      client: "Client",
      notCalculated: "Not calculated yet",
      farePending: "Estimate after route",
      fareHint: "Calculate the route to show the total estimate.",
      clientPending: "Waiting for trip details",
      unnamedClient: "Unnamed client",
      phoneMissing: "Phone missing",
      emailTrip: "Email this trip",
      whatsAppTrip: "Send on WhatsApp",
      defaultStatus: "Add the trip details to preview the route and send a polished booking request."
    },
    languages: {
      en: "English",
      fr: "French"
    },
    footer: {
      eyebrow: "Contact",
      copy: "A clean private transport website that helps clients understand the service immediately and reserve without friction.",
      call: "Call",
      email: "Email"
    },
    mobileBar: {
      call: "Call",
      reserve: "Reserve",
      email: "Email"
    },
    status: {
      pickupRequired: "Enter a pickup address.",
      destinationRequired: "Enter a destination.",
      nameRequired: "Client name is required.",
      phoneRequired: "Phone number is required.",
      mapsNotConfigured: "Google Maps is not configured yet. You can still prepare the booking email or send the request on WhatsApp.",
      mapsLoading: "Google Maps is still loading. Please try again in a moment.",
      calculatingRoute: "Calculating the driving route...",
      routeReady: "Route ready. The client can now send the request by email or WhatsApp.",
      routeReadyRoundTrip: "Route ready. The total estimate now includes the return trip and is ready to send.",
      routeError: "I could not calculate that route right now. Please check the addresses or send the trip manually by email or WhatsApp.",
      emailWithoutRoute: "The route could not be calculated automatically, but the booking email can still be prepared.",
      emailPrepared: "Your email app should open with the trip details already filled in.",
      mapsConnected: "Google Maps is connected. Clients can now calculate driving routes.",
      mapsLoadError: "Google Maps could not be loaded. Check billing, the API key restrictions, and the enabled services.",
      mapsAuthError: "Google Maps rejected the API key. Check that billing is enabled and that this website is allowed in the key referrer restrictions.",
      mapsPlacesError: "Google Maps loaded, but Places Autocomplete is unavailable. Make sure the Places API is enabled for this key.",
      returnDateRequired: "Return date is required for a round trip.",
      returnTimeRequired: "Return time is required for a round trip."
    },
    mail: {
      subjectPrefix: "Ride request",
      newClient: "New client",
      toBeConfirmed: "To be confirmed",
      greeting: "Hello",
      requestLine: "I would like to request a taxi ride.",
      requestShort: "Please find my booking request below.",
      name: "Name",
      client: "Client",
      phone: "Phone",
      vehicle: "Vehicle",
      tripType: "Trip type",
      route: "Route",
      departure: "Departure",
      returnTrip: "Return",
      estimate: "Estimate",
      notes: "Notes",
      pickup: "Pickup",
      destination: "Destination",
      preferredDate: "Pickup date",
      preferredTime: "Pickup time in Paris",
      returnDate: "Return date",
      returnTime: "Return time in Paris",
      passengers: "Passengers",
      distance: "Distance",
      travelTime: "Travel time",
      estimatedFare: "Estimated fare",
      extraDetails: "Extra details",
      none: "None",
      notApplicable: "Not applicable",
      confirm: "Please confirm availability.",
      notProvided: "Not provided"
    },
    whatsApp: {
      greeting: "Hello",
      requestLine: "I would like to request this ride on WhatsApp.",
      requestShort: "Please find my booking request below.",
      confirm: "Please confirm availability here on WhatsApp."
    }
  },
  fr: {
    units: {
      kilometerShort: "km",
      hourShort: "h",
      minuteShort: "min",
      seatOne: "place",
      seatMany: "places"
    },
    meta: {
      title: "Private Taxi Paris | Transferts aeroport et chauffeur prive a Paris",
      description: "Demandez un transfert prive a Paris. Verifiez les details de votre trajet avant la confirmation du chauffeur."
    },
    nav: {
      home: "Accueil",
      reserve: "Reserver",
      schedule: "Planifier",
      contact: "Contact",
      callNow: "Appeler",
      whatsApp: "WhatsApp",
      languageLabel: "Selecteur de langue", skip: "Aller au contenu principal"
    },
    hero: {
      title: "Reservation simple, trajets fluides et premiere impression premium.",
      body: "Cette experience est pensee pour aller vite : les clients peuvent vous appeler tout de suite, envoyer un email ou preparer leur trajet avec un apercu d'itineraire avant de confirmer.",
      planRide: "Planifier un trajet",
      sendEmail: "Envoyer un email",
      note: "Besoin d'un pickup rapide ? Appelez directement. Pour les trajets prevus, le formulaire ci-dessous est l'option la plus claire.",
      response: "Reponse",
      coverage: "Zone",
      specialty: "Specialite"
    },
    contactCard: {
      label: "Contact rapide",
      title: "Donnez aux clients 3 choix simples.",
      phone: "Telephone",
      email: "Email",
      hours: "Horaires"
    },
    flow: {
      label: "Meilleur parcours",
      steps: [
        "Le client indique le depart et la destination.",
        "Le site affiche l'itineraire, la distance et le temps de trajet.",
        "Il confirme par email, telephone ou via un creneau Calendly."
      ]
    },
    benefits: [
      {
        title: "Plus clair qu'une simple page contact",
        body: "Les gens comprennent tout de suite quoi faire, ce qui reduit les abandons et les allers-retours inutiles."
      },
      {
        title: "Plus pratique qu'un systeme de reservation sur mesure",
        body: "Calendly peut gerer les confirmations et rappels des maintenant, pendant que le formulaire garde les details du trajet bien organises."
      },
      {
        title: "Pense pour etre premium sur mobile",
        body: "Le design garde des actions larges, lisibles et rassurantes pour reserver facilement meme quand le client est presse."
      }
    ],
    calendar: {
      title: "Google Agenda", calendarId: "Identifiant dans les parametres de Google Agenda",
      connect: "Connecter l'agenda", reconnect: "Reconnecter l'agenda", connected: "Agenda connecte",
      retry: "Reessayer la synchronisation", unsynced: "courses non synchronisees", pending: "Synchronisation en attente", failed: "Echec de synchronisation",
      syncFailed: "Synchronisation impossible. Vos courses sont enregistrees.",
      connectionFailed: "Connexion a l'agenda impossible. Verifiez l'acces et reessayez."
    },
    schedule: {
      noUpcoming: "Aucun depart a venir.",
      dayView: "Planning du jour", parisDay: "Jour a Paris", previous: "Jour precedent", nextDay: "Jour suivant",
      calendar: "Calendrier des reservations", today: "Aujourd'hui", prevMonth: "Mois precedent", nextMonth: "Mois suivant", entries: "Entrees du calendrier",
      nextPickup: "Prochain depart", openDay: "Ouvrir ce jour", dayEmpty: "Aucune course ni plage bloquee ce jour.",
      calendarCount: "Les totaux incluent les courses, les demandes et les plages bloquees.", timeBlocked: "Plage bloquee",
      workHours: "Horaires de travail", workHoursNotSet: "Horaires de travail non definis", workHoursLoading: "Chargement des horaires...",
      workHoursUnavailable: "Impossible de charger les horaires. Actualisez la page.", dayOff: "Jour de repos",
      workHoursHelp: "Definissez une semaine type en heure de Paris. Bloquez un creneau pour un changement ponctuel. Les demandes hors horaires restent possibles et sont signalees.",
      workStart: "Debut", workEnd: "Fin", followingDay: "Le lendemain", overnightUntil: "Service de nuit jusqu'a",
      invalidWorkHours: "Les heures de debut et de fin doivent etre differentes.", missingWorkHours: "Indiquez une heure de debut et de fin.", outsideWorkHours: "Depart hors horaires de travail",
      saveWorkHours: "Enregistrer les horaires", workHoursSaved: "Horaires enregistres.",
      workHoursSaveFailed: "Impossible d'enregistrer les horaires. Reessayez.",
      workHoursChanged: "Les horaires ont change. Revenez en arriere, puis ouvrez de nouveau les horaires avant de les enregistrer.",
      returnLeg: "Trajet retour", finish: "Fin estimee", finishUnknown: "Heure de fin indisponible",
      travelBetween: "Temps de trajet entre les courses", travelUnknown: "Fin de la course precedente inconnue",
      travelAvailable: "disponibles pour le trajet",
      travelTarget: "Objectif provisoire de trajet (minutes)", travelShort: "Temps de trajet insuffisant",
      travelAdvisory: "Adaptez l'objectif aux adresses. Verifiez le delai avant d'enregistrer.",
      blocked: "Bloque jusqu'a", addBlock: "Bloquer un creneau", removeBlock: "Liberer le creneau", confirmRemove: "Liberer ce creneau ?",
      start: "Debut, heure de Paris", end: "Fin, heure de Paris", invalidBlock: "Choisissez une fin future apres le debut.",
      saveBlock: "Enregistrer le creneau", removed: "Creneau libere.",
      addRide: "Ajouter une course", source: "Origine de la course", phone: "Telephone", saveRide: "Enregistrer la course",
      reschedule: "Deplacer la course", cancelRide: "Annuler la course", confirmCancel: "Annuler cette course confirmee ?",
      duration: "Duree estimee par trajet en minutes (facultatif)", durationInvalid: "Saisissez un entier de 1 a 1440.",
      conflict: "Conflit de planning", legsOverlap: "Le trajet aller chevauche le trajet retour.",
      neighbors: "Courses proches", saved: "Enregistre.",
      checkTravel: "Verifiez le temps de trajet entre deux departs.", otherEntries: "Autres courses et creneaux bloques",
      conflictChanged: "Le planning a change. Verifiez les conflits avant de reessayer.",
      reopenEdit: "Cette course a change. Rouvrez-la pour modifier le dernier planning.",
      saveFailed: "Impossible d'enregistrer la modification. Verifiez le planning actuel.",
      retrySame: "Impossible de verifier l'enregistrement. Reessayez avec les memes donnees.", retry: "Reessayer",
      saving: "Enregistrement...", discard: "Ignorer les modifications"
    },
    driver: {
      title: "Espace chauffeur", signIn: "Connexion chauffeur", password: "Mot de passe", signOut: "Se deconnecter",
      signingIn: "Connexion en cours...", backToBooking: "Retour a la reservation", refreshing: "Actualisation...", decision: "Decision sur la demande",
      signInFailed: "Connexion impossible. Verifiez votre e-mail et votre mot de passe, puis reessayez.",
      googleSignIn: "Se connecter avec Google", googleSignInFailed: "La connexion Google a echoue. Reessayez ou utilisez votre mot de passe.",
      emailFailed: "E-mails de reservation en attente de nouvel essai :", emailRetryExpired: "E-mails hors delai de nouvel essai :",
      emailStatusUnavailable: "Impossible de verifier les e-mails de reservation.", checkEmailStatus: "Verifier le statut des e-mails",
      retryEmail: "Reessayer les e-mails", emailRetryQueued: "Nouvel essai en attente.", emailRetryFailed: "Impossible de relancer les e-mails.",
      latestRequest: "Ouvrir la derniere demande",
      signOutFailed: "Deconnexion impossible. Reessayez.",
      loading: "Chargement de l'espace chauffeur...", unavailable: "L'acces chauffeur est indisponible.",
      denied: "Ce compte ne dispose pas d'un acces chauffeur.", loadFailed: "Impossible de charger les courses. Actualisez la page.",
      scheduleStale: "Echec de l'actualisation. Affichage du dernier planning charge.",
      notFound: "Cette course est introuvable.", back: "Retour aux courses", detail: "Details de la course", reviewRequest: "Examiner la demande",
      pending: "Demandes en attente", pendingEmpty: "Aucune demande en attente.",
      confirmed: "Courses confirmees", confirmedEmpty: "Aucune course confirmee.",
      notes: "Notes du chauffeur", emailRider: "Ecrire au passager", call: "Appeler le passager", directions: "Itineraire vers le depart",
      quote: "Tarif final", quoteInstructions: "Saisissez le tarif final et envoyez-le au passager par e-mail ou sur WhatsApp. Cochez son accord des sa reponse.",
      riderEstimate: "Estimation affichee au passager", roundTripTotal: "total aller-retour", noRiderEstimate: "Le passager n'a pas vu d'estimation de tarif.",
      quoteNeedsFare: "Saisissez le tarif final pour preparer le message de devis.",
      sendQuoteEmail: "Envoyer le devis par e-mail", sendQuoteWhatsApp: "Envoyer le devis sur WhatsApp",
      quoteSubject: "Votre devis Private Taxi Paris #{reference}", quoteGreeting: "Bonjour {name},",
      quoteIntro: "Merci pour votre demande de course #{reference}.", quoteFare: "Tarif final : {fare}.",
      quoteReply: "Merci de repondre pour accepter ce tarif. Je confirmerai ensuite votre course.",
      confirmNeeds: "Pour confirmer, {items}.", needFare: "saisissez le tarif final", needAcceptance: "cochez l'accord du passager",
      needDuration: "corrigez la duree estimee", needNoConflict: "resolvez le conflit de planning", riderLanguage: "Langue du passager",
      agreedFare: "Tarif convenu", agreedFareInput: "Tarif final en euros",
      invalidFare: "Saisissez un tarif positif avec deux decimales maximum.",
      fareAccepted: "Le passager a accepte ce tarif par e-mail ou sur WhatsApp.", fareRequired: "Indiquez le tarif convenu et l'accord du passager avant de confirmer.",
      accept: "Confirmer la course", decline: "Refuser la demande", decisionSaved: "Decision enregistree.",
      staleDecision: "Cette course a change. Verifiez son statut actuel.",
      decisionFailed: "Impossible de verifier le changement. Consultez le statut actuel avant de reessayer.",
      trip: "Trajet", passengerDetails: "Coordonnees du passager", passenger: "Passager", passengerName: "Nom du passager", refresh: "Actualiser",
      confirmDecline: "Refuser cette demande ? Le passager sera informe que la course est indisponible."
    },
    booking: {
      appearance: "Apparence",
      light: "Clair", dark: "Sombre", review: "Verifier la demande", edit: "Modifier le trajet",
      checkFare: "Verifier le trajet et le tarif",
      pickupAt: "Depart, heure de Paris", returnAt: "Retour, heure de Paris",
      pickupDateRequired: "Indiquez une date de depart.", pickupTimeRequired: "Indiquez une heure de depart.",
      dateFormat: "JJ/MM/AAAA", dateField: "Date", timeField: "Heure", showCalendar: "Ouvrir le calendrier", clearDate: "Effacer", invalidDate: "Indiquez une date valide.",
      invalidParisTime: "Choisissez une heure locale valide a Paris.", futurePickup: "Choisissez une heure de depart ulterieure a Paris.", futureReturn: "Choisissez une heure de retour ulterieure a Paris.",
      webNotice: "Envoyez votre demande au moins {hours} heures avant le depart. Pour un depart plus proche, appelez-nous ou utilisez WhatsApp.",
      shortNotice: "Ce depart est trop proche pour une demande en ligne. Choisissez une autre heure, appelez-nous ou utilisez WhatsApp.",
      laterReturn: "Choisissez un retour apres le depart.", passengersRequired: "Choisissez le nombre de passagers.",
      validPhoneRequired: "Saisissez un numero de 7 a 15 chiffres.",
      emailRequired: "Indiquez une adresse e-mail pour le recu.",
      invalidEmail: "Saisissez une adresse e-mail valide.",
      estimating: "Calcul du tarif estime...", fareUnavailable: "Estimation indisponible. Vous pouvez envoyer votre demande.",
      confirmationNote: "Votre chauffeur vous envoie le tarif final par e-mail ou sur WhatsApp. Repondez pour accepter le tarif avant que le chauffeur confirme la course.",
      addressPrivacy: "Google Maps utilise les adresses saisies pour proposer des lieux et estimer le trajet.",
      mapsUnavailable: "Les suggestions d'adresse sont indisponibles. Saisissez les adresses completes. Vous pouvez quand meme envoyer votre demande.",
      agreedFare: "Tarif convenu",
      contactPrivacy: "Nous utilisons les informations de votre trajet et vos coordonnees pour traiter votre demande et vous contacter au sujet de votre course. Nous envoyons par e-mail votre recu, votre lien prive et le suivi de votre reservation.",
      privacyTitle: "Confidentialite", privacyOperator: "Les donnees de reservation sont gerees par",
      privacyUse: "Nous traitons les informations necessaires pour repondre a votre demande et organiser votre course. Le nom, le telephone et l'adresse e-mail sont obligatoires pour toute reservation. Les notes sont facultatives.",
      privacyServices: "Supabase heberge les donnees de reservation. Google Maps traite les recherches d'adresses et d'itineraires. Le chauffeur utilise l'e-mail ou WhatsApp pour les tarifs et les reponses. Notre prestataire d'e-mail envoie le recu et le suivi. Le chauffeur peut reporter les departs confirmes dans Google Calendar.",
      privacyRetention: "La suppression des donnees est programmee 90 jours apres la fin prevue de la course ou apres le refus ou l'annulation de la reservation. Les copies de sauvegarde chiffrees sont conservees sept jours.",
      privacyRights: "Contactez-nous pour acceder a vos donnees, les corriger ou demander leur effacement, leur limitation ou leur portabilite selon les cas. Vous pouvez aussi adresser une reclamation a la CNIL.",
      send: "Envoyer la demande", saving: "Envoi...", retry: "Reessayer",
      saveFailed: "Impossible de verifier l'enregistrement. Vos donnees sont conservees. Reessayez la meme demande ou contactez le chauffeur ci-dessous.",
      savePaused: "Les demandes en ligne sont temporairement indisponibles. Contactez le chauffeur ci-dessous ou reessayez plus tard.",
      saveRejected: "Impossible d'enregistrer la demande. Verifiez les details ou reessayez plus tard.",
      receipt: "Demande recue", reference: "Reference de reservation",
      keepLink: "Conservez le lien prive pour consulter la decision du chauffeur.",
      copyLink: "Copier le lien prive", linkCopied: "Lien copie. Gardez-le pour suivre votre demande.",
      linkCopyFailed: "Impossible de copier le lien. Ouvrez la reservation et ajoutez la page aux favoris.",
      view: "Voir la reservation", another: "Nouvelle demande", refresh: "Actualiser le statut",
      contact: "Contacter le chauffeur", call: "Appeler",
      state: { pending: "En attente de confirmation du chauffeur", confirmed: "Course confirmee", declined: "Demande refusee", cancelled: "Course annulee" },
      lookup: { loading: "Chargement de la reservation...", missing: "Le lien de reservation est invalide ou expire.", error: "Impossible de charger la reservation. Actualisez le statut.", stale: "Echec de l'actualisation. Dernier statut connu affiche." }
    },
    planner: {
      startBooking: "Reserver un trajet",
      title: "Transferts prives",
      headlinePlace: "a Paris.",
      fleetImage: "Une Tesla blanche et un van Mercedes noir sur un boulevard parisien.",
      body: "Preparez un trajet en ville ou un transfert aeroport. Le chauffeur confirmera sa disponibilite apres votre demande.",
      introLabel: "Parcours mobile",
      steps: ["1. Itineraire", "2. Contact", "3. Confirmation"],
      tripTitle: "Details du trajet",
      tripBody: "Commencez par l'itineraire et l'heure souhaitee.",
      contactTitle: "Details du passager",
      contactBody: "Juste assez d'informations pour rappeler rapidement et confirmer la course.",
      labels: {
        pickup: "Adresse de depart",
        destination: "Destination",
        vehicle: "Vehicule",
        roundTrip: "Ajouter un aller-retour",
        date: "Date de depart",
        time: "Heure de depart a Paris",
        returnDate: "Date du retour",
        returnTime: "Heure du retour a Paris",
        name: "Votre nom",
        email: "E-mail pour le recu et le suivi de la reservation",
        phone: "Numero de telephone",
        passengers: "Passagers",
        notes: "Details supplementaires", optionalNotes: "Details supplementaires (facultatif)"
      },
      placeholders: {
        pickup: "Aeroport, hotel, adresse",
        destination: "Ou le trajet doit-il se terminer ?",
        name: "Nom complet",
        phone: "+33...",
        notes: "Numero de vol, bagages, siege enfant ou demande particuliere"
      },
      roundTripHint: "Les estimations aller-retour utilisent actuellement le meme trajet en sens inverse pour mettre a jour le total instantanement.",
      calculateTrip: "Calculer le trajet et le tarif",
      prepareEmail: "Preparer l'email de reservation",
      footnote: "Astuce : si un client prefere aller vite, il peut envoyer le trajet sur WhatsApp au lieu de tout remplir."
    },
    map: {
      label: "Apercu de l'itineraire",
      badgeWaiting: "En attente de Google Maps",
      badgeAddKey: "Ajouter la cle API",
      badgeReady: "Itineraire pret",
      badgeUnavailable: "Carte indisponible",
      placeholderMissingKey: "Ajoutez votre cle API Google Maps dans config.js pour activer l'autocompletion, l'affichage de la carte et le calcul de distance.",
      placeholderLoading: "Connexion a Google Maps...",
      placeholderError: "Google Maps n'a pas pu se charger. Verifiez la facturation, les API actives et les referers autorises pour votre cle."
    },
    summary: {
      label: "Resume du trajet",
      tag: "Pret a envoyer",
      readyLabel: "Estimation actuelle",
      distance: "Distance",
      duration: "Duree",
      fare: "Tarif estime",
      vehicle: "Vehicule",
      tripType: "Type de trajet",
      oneWay: "Aller simple",
      roundTrip: "Aller-retour",
      client: "Client",
      notCalculated: "Pas encore calcule",
      farePending: "Estimation apres l'itineraire",
      fareHint: "Calculez l'itineraire pour afficher le total estime.",
      clientPending: "En attente des details du trajet",
      unnamedClient: "Client sans nom",
      phoneMissing: "Telephone manquant",
      emailTrip: "Envoyer ce trajet par email",
      whatsAppTrip: "Envoyer sur WhatsApp",
      defaultStatus: "Ajoutez les details du trajet pour afficher l'itineraire et envoyer une demande de reservation plus soignee."
    },
    languages: {
      en: "Anglais",
      fr: "Francais"
    },
    footer: {
      eyebrow: "Contact",
      copy: "Un site de transport prive clair qui aide les clients a comprendre le service immediatement et a reserver sans friction.",
      call: "Appeler",
      email: "Email"
    },
    mobileBar: {
      call: "Appeler",
      reserve: "Reserver",
      email: "Email"
    },
    status: {
      pickupRequired: "Indiquez une adresse de depart.",
      destinationRequired: "Indiquez une destination.",
      nameRequired: "Le nom du client est obligatoire.",
      phoneRequired: "Le numero de telephone est obligatoire.",
      mapsNotConfigured: "Google Maps n'est pas encore configure. Vous pouvez quand meme preparer l'email de reservation ou envoyer la demande sur WhatsApp.",
      mapsLoading: "Google Maps est encore en cours de chargement. Reessayez dans un instant.",
      calculatingRoute: "Calcul de l'itineraire en cours...",
      routeReady: "Itineraire pret. Le client peut maintenant envoyer la demande par email ou WhatsApp.",
      routeReadyRoundTrip: "Itineraire pret. Le total estime inclut maintenant aussi le retour et peut etre envoye.",
      routeError: "Impossible de calculer cet itineraire pour le moment. Verifiez les adresses ou envoyez la demande manuellement par email ou WhatsApp.",
      emailWithoutRoute: "L'itineraire n'a pas pu etre calcule automatiquement, mais l'email de reservation peut quand meme etre prepare.",
      emailPrepared: "Votre application email devrait s'ouvrir avec les details du trajet deja remplis.",
      mapsConnected: "Google Maps est connecte. Les clients peuvent maintenant calculer les itineraires routiers.",
      mapsLoadError: "Google Maps n'a pas pu etre charge. Verifiez la facturation, les restrictions de la cle API et les services actives.",
      mapsAuthError: "Google Maps a refuse la cle API. Verifiez que la facturation est active et que ce site est autorise dans les restrictions de referer.",
      mapsPlacesError: "Google Maps est charge, mais l'autocompletion Places est indisponible. Assurez-vous que l'API Places est active pour cette cle.",
      returnDateRequired: "La date du retour est obligatoire pour un aller-retour.",
      returnTimeRequired: "L'heure du retour est obligatoire pour un aller-retour."
    },
    mail: {
      subjectPrefix: "Demande de trajet",
      newClient: "Nouveau client",
      toBeConfirmed: "A confirmer",
      greeting: "Bonjour",
      requestLine: "Je souhaite reserver une course en taxi.",
      requestShort: "Veuillez trouver ma demande de reservation ci-dessous.",
      name: "Nom",
      client: "Client",
      phone: "Telephone",
      vehicle: "Vehicule",
      tripType: "Type de trajet",
      route: "Trajet",
      departure: "Depart",
      returnTrip: "Retour",
      estimate: "Estimation",
      notes: "Notes",
      pickup: "Depart",
      destination: "Destination",
      preferredDate: "Date de depart",
      preferredTime: "Heure de depart a Paris",
      returnDate: "Date du retour",
      returnTime: "Heure du retour a Paris",
      passengers: "Passagers",
      distance: "Distance",
      travelTime: "Temps de trajet",
      estimatedFare: "Tarif estime",
      extraDetails: "Details supplementaires",
      none: "Aucun",
      notApplicable: "Non applicable",
      confirm: "Merci de confirmer la disponibilite.",
      notProvided: "Non renseigne"
    },
    whatsApp: {
      greeting: "Bonjour",
      requestLine: "Je souhaite demander ce trajet sur WhatsApp.",
      requestShort: "Veuillez trouver ma demande de reservation ci-dessous.",
      confirm: "Merci de confirmer la disponibilite ici sur WhatsApp."
    }
  }
};

export function getText(language, key) {
  return key.split(".").reduce((result, segment) => {
    if (result && Object.prototype.hasOwnProperty.call(result, segment)) {
      return result[segment];
    }

    return undefined;
  }, translations[language]) ?? key;
}

export function getLocalizedConfigValue(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value.en || value.fr || Object.values(value)[0] || "";
  }

  return value;
}

export function normalizeLanguage(language) {
  if (!language) {
    return "en";
  }

  const candidate = language.toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(candidate) ? candidate : "en";
}

export function getSupportedLanguageCandidate(language) {
  if (!language) {
    return "";
  }

  const candidate = language.toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(candidate) ? candidate : "";
}

export function getStoredLanguagePreference() {
  try {
    const storedValue = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedValue ? normalizeLanguage(storedValue) : "";
  } catch {
    return "";
  }
}

export function storeLanguagePreference(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage errors and continue with the in-memory selection.
  }
}

export function getInitialLanguage() {
  const stored = getStoredLanguagePreference();

  if (stored) {
    return stored;
  }

  const preferredLanguages = [...(navigator.languages || []), navigator.language].filter(Boolean);
  const match = preferredLanguages
    .map((value) => getSupportedLanguageCandidate(value))
    .find(Boolean);

  return match || "en";
}
