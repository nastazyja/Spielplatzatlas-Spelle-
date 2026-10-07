/*
 * Naschkarte – Artenkatalog und Fundorte
 *
 * WICHTIG:
 * - Der Artenkatalog enthält alle vorbereiteten Naschereien.
 * - Filter werden automatisch NUR für Arten erzeugt, die in `naschorte`
 *   tatsächlich mindestens einmal vorkommen.
 * - Pro Standort ist eine Nascherei vorgesehen (`art`).
 * - `saison` wird automatisch aus dem Artenkatalog übernommen.
 */

const nascharten = {
  // BAUMOBST
  apfel:            { name: "Apfel",              kategorie: "Baumobst", icon: "fa-apple-whole", symbol: "🍎", farbe: "#a84444", saison: "August–Oktober" },
  birne:            { name: "Birne",              kategorie: "Baumobst", icon: "fa-lemon", symbol: "🍐", farbe: "#8aa34a", saison: "August–Oktober" },
  kirsche:          { name: "Kirsche",            kategorie: "Baumobst", icon: "fa-circle", symbol: "🍒", farbe: "#a52f46", saison: "Juni–Juli" },
  sauerkirsche:     { name: "Sauerkirsche",       kategorie: "Baumobst", icon: "fa-circle", symbol: "🍒", farbe: "#8f2941", saison: "Juni–August" },
  vogelkirsche:     { name: "Vogelkirsche",       kategorie: "Baumobst", icon: "fa-circle", symbol: "🍒", farbe: "#96364b", saison: "Juni–Juli" },
  pflaume:          { name: "Pflaume",            kategorie: "Baumobst", icon: "fa-circle", symbol: "●",  farbe: "#6f456f", saison: "Juli–Oktober" },
  zwetschge:        { name: "Zwetschge",          kategorie: "Baumobst", icon: "fa-circle", symbol: "●",  farbe: "#5e426f", saison: "August–Oktober" },
  mirabelle:        { name: "Mirabelle",          kategorie: "Baumobst", icon: "fa-circle", symbol: "●",  farbe: "#d5a934", saison: "Juli–September" },
  kirschpflaume:    { name: "Kirschpflaume",      kategorie: "Baumobst", icon: "fa-circle", symbol: "●",  farbe: "#8d486c", saison: "Juli–September" },
  wildapfel:        { name: "Wildapfel/Holzapfel",kategorie: "Baumobst", icon: "fa-apple-whole", symbol: "🍎", farbe: "#9c5546", saison: "September–Oktober" },
  wildbirne:        { name: "Wildbirne",          kategorie: "Baumobst", icon: "fa-lemon", symbol: "🍐", farbe: "#7f9148", saison: "September–Oktober" },
  mispel:           { name: "Mispel",             kategorie: "Baumobst", icon: "fa-circle", symbol: "●",  farbe: "#8a5d45", saison: "Oktober–November" },
  maulbeere:        { name: "Maulbeere",          kategorie: "Baumobst", icon: "fa-circle", symbol: "●",  farbe: "#6f365d", saison: "Juli–September" },
  quitte:           { name: "Quitte",             kategorie: "Baumobst", icon: "fa-lemon", symbol: "●",  farbe: "#c39a35", saison: "September–November" },

  // BEEREN / STRAUCHFRÜCHTE
  brombeere:        { name: "Brombeere",          kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#4f304e", saison: "Juli–Oktober" },
  himbeere:         { name: "Himbeere",           kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#b33d62", saison: "Juni–September" },
  heidelbeere:      { name: "Heidelbeere",        kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#43577f", saison: "Juli–September" },
  preisbeere:       { name: "Preiselbeere",       kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#a63d4b", saison: "August–Oktober" },
  erdbeere:         { name: "Walderdbeere",       kategorie: "Beeren",    icon: "fa-circle", symbol: "🍓", farbe: "#c94e52", saison: "Juni–August" },
  johannisbeereRot: { name: "Rote Johannisbeere", kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#b53c4d", saison: "Juni–August" },
  johannisbeereSchwarz:{name:"Schwarze Johannisbeere",kategorie:"Beeren", icon: "fa-circle", symbol: "●",  farbe: "#50384f", saison: "Juni–August" },
  stachelbeere:     { name: "Stachelbeere",       kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#81934f", saison: "Juni–August" },
  holunder:         { name: "Schwarzer Holunder", kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#493747", saison: "August–Oktober", hinweis: "Beeren nicht roh verzehren; vor dem Verzehr erhitzen." },
  schlehe:          { name: "Schlehe",            kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#4f4d75", saison: "September–November" },
  hagebutte:        { name: "Hagebutte",          kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#b95642", saison: "September–November" },
  sanddorn:         { name: "Sanddorn",           kategorie: "Beeren",    icon: "fa-circle", symbol: "●",  farbe: "#d17b35", saison: "August–Oktober" },

  // NÜSSE
  haselnuss:        { name: "Haselnuss",          kategorie: "Nüsse",     icon: "fa-seedling", symbol: "●",  farbe: "#8a633f", saison: "September–Oktober" },
  walnuss:          { name: "Walnuss",            kategorie: "Nüsse",     icon: "fa-seedling", symbol: "●",  farbe: "#76543a", saison: "September–Oktober" },
  esskastanie:      { name: "Esskastanie/Marone", kategorie: "Nüsse",     icon: "fa-seedling", symbol: "🌰", farbe: "#79523a", saison: "September–November" }
};

const naschorte = [
  {
    id: "apfel-standort-1",
    name: "Apfel",
    art: "apfel",
    ort: "Schapen",
    koordinaten: { lat: 52.3862081, lng: 7.5323353 },
    beschreibung: "Auf der Picknickwiese an der Giegel Aa",
    hinweis: "",
    quelle: ""
  },
  {
    id: "birne-standort-1",
    name: "Birne",
    art: "birne",
    ort: "Schapen",
    koordinaten: { lat: 52.3863790, lng: 7.5322897 },
    beschreibung: "Auf der Picknickwiese an der Giegel Aa",
    hinweis: "",
    quelle: ""
  },
  {
    id: "brombeere-standort-1",
    name: "Brombeere",
    art: "brombeere",
    ort: "Spelle",
    typ: "strecke",
koordinaten: [
  { lat: 52.3780330, lng: 7.4860150 },
  { lat: 52.3734735, lng: 7.4830192 }
],
    beschreibung: "Bahnradweg, das Stück direkt hinter der Nordumgehung in Richtung Beesten. ",
    hinweis: "",
    quelle: ""
  },
  {
    id: "esskastanie-standort-1",
    name: "Esskastanie / Marone",
    art: "esskastanie",
    ort: "Spelle",
    koordinaten: { lat: 52.3675637, lng: 7.4800171 },
    beschreibung: "Bei dem Zugang zur Kita an der Bahn, an der Verzehrsinsel.",
    hinweis: "",
    quelle: ""
  },
  {
    id: "haselnuss-1",
    name: "Haselnuss",
    art: "haselnuss",
    ort: "Lünne",
    koordinaten: { lat: 52.3837206, lng: 7.4808000 },
    beschreibung: "Moorstraße",
    hinweis: "",
    quelle: ""
  }
];
