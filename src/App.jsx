import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import { appConfig } from "./config";
import { bookingPayload, bookingRpc, focusBookingError, formatParisTime, getParisInstant, validatePassenger, validateWebTrip } from "./booking";
import BookingDetails from "./BookingDetails";
import { DateField, TimeField } from "./DateTimeFields";
import PassengerCountField from "./PassengerCountField";
import { formatFareCents, getRouteTotals, routeEstimate } from "./fare";
import { useParisDay } from "./useParisDay";
import {
  getInitialLanguage,
  getLocalizedConfigValue,
  getText,
  storeLanguagePreference,
  SUPPORTED_LANGUAGES
} from "./i18n";

const SCRIPT_CACHE = new Map();
const DriverWorkspace = lazy(() => import("./DriverWorkspace"));
const INITIAL_FORM_DATA = {
  pickup: "",
  destination: "",
  roundTrip: false,
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
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

function ensureMetaTag(attributeName, attributeValue) {
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  return element;
}

function ensureLinkTag(rel) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  return element;
}

function updateStructuredData(language) {
  const businessName = getLocalizedConfigValue(appConfig.businessName, language);
  const serviceArea = getLocalizedConfigValue(appConfig.serviceArea, language);
  const description = getText(language, "meta.description");
  const siteUrl =
    appConfig.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: businessName,
    description,
    areaServed: serviceArea,
    serviceType: "Private taxi and chauffeur service",
    telephone: appConfig.phoneDisplay,
    email: appConfig.email,
    url: siteUrl || undefined,
    availableLanguage: SUPPORTED_LANGUAGES.map((option) => option.toUpperCase()),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR"
    }
  };
  let script = document.head.querySelector('script[data-seo="taxi-service"]');

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "taxi-service";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
}

function fareRow(ride, t, language) {
  if (ride.agreed_fare_cents != null) return [[t("booking.agreedFare"), formatFareCents(ride.agreed_fare_cents, language)]];
  if (ride.estimated_fare_cents != null && ride.status === "pending") {
    return [[t("summary.fare"), formatFareCents(ride.estimated_fare_cents, language)]];
  }
  return [];
}

function tripRows(ride, t, language) {
  return [
    [t("planner.labels.pickup"), ride.pickup],
    [t("planner.labels.destination"), ride.destination],
    [t("booking.pickupAt"), formatParisTime(ride.pickup_at, language)],
    ...(ride.return_at ? [[t("booking.returnAt"), formatParisTime(ride.return_at, language)]] : []),
    [t("planner.labels.passengers"), ride.passengers],
    ...fareRow(ride, t, language)
  ];
}

const phoneHref = "tel:" + appConfig.phoneLink;
const whatsAppHref = "https://wa.me/" + appConfig.phoneLink.replace(/\D/g, "");

function ContactFooter({ language, workspaceLink = false }) {
  const t = (key) => getText(language, key);
  return (
    <footer className="site-footer actions" id="ride-contact">
      <span>{t("booking.contact")}</span>
      <a href={phoneHref}>{t("booking.call")}</a>
      <a href={whatsAppHref} target="_blank" rel="noreferrer">{t("nav.whatsApp")}</a>
      <a href={"mailto:" + appConfig.email}>{t("footer.email")}</a>
      {workspaceLink && <a className="workspace-link" href="?driver">{t("driver.title")}</a>}
    </footer>
  );
}

function BookingResult({ ride, language, children }) {
  const t = (key) => getText(language, key);
  return (
    <div className="booking-grid booking-result">
      <section className="panel stack" aria-label={t("booking.view")}>
        <p className="booking-status" role="status">{t("booking.state." + ride.status)}</p>
        <p className="booking-reference">{t("booking.reference")} <strong>#{ride.reference}</strong></p>
        {ride.status === "pending" && <p>{t("booking.confirmationNote")}</p>}
        {children}
      </section>
      <section className="panel stack" aria-labelledby="result-trip-heading">
        <h2 id="result-trip-heading">{t("planner.tripTitle")}</h2>
        <BookingDetails rows={tripRows(ride, t, language)} />
      </section>
    </div>
  );
}

function RiderBooking({ language, layout }) {
  const today = useParisDay();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [route, setRoute] = useState(null);
  const [screen, setScreen] = useState("entry");
  const [receipt, setReceipt] = useState(null);
  const [saveState, setSaveState] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const codeInput = useRef(null);
  const [copyState, setCopyState] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const saving = useRef(false);
  const attempt = useRef(null);
  const estimateSequence = useRef(0);
  const headingRef = useRef(null);
  const previousScreen = useRef(screen);
  const mapLanguageRef = useRef(language);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapLayoutRef = useRef(layout);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const selectedPlaces = useRef({});
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const capacity = Math.max(...Object.values(appConfig.vehicles).map((vehicle) => vehicle.capacity));

  useEffect(() => {
    if (screen !== previousScreen.current) headingRef.current?.focus();
    previousScreen.current = screen;
  }, [screen]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = getText(language, "meta.title");
    mapLanguageRef.current = language;
    const pageTitle = getText(language, "meta.title");
    const pageDescription = getText(language, "meta.description");
    const siteUrl =
      appConfig.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
    const canonicalUrl =
      typeof window !== "undefined" ? `${siteUrl}${window.location.pathname}` : siteUrl;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", pageDescription);
    }

    ensureMetaTag("property", "og:title").setAttribute("content", pageTitle);
    ensureMetaTag("property", "og:description").setAttribute("content", pageDescription);
    ensureMetaTag("property", "og:locale").setAttribute(
      "content",
      language === "fr" ? "fr_FR" : "en_GB"
    );
    ensureMetaTag("property", "og:url").setAttribute("content", canonicalUrl);
    ensureMetaTag("name", "twitter:title").setAttribute("content", pageTitle);
    ensureMetaTag("name", "twitter:description").setAttribute("content", pageDescription);
    ensureLinkTag("canonical").setAttribute("href", canonicalUrl);
    updateStructuredData(language);
  }, [language]);

  useEffect(() => {
    if (!appConfig.googleMapsApiKey) {
      return undefined;
    }

    let cancelled = false;
    let authFailed = false;
    let addressGuard = null;
    const autocompleteListeners = [];
    const previousAuthFailure = window.gm_authFailure;
    const googleMapsUrl =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(appConfig.googleMapsApiKey)}` +
      `&libraries=places&language=${encodeURIComponent(mapLanguageRef.current)}`;

    // Google disables inputs that use Autocomplete when it rejects the key. Undo that so riders can type addresses.
    function keepAddressesEditable() {
      if (addressGuard) return;
      const inputs = [pickupInputRef.current, destinationInputRef.current].filter(Boolean);
      const restore = (input) => {
        if (input.disabled) input.disabled = false;
        if (input.classList.contains("gm-err-autocomplete")) input.classList.remove("gm-err-autocomplete");
        if (input.style.backgroundImage) input.style.backgroundImage = "";
        if (input.dataset.placeholder && input.placeholder !== input.dataset.placeholder) {
          input.placeholder = input.dataset.placeholder;
        }
      };
      for (const input of inputs) {
        window.google?.maps?.event?.clearInstanceListeners?.(input);
        restore(input);
      }
      addressGuard = new MutationObserver((records) => records.forEach((record) => restore(record.target)));
      for (const input of inputs) {
        addressGuard.observe(input, { attributes: true, attributeFilter: ["disabled", "class", "placeholder", "style"] });
      }
    }

    const handleMapFailure = () => {
      if (cancelled) {
        return;
      }

      keepAddressesEditable();
      setMapFailed(true);
      setMapReady(false);
      estimateSequence.current++;
      setEstimating(false);
      setRoute(null);
    };

    window.gm_authFailure = () => {
      authFailed = true;
      handleMapFailure();

      if (typeof previousAuthFailure === "function") {
        previousAuthFailure();
      }
    };

    loadScript(googleMapsUrl)
      .then(() => {
        if (
          cancelled || authFailed ||
          !mapRef.current ||
          !pickupInputRef.current ||
          !destinationInputRef.current
        ) {
          return;
        }

        if (!window.google?.maps) {
          handleMapFailure();
          return;
        }

        const googleMaps = window.google.maps;

        try {
          const mapInstance = new googleMaps.Map(mapRef.current, {
            center: appConfig.mapDefaultCenter,
            zoom: appConfig.mapDefaultZoom,
            disableDefaultUI: true,
            styles: mapLayoutRef.current === "dark" ? getMapStyles() : null
          });
          mapInstanceRef.current = mapInstance;

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

          setMapReady(true);
        } catch {
          handleMapFailure();
        }

        function attachAutocomplete(inputElement, fieldName) {
          try {
            if (!googleMaps.places?.Autocomplete) return;
            const biasCircle = new googleMaps.Circle({
              center: appConfig.mapDefaultCenter,
              radius: appConfig.autocomplete?.biasRadiusMeters || 0
            });
            const autocomplete = new googleMaps.places.Autocomplete(inputElement, {
              fields: ["formatted_address", "place_id"],
              types: ["geocode"],
              componentRestrictions: appConfig.autocomplete?.country
                ? { country: appConfig.autocomplete.country }
                : undefined
            });

            if (appConfig.autocomplete?.biasRadiusMeters) {
              autocomplete.setBounds(biasCircle.getBounds());
              autocomplete.setOptions({ strictBounds: false });
            }

            autocompleteListeners.push(autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();

              if (!place || !place.formatted_address) {
                return;
              }

              selectedPlaces.current[fieldName] = { address: place.formatted_address, id: place.place_id };
              setFormData((currentFormData) => ({
                ...currentFormData,
                [fieldName]: place.formatted_address
              }));

              clearEstimate();
              inputElement.blur();
            }));
          } catch {
            // Keep manual addresses and routing available if suggestions fail.
          }
        }
        attachAutocomplete(pickupInputRef.current, "pickup");
        attachAutocomplete(destinationInputRef.current, "destination");
      })
      .catch(() => {
        handleMapFailure();
      });

    return () => {
      cancelled = true;
      addressGuard?.disconnect();
      autocompleteListeners.forEach((listener) => listener.remove());
      window.gm_authFailure = previousAuthFailure;
    };
  }, []);

  useEffect(() => {
    mapLayoutRef.current = layout;
    mapInstanceRef.current?.setOptions({ styles: layout === "dark" ? getMapStyles() : null });
  }, [layout]);

  // The map is created while its panel is hidden, so fit the route once the panel shows it.
  const mapVisible = screen === "review" && mapReady && Boolean(route);
  useEffect(() => {
    if (!mapVisible) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const bounds = directionsRendererRef.current?.getDirections()?.routes?.[0]?.bounds;
      if (bounds) mapInstanceRef.current?.fitBounds(bounds);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [mapVisible, route]);

  function clearEstimate() {
    estimateSequence.current++;
    directionsRendererRef.current?.set("directions", null);
    setEstimating(false);
    setRoute(null);
  }

  function handleInputChange(event) {
    const { name, type, value, checked } = event.target;
    updateField(name, type === "checkbox" ? checked : value);
  }

  function updateField(name, value) {
    if (name === "customerEmail") {
      setCodeRequested(false);
      setEmailCode("");
      setSaveState("");
    }
    if (name === "pickup" || name === "destination") delete selectedPlaces.current[name];
    if (["pickup", "destination", "pickupDate", "pickupTime", "roundTrip", "returnDate", "returnTime"].includes(name)) {
      clearEstimate();
    }
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleReview(event) {
    event.preventDefault();
    const nextErrors = validateWebTrip(formData, capacity);
    const invalid = focusBookingError(event.currentTarget, nextErrors);
    setErrors(nextErrors);
    if (invalid) return;

    setScreen("review");
    clearEstimate();
    if (!mapReady) return;
    const sequence = ++estimateSequence.current;
    setEstimating(true);
    const endpoint = (name) => {
      const address = formData[name].trim();
      const place = selectedPlaces.current[name];
      return place?.address === address && place.id ? { placeId: place.id } : address;
    };
    let timeout;
    try {
      const response = await Promise.race([
        directionsServiceRef.current.route({
          origin: endpoint("pickup"),
          destination: endpoint("destination"),
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: getParisInstant(formData.pickupDate + "T" + formData.pickupTime),
            trafficModel: window.google.maps.TrafficModel.BEST_GUESS
          }
        }),
        new Promise((resolve) => { timeout = window.setTimeout(() => resolve(null), 6000); })
      ]);
      if (!response || sequence !== estimateSequence.current) return;
      const estimate = routeEstimate(response.routes?.[0]?.legs?.[0]);
      if (!estimate) return;
      directionsRendererRef.current.setDirections(response);
      setRoute(estimate);
    } catch {
      // A fare lookup can fail without preventing a booking.
    } finally {
      window.clearTimeout(timeout);
      if (sequence === estimateSequence.current) setEstimating(false);
    }
  }

  function editTrip() {
    if (attempt.current) return;
    clearEstimate();
    setSaveState("");
    setScreen("entry");
  }

  async function requestEmailCode() {
    if (saving.current) return;
    saving.current = true;
    setSaveState("sendingCode");
    try {
      await bookingRpc("request_booking_code", { p_email: formData.customerEmail.trim(), p_language: language });
      setCodeRequested(true);
      setSaveState("codeSent");
      window.requestAnimationFrame(() => codeInput.current?.focus());
    } catch (error) {
      setSaveState(error.code === "PT429" ? "codeLimit" : "codeFailed");
    } finally {
      saving.current = false;
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    if (saving.current || estimating) return;
    if (!attempt.current) {
      const nextErrors = validatePassenger(formData);
      setErrors(nextErrors);
      const invalid = [...event.currentTarget.elements].find((field) => nextErrors[field.name]);
      if (invalid) {
        window.requestAnimationFrame(() => invalid.focus());
        return;
      }
      if (!codeRequested) {
        await requestEmailCode();
        return;
      }
      if (!/^[a-f0-9]{32}$/i.test(emailCode.trim())) {
        setSaveState("invalidCode");
        codeInput.current?.focus();
        return;
      }
    }
    saving.current = true;
    setSaveState("saving");
    try {
      if (!attempt.current) {
        const payload = bookingPayload(formData, language);
        payload.email_code = emailCode.trim().toLowerCase();
        if (route && route.durationMinutes > 0 && route.durationMinutes <= 1440) {
          payload.estimated_minutes = Math.ceil(route.durationMinutes);
        }
        const shownFare = getRouteTotals(route, formData.roundTrip)?.fare;
        // Store the whole-euro fare the rider saw on the review screen.
        if (shownFare > 0 && shownFare <= 100000) payload.estimated_fare_cents = Math.round(shownFare) * 100;
        attempt.current = { key: crypto.randomUUID(), payload };
      }
      const { key, payload } = attempt.current;
      const result = await bookingRpc("save_ride", { p_request_key: key, p_trip: payload });
      if (!result?.reference) throw new Error("MISSING_BOOKING_RECEIPT");
      setReceipt({ ...result, key });
      attempt.current = null;
      setEmailCode("");
      setSaveState("");
      setScreen("receipt");
    } catch (error) {
      if (error.code === "PT403") {
        attempt.current = null;
        setSaveState("invalidCode");
        window.requestAnimationFrame(() => codeInput.current?.focus());
      } else if (error.code === "42501" && error.reason === "WEB_INTAKE_LIMIT") {
        attempt.current = null;
        setSaveState("intakeLimit");
      } else if (error.code === "PT422") {
        attempt.current = null;
        setSaveState("shortNotice");
      } else if (error.message === "BOOKING_NOT_CONFIGURED" || /^(22\d{3}|23502|23514)$/.test(error.code)) {
        attempt.current = null;
        setSaveState("rejected");
      } else {
        setSaveState(error.code === "42501" ? "paused" : "failed");
      }
    } finally {
      saving.current = false;
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(new URL(receiptLink, window.location.href).href);
      setCopyState("linkCopied");
    } catch {
      setCopyState("linkCopyFailed");
    }
  }

  function startNewBooking() {
    setCopyState("");
    setCodeRequested(false);
    setEmailCode("");
    setSaveState("");
    attempt.current = null;
    selectedPlaces.current = {};
    clearEstimate();
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setReceipt(null);
    setScreen("entry");
  }

  const t = (key) => getText(language, key);
  const retrySave = saveState === "failed" || saveState === "paused";
  const saveMessage = { failed: "saveFailed", paused: "savePaused", rejected: "saveRejected", shortNotice: "shortNotice",
    invalidCode: "invalidCode", codeLimit: "codeLimit", codeFailed: "codeFailed", intakeLimit: "intakeLimit" }[saveState];
  const busy = saveState === "saving" || saveState === "sendingCode";
  const totals = getRouteTotals(route, formData.roundTrip);
  const receiptLink = receipt ? "?booking#key=" + receipt.key : "";
  const details = screen === "review" ? [
    ["planner.labels.pickup", formData.pickup.trim()],
    ["planner.labels.destination", formData.destination.trim()],
    ["booking.pickupAt", formatParisTime(getParisInstant(formData.pickupDate + "T" + formData.pickupTime), language)],
    ...(formData.roundTrip ? [["booking.returnAt", formatParisTime(getParisInstant(formData.returnDate + "T" + formData.returnTime), language)]] : []),
    ["planner.labels.passengers", formData.passengers]
  ] : [];

  function field(name, label, options = {}) {
    const error = errors[name];
    const props = {
      id: name,
      name,
      value: formData[name],
      onChange: handleInputChange,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? name + "-error" : undefined,
      ...options
    };
    return (
      <div className="field">
        <label htmlFor={name}>{t("planner.labels." + label)}</label>
        {name === "notes" ? <textarea {...props} /> : <input {...props} />}
        {error && <span className="field-error" id={name + "-error"}>{t(error)}</span>}
      </div>
    );
  }

  function tripField(Field, name, label, options = {}) {
    return <Field name={name} label={t("planner.labels." + label)} language={language} value={formData[name]}
      onChange={(value) => updateField(name, value)} error={errors[name] && t(errors[name])} {...options} />;
  }

  return (
    <main className="site-main rider-main" id="main-content" tabIndex={-1}>
      <div hidden={screen !== "entry"}>
        <header className="booking-hero">
          <div className="hero-copy">
            <h1 ref={screen === "entry" ? headingRef : null} tabIndex={-1}>
              {t("planner.title")} <em>{t("planner.headlinePlace")}</em>
            </h1>
            <p className="intro">{t("planner.body")}</p>
            <button type="button" className="button hero-action" onClick={() => pickupInputRef.current?.focus()}>
              {t("planner.startBooking")} <span aria-hidden="true">↓</span>
            </button>
          </div>
          <img className="fleet-photo" src={import.meta.env.BASE_URL + "paris-fleet.jpg"}
            width="1200" height="800" alt={t("planner.fleetImage")} fetchPriority="high" />
        </header>
        <form className="reservation-form" onSubmit={handleReview} noValidate>
          <section className="panel stack" aria-labelledby="trip-heading">
            <h2 id="trip-heading">{t("planner.tripTitle")}</h2>
            <p className="muted trip-note">{t("booking.webNotice").replace("{hours}", appConfig.minimumWebNoticeHours)}{" "}
              <a href="#ride-contact">{t("booking.contact")}</a>
            </p>
            <div className="rider-fields">
              {field("pickup", "pickup", { ref: pickupInputRef, autoComplete: "street-address", placeholder: t("planner.placeholders.pickup"),
                "data-placeholder": t("planner.placeholders.pickup"), maxLength: 300, required: true })}
              {field("destination", "destination", { ref: destinationInputRef, placeholder: t("planner.placeholders.destination"),
                "data-placeholder": t("planner.placeholders.destination"), maxLength: 300, required: true })}
            </div>
            <p className="muted field-note">{t(mapFailed ? "booking.mapsUnavailable" : "booking.addressPrivacy")}</p>
            <div className="time-pair">
              {tripField(DateField, "pickupDate", "date", { min: today })}
              {tripField(TimeField, "pickupTime", "time")}
            </div>
            <div className="rider-fields trip-options">
              <PassengerCountField capacity={capacity} label={t("planner.labels.passengers")} value={formData.passengers}
                onChange={(value) => updateField("passengers", value)} error={errors.passengers && t(errors.passengers)}
                disabled={saveState === "saving" || retrySave} />
              <label className="check">
                <input name="roundTrip" type="checkbox" checked={formData.roundTrip} onChange={handleInputChange} />
                {t("planner.labels.roundTrip")}
              </label>
            </div>
            {formData.roundTrip && (
              <div className="time-pair">
                {tripField(DateField, "returnDate", "returnDate", { min: formData.pickupDate > today ? formData.pickupDate : today })}
                {tripField(TimeField, "returnTime", "returnTime")}
              </div>
            )}
          </section>
          <div className="reservation-submit">
            <button className="button primary" type="submit">{t("booking.checkFare")} <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </div>

      {screen === "review" && (
        <>
          <h1 ref={headingRef} tabIndex={-1}>{t("booking.review")}</h1>
          <div className="booking-grid review-layout">
            <section className="panel stack" aria-labelledby="fare-heading">
              <h2 id="fare-heading">{t("summary.fare")}</h2>
              <div role="status">
                {estimating ? t("booking.estimating") : totals ? (
                  <>
                    <strong className="fare">{formatFare(totals.fare, language)}</strong>
                    <p>{formatDistance(totals.distanceKm, language)} · {formatDuration(totals.durationMinutes, language)}</p>
                    {formData.roundTrip && <p>{t("planner.roundTripHint")}</p>}
                  </>
                ) : t("booking.fareUnavailable")}
              </div>
              <p className="trip-note">{t("booking.confirmationNote")}</p>
              <div className="review-trip stack">
                <h2>{t("planner.tripTitle")}</h2>
                <BookingDetails rows={details.map(([key, value]) => [t(key), value])} />
                <button className="button" type="button" onClick={editTrip} disabled={busy || retrySave}>{t("booking.edit")}</button>
              </div>
            </section>
            <form className="reservation-form passenger-form" onSubmit={handleSave} noValidate>
              <fieldset className="panel stack passenger-fields" disabled={busy || retrySave}>
                <legend><h2>{t("planner.contactTitle")}</h2></legend>
                {field("customerName", "name", { autoComplete: "name", maxLength: 150, required: true })}
                {field("customerPhone", "phone", { type: "tel", autoComplete: "tel", maxLength: 40, required: true })}
                {field("customerEmail", "email", { type: "email", autoComplete: "email", maxLength: 254, required: true })}
                {codeRequested && <div className="field email-code">
                  <label htmlFor="email-code">{t("booking.emailCode")}</label>
                  <input ref={codeInput} id="email-code" name="emailCode" value={emailCode} autoComplete="one-time-code"
                    spellCheck={false} autoCapitalize="none" aria-describedby="email-code-help"
                    aria-invalid={saveState === "invalidCode" ? true : undefined} onChange={(event) => setEmailCode(event.target.value)} />
                  <p className="muted field-note" id="email-code-help" role="status">{t("booking.codeHelp")}</p>
                  <button type="button" className="button" onClick={requestEmailCode}>{t("booking.resendCode")}</button>
                </div>}
                {field("notes", "optionalNotes", { rows: 3, placeholder: t("planner.placeholders.notes"), maxLength: 1500 })}
                <p className="muted">{t("booking.contactPrivacy")}</p>
              </fieldset>
              <details className="panel booking-privacy">
                <summary>{t("booking.privacyTitle")}</summary>
                <div className="stack calendar-content">
                  <p>{t("booking.privacyOperator")} {appConfig.operatorName}. <a href={"mailto:" + appConfig.email}>{appConfig.email}</a></p>
                  <p>{t("booking.privacyUse")}</p>
                  <p>{t("booking.privacyServices")}</p>
                  <p>{t("booking.privacyRetention")}</p>
                  <p>{t("booking.privacyRights")} <a href="https://www.cnil.fr/fr/plaintes">CNIL</a></p>
                </div>
              </details>
              {saveMessage && (
                <p className="field-error save-message" role="alert">{t("booking." + saveMessage)}
                  {(saveState === "shortNotice" || saveState === "intakeLimit") && <>{" "}<a href="#ride-contact">{t("booking.contact")}</a></>}
                </p>
              )}
              <div className="reservation-submit">
                <button className="button primary" type="submit" disabled={estimating || busy || saveState === "shortNotice"}>
                  {t(saveState === "sendingCode" ? "booking.sendingCode" : !codeRequested ? "booking.requestCode"
                    : saveState === "saving" ? "booking.saving" : retrySave ? "booking.retry" : "booking.send")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <section className="route-preview panel" aria-labelledby="route-heading" hidden={screen !== "review" || !mapReady || (!totals && !estimating)}>
        <h2 id="route-heading">{t("map.label")}</h2>
        <div ref={mapRef} className="map-surface"></div>
      </section>

      {screen === "receipt" && (
        <>
          <h1 ref={headingRef} tabIndex={-1}>{t("booking.receipt")}</h1>
          <BookingResult ride={receipt} language={language}>
            <p>{t("booking.keepLink")}</p>
            <div className="actions">
              <a className="button primary" href={receiptLink}>{t("booking.view")}</a>
              <button className="button" type="button" onClick={copyLink}>{t("booking.copyLink")}</button>
            </div>
            <p className="muted booking-feedback" role="status">{copyState && t("booking." + copyState)}</p>
          </BookingResult>
          <button className="button form-submit" type="button" onClick={startNewBooking}>{t("booking.another")}</button>
        </>
      )}
      <ContactFooter language={language} workspaceLink />
    </main>
  );
}

function readBookingKey() {
  return new URLSearchParams(window.location.hash.slice(1)).get("key");
}

function BookingStatus({ language, requestKey }) {
  const [result, setResult] = useState({ status: "loading" });
  const [refresh, setRefresh] = useState(0);
  const validKey = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestKey);
  const t = (name) => getText(language, name);

  useEffect(() => {
    let active = true;
    if (!validKey) return;
    bookingRpc("get_ride", { p_request_key: requestKey })
      .then((ride) => { if (active) setResult({ status: ride ? "ready" : "missing", ride, checkedAt: Date.now() }); })
      .catch(() => { if (active) setResult((current) => ({ ...current, status: "error" })); });
    return () => { active = false; };
  }, [requestKey, refresh, validKey]);

  // Check a pending request again every minute while the page is visible.
  const waiting = result.ride?.status === "pending";
  useEffect(() => {
    if (!waiting) return undefined;
    const check = () => { if (document.visibilityState === "visible") setRefresh((count) => count + 1); };
    const timer = window.setInterval(check, 60000);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [waiting]);

  const ride = result.ride;
  const feedback = validKey ? result.status : "missing";
  const checkedTime = result.checkedAt && new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB",
    { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(result.checkedAt);
  const refreshButton = validKey && <button className={feedback === "missing" ? "button" : "button primary"}
    type="button" aria-disabled={feedback === "loading"} onClick={() => {
    if (feedback === "loading") return;
    setResult((current) => ({ ...current, status: "loading" }));
    setRefresh((count) => count + 1);
  }}>{t("booking.refresh")}</button>;
  return (
    <main className="site-main" id="main-content" tabIndex={-1}>
      <h1>{t("booking.statusTitle")}</h1>
      {ride ? (
        <BookingResult ride={ride} language={language}>
          {refreshButton}
          <p className="muted booking-feedback" role="status">
            {feedback !== "ready" && t(feedback === "error" ? "booking.lookup.stale" : "booking.lookup.loading")}
          </p>
          {feedback === "ready" && checkedTime && <p className="muted booking-feedback">
            {t("booking.lastChecked").replace("{time}", checkedTime)}{ride.status === "pending" && " " + t("booking.autoRefresh")}
          </p>}
        </BookingResult>
      ) : (
        <div className="panel stack booking-fallback">
          <p role="status">{t("booking.lookup." + feedback)}</p>
          <div className="actions">
            {feedback === "missing" && <a className="button primary" href={window.location.pathname}>{t("booking.another")}</a>}
            {refreshButton}
          </div>
        </div>
      )}
      {(ride || feedback === "error") && (
        <a className="button form-submit" href={window.location.pathname}>{t("booking.another")}</a>
      )}
      <ContactFooter language={language} />
    </main>
  );
}

function App() {
  const query = new URLSearchParams(window.location.search);
  const driverView = query.has("driver");
  const privateView = !driverView && query.has("booking");
  const layoutStorageKey = driverView ? "muba-driver-layout" : "muba-rider-layout";
  const [language, setLanguage] = useState(getInitialLanguage);
  const [bookingKey, setBookingKey] = useState(() => privateView ? readBookingKey() : null);
  const [layout, setLayout] = useState(() => {
    try {
      return localStorage.getItem(layoutStorageKey) === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.layout = layout;
  }, [language, layout]);

  useEffect(() => {
    if (!privateView) return;
    const update = () => setBookingKey(readBookingKey());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [privateView]);

  function selectLayout(next) {
    setLayout(next);
    try {
      localStorage.setItem(layoutStorageKey, next);
    } catch {
      // The selected layout remains active until this page is closed.
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault();
        document.getElementById("main-content")?.focus();
      }}>{getText(language, "nav.skip")}</a>
      <header className="site-header">
        <div className="site-bar">
          <a className="wordmark" href={window.location.pathname}>
            <img className="brand-mark" src={import.meta.env.BASE_URL + "favicon.svg"} width="34" height="34" alt="" />
            <strong>{getLocalizedConfigValue(appConfig.businessName, language)}</strong>
          </a>
          <div className="preferences">
            {!driverView && <div className="preference-group header-contact">
              <a className="button toggle icon-link" href={phoneHref} aria-label={getText(language, "booking.callDriver")}
                title={getText(language, "booking.callDriver")}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M6.6 3.5h2.8l1.4 4.1-2 1.5a12 12 0 0 0 6.1 6.1l1.5-2 4.1 1.4v2.8a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="button toggle icon-link" href={whatsAppHref} target="_blank" rel="noreferrer"
                aria-label={getText(language, "booking.whatsAppDriver")} title={getText(language, "booking.whatsAppDriver")}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </a>
            </div>}
            <div className="preference-group">
              <button className="button toggle theme-toggle" type="button" aria-pressed={layout === "dark"}
                aria-label={getText(language, "booking.darkTheme")} title={getText(language, "booking.darkTheme")}
                onClick={() => selectLayout(layout === "dark" ? "light" : "dark")}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="preference-group" role="group" aria-label={getText(language, "nav.languageLabel")}>
              {SUPPORTED_LANGUAGES.map((option) => (
                <button key={option} className="button toggle" type="button" lang={option} aria-pressed={language === option}
                  onClick={() => {
                    setLanguage(option);
                    storeLanguagePreference(option);
                  }}>{option.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </header>
      {driverView ? (
        <Suspense fallback={<main className="site-main" id="main-content" tabIndex={-1}><p role="status">{getText(language, "driver.loading")}</p></main>}>
          <DriverWorkspace language={language} />
        </Suspense>
      ) : privateView ? <BookingStatus key={bookingKey ?? ""} requestKey={bookingKey} language={language} /> : <RiderBooking language={language} layout={layout} />}
    </>
  );
}

export default App;
