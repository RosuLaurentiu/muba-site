export const appConfig = {
  businessName: {
    en: "Private Taxi Paris",
    fr: "Private Taxi Paris"
  },
  serviceArea: {
    en: "Paris and nearby cities",
    fr: "Paris et villes voisines"
  },
  siteUrl: "https://privatetaxiparis.com",
  phoneDisplay: "+33 6 68 47 81 37",
  phoneLink: "+33668478137",
  email: "privatetaxiparis@gmail.com",
  operatorName: "Mubashir",
  minimumWebNoticeHours: 2,

  // Browser key for address suggestions and route estimates, restricted by HTTP referrer.
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
        fr: "Berline éco"
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
