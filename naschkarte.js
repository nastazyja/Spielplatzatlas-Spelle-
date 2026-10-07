const activeFruits = new Set();
let activeNaschOrt = "all";
let onlyInSeason = false;
let naschMap;
let naschMarkers = [];
let naschLines = [];

const naschCards = document.getElementById("nasch-cards");
const categoryColors = {
  Baumobst: "#E10600",
  Beeren: "#9B7BC4",
  "Nüsse": "#C79A63"
};

function getArt(item) { return nascharten[item.art] || null; }

function getStartKoordinaten(item) {
  if (item.koordinaten?.lat != null && item.koordinaten?.lng != null) return item.koordinaten;
  if (item.typ === "strecke" && Array.isArray(item.koordinaten) && item.koordinaten.length) return item.koordinaten[0];
  if (Array.isArray(item.strecke) && item.strecke.length) return item.strecke[0];
  return null;
}

function hasNaschPosition(item) { return !!getStartKoordinaten(item); }

const pluralNames = {
  apfel: "Äpfel", birne: "Birnen", kirsche: "Kirschen", sauerkirsche: "Sauerkirschen",
  vogelkirsche: "Vogelkirschen", pflaume: "Pflaumen", zwetschge: "Zwetschgen", mirabelle: "Mirabellen",
  kirschpflaume: "Kirschpflaumen", wildapfel: "Wildäpfel/Holzäpfel", wildbirne: "Wildbirnen",
  mispel: "Mispeln", maulbeere: "Maulbeeren", quitte: "Quitten", brombeere: "Brombeeren",
  himbeere: "Himbeeren", heidelbeere: "Heidelbeeren", preisbeere: "Preiselbeeren", erdbeere: "Walderdbeeren",
  johannisbeereRot: "Rote Johannisbeeren", johannisbeereSchwarz: "Schwarze Johannisbeeren",
  stachelbeere: "Stachelbeeren", holunder: "Schwarzer Holunder", schlehe: "Schlehen", hagebutte: "Hagebutten",
  sanddorn: "Sanddorn", haselnuss: "Haselnüsse", walnuss: "Walnüsse", esskastanie: "Esskastanien/Maronen"
};

const monthNumbers = {
  januar:1, februar:2, märz:3, april:4, mai:5, juni:6, juli:7, august:8, september:9, oktober:10, november:11, dezember:12
};

function isCurrentlyInSeason(saison) {
  if (!saison) return false;
  const parts = saison.toLowerCase().replace(/–/g, "-").split("-").map(x => x.trim());
  const start = monthNumbers[parts[0]];
  const end = monthNumbers[parts[1] || parts[0]];
  if (!start || !end) return false;
  const month = new Date().getMonth() + 1;
  return start <= end ? month >= start && month <= end : month >= start || month <= end;
}


function renderFruitFilters() {
  const box = document.querySelector(".nasch-frucht-filter");
  if (!box) return;
  const used = [...new Set((naschorte || []).map(x => x.art).filter(x => nascharten[x]))];
  box.innerHTML = `<button class="active" data-filter="all-fruits" onclick="clearFruitFilters()">Alle</button>` +
    used.map(key => {
      const art = nascharten[key];
      return `<button data-filter="${key}" onclick="toggleFruit(this,'${key}')"><i class="fa-solid ${art.icon || "fa-circle"} nasch-filter-icon" style="color:${art.farbe}" aria-hidden="true"></i> ${art.name}</button>`;
    }).join("");
}

function renderOrtFilters() {
  const box = document.querySelector(".nasch-ortsfilter");
  if (!box) return;
  const order = ["Spelle","Venhaus","Varenrode","Lünne","Schapen"];
  const used = [...new Set((naschorte || []).map(x => x.ort).filter(Boolean))]
    .sort((a,b) => (order.indexOf(a) < 0 ? 99 : order.indexOf(a)) - (order.indexOf(b) < 0 ? 99 : order.indexOf(b)) || a.localeCompare(b));
  box.innerHTML = `<button class="active" onclick="filterNaschOrt(this,'all')">Alle Orte</button>` +
    used.map(ort => `<button onclick="filterNaschOrt(this,'${ort.replaceAll("'","\\'")}')">${ort}</button>`).join("");
}

function createNaschCard(item) {
  const art = getArt(item); if (!art) return;
  const routeKoordinaten = getStartKoordinaten(item); if (!routeKoordinaten) return;
  const card = document.createElement("div");
  card.className = "card nasch-card";
  card.dataset.id = item.id;
  card.dataset.ort = item.ort;
  card.dataset.art = item.art;
  card.dataset.inSeason = isCurrentlyInSeason(art.saison) ? "true" : "false";
  card.innerHTML = `
    <div class="nasch-symbol" aria-hidden="true" style="color:${art.farbe}"><i class="fa-solid ${art.icon || "fa-circle"}"></i></div>
    <div class="content">
      <h2>${pluralNames[item.art] || art.name}</h2>
      <p class="nasch-ort"><strong>Ort:</strong> ${item.ort || ""}</p>
      ${item.beschreibung ? `<p class="nasch-beschreibung"><strong>Standort:</strong> ${item.beschreibung}</p>` : ""}
      <p class="nasch-saison"><strong>Saison:</strong> ca. ${art.saison}</p>
    </div>
    <a href="https://www.google.com/maps/dir/?api=1&destination=${routeKoordinaten.lat},${routeKoordinaten.lng}" target="_blank" rel="noopener" class="route-link" aria-label="Route zu ${pluralNames[item.art] || art.name}">Route<br>starten</a>`;
  naschCards.appendChild(card);
}

function renderNaschorte(){
  renderFruitFilters(); renderOrtFilters();
  naschCards.innerHTML="";
  const valid=(naschorte||[]).filter(x=>getArt(x) && hasNaschPosition(x));
  valid.forEach(createNaschCard);
  const empty=document.getElementById("nasch-empty"); if(empty) empty.style.display=valid.length?"none":"block";
  applyNaschFilters();
}

function toggleFruit(btn, fruit){
  activeFruits.has(fruit)?activeFruits.delete(fruit):activeFruits.add(fruit);
  btn.classList.toggle("active",activeFruits.has(fruit));
  document.querySelector('[data-filter="all-fruits"]')?.classList.toggle("active",activeFruits.size===0);
  applyNaschFilters();
}
function clearFruitFilters(){ activeFruits.clear(); document.querySelectorAll(".nasch-frucht-filter button").forEach(b=>b.classList.remove("active")); document.querySelector('[data-filter="all-fruits"]')?.classList.add("active"); applyNaschFilters(); }
function filterNaschOrt(btn,ort){ activeNaschOrt=ort; document.querySelectorAll(".nasch-ortsfilter button").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); applyNaschFilters(); }
function toggleSeasonFilter(btn){ onlyInSeason=!onlyInSeason; btn.classList.toggle("active",onlyInSeason); btn.setAttribute("aria-pressed", String(onlyInSeason)); applyNaschFilters(); }
function applyNaschFilters(){
  let count=0;
  document.querySelectorAll("#nasch-cards .nasch-card").forEach(card=>{
    // ODER-Logik: Bei mehreren ausgewählten Naschereien genügt eine Übereinstimmung.
    const fruitMatch=activeFruits.size===0 || activeFruits.has(card.dataset.art);
    const ortMatch=activeNaschOrt==="all"||card.dataset.ort===activeNaschOrt;
    const seasonMatch=!onlyInSeason || card.dataset.inSeason==="true";
    const visible=fruitMatch&&ortMatch&&seasonMatch; card.style.display=visible?"flex":"none"; if(visible) count++;
  });
  const countEl=document.getElementById("nasch-count"); if(countEl) countEl.textContent=count===1?"1 Fundort":`${count} Fundorte`;
  updateNaschMarkers();
}
function showNaschList(){ document.getElementById("nasch-cards").style.display="block"; document.getElementById("nasch-map-view").style.display="none"; document.getElementById("naschListBtn").classList.add("active"); document.getElementById("naschMapBtn").classList.remove("active"); }
function showNaschMap(){ document.getElementById("nasch-cards").style.display="none"; document.getElementById("nasch-map-view").style.display="block"; document.getElementById("naschMapBtn").classList.add("active"); document.getElementById("naschListBtn").classList.remove("active"); initNaschMap(); setTimeout(()=>{naschMap?.resize(); fitNaschMap();},200); }
function initNaschMap(){ if(naschMap) return; naschMap=new maplibregl.Map({container:"nasch-map",style:"https://api.maptiler.com/maps/aquarelle-v4/style.json?key=lweRJtDUXGZFcYyE855O",center:[7.467,52.362],zoom:12}); naschMap.addControl(new maplibregl.NavigationControl(),"top-right"); naschMap.addControl(new maplibregl.GeolocateControl({positionOptions:{enableHighAccuracy:true},trackUserLocation:true}),"top-right"); naschMap.on("load",()=>{renderNaschMarkers();fitNaschMap();}); }
function renderNaschMarkers(){
  naschMarkers.forEach(x=>x.marker.remove()); naschMarkers=[];
  naschLines.forEach(x=>{
    if(naschMap.getLayer(x.layerId)) naschMap.removeLayer(x.layerId);
    if(naschMap.getSource(x.sourceId)) naschMap.removeSource(x.sourceId);
  });
  naschLines=[];

  (naschorte||[]).forEach(item=>{
    const art=getArt(item); if(!art||!hasNaschPosition(item))return;

    const streckenPunkte = item.typ === "strecke" && Array.isArray(item.koordinaten)
      ? item.koordinaten
      : (Array.isArray(item.strecke) ? item.strecke : null);

    if(streckenPunkte && streckenPunkte.length >= 2){
      const sourceId=`nasch-strecke-${item.id}`;
      const layerId=`nasch-strecke-layer-${item.id}`;
      naschMap.addSource(sourceId,{
        type:"geojson",
        data:{type:"Feature",properties:{id:item.id},geometry:{type:"LineString",coordinates:streckenPunkte.map(p=>[p.lng,p.lat])}}
      });
      naschMap.addLayer({
        id:layerId,
        type:"line",
        source:sourceId,
        paint:{
          "line-color":categoryColors[art.kategorie] || art.farbe,
          "line-width":7,
          "line-opacity":0.85
        }
      });
      naschMap.on("click",layerId,()=>openNaschMapCard(item.id));
      naschMap.on("mouseenter",layerId,()=>naschMap.getCanvas().style.cursor="pointer");
      naschMap.on("mouseleave",layerId,()=>naschMap.getCanvas().style.cursor="");
      naschLines.push({id:item.id,sourceId,layerId});
      return;
    }

    const pos=getStartKoordinaten(item);
    const el=document.createElement("div"); el.className="nasch-marker";
    el.style.background=categoryColors[art.kategorie] || art.farbe;
    el.title=`${art.name} · ${item.ort}`;
    const marker=new maplibregl.Marker({element:el,anchor:"bottom"}).setLngLat([pos.lng,pos.lat]).addTo(naschMap);
    marker.getElement().onclick=()=>openNaschMapCard(item.id); naschMarkers.push({id:item.id,marker});
  }); updateNaschMarkers();
}

function visibleIds(){ return [...document.querySelectorAll("#nasch-cards .nasch-card")].filter(c=>c.style.display!=="none").map(c=>c.dataset.id); }
function updateNaschMarkers(){ if(!naschMap)return; const ids=visibleIds(); naschMarkers.forEach(x=>x.marker.getElement().style.display=ids.includes(x.id)?"block":"none"); naschLines.forEach(x=>{ if(naschMap.getLayer(x.layerId)) naschMap.setLayoutProperty(x.layerId,"visibility",ids.includes(x.id)?"visible":"none"); }); fitNaschMap(); }
function fitNaschMap(){ if(!naschMap)return; const ids=visibleIds(); const items=(naschorte||[]).filter(x=>ids.includes(x.id)&&hasNaschPosition(x)); if(!items.length)return; const b=new maplibregl.LngLatBounds(); items.forEach(x=>{
  const punkte = x.typ === "strecke" && Array.isArray(x.koordinaten)
    ? x.koordinaten
    : (Array.isArray(x.strecke) ? x.strecke : null);
  if(punkte && punkte.length){
    punkte.forEach(p=>b.extend([p.lng,p.lat]));
  } else {
    const p=getStartKoordinaten(x);
    b.extend([p.lng,p.lat]);
  }
}); naschMap.fitBounds(b,{padding:60,maxZoom:14}); }
function openNaschMapCard(id){ const src=document.querySelector(`.nasch-card[data-id="${id}"]`), overlay=document.getElementById("nasch-map-card-overlay"), content=document.getElementById("nasch-map-card-content"); if(!src)return; content.innerHTML=""; const clone=src.cloneNode(true); clone.style.display="flex"; content.appendChild(clone); overlay.classList.add("open"); }
function closeNaschMapCard(){ document.getElementById("nasch-map-card-overlay").classList.remove("open"); }
window.addEventListener("load",renderNaschorte);
