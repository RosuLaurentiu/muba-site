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
      title: "privatetaxiparis",
      description: "Reserve a private taxi ride in Paris, calculate the route, and confirm quickly by email or WhatsApp."
    },
    nav: {
      home: "Home",
      reserve: "Reserve",
      schedule: "Schedule",
      contact: "Contact",
      callNow: "Call now",
      whatsApp: "WhatsApp",
      languageLabel: "Language selector"
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
    planner: {
      eyebrow: "Reserve a ride",
      title: "Private Paris transfers with a calmer, faster booking flow.",
      body: "Plan the route, review the estimate, and send the request in one clean screen on desktop and a smoother stacked flow on mobile.",
      introLabel: "Mobile booking flow",
      steps: ["1. Route", "2. Contact", "3. Confirm"],
      tripTitle: "Trip details",
      tripBody: "Start with the route and preferred pickup time.",
      contactTitle: "Passenger details",
      contactBody: "Enough information to call back quickly and confirm the ride.",
      labels: {
        pickup: "Pickup location",
        destination: "Destination",
        vehicle: "Vehicle",
        roundTrip: "Add a round trip",
        date: "Preferred date",
        time: "Preferred time",
        returnDate: "Return date",
        returnTime: "Return time",
        name: "Your name",
        phone: "Phone number",
        passengers: "Passengers",
        notes: "Extra details"
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
    schedule: {
      eyebrow: "Scheduling",
      title: "Use Calendly for confirmations and automatic reminders.",
      body: "For a solo taxi business, this is the simplest production setup: the website handles trip details, while Calendly handles appointment slots, confirmations, and notifications.",
      label: "Recommended setup",
      points: [
        "Keep call and email visible for clients who want immediate contact.",
        "Use the route form to capture pickup, destination, and phone number.",
        "Let Calendly manage the time selection and reminder emails."
      ],
      openPage: "Open scheduling page",
      helperMissing: "Add your Calendly link in config.js to enable direct scheduling.",
      helperWithUrl: "Use this link for a full-page scheduling flow or keep the inline embed below.",
      placeholder: "Your Calendly inline widget will appear here once the URL is configured.",
      placeholderError: "Calendly could not be loaded right now. Use the scheduling button instead."
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
      pickupRequired: "Pickup location is required.",
      destinationRequired: "Destination is required.",
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
      name: "Name",
      phone: "Phone",
      vehicle: "Vehicle",
      tripType: "Trip type",
      pickup: "Pickup",
      destination: "Destination",
      preferredDate: "Preferred date",
      preferredTime: "Preferred time",
      returnDate: "Return date",
      returnTime: "Return time",
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
      title: "privatetaxiparis",
      description: "Reservez un trajet prive a Paris, calculez l'itineraire et confirmez rapidement par email ou WhatsApp."
    },
    nav: {
      home: "Accueil",
      reserve: "Reserver",
      schedule: "Planifier",
      contact: "Contact",
      callNow: "Appeler",
      whatsApp: "WhatsApp",
      languageLabel: "Selecteur de langue"
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
    planner: {
      eyebrow: "Reserver un trajet",
      title: "Transferts prives a Paris avec un parcours de reservation plus rapide et plus clair.",
      body: "Preparez l'itineraire, verifiez l'estimation, puis envoyez la demande depuis un seul ecran sur desktop et un parcours mobile plus fluide.",
      introLabel: "Parcours mobile",
      steps: ["1. Itineraire", "2. Contact", "3. Confirmation"],
      tripTitle: "Details du trajet",
      tripBody: "Commencez par l'itineraire et l'heure souhaitee.",
      contactTitle: "Details du passager",
      contactBody: "Juste assez d'informations pour rappeler rapidement et confirmer la course.",
      labels: {
        pickup: "Lieu de depart",
        destination: "Destination",
        vehicle: "Vehicule",
        roundTrip: "Ajouter un aller-retour",
        date: "Date souhaitee",
        time: "Heure souhaitee",
        returnDate: "Date du retour",
        returnTime: "Heure du retour",
        name: "Votre nom",
        phone: "Numero de telephone",
        passengers: "Passagers",
        notes: "Details supplementaires"
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
    schedule: {
      eyebrow: "Planification",
      title: "Utilisez Calendly pour les confirmations et rappels automatiques.",
      body: "Pour une activite de taxi independant, c'est la configuration la plus simple : le site gere les details du trajet, tandis que Calendly gere les creneaux, confirmations et notifications.",
      label: "Configuration recommandee",
      points: [
        "Gardez l'appel et l'email visibles pour les clients qui veulent un contact immediat.",
        "Utilisez le formulaire pour recuperer depart, destination et numero de telephone.",
        "Laissez Calendly gerer le choix de l'heure et les emails de rappel."
      ],
      openPage: "Ouvrir la page de planification",
      helperMissing: "Ajoutez votre lien Calendly dans config.js pour activer la planification directe.",
      helperWithUrl: "Utilisez ce lien pour une planification en pleine page ou conservez l'integration ci-dessous.",
      placeholder: "Votre widget Calendly apparaitra ici une fois l'URL configuree.",
      placeholderError: "Calendly n'a pas pu se charger pour le moment. Utilisez le bouton de planification a la place."
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
      pickupRequired: "Le lieu de depart est obligatoire.",
      destinationRequired: "La destination est obligatoire.",
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
      name: "Nom",
      phone: "Telephone",
      vehicle: "Vehicule",
      tripType: "Type de trajet",
      pickup: "Depart",
      destination: "Destination",
      preferredDate: "Date souhaitee",
      preferredTime: "Heure souhaitee",
      returnDate: "Date du retour",
      returnTime: "Heure du retour",
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
