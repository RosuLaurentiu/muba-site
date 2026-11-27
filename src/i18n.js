export const SUPPORTED_LANGUAGES = ["en", "fr"];
export const LANGUAGE_STORAGE_KEY = "muba-site-language";

export const translations = {
  en: {
    units: {
      kilometerShort: "km",
      hourShort: "h",
      minuteShort: "min"
    },
    meta: {
      title: "Private Taxi Paris | Paris Airport Transfers & Chauffeur Service",
      description: "Request a private transfer in Paris and review your trip before the driver confirms availability."
    },
    nav: {
      whatsApp: "WhatsApp",
      languageLabel: "Language selector", skip: "Skip to main content"
    },
    calendar: {
      title: "Google Calendar", calendarId: "Calendar ID from Google Calendar settings",
      connect: "Connect calendar", reconnect: "Reconnect calendar", connected: "Connected calendar",
      retry: "Retry sync", unsynced: "unsynced rides", pending: "Waiting to sync", failed: "Sync failed",
      syncFailed: "Calendar sync could not finish. Your rides are saved.",
      connectionFailed: "Could not connect the calendar. Check access and try again."
    },
    schedule: {
      noUpcoming: "No upcoming pickup.",
      parisDay: "Day in Paris", previous: "Previous day", nextDay: "Next day",
      calendar: "Reservation calendar", today: "Today", prevMonth: "Previous month", nextMonth: "Next month", entries: "Calendar entries",
      nextPickup: "Next pickup", dayEmpty: "No rides or time blocks for this day.",
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
      travelTarget: "Travel time needed (minutes)", travelShort: "Below travel target",
      travelAdvisory: "Adjust the target for these locations. Check the gap before saving.",
      blocked: "Blocked until", addBlock: "Block time", removeBlock: "Remove block", confirmRemove: "Remove this time block?",
      confirmRemoveYes: "Yes, remove it", keep: "No, keep it",
      quickChoices: "Quick choices", restOfToday: "Rest of today", allDay: "All day",
      todayAt: "Today {time}", tomorrowAt: "Tomorrow {time}", inTime: "in {time}",
      start: "Start in Paris time", end: "End in Paris time", invalidBlock: "Choose a valid future end after the start.",
      saveBlock: "Save time block", removed: "Time block removed.",
      addRide: "Add ride", source: "Booking source", phone: "Phone", saveRide: "Save ride",
      reschedule: "Reschedule ride", cancelRide: "Cancel ride", confirmCancel: "Cancel this confirmed ride?", confirmCancelYes: "Yes, cancel the ride",
      duration: "Estimated minutes per leg (optional)", durationInvalid: "Enter a whole number from 1 to 1440.",
      conflict: "Schedule conflict", legsOverlap: "The outbound and return rides overlap.",
      neighbors: "Adjacent rides", saved: "Saved.",
      checkTravel: "Check travel time between pickups.",
      conflictChanged: "The schedule changed. Review the conflicts before trying again.",
      reopenEdit: "This ride changed. Reopen it to edit the latest schedule.",
      saveFailed: "Could not save the change. Check the current schedule.",
      retrySame: "Could not verify the save. Retry with the same details.", retry: "Retry save",
      saving: "Saving...", discard: "Discard changes"
    },
    driver: {
      title: "Driver workspace", signIn: "Driver sign-in", signInAction: "Sign in", bookingPage: "Booking page", statePending: "Awaiting your decision",
      passengerEmail: "Passenger email (receipt and updates)", password: "Password", signOut: "Sign out",
      signingIn: "Signing in...", backToBooking: "Back to booking", refreshing: "Refreshing...", decision: "Booking decision",
      signInFailed: "Could not sign in. Check your email and password and try again.",
      googleSignIn: "Sign in with Google", googleSignInFailed: "Google sign-in did not finish. Try again or use your password.",
      emailFailed: "Booking emails awaiting retry:", emailRetryExpired: "Booking emails past the safe retry window:",
      emailOverdue: "{count} booking emails have not been sent yet. The oldest has waited {age}. Check the booking email service.",
      emailStatusUnavailable: "Could not check booking emails.", checkEmailStatus: "Check email status",
      approveCode: "Approve a rider’s booking code", approvalHelp: "After speaking with the rider, enter their email to approve one web request. The rider must enter the code from their inbox.",
      codeApproved: "Code approved. The rider can use their current code or check their inbox for a new one.",
      approvalLimit: "The email limit has been reached. Try again later.", approvalFailed: "Could not approve this code. Check the address and try again.",
      retryEmail: "Retry booking emails", emailRetryQueued: "Email retry queued.", emailRetryFailed: "Could not queue an email retry.",
      latestRequest: "Open latest request",
      signOutFailed: "Could not sign out. Try again.",
      loading: "Loading the driver workspace...", unavailable: "Driver access is unavailable.",
      denied: "This account does not have driver access.", loadFailed: "Could not load rides. Try refreshing.",
      scheduleStale: "Refresh failed. Showing the last loaded schedule.",
      notFound: "This ride could not be found.", back: "Back to rides", detail: "Ride details", reviewRequest: "Review request",
      pending: "Pending requests", pendingEmpty: "No pending requests.",
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
      confirmDecline: "Decline this request? The rider will be told the ride is unavailable.",
      confirmDeclineYes: "Yes, decline",
      received: "Received {time}", receivedNow: "Received just now", passengerOne: "1 passenger", passengerMany: "{count} passengers"
    },
    booking: {
      darkTheme: "Dark theme", callDriver: "Call the driver", whatsAppDriver: "Message the driver on WhatsApp",
      lastChecked: "Last checked at {time}.", autoRefresh: "This page checks again every minute while your request is pending.", review: "Review request", edit: "Edit trip",
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
      requestCode: "Email me a code", resendCode: "Send a new code", sendingCode: "Sending code…", emailCode: "Email verification code",
      codeHelp: "Enter the code from your inbox within 15 minutes. If it does not arrive, check your spam folder or contact the driver for help.",
      intakeLimit: "The online booking limit has been reached. Contact the driver to check availability or arrange your ride directly.",
      invalidCode: "Check the code and the email address. If the code has expired or was already used, request a new one.",
      codeFailed: "We could not request a code. Try again or contact the driver.",
      codeLimit: "Too many code requests. Try again later or contact the driver.",
      privacyUse: "We use your name, phone number and verified email to arrange your ride. Notes are optional. We use a temporary fingerprint of your network address to limit repeated requests.",
      privacyServices: "Supabase hosts booking data. Google Maps handles address and route lookups. The driver uses email or WhatsApp for quotes and replies. Our email provider sends your receipt and booking updates. The driver can mirror confirmed pickups to Google Calendar.",
      privacyRetention: "Our retention period for booking data is 90 days after the scheduled ride ends or after we decline or cancel the booking.",
      privacyRights: "Contact us to access or correct your data or to request deletion, restriction or portability where applicable. You can also complain to the CNIL.",
      send: "Send ride request", saving: "Sending...", retry: "Retry request",
      saveFailed: "We could not verify the save. Your details are still here. Retry the same request or contact the driver below.",
      savePaused: "Online ride requests are temporarily unavailable. Contact the driver below or retry later.",
      saveRejected: "We could not save the request. Check the details or try again later.",
      receipt: "Request received", reference: "Booking reference",
      keepLink: "Keep the private booking link to see the driver's decision.",
      copyLink: "Copy private link", linkCopied: "Link copied. Keep it to follow your request.",
      linkCopyFailed: "Could not copy the link. Open the booking and bookmark the page.",
      view: "View booking", statusTitle: "Your booking", another: "Start a new request", refresh: "Refresh status",
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
      tripTitle: "Trip details",
      contactTitle: "Passenger details",
      labels: {
        pickup: "Pickup address",
        destination: "Destination",
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
        notes: "Flight number, luggage, child seat, or any special request"
      },
      roundTripHint: "Round trip: the estimate covers the same route in both directions."
    },
    map: {
      label: "Route preview"
    },
    summary: {
      fare: "Estimated fare"
    },
    languages: {
      en: "English",
      fr: "French"
    },
    footer: {
      email: "Email"
    },
    status: {
      pickupRequired: "Enter a pickup address.",
      destinationRequired: "Enter a destination.",
      nameRequired: "Enter a name.",
      returnDateRequired: "Enter a return date.",
      returnTimeRequired: "Enter a return time."
    }
  },
  fr: {
    units: {
      kilometerShort: "km",
      hourShort: "h",
      minuteShort: "min"
    },
    meta: {
      title: "Private Taxi Paris | Transferts aéroport et chauffeur privé à Paris",
      description: "Demandez un transfert privé à Paris. Vérifiez les détails de votre trajet avant la confirmation du chauffeur."
    },
    nav: {
      whatsApp: "WhatsApp",
      languageLabel: "Sélecteur de langue", skip: "Aller au contenu principal"
    },
    calendar: {
      title: "Google Agenda", calendarId: "Identifiant dans les paramètres de Google Agenda",
      connect: "Connecter l'agenda", reconnect: "Reconnecter l'agenda", connected: "Agenda connecté",
      retry: "Réessayer la synchronisation", unsynced: "courses non synchronisées", pending: "Synchronisation en attente", failed: "Échec de synchronisation",
      syncFailed: "Synchronisation impossible. Vos courses sont enregistrées.",
      connectionFailed: "Connexion à l'agenda impossible. Vérifiez l'accès et réessayez."
    },
    schedule: {
      noUpcoming: "Aucun départ à venir.",
      parisDay: "Jour à Paris", previous: "Jour précédent", nextDay: "Jour suivant",
      calendar: "Calendrier des réservations", today: "Aujourd'hui", prevMonth: "Mois précédent", nextMonth: "Mois suivant", entries: "Entrées du calendrier",
      nextPickup: "Prochain départ", dayEmpty: "Aucune course ni plage bloquée ce jour.",
      todayAt: "Aujourd'hui {time}", tomorrowAt: "Demain {time}", inTime: "dans {time}",
      calendarCount: "Les totaux incluent les courses, les demandes et les plages bloquées.", timeBlocked: "Plage bloquée",
      workHours: "Horaires de travail", workHoursNotSet: "Horaires de travail non définis", workHoursLoading: "Chargement des horaires...",
      workHoursUnavailable: "Impossible de charger les horaires. Actualisez la page.", dayOff: "Jour de repos",
      workHoursHelp: "Définissez une semaine type en heure de Paris. Bloquez un créneau pour un changement ponctuel. Les demandes hors horaires restent possibles et sont signalées.",
      workStart: "Début", workEnd: "Fin", followingDay: "Le lendemain", overnightUntil: "Service de nuit jusqu'à",
      invalidWorkHours: "Les heures de début et de fin doivent être différentes.", missingWorkHours: "Indiquez une heure de début et de fin.", outsideWorkHours: "Départ hors horaires de travail",
      saveWorkHours: "Enregistrer les horaires", workHoursSaved: "Horaires enregistrés.",
      workHoursSaveFailed: "Impossible d'enregistrer les horaires. Réessayez.",
      workHoursChanged: "Les horaires ont changé. Revenez en arrière, puis ouvrez de nouveau les horaires avant de les enregistrer.",
      returnLeg: "Trajet retour", finish: "Fin estimée", finishUnknown: "Heure de fin indisponible",
      travelBetween: "Temps de trajet entre les courses", travelUnknown: "Fin de la course précédente inconnue",
      travelAvailable: "disponibles pour le trajet",
      travelTarget: "Temps de trajet nécessaire (minutes)", travelShort: "Temps de trajet insuffisant",
      travelAdvisory: "Adaptez l'objectif aux adresses. Vérifiez le délai avant d'enregistrer.",
      blocked: "Bloqué jusqu'à", addBlock: "Bloquer un créneau", removeBlock: "Libérer le créneau", confirmRemove: "Libérer ce créneau ?",
      confirmRemoveYes: "Oui, libérer ce créneau", keep: "Non, conserver",
      quickChoices: "Choix rapides", restOfToday: "Reste de la journée", allDay: "Toute la journée",
      start: "Début, heure de Paris", end: "Fin, heure de Paris", invalidBlock: "Choisissez une fin future après le début.",
      saveBlock: "Enregistrer le créneau", removed: "Créneau libéré.",
      addRide: "Ajouter une course", source: "Origine de la course", phone: "Téléphone", saveRide: "Enregistrer la course",
      reschedule: "Déplacer la course", cancelRide: "Annuler la course", confirmCancel: "Annuler cette course confirmée ?",
      confirmCancelYes: "Oui, annuler la course",
      duration: "Durée estimée par trajet en minutes (facultatif)", durationInvalid: "Saisissez un entier de 1 à 1440.",
      conflict: "Conflit de planning", legsOverlap: "Le trajet aller chevauche le trajet retour.",
      neighbors: "Courses proches", saved: "Enregistré.",
      checkTravel: "Vérifiez le temps de trajet entre deux départs.",
      conflictChanged: "Le planning a changé. Vérifiez les conflits avant de réessayer.",
      reopenEdit: "Cette course a changé. Rouvrez-la pour modifier le dernier planning.",
      saveFailed: "Impossible d'enregistrer la modification. Vérifiez le planning actuel.",
      retrySame: "Impossible de vérifier l'enregistrement. Réessayez avec les mêmes données.", retry: "Réessayer",
      saving: "Enregistrement...", discard: "Ignorer les modifications"
    },
    driver: {
      title: "Espace chauffeur", signIn: "Connexion chauffeur", signInAction: "Se connecter", bookingPage: "Page de réservation", statePending: "En attente de votre décision",
      passengerEmail: "E-mail du passager (reçu et suivi)", password: "Mot de passe", signOut: "Se déconnecter",
      signingIn: "Connexion en cours...", backToBooking: "Retour à la réservation", refreshing: "Actualisation...", decision: "Décision sur la demande",
      signInFailed: "Connexion impossible. Vérifiez votre e-mail et votre mot de passe, puis réessayez.",
      googleSignIn: "Se connecter avec Google", googleSignInFailed: "La connexion Google a échoué. Réessayez ou utilisez votre mot de passe.",
      emailFailed: "E-mails de réservation en attente de nouvel essai :", emailRetryExpired: "E-mails hors délai de nouvel essai :",
      emailOverdue: "{count} e-mails de réservation ne sont pas encore partis. Le plus ancien attend depuis {age}. Vérifiez le service d'envoi des e-mails.",
      emailStatusUnavailable: "Impossible de vérifier les e-mails de réservation.", checkEmailStatus: "Vérifier le statut des e-mails",
      approveCode: "Approuver le code d’un passager", approvalHelp: "Après avoir échangé avec le passager, saisissez son adresse e-mail pour autoriser une demande en ligne. Le passager doit saisir le code reçu par e-mail.",
      codeApproved: "Code approuvé. Le passager peut utiliser son code actuel ou consulter sa messagerie pour obtenir le nouveau code.",
      approvalLimit: "La limite d’envoi d’e-mails est atteinte. Réessayez plus tard.", approvalFailed: "Impossible d’approuver ce code. Vérifiez l’adresse et réessayez.",
      retryEmail: "Réessayer les e-mails", emailRetryQueued: "Nouvel essai en attente.", emailRetryFailed: "Impossible de relancer les e-mails.",
      latestRequest: "Ouvrir la dernière demande",
      signOutFailed: "Déconnexion impossible. Réessayez.",
      loading: "Chargement de l'espace chauffeur...", unavailable: "L'accès chauffeur est indisponible.",
      denied: "Ce compte ne dispose pas d'un accès chauffeur.", loadFailed: "Impossible de charger les courses. Actualisez la page.",
      scheduleStale: "Échec de l'actualisation. Affichage du dernier planning chargé.",
      notFound: "Cette course est introuvable.", back: "Retour aux courses", detail: "Détails de la course", reviewRequest: "Examiner la demande",
      pending: "Demandes en attente", pendingEmpty: "Aucune demande en attente.",
      received: "Reçue {time}", receivedNow: "Reçue à l'instant", passengerOne: "1 passager", passengerMany: "{count} passagers",
      notes: "Notes du chauffeur", emailRider: "Écrire au passager", call: "Appeler le passager", directions: "Itinéraire vers le départ",
      quote: "Tarif final", quoteInstructions: "Saisissez le tarif final et envoyez-le au passager par e-mail ou sur WhatsApp. Cochez son accord dès sa réponse.",
      riderEstimate: "Estimation affichée au passager", roundTripTotal: "total aller-retour", noRiderEstimate: "Le passager n'a pas vu d'estimation de tarif.",
      quoteNeedsFare: "Saisissez le tarif final pour préparer le message de devis.",
      sendQuoteEmail: "Envoyer le devis par e-mail", sendQuoteWhatsApp: "Envoyer le devis sur WhatsApp",
      quoteSubject: "Votre devis Private Taxi Paris #{reference}", quoteGreeting: "Bonjour {name},",
      quoteIntro: "Merci pour votre demande de course #{reference}.", quoteFare: "Tarif final : {fare}.",
      quoteReply: "Merci de répondre pour accepter ce tarif. Je confirmerai ensuite votre course.",
      confirmNeeds: "Pour confirmer, {items}.", needFare: "saisissez le tarif final", needAcceptance: "cochez l'accord du passager",
      needDuration: "corrigez la durée estimée", needNoConflict: "résolvez le conflit de planning", riderLanguage: "Langue du passager",
      agreedFare: "Tarif convenu", agreedFareInput: "Tarif final en euros",
      invalidFare: "Saisissez un tarif positif avec deux décimales maximum.",
      fareAccepted: "Le passager a accepté ce tarif par e-mail ou sur WhatsApp.", fareRequired: "Indiquez le tarif convenu et l'accord du passager avant de confirmer.",
      accept: "Confirmer la course", decline: "Refuser la demande", decisionSaved: "Décision enregistrée.",
      staleDecision: "Cette course a changé. Vérifiez son statut actuel.",
      decisionFailed: "Impossible de vérifier le changement. Consultez le statut actuel avant de réessayer.",
      trip: "Trajet", passengerDetails: "Coordonnées du passager", passenger: "Passager", passengerName: "Nom du passager", refresh: "Actualiser",
      confirmDecline: "Refuser cette demande ? Le passager sera informé que la course est indisponible.",
      confirmDeclineYes: "Oui, refuser"
    },
    booking: {
      darkTheme: "Thème sombre", review: "Vérifier la demande", edit: "Modifier le trajet",
      callDriver: "Appeler le chauffeur", whatsAppDriver: "Écrire au chauffeur sur WhatsApp",
      checkFare: "Vérifier le trajet et le tarif",
      pickupAt: "Départ, heure de Paris", returnAt: "Retour, heure de Paris",
      pickupDateRequired: "Indiquez une date de départ.", pickupTimeRequired: "Indiquez une heure de départ.",
      dateFormat: "JJ/MM/AAAA", dateField: "Date", timeField: "Heure", showCalendar: "Ouvrir le calendrier", clearDate: "Effacer", invalidDate: "Indiquez une date valide.",
      invalidParisTime: "Choisissez une heure locale valide à Paris.", futurePickup: "Choisissez une heure de départ ultérieure à Paris.", futureReturn: "Choisissez une heure de retour ultérieure à Paris.",
      webNotice: "Envoyez votre demande au moins {hours} heures avant le départ. Pour un départ plus proche, appelez-nous ou utilisez WhatsApp.",
      shortNotice: "Ce départ est trop proche pour une demande en ligne. Choisissez une autre heure, appelez-nous ou utilisez WhatsApp.",
      laterReturn: "Choisissez un retour après le départ.", passengersRequired: "Choisissez le nombre de passagers.",
      validPhoneRequired: "Saisissez un numéro de 7 à 15 chiffres.",
      emailRequired: "Indiquez une adresse e-mail pour le reçu.",
      invalidEmail: "Saisissez une adresse e-mail valide.",
      estimating: "Calcul du tarif estimé...", fareUnavailable: "Estimation indisponible. Vous pouvez envoyer votre demande.",
      confirmationNote: "Votre chauffeur vous envoie le tarif final par e-mail ou sur WhatsApp. Répondez pour accepter le tarif avant que le chauffeur confirme la course.",
      addressPrivacy: "Google Maps utilise les adresses saisies pour proposer des lieux et estimer le trajet.",
      mapsUnavailable: "Les suggestions d'adresse sont indisponibles. Saisissez les adresses complètes. Vous pouvez quand même envoyer votre demande.",
      agreedFare: "Tarif convenu",
      contactPrivacy: "Nous utilisons les informations de votre trajet et vos coordonnées pour traiter votre demande et vous contacter au sujet de votre course. Nous envoyons par e-mail votre reçu, votre lien privé et le suivi de votre réservation.",
      privacyTitle: "Confidentialité", privacyOperator: "Les données de réservation sont gérées par",
      requestCode: "Recevoir un code par e-mail", resendCode: "Envoyer un nouveau code", sendingCode: "Envoi du code…", emailCode: "Code de vérification par e-mail",
      codeHelp: "Saisissez le code reçu par e-mail dans les 15 minutes. Si vous ne le recevez pas, vérifiez vos courriers indésirables ou contactez le chauffeur.",
      intakeLimit: "La limite de réservation en ligne est atteinte. Contactez le chauffeur pour vérifier les disponibilités ou réserver directement.",
      invalidCode: "Vérifiez le code et l'adresse e-mail. Si le code a expiré ou a déjà servi, demandez-en un nouveau.",
      codeFailed: "Impossible de demander un code. Réessayez ou contactez le chauffeur.",
      codeLimit: "Trop de demandes de code. Réessayez plus tard ou contactez le chauffeur.",
      privacyUse: "Nous utilisons votre nom, votre téléphone et votre e-mail vérifié pour organiser votre course. Les notes sont facultatives. Une empreinte temporaire de votre adresse réseau permet de limiter les demandes répétées.",
      privacyServices: "Supabase héberge les données de réservation. Google Maps traite les recherches d'adresses et d'itinéraires. Le chauffeur utilise l'e-mail ou WhatsApp pour les tarifs et les réponses. Notre prestataire d'e-mail envoie le reçu et le suivi. Le chauffeur peut reporter les départs confirmés dans Google Calendar.",
      privacyRetention: "Nous conservons les données de réservation pendant 90 jours après la fin prévue de la course ou après le refus ou l'annulation de la réservation.",
      privacyRights: "Contactez-nous pour accéder à vos données, les corriger ou demander leur effacement, leur limitation ou leur portabilité selon les cas. Vous pouvez aussi adresser une réclamation à la CNIL.",
      send: "Envoyer la demande", saving: "Envoi...", retry: "Réessayer",
      saveFailed: "Impossible de vérifier l'enregistrement. Vos données sont conservées. Réessayez la même demande ou contactez le chauffeur ci-dessous.",
      savePaused: "Les demandes en ligne sont temporairement indisponibles. Contactez le chauffeur ci-dessous ou réessayez plus tard.",
      saveRejected: "Impossible d'enregistrer la demande. Vérifiez les détails ou réessayez plus tard.",
      receipt: "Demande reçue", reference: "Référence de réservation",
      keepLink: "Conservez le lien privé pour consulter la décision du chauffeur.",
      copyLink: "Copier le lien privé", linkCopied: "Lien copié. Gardez-le pour suivre votre demande.",
      linkCopyFailed: "Impossible de copier le lien. Ouvrez la réservation et ajoutez la page aux favoris.",
      view: "Voir la réservation", statusTitle: "Votre réservation", another: "Nouvelle demande", refresh: "Actualiser le statut",
      lastChecked: "Dernière vérification à {time}.", autoRefresh: "Cette page vérifie de nouveau chaque minute tant que votre demande est en attente.",
      contact: "Contacter le chauffeur", call: "Appeler",
      state: { pending: "En attente de confirmation du chauffeur", confirmed: "Course confirmée", declined: "Demande refusée", cancelled: "Course annulée" },
      lookup: { loading: "Chargement de la réservation...", missing: "Le lien de réservation est invalide ou expiré.", error: "Impossible de charger la réservation. Actualisez le statut.", stale: "Échec de l'actualisation. Dernier statut connu affiché." }
    },
    planner: {
      startBooking: "Réserver un trajet",
      title: "Transferts privés",
      headlinePlace: "à Paris.",
      fleetImage: "Une Tesla blanche et un van Mercedes noir sur un boulevard parisien.",
      body: "Préparez un trajet en ville ou un transfert aéroport. Le chauffeur confirmera sa disponibilité après votre demande.",
      tripTitle: "Détails du trajet",
      contactTitle: "Détails du passager",
      labels: {
        pickup: "Adresse de départ",
        destination: "Destination",
        roundTrip: "Ajouter un aller-retour",
        date: "Date de départ",
        time: "Heure de départ à Paris",
        returnDate: "Date du retour",
        returnTime: "Heure du retour à Paris",
        name: "Votre nom",
        email: "E-mail pour le reçu et le suivi de la réservation",
        phone: "Numéro de téléphone",
        passengers: "Passagers",
        notes: "Détails supplémentaires", optionalNotes: "Détails supplémentaires (facultatif)"
      },
      placeholders: {
        pickup: "Aéroport, hôtel, adresse",
        destination: "Où le trajet doit-il se terminer ?",
        notes: "Numéro de vol, bagages, siège enfant ou demande particulière"
      },
      roundTripHint: "Aller-retour : l'estimation couvre le même trajet dans les deux sens."
    },
    map: {
      label: "Aperçu de l'itinéraire"
    },
    summary: {
      fare: "Tarif estimé"
    },
    languages: {
      en: "Anglais",
      fr: "Français"
    },
    footer: {
      email: "E-mail"
    },
    status: {
      pickupRequired: "Indiquez une adresse de départ.",
      destinationRequired: "Indiquez une destination.",
      nameRequired: "Saisissez un nom.",
      returnDateRequired: "Saisissez une date de retour.",
      returnTimeRequired: "Saisissez une heure de retour."
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
