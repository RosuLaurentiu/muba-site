export const appConfig = {
  businessName: "Muba Chauffeur",
  serviceArea: {
    en: "Paris and nearby cities",
    fr: "Paris et villes voisines"
  },
  vehicleLabel: {
    en: "Airport transfers and private rides",
    fr: "Transferts aeroport et trajets prives"
  },
  responsePromise: {
    en: "Usually within 10 minutes",
    fr: "Reponse en general sous 10 minutes"
  },
  businessHours: {
    en: "24/7 by reservation",
    fr: "24/7 sur reservation"
  },
  phoneDisplay: "+33 6 00 00 00 00",
  phoneLink: "+33600000000",
  email: "booking@mubataxi.com",

  // Add your real Calendly event URL when ready.
  calendlyUrl: "https://calendly.com/rosulaurentiu33/30min",

  // Add your Google Maps browser API key to enable the live map and route calculation.
  googleMapsApiKey: "AIzaSyCm14tRKwaMWl63zaoA60yOTOfWo6j2dMk",

  mapDefaultCenter: {
    lat: 48.8566,
    lng: 2.3522
  },
  mapDefaultZoom: 11,
  autocomplete: {
    country: "fr",
    biasRadiusMeters: 140000
  },

  vehicles: {
    eco: {
      label: {
        en: "Eco sedan",
        fr: "Berline eco"
      },
      capacity: 3
    },
    premium: {
      label: {
        en: "Premium sedan",
        fr: "Berline premium"
      },
      capacity: 3
    },
    van: {
      label: {
        en: "Van",
        fr: "Van"
      },
      capacity: 8
    }
  },

  pricing: {
    currency: "EUR",
    locale: {
      en: "en-GB",
      fr: "fr-FR"
    },
    shortTrip: {
      minimumFare: 20,
      perKilometer: 1,
      longTripThresholdKm: 100
    },
    longTrip: {
      minimumFare: 140,
      perKilometer: 1.4
    },
    durationFloor: {
      minimumPerHour: 30
    }
  }
};
