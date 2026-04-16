import { useEffect, useRef, useState } from "react";
import "./App.css";
import { appConfig } from "./config";
import {
  getInitialLanguage,
  getLocalizedConfigValue,
  getText,
  storeLanguagePreference,
  SUPPORTED_LANGUAGES
} from "./i18n";

const DEFAULT_VEHICLE = Object.keys(appConfig.vehicles || {})[0] || "eco";
const SCRIPT_CACHE = new Map();
const INITIAL_FORM_DATA = {
  pickup: "",
  destination: "",
  vehicleType: DEFAULT_VEHICLE,
  roundTrip: false,
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  customerName: "",
  customerPhone: "",
  passengers: "1",
  notes: ""
};

function loadScript(source) {
  if (SCRIPT_CACHE.has(source)) {
    return SCRIPT_CACHE.get(source);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${source}"]`);

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = source;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  SCRIPT_CACHE.set(source, promise);
  return promise;
}

function getVehicleConfig(vehicleType) {
  return appConfig.vehicles[vehicleType] || Object.values(appConfig.vehicles)[0];
}

function validateTrip(formData) {
  if (!formData.pickup) {
    return "status.pickupRequired";
  }

  if (!formData.destination) {
    return "status.destinationRequired";
  }

  return "";
}

function validateBooking(formData) {
  const tripValidationError = validateTrip(formData);

  if (tripValidationError) {
    return tripValidationError;
  }

  if (formData.roundTrip && !formData.returnDate) {
    return "status.returnDateRequired";
  }

  if (formData.roundTrip && !formData.returnTime) {
    return "status.returnTimeRequired";
  }

  if (!formData.customerName) {
    return "status.nameRequired";
  }

  if (!formData.customerPhone) {
    return "status.phoneRequired";
  }

  return "";
}

function getDepartureTime(formData) {
  const now = new Date();

  if (formData.pickupDate && formData.pickupTime) {
    const departureTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);

    if (!Number.isNaN(departureTime.getTime()) && departureTime > now) {
      return departureTime;
    }
  }

  return now;
}

function calculateEstimate(distanceKm, durationMinutes) {
  const shortTripConfig = appConfig.pricing.shortTrip;
  const longTripConfig = appConfig.pricing.longTrip;
  const durationFloorConfig = appConfig.pricing.durationFloor;
  const distancePrice =
    distanceKm >= shortTripConfig.longTripThresholdKm
      ? Math.max(longTripConfig.minimumFare, distanceKm * longTripConfig.perKilometer)
      : Math.max(shortTripConfig.minimumFare, distanceKm * shortTripConfig.perKilometer);
  const durationPrice = (durationMinutes / 60) * durationFloorConfig.minimumPerHour;

  return {
    price: Math.max(distancePrice, durationPrice)
  };
}

function getLocalizedNumberFormatter(language, options = {}) {
  return new Intl.NumberFormat(
    getLocalizedConfigValue(appConfig.pricing.locale, language),
    options
  );
}

function formatFare(amount, language) {
  return getLocalizedNumberFormatter(language, {
    style: "currency",
    currency: appConfig.pricing.currency,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDistance(distanceKm, language) {
  const numberFormatter = getLocalizedNumberFormatter(language, {
    maximumFractionDigits: distanceKm < 10 ? 1 : 0
  });

  return `${numberFormatter.format(distanceKm)} ${getText(language, "units.kilometerShort")}`;
}

function formatDuration(durationMinutes, language) {
  const roundedMinutes = Math.round(durationMinutes);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;
  const hourLabel = getText(language, "units.hourShort");
  const minuteLabel = getText(language, "units.minuteShort");

  if (hours && minutes) {
    return `${hours}${hourLabel} ${minutes} ${minuteLabel}`;
  }

  if (hours) {
    return `${hours}${hourLabel}`;
  }

  return `${minutes} ${minuteLabel}`;
}

function formatSeatCount(capacity, language) {
  const seatLabel =
    capacity === 1 ? getText(language, "units.seatOne") : getText(language, "units.seatMany");

  return `${capacity} ${seatLabel}`;
}

function getTripTypeLabel(language, roundTrip) {
  return getText(language, roundTrip ? "summary.roundTrip" : "summary.oneWay");
}

function getRouteTotals(route, roundTrip) {
  if (!route) {
    return null;
  }

  const multiplier = roundTrip ? 2 : 1;

  return {
    distanceKm: route.distanceKm * multiplier,
    durationMinutes: route.durationMinutes * multiplier,
    fare: route.fareOneWay * multiplier
  };
}

function buildMailtoLink({ formData, route, language }) {
  const mail = getText(language, "mail");
  const businessName = getLocalizedConfigValue(appConfig.businessName, language);
  const vehicle = getVehicleConfig(formData.vehicleType);
  const totals = getRouteTotals(route, formData.roundTrip);
  const tripTypeSummary = getTripTypeLabel(language, formData.roundTrip);
  const vehicleSummary = getLocalizedConfigValue(vehicle.label, language);
  const dateSummary = formData.pickupDate || mail.toBeConfirmed;
  const timeSummary = formData.pickupTime || mail.toBeConfirmed;
  const returnDateSummary = formData.roundTrip
    ? formData.returnDate || mail.toBeConfirmed
    : mail.notApplicable;
  const returnTimeSummary = formData.roundTrip
    ? formData.returnTime || mail.toBeConfirmed
    : mail.notApplicable;
  const distanceSummary = totals
    ? formatDistance(totals.distanceKm, language)
    : mail.toBeConfirmed;
  const durationSummary = totals
    ? formatDuration(totals.durationMinutes, language)
    : mail.toBeConfirmed;
  const fareSummary = totals ? formatFare(totals.fare, language) : mail.toBeConfirmed;

  const subject = encodeURIComponent(
    `${mail.subjectPrefix} | ${formData.customerName || mail.newClient} | ${dateSummary}`
  );
  const body = encodeURIComponent(
    [
      `${mail.greeting} ${businessName},`,
      "",
      mail.requestLine,
      "",
      `${mail.name}: ${formData.customerName || mail.notProvided}`,
      `${mail.phone}: ${formData.customerPhone || mail.notProvided}`,
      `${mail.vehicle}: ${vehicleSummary}`,
      `${mail.tripType}: ${tripTypeSummary}`,
      `${mail.pickup}: ${formData.pickup || mail.notProvided}`,
      `${mail.destination}: ${formData.destination || mail.notProvided}`,
      `${mail.preferredDate}: ${dateSummary}`,
      `${mail.preferredTime}: ${timeSummary}`,
      `${mail.returnDate}: ${returnDateSummary}`,
      `${mail.returnTime}: ${returnTimeSummary}`,
      `${mail.passengers}: ${formData.passengers || "1"}`,
      `${mail.distance}: ${distanceSummary}`,
      `${mail.travelTime}: ${durationSummary}`,
      `${mail.estimatedFare}: ${fareSummary}`,
      `${mail.extraDetails}: ${formData.notes || mail.none}`,
      "",
      mail.confirm
    ].join("\n")
  );

  return `mailto:${appConfig.email}?subject=${subject}&body=${body}`;
}

function buildWhatsAppLink({ formData, route, language }) {
  const mail = getText(language, "mail");
  const whatsApp = getText(language, "whatsApp");
  const businessName = getLocalizedConfigValue(appConfig.businessName, language);
  const vehicle = getVehicleConfig(formData.vehicleType);
  const totals = getRouteTotals(route, formData.roundTrip);
  const tripTypeSummary = getTripTypeLabel(language, formData.roundTrip);
  const vehicleSummary = getLocalizedConfigValue(vehicle.label, language);
  const dateSummary = formData.pickupDate || mail.toBeConfirmed;
  const timeSummary = formData.pickupTime || mail.toBeConfirmed;
  const returnDateSummary = formData.roundTrip
    ? formData.returnDate || mail.toBeConfirmed
    : mail.notApplicable;
  const returnTimeSummary = formData.roundTrip
    ? formData.returnTime || mail.toBeConfirmed
    : mail.notApplicable;
  const distanceSummary = totals
    ? formatDistance(totals.distanceKm, language)
    : mail.toBeConfirmed;
  const durationSummary = totals
    ? formatDuration(totals.durationMinutes, language)
    : mail.toBeConfirmed;
  const fareSummary = totals ? formatFare(totals.fare, language) : mail.toBeConfirmed;
  const phone = appConfig.phoneLink.replace(/\D/g, "");
  const message = encodeURIComponent(
    [
      `${whatsApp.greeting} ${businessName},`,
      "",
      whatsApp.requestLine,
      "",
      `${mail.name}: ${formData.customerName || mail.notProvided}`,
      `${mail.phone}: ${formData.customerPhone || mail.notProvided}`,
      `${mail.vehicle}: ${vehicleSummary}`,
      `${mail.tripType}: ${tripTypeSummary}`,
      `${mail.pickup}: ${formData.pickup || mail.notProvided}`,
      `${mail.destination}: ${formData.destination || mail.notProvided}`,
      `${mail.preferredDate}: ${dateSummary}`,
      `${mail.preferredTime}: ${timeSummary}`,
      `${mail.returnDate}: ${returnDateSummary}`,
      `${mail.returnTime}: ${returnTimeSummary}`,
      `${mail.passengers}: ${formData.passengers || "1"}`,
      `${mail.distance}: ${distanceSummary}`,
      `${mail.travelTime}: ${durationSummary}`,
      `${mail.estimatedFare}: ${fareSummary}`,
      `${mail.extraDetails}: ${formData.notes || mail.none}`,
      "",
      whatsApp.confirm
    ].join("\n")
  );

  return `https://wa.me/${phone}?text=${message}`;
}

function getMapStyles() {
  return [
    { elementType: "geometry", stylers: [{ color: "#151516" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#151516" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8e867b" }] },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#373536" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#93897b" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#242426" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#655030" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#8d693d" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0b1016" }]
    }
  ];
}

function clearPacContainers() {
  document.querySelectorAll(".pac-container").forEach((container) => {
    container.classList.remove("pac-container-active");
  });
}

function syncPacContainer(inputElement) {
  window.setTimeout(() => {
    const inputRect = inputElement.getBoundingClientRect();

    if (window.innerWidth <= 780) {
      document.querySelectorAll(".pac-container").forEach((container) => {
        container.classList.add("pac-container-active");
        container.style.left = "10px";
        container.style.top = `${Math.min(
          inputRect.bottom + 8,
          window.innerHeight - 220
        )}px`;
        container.style.width = `${Math.max(window.innerWidth - 20, 0)}px`;
      });
      return;
    }

    const inputLeft = inputRect.left + window.scrollX;
    const inputBottom = inputRect.bottom + window.scrollY;
    const containers = Array.from(document.querySelectorAll(".pac-container"));

    if (!containers.length) {
      return;
    }

    let bestContainer = null;
    let bestScore = Number.POSITIVE_INFINITY;

    containers.forEach((container) => {
      const containerLeft = Number.parseFloat(container.style.left || "0");
      const containerTop = Number.parseFloat(container.style.top || "0");
      const score = Math.abs(containerLeft - inputLeft) + Math.abs(containerTop - inputBottom);

      if (score < bestScore) {
        bestScore = score;
        bestContainer = container;
      }
    });

    clearPacContainers();

    if (bestContainer) {
      bestContainer.classList.add("pac-container-active");
    }
  }, 0);
}

function App() {
  const [language, setLanguage] = useState(() => getInitialLanguage());
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [route, setRoute] = useState(null);
  const [statusKey, setStatusKey] = useState("summary.defaultStatus");
  const [statusTone, setStatusTone] = useState("");
  const [mapState, setMapState] = useState(
    appConfig.googleMapsApiKey ? "loading" : "missingKey"
  );
  const [mapReady, setMapReady] = useState(false);

  const mapLanguageRef = useRef(language);
  const mapRef = useRef(null);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const translate = (key) => getText(language, key);
  const businessName = getLocalizedConfigValue(appConfig.businessName, language);
  const brandMark = businessName.trim().charAt(0).toUpperCase() || "P";
  const selectedVehicle = getVehicleConfig(formData.vehicleType);
  const routeTotals = getRouteTotals(route, formData.roundTrip);
  const routeReady = Boolean(routeTotals);
  const vehicleOptions = Object.entries(appConfig.vehicles).map(([key, vehicle]) => ({
    key,
    label: getLocalizedConfigValue(vehicle.label, language),
    capacity: vehicle.capacity
  }));
  const passengerOptions = Array.from({ length: selectedVehicle.capacity }, (_, index) =>
    String(index + 1)
  );
  const mailtoLink = buildMailtoLink({ formData, route, language });
  const whatsAppLink = buildWhatsAppLink({ formData, route, language });
  const mapBadgeKey = {
    missingKey: "map.badgeAddKey",
    loading: "map.badgeWaiting",
    ready: "map.badgeReady",
    error: "map.badgeUnavailable"
  }[mapState];
  const mapPlaceholderKey = {
    missingKey: "map.placeholderMissingKey",
    loading: "map.placeholderLoading",
    ready: "",
    error: "map.placeholderError"
  }[mapState];
  const mapPlaceholderMessage = mapPlaceholderKey ? translate(mapPlaceholderKey) : "";
  const clientSummary =
    formData.customerName || formData.customerPhone
      ? `${formData.customerName || translate("summary.unnamedClient")} | ${
          formData.customerPhone || translate("summary.phoneMissing")
        }`
      : translate("summary.clientPending");
  const fareDisplay = routeReady
    ? formatFare(routeTotals.fare, language)
    : translate("summary.farePending");
  const fareContext = routeReady
    ? `${getTripTypeLabel(language, formData.roundTrip)} | ${getLocalizedConfigValue(
        selectedVehicle.label,
        language
      )}`
    : translate("summary.fareHint");

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = getText(language, "meta.title");
    mapLanguageRef.current = language;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", getText(language, "meta.description"));
    }
  }, [language]);

  useEffect(() => {
    if (!appConfig.googleMapsApiKey) {
      return undefined;
    }

    let cancelled = false;
    const previousAuthFailure = window.gm_authFailure;
    const googleMapsUrl =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(appConfig.googleMapsApiKey)}` +
      `&libraries=places&language=${encodeURIComponent(mapLanguageRef.current)}`;

    const handleMapFailure = (nextStatusKey) => {
      if (cancelled) {
        return;
      }

      setMapReady(false);
      setMapState("error");
      setStatusKey(nextStatusKey);
      setStatusTone("error");
    };

    window.gm_authFailure = () => {
      handleMapFailure("status.mapsAuthError");

      if (typeof previousAuthFailure === "function") {
        previousAuthFailure();
      }
    };

    loadScript(googleMapsUrl)
      .then(() => {
        if (
          cancelled ||
          !mapRef.current ||
          !pickupInputRef.current ||
          !destinationInputRef.current
        ) {
          return;
        }

        if (!window.google?.maps) {
          handleMapFailure("status.mapsLoadError");
          return;
        }

        const googleMaps = window.google.maps;

        if (!googleMaps.places?.Autocomplete) {
          handleMapFailure("status.mapsPlacesError");
          return;
        }

        try {
          const mapInstance = new googleMaps.Map(mapRef.current, {
            center: appConfig.mapDefaultCenter,
            zoom: appConfig.mapDefaultZoom,
            disableDefaultUI: true,
            styles: getMapStyles()
          });

          directionsServiceRef.current = new googleMaps.DirectionsService();
          directionsRendererRef.current = new googleMaps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#d8af73",
              strokeOpacity: 0.9,
              strokeWeight: 6
            }
          });

          const attachAutocomplete = (inputElement, fieldName) => {
            const biasCircle = new googleMaps.Circle({
              center: appConfig.mapDefaultCenter,
              radius: appConfig.autocomplete?.biasRadiusMeters || 0
            });
            const autocomplete = new googleMaps.places.Autocomplete(inputElement, {
              fields: ["formatted_address", "geometry", "name"],
              types: ["geocode"],
              componentRestrictions: appConfig.autocomplete?.country
                ? { country: appConfig.autocomplete.country }
                : undefined
            });

            if (appConfig.autocomplete?.biasRadiusMeters) {
              autocomplete.setBounds(biasCircle.getBounds());
              autocomplete.setOptions({ strictBounds: false });
            }

            const handleAutocompleteFocus = () => {
              syncPacContainer(inputElement);
            };

            inputElement.addEventListener("focus", handleAutocompleteFocus);
            inputElement.addEventListener("input", handleAutocompleteFocus);

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();

              if (!place || !place.formatted_address) {
                return;
              }

              setFormData((currentFormData) => ({
                ...currentFormData,
                [fieldName]: place.formatted_address
              }));

              if (directionsRendererRef.current) {
                directionsRendererRef.current.set("directions", null);
              }

              setRoute(null);
              clearPacContainers();
              inputElement.blur();
            });
          };

          attachAutocomplete(pickupInputRef.current, "pickup");
          attachAutocomplete(destinationInputRef.current, "destination");
          setMapReady(true);
          setMapState("ready");
        } catch {
          handleMapFailure("status.mapsLoadError");
        }
      })
      .catch(() => {
        handleMapFailure("status.mapsLoadError");
      });

    return () => {
      cancelled = true;
      window.gm_authFailure = previousAuthFailure;
    };
  }, []);

  function handleLanguageSelect(nextLanguage) {
    setLanguage(nextLanguage);
    storeLanguagePreference(nextLanguage);
  }

  function clearRoute() {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.set("directions", null);
    }

    setRoute(null);
  }

  function handleInputChange(event) {
    const { name, type, value, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((currentFormData) => {
      const nextFormData = {
        ...currentFormData,
        [name]: nextValue
      };

      if (name === "roundTrip" && !checked) {
        nextFormData.returnDate = "";
        nextFormData.returnTime = "";
      }

      return nextFormData;
    });

    if (name === "pickup" || name === "destination") {
      clearRoute();
    }
  }

  function handleVehicleSelect(vehicleType) {
    const nextVehicle = getVehicleConfig(vehicleType);

    setFormData((currentFormData) => ({
      ...currentFormData,
      vehicleType,
      passengers: String(
        Math.min(Math.max(Number(currentFormData.passengers) || 1, 1), nextVehicle.capacity)
      )
    }));
  }

  async function requestRoute(origin, destination) {
    const response = await directionsServiceRef.current.route({
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: getDepartureTime(formData),
        trafficModel: window.google.maps.TrafficModel.BEST_GUESS
      }
    });

    directionsRendererRef.current.setDirections(response);

    const leg = response.routes[0].legs[0];
    const distanceKm = leg.distance.value / 1000;
    const durationMinutes = (leg.duration_in_traffic?.value ?? leg.duration.value) / 60;
    const estimate = calculateEstimate(distanceKm, durationMinutes);
    const nextRoute = {
      distanceKm,
      durationMinutes,
      fareOneWay: estimate.price
    };

    setRoute(nextRoute);
    return nextRoute;
  }

  async function handleCalculateRoute() {
    const validationErrorKey = validateTrip(formData);

    if (validationErrorKey) {
      setStatusKey(validationErrorKey);
      setStatusTone("error");
      return;
    }

    if (!appConfig.googleMapsApiKey) {
      setStatusKey("status.mapsNotConfigured");
      setStatusTone("warning");
      return;
    }

    if (!mapReady) {
      setStatusKey("status.mapsLoading");
      setStatusTone("warning");
      return;
    }

    try {
      setStatusKey("status.calculatingRoute");
      setStatusTone("");
      await requestRoute(formData.pickup, formData.destination);
      setStatusKey(formData.roundTrip ? "status.routeReadyRoundTrip" : "status.routeReady");
      setStatusTone("success");
    } catch {
      setStatusKey("status.routeError");
      setStatusTone("error");
    }
  }

  async function handlePrepareEmail(event) {
    event.preventDefault();

    const validationErrorKey = validateBooking(formData);

    if (validationErrorKey) {
      setStatusKey(validationErrorKey);
      setStatusTone("error");
      return;
    }

    let routeForEmail = route;

    if (mapReady && !routeForEmail && formData.pickup && formData.destination) {
      try {
        routeForEmail = await requestRoute(formData.pickup, formData.destination);
      } catch {
        setStatusKey("status.emailWithoutRoute");
        setStatusTone("warning");
      }
    }

    window.location.href = buildMailtoLink({
      formData,
      route: routeForEmail,
      language
    });

    setStatusKey("status.emailPrepared");
    setStatusTone("success");
  }

  return (
    <div className="page-shell">
      <div className="atmosphere atmosphere-left" aria-hidden="true"></div>
      <div className="atmosphere atmosphere-right" aria-hidden="true"></div>

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">{brandMark}</span>
          <span id="brand-name">{businessName}</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          <a href="#planner">{translate("nav.reserve")}</a>
        </nav>

        <div className="topbar-actions">
          <div className="language-switch" aria-label={translate("nav.languageLabel")}>
            {SUPPORTED_LANGUAGES.map((option) => (
              <button
                key={option}
                className={`language-option${language === option ? " is-active" : ""}`}
                type="button"
                onClick={() => handleLanguageSelect(option)}
                aria-pressed={language === option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section className="planner" id="planner">
          <div className="planner-layout">
            <div className="planner-main">
              <section className="hero-card" id="home">
                <div className="section-heading section-heading-compact">
                  <p className="eyebrow">{translate("planner.eyebrow")}</p>
                  <h2>{translate("planner.title")}</h2>
                  <p>{translate("planner.body")}</p>
                </div>

                <div className="hero-card-footer">
                  <div className="intro-flow" aria-label={translate("planner.introLabel")}>
                    {translate("planner.steps").map((step) => (
                      <span key={step} className="step-pill">
                        {step}
                      </span>
                    ))}
                  </div>

                  <div className="form-intro-contact">
                    <a className="contact-shortcut-card" href={whatsAppLink} target="_blank" rel="noreferrer">
                      <span className="contact-shortcut-label">{translate("nav.whatsApp")}</span>
                      <strong>{appConfig.phoneDisplay}</strong>
                    </a>

                    <a className="contact-shortcut-card" href={`mailto:${appConfig.email}`}>
                      <span className="contact-shortcut-label">{translate("footer.email")}</span>
                      <strong>{appConfig.email}</strong>
                    </a>
                  </div>
                </div>
              </section>

              <form className="booking-form" onSubmit={handlePrepareEmail}>
                <section className="form-section form-section-trip" aria-labelledby="trip-details-heading">
                  <div className="form-section-head">
                    <h3 id="trip-details-heading">{translate("planner.tripTitle")}</h3>
                    <p>{translate("planner.tripBody")}</p>
                  </div>

                  <div className="field field-full">
                    <span>{translate("planner.labels.vehicle")}</span>
                    <div className="vehicle-grid" role="radiogroup" aria-label={translate("planner.labels.vehicle")}>
                      {vehicleOptions.map((vehicle) => (
                        <button
                          key={vehicle.key}
                          className={`vehicle-card${formData.vehicleType === vehicle.key ? " is-active" : ""}`}
                          type="button"
                          onClick={() => handleVehicleSelect(vehicle.key)}
                          aria-pressed={formData.vehicleType === vehicle.key}
                        >
                          <strong>{vehicle.label}</strong>
                          <span>{formatSeatCount(vehicle.capacity, language)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="trip-toggle">
                    <input
                      id="round-trip"
                      name="roundTrip"
                      type="checkbox"
                      checked={formData.roundTrip}
                      onChange={handleInputChange}
                    />
                    <span>{translate("planner.labels.roundTrip")}</span>
                  </label>

                  <div className="form-grid form-grid-trip">
                    <label className="field field-route">
                      <span>{translate("planner.labels.pickup")}</span>
                      <input
                        ref={pickupInputRef}
                        id="pickup"
                        name="pickup"
                        type="text"
                        value={formData.pickup}
                        onChange={handleInputChange}
                        placeholder={translate("planner.placeholders.pickup")}
                        autoComplete="street-address"
                        enterKeyHint="next"
                        required
                      />
                    </label>

                    <label className="field field-route">
                      <span>{translate("planner.labels.destination")}</span>
                      <input
                        ref={destinationInputRef}
                        id="destination"
                        name="destination"
                        type="text"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder={translate("planner.placeholders.destination")}
                        autoComplete="street-address"
                        enterKeyHint="next"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>{translate("planner.labels.date")}</span>
                      <div className="input-shell input-shell-picker input-shell-date">
                        <input
                          id="pickup-date"
                          name="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </label>

                    <label className="field">
                      <span>{translate("planner.labels.time")}</span>
                      <div className="input-shell input-shell-picker input-shell-time">
                        <input
                          id="pickup-time"
                          name="pickupTime"
                          type="time"
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </label>

                    {formData.roundTrip && (
                      <>
                        <label className="field">
                          <span>{translate("planner.labels.returnDate")}</span>
                          <div className="input-shell input-shell-picker input-shell-date">
                            <input
                              id="return-date"
                              name="returnDate"
                              type="date"
                              value={formData.returnDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </label>

                        <label className="field">
                          <span>{translate("planner.labels.returnTime")}</span>
                          <div className="input-shell input-shell-picker input-shell-time">
                            <input
                              id="return-time"
                              name="returnTime"
                              type="time"
                              value={formData.returnTime}
                              onChange={handleInputChange}
                            />
                          </div>
                        </label>

                        <p className="field-hint field-full">{translate("planner.roundTripHint")}</p>
                      </>
                    )}
                  </div>
                </section>

                <section className="form-section form-section-contact" aria-labelledby="contact-details-heading">
                  <div className="form-section-head">
                    <h3 id="contact-details-heading">{translate("planner.contactTitle")}</h3>
                    <p>{translate("planner.contactBody")}</p>
                  </div>

                  <div className="form-grid form-grid-contact">
                    <label className="field">
                      <span>{translate("planner.labels.name")}</span>
                      <input
                        id="customer-name"
                        name="customerName"
                        type="text"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder={translate("planner.placeholders.name")}
                        autoComplete="name"
                        autoCapitalize="words"
                        enterKeyHint="next"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>{translate("planner.labels.phone")}</span>
                      <input
                        id="customer-phone"
                        name="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        placeholder={translate("planner.placeholders.phone")}
                        autoComplete="tel"
                        inputMode="tel"
                        enterKeyHint="next"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>{translate("planner.labels.passengers")}</span>
                      <select id="passengers" name="passengers" value={formData.passengers} onChange={handleInputChange}>
                        {passengerOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field field-full">
                      <span>{translate("planner.labels.notes")}</span>
                      <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder={translate("planner.placeholders.notes")}
                        enterKeyHint="done"
                      ></textarea>
                    </label>
                  </div>
                </section>

                <div className="form-actions">
                  <button className="button button-primary" type="button" onClick={handleCalculateRoute}>
                    {translate("planner.calculateTrip")}
                  </button>
                  <button className="button button-outline" type="submit">
                    {translate("planner.prepareEmail")}
                  </button>
                </div>
                <p className="form-intro-note">{translate("planner.footnote")}</p>
              </form>
            </div>

            <div className="planner-sidebar">
              <div className="map-card">
                <div className="card-head">
                  <p className="panel-label">{translate("map.label")}</p>
                  <span className="map-badge">{translate(mapBadgeKey)}</span>
                </div>
                <div className="map-canvas">
                  <div ref={mapRef} className="map-surface" aria-hidden={mapState !== "ready"}></div>
                  {mapState !== "ready" && <div className="map-placeholder">{mapPlaceholderMessage}</div>}
                </div>
              </div>

              <div className="summary-card" id="summary-card">
                <div className="card-head">
                  <p className="panel-label">{translate("summary.label")}</p>
                  <span className="summary-tag">{translate("summary.tag")}</span>
                </div>

                <div className={`summary-hero${routeReady ? " is-ready" : ""}`}>
                  <span className="summary-hero-label">{translate("summary.readyLabel")}</span>
                  <strong className={`summary-amount${routeReady ? "" : " is-placeholder"}`}>
                    {fareDisplay}
                  </strong>
                  <p className="summary-subcopy">{fareContext}</p>
                </div>

                <dl className="summary-grid">
                  <div>
                    <dt>{translate("summary.distance")}</dt>
                    <dd>
                      {routeReady
                        ? formatDistance(routeTotals.distanceKm, language)
                        : translate("summary.notCalculated")}
                    </dd>
                  </div>
                  <div>
                    <dt>{translate("summary.duration")}</dt>
                    <dd>
                      {routeReady
                        ? formatDuration(routeTotals.durationMinutes, language)
                        : translate("summary.notCalculated")}
                    </dd>
                  </div>
                  <div>
                    <dt>{translate("summary.vehicle")}</dt>
                    <dd>{getLocalizedConfigValue(selectedVehicle.label, language)}</dd>
                  </div>
                  <div>
                    <dt>{translate("summary.tripType")}</dt>
                    <dd>{getTripTypeLabel(language, formData.roundTrip)}</dd>
                  </div>
                  <div className="summary-wide">
                    <dt>{translate("summary.client")}</dt>
                    <dd>{clientSummary}</dd>
                  </div>
                </dl>

                <div className="summary-actions">
                  <a className="button button-primary" href={mailtoLink}>
                    {translate("summary.emailTrip")}
                  </a>
                  <a className="button button-secondary" href={whatsAppLink} target="_blank" rel="noreferrer">
                    {translate("summary.whatsAppTrip")}
                  </a>
                </div>

                <p className={`status-message${statusTone ? ` ${statusTone}` : ""}`} aria-live="polite">
                  {translate(statusKey)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
