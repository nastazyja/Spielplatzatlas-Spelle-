let activeTag = "all";
let activeOrt = "all";
document.querySelectorAll(".carousel").forEach((carousel) => {
  const images = carousel.querySelectorAll("img");
  const dotsContainer = carousel.querySelector(".dots");

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
  const cards = document.querySelectorAll(".card:not(.helper-card):not(.kaffeekasse-card):not(.sponsor-card)");

  cards.forEach(card => {

    const tags = card.dataset.tags || "";
    const ort = card.dataset.ort || "";

    const tagMatch =
      activeTag === "all" ||
      tags.includes(activeTag);

    const ortMatch =
      activeOrt === "all" ||
      ort === activeOrt;

    card.style.display =
      tagMatch && ortMatch
        ? "block"
        : "none";

  });

  const helperCard = document.querySelector(".helper-card");
const kaffeekasseCard = document.querySelector(".kaffeekasse-card");
const sponsorCard = document.querySelector(".sponsor-card");

helperCard.style.display = "block";
kaffeekasseCard.style.display = "block";
sponsorCard.style.display = "block";

helperCard.parentNode.appendChild(helperCard);
helperCard.parentNode.appendChild(kaffeekasseCard);
helperCard.parentNode.appendChild(sponsorCard);
}

function addPlayground() {
  alert("Adminsystem kommt als nächster Schritt.");
}

let currentGallery = [];
let currentIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

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

document.querySelector(".close-lightbox").onclick = () => {
  lightbox.style.display = "none";
};

document.querySelector(".left-lightbox").onclick = () => {
  currentIndex =
    (currentIndex - 1 + currentGallery.length) %
    currentGallery.length;

  lightboxImg.src = currentGallery[currentIndex].src;
};

document.querySelector(".right-lightbox").onclick = () => {
  currentIndex =
    (currentIndex + 1) %
    currentGallery.length;

  lightboxImg.src = currentGallery[currentIndex].src;
};

lightbox.onclick = e => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
};

function updatePlaygroundCount() {
  const visibleCards = document.querySelectorAll(".card:not(.helper-card):not(.kaffeekasse-card):not(.sponsor-card)");

  let count = 0;

  visibleCards.forEach(card => {
    if (card.style.display !== "none") {
      count++;
    }
  });

  const text =
    count === 1
      ? "1 Spielplatz gefunden"
      : count + " Spielplätze gefunden";

  document.getElementById("playground-count").textContent = text;
}

function setActiveFilter(button) {
  const parent = button.parentElement;

  parent.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('active');
  });

  button.classList.add('active');
}

window.addEventListener("load", updatePlaygroundCount);