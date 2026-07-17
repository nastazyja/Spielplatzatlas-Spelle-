let activeTag = "all";
let activeOrt = "all";
let map;
let markers = [];

const cardsContainer = document.getElementById("cards");

function createCard(spielplatz) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.tags = spielplatz.tags.join(" ");
  card.dataset.ort = spielplatz.ort;
  card.dataset.id = spielplatz.id;

  card.innerHTML = `
    <div class="carousel">
      <button class="arrow left" onclick="prevSlide(this)">‹</button>

      ${spielplatz.bilder.map((bild, index) => `
        <img src="${bild}" 
             class="${index === 0 ? "active" : ""}" 
             ${index === 0 ? "" : 'loading="lazy"'} 
             alt="${spielplatz.name}">
      `).join("")}

      <button class="arrow right" onclick="nextSlide(this)">›</button>
      <div class="dots"></div>
    </div>

    <div class="content">
      <h2>${spielplatz.name}</h2>
      <p class="ort-badge">📍 ${spielplatz.ort}</p>
      <p>${spielplatz.beschreibung}</p>
    </div>

    <div class="tags">
      ${spielplatz.tags.map(tag => `
        <span>
          ${getTagIcon(tag)}
          ${tag}
        </span>
      `).join("")}
    </div>

    <a href="https://www.google.com/maps/dir/?api=1&destination=${spielplatz.koordinaten.lat},${spielplatz.koordinaten.lng}"
       target="_blank"
       class="route-link">
      <img src="images/route.png" alt="Route planen" class="route-icon">
    </a>
  `;

  cardsContainer.appendChild(card);
}

function getTagIcon(tag) {
  const icons = {
    "Kleinkinder Kletterturm": "images/kleinkinder kletterturm.png",
    "Kletterturm": "images/kletterturm.png",
    "Babyschaukel": "images/babyschaukel.png",
    "Wasserspiel": "images/wasserspiel.png",
    "Bagger": "images/bagger.png",
    "Turnreck": "images/turnreck.png",
    "Ballspiele": "images/ballspiele.png",
    "Schatten": "images/schatten.png",
    "Abschließbar": "images/abschließbar.png",
    "Tischtennis": "images/tischtennis.png",
    "Fußball": "images/fussball.png",
    "Basketball": "images/basketball.png"
  };

  if (!icons[tag]) return "";

  return `<img src="${icons[tag]}" class="tag-icon" alt="">`;
}

function renderCards() {
  cardsContainer.innerHTML = "";

  spielplaetze.forEach(spielplatz => {
    createCard(spielplatz);
  });

  initCarousels();
  initLightbox();
  applyFilters();
  updatePlaygroundCount();
}

function initCarousels() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const images = carousel.querySelectorAll("img");
    const dotsContainer = carousel.querySelector(".dots");

    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    let current = 0;

    images.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        showSlide(index);
      });

      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    function showSlide(index) {
      images[current].classList.remove("active");
      dots[current].classList.remove("active");

      current = index;

      images[current].classList.add("active");
      dots[current].classList.add("active");
    }

    carousel.showSlide = showSlide;
    carousel.current = () => current;
    carousel.total = images.length;
  });
}

function nextSlide(btn) {
  const carousel = btn.parentElement;
  let next = carousel.current() + 1;

  if (next >= carousel.total) next = 0;

  carousel.showSlide(next);
}

function prevSlide(btn) {
  const carousel = btn.parentElement;
  let prev = carousel.current() - 1;

  if (prev < 0) prev = carousel.total - 1;

  carousel.showSlide(prev);
}

function filterCards(tag) {
  activeTag = tag;
  applyFilters();
  updatePlaygroundCount();
}

function filterOrt(ort) {
  activeOrt = ort;
  applyFilters();
  updatePlaygroundCount();
}

function applyFilters() {
  const cards = document.querySelectorAll(".card[data-id]");

  cards.forEach(card => {
    const tags = card.dataset.tags || "";
    const ort = card.dataset.ort || "";

const ballspieleTags = ["Fußball", "Tischtennis", "Basketball"];

const tagMatch =
  activeTag === "all" ||
  tags.includes(activeTag) ||
  (
    activeTag === "Ballspiele" &&
    ballspieleTags.some(ballTag => tags.includes(ballTag))
  );

    const ortMatch =
      activeOrt === "all" ||
      ort === activeOrt;

    card.style.display =
      tagMatch && ortMatch
        ? "block"
        : "none";
  });

  updateMarkersVisibility();

  if (
    map &&
    document.getElementById("map-view").style.display === "block"
  ) {
    fitMapToVisiblePlaygrounds();
  }
}

function updatePlaygroundCount() {
  const cards = document.querySelectorAll(".card[data-id]");

  let count = 0;

  cards.forEach(card => {
    if (card.style.display !== "none") {
      count++;
    }
  });

  const countElement = document.getElementById("playground-count");

  if (!countElement) return;

  countElement.textContent =
    count === 1
      ? "1 Spielplatz gefunden"
      : count + " Spielplätze gefunden";
}

function setActiveFilter(button) {
  const parent = button.parentElement;

  parent.querySelectorAll("button").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
}

let currentGallery = [];
let currentIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll(".carousel").forEach(carousel => {
    const images = carousel.querySelectorAll("img");

    images.forEach((img, index) => {
      img.style.cursor = "pointer";

      img.addEventListener("click", () => {
        currentGallery = [...images];
        currentIndex = index;

        lightboxImg.src = img.src;
        lightbox.style.display = "flex";
      });
    });
  });

  const closeBtn = document.querySelector(".close-lightbox");
  const leftBtn = document.querySelector(".left-lightbox");
  const rightBtn = document.querySelector(".right-lightbox");

  if (closeBtn) {
    closeBtn.onclick = () => {
      lightbox.style.display = "none";
    };
  }

  if (leftBtn) {
    leftBtn.onclick = () => {
      currentIndex =
        (currentIndex - 1 + currentGallery.length) %
        currentGallery.length;

      lightboxImg.src = currentGallery[currentIndex].src;
    };
  }

  if (rightBtn) {
    rightBtn.onclick = () => {
      currentIndex =
        (currentIndex + 1) %
        currentGallery.length;

      lightboxImg.src = currentGallery[currentIndex].src;
    };
  }

  lightbox.onclick = e => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  };
}

function addPlayground() {
  alert("Adminsystem kommt als nächster Schritt.");
}

window.addEventListener("load", renderCards);

function showListView() {
  document.getElementById("cards").style.display = "grid";
  document.getElementById("map-view").style.display = "none";

  document.getElementById("listViewBtn").classList.add("active");
  document.getElementById("mapViewBtn").classList.remove("active");
}

function showMapView() {
  document.getElementById("cards").style.display = "none";
  document.getElementById("map-view").style.display = "block";

  document.getElementById("mapViewBtn").classList.add("active");
  document.getElementById("listViewBtn").classList.remove("active");

  initMap();

  setTimeout(() => {
    map.resize();
    fitMapToVisiblePlaygrounds();
  }, 200);
}

function initMap() {
  if (!document.getElementById("map")) return;
  if (map) return;

  map = new maplibregl.Map({
    container: "map",
    style: "https://api.maptiler.com/maps/aquarelle-v4/style.json?key=lweRJtDUXGZFcYyE855O",
    center: [7.467, 52.362],
    zoom: 12
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");
  
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-right"
);
  map.on("load", () => {
    renderMarkers();
    fitMapToVisiblePlaygrounds();
  });
}

function renderMarkers() {
  markers.forEach(item => item.marker.remove());
  markers = [];

  spielplaetze.forEach(spielplatz => {
    const marker = new maplibregl.Marker({
      color: "#6ea34d"
    })
      .setLngLat([
        spielplatz.koordinaten.lng,
        spielplatz.koordinaten.lat
      ])
      .addTo(map);
      marker.getElement().addEventListener("click", () => {
  openMapCard(spielplatz.id);

  map.flyTo({
    center: [
      spielplatz.koordinaten.lng,
      spielplatz.koordinaten.lat
    ],
    zoom: 15
  });
});

    markers.push({
      id: spielplatz.id,
      spielplatz,
      marker
    });
  });
}

function fitMapToVisiblePlaygrounds() {
  if (!map) return;

  const visibleIds = [...document.querySelectorAll(".card[data-id]")]
    .filter(card => card.style.display !== "none")
    .map(card => card.dataset.id);

  const visiblePlaygrounds = spielplaetze.filter(spielplatz =>
    visibleIds.includes(spielplatz.id)
  );

  if (visiblePlaygrounds.length === 0) return;

  const bounds = new maplibregl.LngLatBounds();

  visiblePlaygrounds.forEach(spielplatz => {
    bounds.extend([
      spielplatz.koordinaten.lng,
      spielplatz.koordinaten.lat
    ]);
  });

  map.fitBounds(bounds, {
    padding: 60,
    maxZoom: 14
  });
}

function openMapCard(spielplatzId) {
  const originalCard = document.querySelector(`.card[data-id="${spielplatzId}"]`);
  const overlay = document.getElementById("map-card-overlay");
  const content = document.getElementById("map-card-content");

  if (!originalCard || !overlay || !content) return;

  const clonedCard = originalCard.cloneNode(true);

  clonedCard.style.display = "block";

  content.innerHTML = "";
  content.appendChild(clonedCard);

  overlay.classList.add("open");

  initCarousels();
  initLightbox();
}

function closeMapCard() {
  const overlay = document.getElementById("map-card-overlay");
  if (overlay) overlay.classList.remove("open");
}

function updateMarkersVisibility() {
  if (!map || markers.length === 0) return;

  const visibleIds = [...document.querySelectorAll(".card[data-id]")]
    .filter(card => card.style.display !== "none")
    .map(card => card.dataset.id);

  markers.forEach(item => {
    const markerElement = item.marker.getElement();

    if (visibleIds.includes(item.id)) {
      markerElement.style.display = "block";
    } else {
      markerElement.style.display = "none";
    }
  });
}