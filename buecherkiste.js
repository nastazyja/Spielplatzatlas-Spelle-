// Weitere Bücher unten ergänzen. Das erste erscheint im Regalaufsatz,
// alle weiteren in einem zusätzlichen Regalfach. Das Unterteil bleibt Dekoration.
const buecher = [
  { titel: "Der kleine Fuchs hört einen Mucks", bild: "images/books/fuchsmucks.webp", beschreibung: "Ein kleiner Fuchs hört ein geheimnisvolles Geräusch und geht auf die Suche.", link: "https://link.amazon/B0eiDClpZ" },
  { titel: "Die Eule mit der Beule", bild: "images/books/eulebeule.webp", beschreibung: "Die Eule hat sich gestoßen. Ihre Freunde wollen helfen, doch Mamas Trost hilft am besten.", link: "https://link.amazon/B0caMfFYk" },
  { titel: "Zogg", bild: "images/books/zogg.webp", beschreibung: "Drache Zogg lernt in der Drachenschule und bekommt dabei Hilfe von Prinzessin Perle, die lieber Ärztin wäre.", link: "https://link.amazon/B03veyYzY" },
  { titel: "Kalle Tierfrisör", bild: "images/books/kalle.webp", beschreibung: "Drache Zogg lernt in der Drachenschule und bekommt dabei Hilfe von Prinzessin Perle, die lieber Ärztin wäre.", link: "https://link.amazon/B0ebBrl7T" },
  { titel: "Frohe Weihnachten! Pustebuch", bild: "images/books/pustenweihnachten.webp", beschreibung: "Die Waldtiere bereiten sich auf Weihnachten vor: Sie backen Plätzchen, schmücken den Weihnachtsbaum und packen Geschenke ein.", link: "https://link.amazon/B0aMqttjZ" },
  { titel: "Alle Äffchen fühlen so!", bild: "images/books/affengefuehle.webp", beschreibung: "Die Affenfreunde wollen ihre Banane nicht teilen und erleben auf der Suche nach weiteren Bananen eine Achterbahn der Gefühle.", link: "https://link.amazon/B05Sg9ZSh" },
  { titel: "Immer Drama mit dem Lama", bild: "images/books/dramalama.webp", beschreibung: "Dana Lama hat schlechte Laune, doch die großen Lamas begleiten sie liebevoll und mit viel Humor durch den Tag.", link: "https://link.amazon/B0bZ2upio" },
  { titel: "Wie kleine Tiere schlafen gehen", bild: "images/books/kleinetiereschlafen.webp", beschreibung: "Eine süße Gute-Nacht-Geschichte über die Einschlafrituale verschiedener Tiere, liebevoll erzählt in schönen Reimen.", link: "https://link.amazon/B09AiCE1M"},
  { titel: "Junior Lexikon Fahrzeuge", bild: "images/books/lexikonfahrzeuge.webp", beschreibung: "Unser liebstes und vielfältigstes Fahrzeugbuch! Vom Tuk-Tuk über die Pferdekutsche bis zum Altglassammelfahrzeug gibt es hier wirklich alles zu entdecken.", link: "https://link.amazon/B08Rr7miE"}
];
const ziel = document.getElementById('bookcase-books');
buecher.forEach((buch, index) => {
  const fach = document.createElement('article');
  fach.className = 'bookcase-module ' + (index === 0 ? 'bookcase-module--top' : 'bookcase-module--middle');
  const inhalt = document.createElement('div'); inhalt.className = 'bookcase-content';
  const bild = document.createElement('img'); bild.className = 'bookcase-cover'; bild.src = buch.bild; bild.alt = 'Illustration zu ' + buch.titel; bild.loading = index === 0 ? 'eager' : 'lazy';
   const copy = document.createElement('div'); copy.className = 'bookcase-copy';
   const titel = document.createElement('h2');
   const text = document.createElement('p'); text.textContent = buch.beschreibung;
   const bildLink = document.createElement(buch.link ? 'a' : 'div');
   bildLink.className = 'bookcase-image-link';
   if (buch.link) { bildLink.href = buch.link; bildLink.target = '_blank'; bildLink.rel = 'sponsored noopener noreferrer'; bildLink.setAttribute('aria-label', buch.titel + ' bei Amazon ansehen (Partnerlink)'); }
   bildLink.append(bild);
   if (buch.link) {
     const titelLink = document.createElement('a'); titelLink.href = buch.link;
     titelLink.target = '_blank'; titelLink.rel = 'sponsored noopener noreferrer';
     titelLink.textContent = buch.titel; titel.append(titelLink);
   } else { titel.textContent = buch.titel; }
   copy.append(titel, text);
   inhalt.append(bildLink, copy); fach.append(inhalt); ziel.append(fach);
});
