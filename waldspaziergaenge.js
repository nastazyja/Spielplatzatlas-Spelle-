const waldspaziergaenge = [
  {
    id: "naturspazierweg-schapen",
    name: "Naturspazierweg Schapen",
    ort: "Schapen",
    adresse: "Am Pfarrhof 1, 48480 Schapen",
    koordinaten: { lat: 52.400157, lng: 7.545108 },
    bilder: [
  "images/nature/naturspazierwegschapen1.webp",
  "images/nature/naturspazierwegschapen2.webp",
  "images/nature/naturspazierwegschapen3.webp",
  "images/nature/naturspazierwegschapen4.webp",
  "images/nature/naturspazierwegschapen5.webp"
],
    beschreibung: `<p>Rund um das Alte Pfarrhaus führt ein familienfreundlicher Naturspazierweg mit 19 Stationen durch den Park. An verschiedenen Stellen kann gesammelt, gefühlt, gerochen und entdeckt werden.</p><p>Super für einen kleinen Naturausflug mit Kindern. Im Bürgerpark gibt es zudem öffentliche Toiletten. </p>`,
  },
  {
    id: "wald-spelle-schapen",
    name: "Wäldchen zwischen Spelle und Schapen",
    ort: "Schapen",
    adresse: "Speller Str., 48480 Schapen",
    koordinaten: { lat: 52.3802274, lng: 7.5263067 },
    bilder: [
  "images/nature/waldspelleschapen1.webp",
  "images/nature/waldspelleschapen2.webp",
  "images/nature/waldspelleschapen3.webp"
],
    beschreibung: `<p>Ein Waldgebiet zwischen Spelle und Schapen.</p>`,
  },
  {
    id: "picknickwiese-giegel-aa",
    name: "Picknickwiese an der Giegel Aa",
    ort: "Schapen",
    adresse: "Speller Str., 48480 Schapen",
    koordinaten: { lat: 52.3863346, lng: 7.5328680 },
    bilder: [
  "images/nature/picknickwiesegiegel1.webp",
  "images/nature/picknickwiesegiegel2.webp",
  "images/nature/picknickwiesegiegel3.webp",
  "images/nature/picknickwiesegiegel4.webp",
  "images/nature/picknickwiesegiegel5.webp",
  "images/nature/picknickwiesegiegel6.webp"
],
    beschreibung: `<p>Ein richtig schönes Plätzchen. Die Wiese liegt idyllisch an der Giegel Aa und ist von hohen Bäumen umgeben, die dem Ort eine wunderbar ruhige und gemütliche Atmosphäre geben.</p><p>Ein Picknicktisch mit Bänken lädt dazu ein, eine Kleinigkeit zu essen oder einfach ein bisschen länger zu bleiben. Direkt an der Giegel Aa steht eine Liege, perfekt, um kurz die Beine hochzulegen und die ruhige Umgebung zu genießen.</p><p>Auf der Wiese gibt es auch für Kinder etwas zu entdecken: Ein Insektenhaus lädt zum Beobachten ein und auf der Wiese stehen verschiedene Obstbäume mit einem gelben Band, das heißt: Pflücken ist ausdrücklich erlaubt.</p>`,
  },
  {
    id: "naturerlebnispfad-luenne",
    name: "Naturerlebnispfad Wassermühle Lünne",
    ort: "Lünne",
    adresse: "Auf dem Damm, 48480 Lünne",
    koordinaten: { lat: 52.4310593, lng: 7.4265851 },
    bilder: [],
    beschreibung: `<p>Im idyllischen Bürgerpark lässt sich die Natur spielerisch entdecken. Zu den Stationen gehören unter anderem ein Baumstamm-Xylophon, Tierweitsprung und ein Natur-Quiz am Wegesrand.</p>`,
  },
  {
    id: "speller-sand",
    name: "Speller Sand",
    ort: "Lünne",
    adresse: "Am Speller Sand, 48480 Lünne",
    koordinaten: { lat: 52.3980363, lng: 7.4792305 },
    bilder: [],
    beschreibung: `<p>Ein Waldgebiet zwischen Spelle und Lünne.</p>`,
  }
];

let aktiverWaldOrt = "all";

function renderWaldspaziergaenge() {
  const container = document.getElementById("wald-cards");
  const sichtbar = waldspaziergaenge.filter(eintrag => aktiverWaldOrt === "all" || eintrag.ort === aktiverWaldOrt);
  container.innerHTML = "";

  sichtbar.forEach(eintrag => {
    const card = document.createElement("div");
    card.className = "card wald-card";

    const bildbereich = eintrag.bilder.length
      ? `<div class="carousel">
          ${eintrag.bilder.map((bild, i) => `<img src="${bild}" class="${i === 0 ? "active" : ""}" ${i === 0 ? "" : 'loading="lazy"'} alt="${eintrag.name}">`).join("")}
          ${eintrag.bilder.length > 1 ? `
            <button class="arrow left" type="button" aria-label="Vorheriges Bild">‹</button>
            <button class="arrow right" type="button" aria-label="Nächstes Bild">›</button>
            <div class="dots"></div>
          ` : ""}
        </div>`
      : `<div class="wald-placeholder"><i class="fa-solid fa-tree"></i><span>Eigene Fotos folgen</span></div>`;

    const route = eintrag.koordinaten
      ? `<a href="https://www.google.com/maps/dir/?api=1&destination=${eintrag.koordinaten.lat},${eintrag.koordinaten.lng}" target="_blank" rel="noopener" class="route-link"><img src="images/routewald.png" alt="Route planen" class="route-icon"></a>`
      : "";

    card.innerHTML = `${bildbereich}<div class="content"><h2>${eintrag.name}</h2><p class="ort-badge">📍 ${eintrag.ort}</p><p class="wald-adresse">${eintrag.adresse}</p>${eintrag.beschreibung}${route}</div>`;
    container.appendChild(card);
  });

  initWaldCarousels();
  initWaldLightbox();
  document.getElementById("wald-count").textContent = `${sichtbar.length} ${sichtbar.length === 1 ? "Naturort" : "Naturorte"}`;
}

function initWaldCarousels() {
  document.querySelectorAll("#wald-cards .carousel").forEach(carousel => {
    const images = Array.from(carousel.querySelectorAll("img"));
    const dotsContainer = carousel.querySelector(".dots");
    const left = carousel.querySelector(".arrow.left");
    const right = carousel.querySelector(".arrow.right");
    let current = 0;

    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = `dot${index === 0 ? " active" : ""}`;
        dot.addEventListener("click", event => {
          event.stopPropagation();
          showSlide(index);
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".dot")) : [];

    function showSlide(index) {
      images[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");
      current = (index + images.length) % images.length;
      images[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
    }

    if (left) left.addEventListener("click", event => {
      event.stopPropagation();
      showSlide(current - 1);
    });

    if (right) right.addEventListener("click", event => {
      event.stopPropagation();
      showSlide(current + 1);
    });

    carousel.getCurrentIndex = () => current;
    carousel.showSlide = showSlide;
  });
}

let waldLightbox;
let waldLightboxImg;
let waldLightboxBilder = [];
let waldLightboxIndex = 0;

function initWaldLightbox() {
  if (!waldLightbox) {
    waldLightbox = document.createElement("div");
    waldLightbox.className = "lightbox";
    waldLightbox.innerHTML = `
      <span class="close-lightbox" aria-label="Schließen">×</span>
      <button class="lightbox-arrow left-lightbox" type="button" aria-label="Vorheriges Bild">‹</button>
      <img alt="Vergrößerte Ansicht">
      <button class="lightbox-arrow right-lightbox" type="button" aria-label="Nächstes Bild">›</button>
    `;
    document.body.appendChild(waldLightbox);
    waldLightboxImg = waldLightbox.querySelector("img");

    waldLightbox.querySelector(".close-lightbox").addEventListener("click", closeWaldLightbox);
    waldLightbox.querySelector(".left-lightbox").addEventListener("click", event => {
      event.stopPropagation();
      showWaldLightboxBild(waldLightboxIndex - 1);
    });
    waldLightbox.querySelector(".right-lightbox").addEventListener("click", event => {
      event.stopPropagation();
      showWaldLightboxBild(waldLightboxIndex + 1);
    });
    waldLightbox.addEventListener("click", event => {
      if (event.target === waldLightbox) closeWaldLightbox();
    });

    document.addEventListener("keydown", event => {
      if (waldLightbox.style.display !== "flex") return;
      if (event.key === "Escape") closeWaldLightbox();
      if (event.key === "ArrowLeft") showWaldLightboxBild(waldLightboxIndex - 1);
      if (event.key === "ArrowRight") showWaldLightboxBild(waldLightboxIndex + 1);
    });
  }

  document.querySelectorAll("#wald-cards .carousel").forEach(carousel => {
    const images = Array.from(carousel.querySelectorAll("img"));
    images.forEach((img, index) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        waldLightboxBilder = images.map(image => image.src);
        const current = carousel.getCurrentIndex ? carousel.getCurrentIndex() : index;
        showWaldLightboxBild(current);
        waldLightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    });
  });
}

function showWaldLightboxBild(index) {
  if (!waldLightboxBilder.length) return;
  waldLightboxIndex = (index + waldLightboxBilder.length) % waldLightboxBilder.length;
  waldLightboxImg.src = waldLightboxBilder[waldLightboxIndex];

  const arrows = waldLightbox.querySelectorAll(".lightbox-arrow");
  arrows.forEach(arrow => arrow.style.display = waldLightboxBilder.length > 1 ? "block" : "none");
}

function closeWaldLightbox() {
  if (!waldLightbox) return;
  waldLightbox.style.display = "none";
  document.body.style.overflow = "";
}

function setWaldOrt(button, ort) {
  aktiverWaldOrt = ort;
  document.querySelectorAll(".orts button").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  renderWaldspaziergaenge();
}

document.addEventListener("DOMContentLoaded", renderWaldspaziergaenge);
