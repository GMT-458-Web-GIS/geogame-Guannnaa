/* GeoKahoot — script.js
   Features included:
   - Setup (1-4 players, difficulty, time)
   - Game page (map + sidebar)
   - Load geojson from geojson/turkiye.geojson or /mnt/data/turkiye.geojson or user file
   - Turf.js point-in-polygon using properties.AD -> "Name-PLAKA"
   - Scoring: base + combo + speed; skip penalty; lives; multiplayer sequential turns
   - Leaderboard via localStorage
*/

let map, provincesLayer = null, provincesGeo = null;
let markerLayer = null;
let allProvinceNames = []; // cleaned names from properties.AD
let currentQuestion = null;
let currentPlayerIndex = 0;
let players = [];
let mode = "easy";
// cultural questions embedded directly to avoid fetch issues (provinceName -> hintText)
let culturalQuestions = {
  "Adana": "Çukurova'nın merkezi; kebabı, tarihi Taşköprü ve verimli tarım arazileriyle ünlüdür.",
  "Adıyaman": "Nemrut Dağı'ndaki devasa heykeller ve antik kalıntılarıyla bilinir.",
  "Afyonkarahisar": "Tarihi kalesi, termal kaynakları ve kaymaklı lokumuyla tanınır.",
  "Ağrı": "Türkiye'nin en yüksek dağı olan Ağrı Dağı (Ararat) yakınlarında yer alır.",
  "Amasya": "Yeşilırmak kıyısında yer alan Osmanlı sultanlarının portreleri ve tarihi evleri ile meşhurdur.",
  "Ankara": "Türkiye'nin başkenti; Anıtkabir ve Cumhuriyet dönemi müzeleriyle siyasi ve kültürel merkezdir.",
  "Antalya": "Akdeniz sahilleri, antik kentleri (Perge, Aspendos) ve turistik plajlarıyla bilinir.",
  "Artvin": "Yeşil doğası, yaylaları ve geleneksel kültürü ile Karadeniz'in en bakir bölgelerindendir.",
  "Aydın": "Kuşadası ve antik şehirler (Milet, Didyma) yakınlarında bulunan Ege ili.",
  "Balıkesir": "Kazdağları ve Ege ile Marmara kıyılarına erişimi olan zengin bir coğrafyaya sahiptir.",
  "Bilecik": "Osmanlı'nın kuruluş dönemiyle ilişkili tarihi yerleri ve doğal güzellikleri vardır.",
  "Bingöl": "Doğal yaylaları ve dağlık arazisiyle bilinir; geleneksel yayla kültürü güçlüdür.",
  "Bitlis": "Tarihi Bitlis evleri ve Nemrut Krater Gölü çevresiyle dikkat çeker.",
  "Bolu": "Abant ve Yedigöller gibi tabiat parkları, ormanları ve yaylalarıyla ünlüdür.",
  "Burdur": "Burdur Gölü ve çevresindeki arkeolojik sit alanları ile bilinir.",
  "Bursa": "Osmanlı'nın erken başkentlerinden; Uludağ, tarihî çarşıları ve İskender kebabı ile tanınır.",
  "Çanakkale": "Tarihi Truva ve Gelibolu yarımadası cepheleriyle, hem antik hem yakın tarih önemi taşır.",
  "Çankırı": "Tuz mağaraları ve tarihi yapılarıyla İç Anadolu'nun taşra kültürünü yansıtır.",
  "Çorum": "Hitit medeniyetine ait birçok kalıntı ve leblebisiyle bilinir.",
  "Denizli": "Pamukkale travertenleri ve antik Hierapolis kenti ile dünya çapında tanınır.",
  "Diyarbakır": "Tarihi surları, zengin kültürel mirası ve özgün mutfağıyla Güneydoğu'nun önemli kentidir.",
  "Edirne": "Osmanlı döneminden kalma Selimiye Camii ve tarihi köprüleriyle kültürel bir merkezdir.",
  "Elazığ": "Hazar Gölü çevresi ve Harput tarihi semti ile tanınır.",
  "Erzincan": "Doğal vadileri, geleneksel el sanatları ve tatlı su kaynakları ile bilinir.",
  "Erzurum": "Kış sporları, çift minareli medrese ve palandöken ile öne çıkar.",
  "Eskişehir": "Porsuk Çayı, modern üniversite yaşamı ve hamamlarıyla genç bir kültüre sahiptir.",
  "Gaziantep": "Baklava ve kebap gibi zengin mutfağı, Zeugma mozaikleri ve gastronomi kültürüyle ünlüdür.",
  "Giresun": "Fındık bahçeleri, Giresun Adası ve Karadeniz kültürüyle bilinir.",
  "Gümüşhane": "Tarihi madenleri, Zigana geçidi ve yayla kültürü ile tanınır.",
  "Hakkari": "Dağlık arazisi ve geleneksel Kürt kültürü ile Güneydoğu'nun yüksek şehirlerinden biridir.",
  "Hatay": "Farklı dinî ve kültürel mirası, Antakya mozaikleri ve zengin mutfağıyla dikkat çeker.",
  "Isparta": "Gülleri ve gül ürünleriyle bilinir; ayrıca Eğirdir Gölü turizmi önemlidir.",
  "Mersin": "Liman kenti ve Tarsus gibi antik kentlere yakınlığı; Akdeniz mutfağı öne çıkar.",
  "İstanbul": "Tarihsel Bizans ve Osmanlı mirası, tarihi yarımada, Boğaz ve kültürel çeşitlilik merkezi.",
  "İzmir": "Ege'nin açık liman kenti; Kordon, İzmir tarihi ve Aegean kültürü ile bilinir.",
  "Kars": "Ani harabeleri, kars kazı ve soğuk iklim kültürü ile özellikle Doğu Anadolu'da önemli bir şehirdir.",
  "Kastamonu": "Tarihi evleri, Ilgaz Dağı ve Karadeniz kültürü ile öne çıkar.",
  "Kayseri": "Tarihi Selçuklu eserleri, mantısı ve tüccar kültürüyle İç Anadolu'nun önemli merkezidir.",
  "Kırklareli": "Trakya'nın sınır illerinden; doğa, bağcılık ve geleneksel köy yaşamı ile bilinir.",
  "Kırşehir": "Ahi kültürü ve tasavvuf geleneği ile tanınır; tarihî eserleri mevcuttur.",
  "Kocaeli": "Sanayi merkezi ve İzmit körfezi çevresindeki deniz kültürüyle bilinir.",
  "Konya": "Mevlana ve Sufi kültürü, tarihi külliyeler ve tahıl üretimiyle öne çıkar.",
  "Kütahya": "Seramik ve çini sanatı ile tanınır; çini atölyeleri kültürel mirastır.",
  "Malatya": "Kayısı üretimi ile ünlü; ayrıca tarihî dokusu ve kültürel etkinlikleri vardır.",
  "Manisa": "Sultaniye üzümü, Spil Dağı ve tarihî uygarlık izleri ile tanınır.",
  "Kahramanmaraş": "Dondurması (Maraş dondurması) ve el sanatlarıyla meşhurdur.",
  "Mardin": "Taş mimarisi, dar sokakları ve farklı kültürlerin buluştuğu tarihi bir şehirdir.",
  "Muğla": "Bodrum, Marmaris gibi tatil merkezleri ve Ege sahil hayatı ile bilinir.",
  "Muş": "Tarihi ve kırsal yapısı, yayla kültürü ve yöresel lezzetleriyle Doğu Anadolu'da yer alır.",
  "Nevşehir": "Kapadokya bölgesinin merkezi; peri bacaları ve yer altı şehirleri ile dünyaca ünlüdür.",
  "Niğde": "Tarihi kalıntılar ve yayla turizmi; tarım kültürü ön plandadır.",
  "Ordu": "Fındık üretimi ve Boztepe ile Karadeniz kıyı kültürünün tipik örneklerindendir.",
  "Rize": "Çay üretimi, yaylaları ve Karadeniz çay-kültürü ile tanınır.",
  "Sakarya": "Sapanca Gölü ve doğal rekreasyon alanları ile hafta sonu turizmi popülerdir.",
  "Samsun": "Kurtuluş Savaşı'nda önemli rolü ve sahil bandı ile bilinir.",
  "Siirt": "Büryan kebabı ve geleneksel el sanatlarıyla tanınan Güneydoğu ilidir.",
  "Sinop": "Karadeniz'in en kuzey ucu; hapishane müzesi ve doğal koyları ile dikkat çeker.",
  "Sivas": "Tarihi medeniyetlerin merkezi, Kongre Merkezi ve aşırı soğuk iklimiyle bilinir.",
  "Tekirdağ": "Şarköy sahilleri, rakı kültürü ve Trakya tarım ürünleriyle tanınır.",
  "Tokat": "Tarihi dokusu, yemek kültürü (zile pekmezi vb.) ve doğal güzellikleri vardır.",
  "Trabzon": "Sümela Manastırı, çay kültürü ve Karadeniz yayla geleneğiyle öne çıkar.",
  "Tunceli": "Munzur Vadisi milli parkı ve Alevi kültür mirası ile bilinir.",
  "Şanlıurfa": "Göbekli Tepe, peygamber geleneği ve zengin mutfağıyla tarihi bir merkezdir.",
  "Uşak": "Halıcılık ve antik Lidya uygarlığı mirasıyla tanınır.",
  "Van": "Van Gölü, tarihi Akdamar Adası kilisesi ve otantik kahvaltı kültürüyle bilinir.",
  "Yozgat": "Orta Anadolu'nun tarihi ve kırsal kültürünü yansıtan bir ildir.",
  "Zonguldak": "Kömür madenciliği geçmişi ve Karadeniz kıyılarıyla bilinir.",
  "Aksaray": "Kapadokya'ya yakınlığı, Ihlara Vadisi ve tarihi dokusuyla tanınır.",
  "Bayburt": "Kalesi ve geleneksel taş mimarisiyle küçük ama tarihî bir ildir.",
  "Karaman": "Yörük ve göçebe kültürüne dair izler, tarihi eserleriyle bilinir.",
  "Kırıkkale": "Savunma sanayi ve iç Anadolu sanayi şehirlerinden biridir.",
  "Batman": "Hasankeyf yakınlığı ve petrol endüstrisi ile bölgesel öneme sahiptir.",
  "Şırnak": "Güneydoğu'nun dağlık yapısı ve zengin yöresel kültürü ile tanınır.",
  "Bartın": "Karadeniz kıyısında ahşap evleri ve Amasra örneği ile turistik bir yöredir.",
  "Ardahan": "Soğuk iklimi, yaylaları ve sınır konumu ile bilinir.",
  "Iğdır": "Doğu'nun nadir ovalarından birine sahiptir; Ağrı Dağı manzarası ile dikkat çeker.",
  "Yalova": "Termal kaynakları ve küçük ölçekli tatil imkanlarıyla öne çıkar.",
  "Karabük": "Safranbolu gibi Osmanlı dönemi mimarisine sahip kasabalarla ünlüdür.",
  "Kilis": "Gaziantep'e yakın; yöresel yemekleri ve tarihî dokusuyla bilinir.",
  "Osmaniye": "Ceyhan havzası ve tarihî kalıntılarıyla Akdeniz-Kuzeydoğu geçiş bölgesindedir.",
  "Düzce": "Doğal parkları, derenin kenarındaki yerleşimleri ve yeni yerleşim alanlarıyla tanınır"
};
let defaultTimePerPlayer = 60;
let timerInterval = null;
let timeLeft = 0;
let score = 0;
let lives = 3;
let combo = 0;
let lastQuestionTime = 0;

// DOM refs
const el = id => document.getElementById(id);
const evtLog = txt => {
  const ul = el('events');
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleTimeString()} — ${txt}`;
  ul.prepend(li);
};

// Setup UI
function updatePlayerInputs(){
  const count = parseInt(el('playerCount').value);
  const div = el('playerNames');
  div.innerHTML = '';
  for(let i=1;i<=count;i++){
    const wrap = document.createElement('div');
    wrap.className = 'player-input';
    wrap.innerHTML = `<label>Oyuncu ${i} Adı: <input id="player${i}Name" placeholder="Oyuncu ${i}"/></label>`;
    div.appendChild(wrap);
  }
}
el('playerCount').addEventListener('change', updatePlayerInputs);
updatePlayerInputs();

// GeoJSON load removed — button deleted from UI
// file input disabled — do not attach change handler

// Start game from setup
el('startBtn').addEventListener('click', ()=>{
  startFromSetup();
});

function startFromSetup(){
  // players
  players = [];
  const count = parseInt(el('playerCount').value);
  for(let i=1;i<=count;i++){
    const name = (document.getElementById(`player${i}Name`)?.value || `Oyuncu ${i}`).trim() || `Oyuncu ${i}`;
    players.push({name, score:0, time:0});
  }
  mode = el('difficulty').value;
  defaultTimePerPlayer = parseInt(el('timePerPlayer').value) || 60;
  // hide setup, show game
  document.getElementById('setupPage').style.display = 'none';
  document.getElementById('gamePage').style.display = 'flex';
  // init map (do not try to load any GeoJSON)
  initMap();
  // setup first player
  currentPlayerIndex = 0;
  setupPlayerTurn(currentPlayerIndex);
  startTurn();
  renderLeaders();
}

function initMap(){
  if(map) return;
  map = L.map('map').setView([39,35],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18}).addTo(map);
  // layer to hold temporary markers for guesses/targets; cleared each question
  markerLayer = L.layerGroup().addTo(map);
  map.on('click', onMapClick);
}

// try to fetch default geojson paths
function tryLoadDefaultGeoJSON(){
  const candidates = [
    'geojson/turkiye.geojson',
    '/mnt/data/turkiye.geojson'
  ];
  (async ()=>{
    for(const url of candidates){
      try {
        const resp = await fetch(url);
        if(!resp.ok) throw new Error('not found');
        const gj = await resp.json();
        handleLoadedGeoJSON(gj);
        evtLog('GeoJSON yüklendi: '+url);
        return;
      } catch(e){}
    }
    evtLog('Varsayılan GeoJSON bulunamadı; merkez noktası uzaklık kontrolleri kullanılıyor.');
  })();
}

// handle loaded geojson: add to map & parse names
function handleLoadedGeoJSON(gj){
  provincesGeo = gj;
  if(provincesLayer) provincesLayer.remove();
  provincesLayer = L.geoJSON(gj, {
    style: {color:'#0077ff', weight:1, fillOpacity:0.06}
  }).addTo(map);
  // extract names from properties.AD (split '-')
  allProvinceNames = [];
  if(gj && Array.isArray(gj.features)){
    gj.features.forEach(f=>{
      const ad = f.properties?.AD || f.properties?.name || f.properties?.NAME || '';
      let cname = ad;
      if(typeof ad === 'string' && ad.includes('-')) cname = ad.split('-')[0].trim();
      if(cname) allProvinceNames.push(cname);
    });
  }
  if(allProvinceNames.length>0) evtLog(allProvinceNames.length+' il GeoJSON\'da bulundu.');
  // fit bounds
  try { map.fitBounds(provincesLayer.getBounds(), {padding:[20,20]}); } catch(e){}
}

// Question generation
function pickRandomProvinceName(){
  if(mode === 'easy') return pickRandomProvinceNameEasy();
  if(mode === 'hard'){
    const keys = Object.keys(culturalQuestions);
    if(keys.length>0) return keys[Math.floor(Math.random()*keys.length)];
  }
  if(allProvinceNames.length>0) return allProvinceNames[Math.floor(Math.random()*allProvinceNames.length)];
  // fallback: some hardcoded list
  const fallback = ['İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Kayseri','Samsun','Trabzon','Erzurum','Van','Mersin','Gaziantep','Diyarbakır'];
  return fallback[Math.floor(Math.random()*fallback.length)];
}

// Full plate map for easy mode (province name -> plate number)
const plateMap = {
  'Adana': '01','Adıyaman': '02','Afyonkarahisar': '03','Ağrı': '04','Amasya': '05','Ankara': '06','Antalya': '07','Artvin': '08','Aydın': '09','Balıkesir': '10',
  'Bilecik': '11','Bingöl': '12','Bitlis': '13','Bolu': '14','Burdur': '15','Bursa': '16','Çanakkale': '17','Çankırı': '18','Çorum': '19','Denizli': '20',
  'Diyarbakır': '21','Edirne': '22','Elazığ': '23','Erzincan': '24','Erzurum': '25','Eskişehir': '26','Gaziantep': '27','Giresun': '28','Gümüşhane': '29','Hakkari': '30',
  'Hatay': '31','Isparta': '32','Mersin': '33','İstanbul': '34','İzmir': '35','Kars': '36','Kastamonu': '37','Kayseri': '38','Kırklareli': '39','Kırşehir': '40',
  'Kocaeli': '41','Konya': '42','Kütahya': '43','Malatya': '44','Manisa': '45','Kahramanmaraş': '46','Mardin': '47','Muğla': '48','Muş': '49','Nevşehir': '50',
  'Niğde': '51','Ordu': '52','Rize': '53','Sakarya': '54','Samsun': '55','Siirt': '56','Sinop': '57','Sivas': '58','Tekirdağ': '59','Tokat': '60',
  'Trabzon': '61','Tunceli': '62','Şanlıurfa': '63','Uşak': '64','Van': '65','Yozgat': '66','Zonguldak': '67','Aksaray': '68','Bayburt': '69','Karaman': '70',
  'Kırıkkale': '71','Batman': '72','Şırnak': '73','Bartın': '74','Ardahan': '75','Iğdır': '76','Yalova': '77','Karabük': '78','Kilis': '79','Osmaniye': '80','Düzce': '81'
};

function pickRandomProvinceNameEasy(){
  const keys = Object.keys(plateMap);
  return keys[Math.floor(Math.random()*keys.length)];
}

// Approximate province centroids (lat, lon) used when no GeoJSON
const plateCentroids = {
  'Adana':[36.9914,35.3308],'Adıyaman':[37.7648,38.2763],'Afyonkarahisar':[38.7507,30.5566],'Ağrı':[39.7191,43.0505],'Amasya':[40.6499,35.8353],
  'Ankara':[39.92077,32.85411],'Antalya':[36.88414,30.70563],'Artvin':[41.1827,41.8190],'Aydın':[37.8450,27.8396],'Balıkesir':[39.6484,27.8826],
  'Bilecik':[40.1506,30.0361],'Bingöl':[38.8840,40.4937],'Bitlis':[38.3935,42.1232],'Bolu':[40.5781,31.5788],'Burdur':[37.7203,30.2902],
  'Bursa':[40.1950,29.0600],'Çanakkale':[40.1553,26.4142],'Çankırı':[40.6013,33.6134],'Çorum':[40.5486,34.9537],'Denizli':[37.7765,29.0864],
  'Diyarbakır':[37.9144,40.2306],'Edirne':[41.6771,26.5557],'Elazığ':[38.6741,39.2222],'Erzincan':[39.7485,39.4926],'Erzurum':[39.9088,41.2768],
  'Eskişehir':[39.7767,30.5206],'Gaziantep':[37.0628,37.3795],'Giresun':[40.9128,38.3895],'Gümüşhane':[40.4606,39.4818],'Hakkari':[37.5744,43.7400],
  'Hatay':[36.2021,36.1600],'Isparta':[37.7648,30.5566],'Mersin':[36.8121,34.6415],'İstanbul':[41.0082,28.9784],'İzmir':[38.4237,27.1428],
  'Kars':[40.6013,43.0972],'Kastamonu':[41.3789,33.7750],'Kayseri':[38.7225,35.4875],'Kırklareli':[41.7351,27.2256],'Kırşehir':[39.1425,34.1700],
  'Kocaeli':[40.8533,29.8815],'Konya':[37.8716,32.4847],'Kütahya':[39.4209,29.9833],'Malatya':[38.3552,38.3095],'Manisa':[38.6191,27.4289],
  'Kahramanmaraş':[37.5858,36.9371],'Mardin':[37.3127,40.7350],'Muğla':[37.2153,28.3636],'Muş':[38.7469,41.5061],'Nevşehir':[38.6240,34.7141],
  'Niğde':[37.9667,34.6833],'Ordu':[40.9833,37.8786],'Rize':[41.0201,40.5234],'Sakarya':[40.7760,30.3949],'Samsun':[41.2867,36.33],
  'Siirt':[37.9276,41.9370],'Sinop':[42.0286,35.1533],'Sivas':[39.7483,37.0179],'Tekirdağ':[40.9781,27.5116],'Tokat':[40.3167,36.55],
  'Trabzon':[41.0015,39.7178],'Tunceli':[39.1080,39.5450],'Şanlıurfa':[37.1674,38.7955],'Uşak':[38.6823,29.4082],'Van':[38.5016,43.4165],
  'Yozgat':[39.8200,34.8048],'Zonguldak':[41.4564,31.7987],'Aksaray':[38.3687,34.0276],'Bayburt':[40.2550,40.2247],'Karaman':[37.1810,33.2154],
  'Kırıkkale':[39.8468,33.5153],'Batman':[37.8812,41.1351],'Şırnak':[37.5083,42.4584],'Bartın':[41.5811,32.4611],'Ardahan':[41.1105,42.7022],
  'Iğdır':[39.8880,44.0040],'Yalova':[40.6549,29.2765],'Karabük':[41.2061,32.6204],'Kilis':[36.7167,37.1167],'Osmaniye':[37.0745,36.2433],'Düzce':[40.8438,31.1565]
};

function makeHintForProvince(name){
  // simple hint generator: use plate if present in geojson, else random type
  if(provincesGeo){
    const feature = provincesGeo.features.find(f => {
      const ad = f.properties?.AD || '';
      const pname = (typeof ad==='string' && ad.includes('-')) ? ad.split('-')[0].trim() : ad;
      return pname && pname.toLowerCase() === name.toLowerCase();
    });
    if(feature){
      const plate = feature.properties?.IL || '';
      const region = feature.properties?.BOLGE || feature.properties?.bolge || feature.properties?.REGION || '';
      const famous = feature.properties?.FAMOUS || feature.properties?.UNLU || '';
      const neighbors = feature.properties?.NEIGH || '';
      // build a few hints
      const hints = [];
      if(plate) hints.push(`Plaka: ${plate}`);
      if(region) hints.push(`Bölge: ${region}`);
      if(famous) hints.push(`Meşhur: ${famous}`);
      if(neighbors) hints.push(`Komşu örneği: ${neighbors}`);
      if(hints.length>0) return hints[Math.floor(Math.random()*hints.length)];
    }
  }
  // fallback hints
  const generic = [
    'Bu il Türkiye\'dedir.',
    'Bu bir il merkezidir.',
    'Yerel mutfağı veya ünlü yerleriyle tanınır.',
    'Türkiye\'nin daha büyük illerinden biridir.'
  ];
  return generic[Math.floor(Math.random()*generic.length)];
}

function newQuestion(){
  // Easy mode: show plate number and ask player to click on the map near that province
  if(mode === 'easy'){
    currentQuestion = pickRandomProvinceNameEasy();
    const plate = plateMap[currentQuestion];
    el('hintText').innerText = `Plaka: ${plate} — haritada bu ili seçin.`;
    lastQuestionTime = Date.now();
    el('skipBtn').disabled = false;
    evtLog(`Soru: Plaka ${plate} (hedef il gizli)`);
    // don't prompt — wait for map click
    if(markerLayer) markerLayer.clearLayers();
    return;
  }

  // HARD mode: show cultural hint (from loaded dataset) if available, else fallback hint
  currentQuestion = pickRandomProvinceName();
  if(mode==='hard'){
    const hint = culturalQuestions[currentQuestion] || makeHintForProvince(currentQuestion);
    el('hintText').innerText = hint;
  } else {
    el('hintText').innerText = makeHintForProvince(currentQuestion);
  }
  lastQuestionTime = Date.now();
  el('skipBtn').disabled = false;
}
// (removed prompt-based easy-mode helper) waiting for map click for easy-mode answers

// Map click handler: determine clicked province and compare to currentQuestion
function onMapClick(e){
  if(!currentQuestion) return;
  const latlng = e.latlng;
  // EASY MODE: compare click to province centroid (plate-based question)
  if(mode === 'easy'){
    const targetName = currentQuestion;
    let target = plateCentroids[targetName];
    let tLat, tLon;
    if(target && target.length===2){ tLat = target[0]; tLon = target[1]; }
    else if(provincesGeo && provincesGeo.features && provincesGeo.features.length>0){
      // fallback: try to find feature by name
      const f = provincesGeo.features.find(fe=>{
        const ad = fe.properties?.AD || fe.properties?.name || fe.properties?.NAME || '';
        const pname = typeof ad==='string' && ad.includes('-') ? ad.split('-')[0].trim() : ad;
        return pname && pname.toLowerCase() === targetName.toLowerCase();
      });
      if(f){ try{ const c = turf.centroid(f).geometry.coordinates; tLat = c[1]; tLon = c[0]; }catch(e){} }
    }
    if(!tLat || !tLon){ evtLog('Hedef il için koordinat bulunamadı.'); processWrong(null); return; }

    const dist = haversineKm(latlng.lat, latlng.lng, tLat, tLon);
    // show clicked marker and target marker (clear previous markers first)
    if(markerLayer) markerLayer.clearLayers();
    L.marker([latlng.lat, latlng.lng]).addTo(markerLayer).bindPopup(`Tıklanan yer — ${dist.toFixed(1)} km`).openPopup();
    L.marker([tLat, tLon]).addTo(markerLayer).bindPopup(`${targetName} (hedef)`).openPopup();

    // scoring tiers (closer = more points)
    let gained = 0;
    if(dist <= 20) gained = 20;
    else if(dist <= 60) gained = 10;
    else if(dist <= 150) gained = 5;

    if(gained > 0){
      players[currentPlayerIndex].score = (players[currentPlayerIndex].score || 0) + gained;
      el('score').innerText = players[currentPlayerIndex].score;
      evtLog(`✅ ${players[currentPlayerIndex].name} ${dist.toFixed(1)}km uzaklıktan tıkladı — +${gained} puan (hedef: ${targetName})`);
      setTimeout(()=> newQuestion(), 700);
    } else {
      // too far -> lose a life
      players[currentPlayerIndex].lives = (players[currentPlayerIndex].lives===undefined? (mode==='hard'?2:3) : players[currentPlayerIndex].lives) - 1;
      el('lives').innerText = players[currentPlayerIndex].lives;
      evtLog(`❌ Çok uzak (${dist.toFixed(1)} km) — Kalan canlar: ${players[currentPlayerIndex].lives}`);
      if(players[currentPlayerIndex].lives <= 0) endTurnOrGame();
      else setTimeout(()=> newQuestion(), 700);
    }
    return;
  }
  // NON-EASY MODE: use plateCentroids (no GeoJSON) — find nearest province centroid
  // compute nearest centroid from plateCentroids
  let best = {name:null, dist:99999, lat:0, lon:0};
  for(const [name, coord] of Object.entries(plateCentroids)){
    if(!coord || coord.length<2) continue;
    const d = haversineKm(latlng.lat, latlng.lng, coord[0], coord[1]);
    if(d < best.dist){ best = {name:name, dist:d, lat:coord[0], lon:coord[1]}; }
  }

  if(!best.name){
    processWrong(null);
    return;
  }

  // show feedback markers
  if(markerLayer) markerLayer.clearLayers();
  L.marker([latlng.lat, latlng.lng]).addTo(markerLayer).bindPopup(`Tıklanan yer — ${best.dist.toFixed(1)} km`).openPopup();
  L.marker([best.lat, best.lon]).addTo(markerLayer).bindPopup(`${best.name} (en yakın)`).openPopup();

  // threshold depends on difficulty
  const threshold = (mode==='hard'?25:40);
  if(best.dist <= threshold){
    // consider correct
    processAnswer(best.name, false, best.dist);
  } else {
    processWrong(best.dist);
  }
  return;
}

function processAnswer(foundName, viaPolygon=false, distKm=0){
  // normalize compare
  const a = (foundName||'').toString().trim().toLowerCase();
  const b = (currentQuestion||'').toString().trim().toLowerCase();
  if(a === b){
    // correct
    combo += 1;
    const base = 10;
    let comboBonus = 0;
    if(combo>=3) comboBonus = 5;
    if(combo>=5) comboBonus = 20;
    // speed bonus
    const elapsed = (Date.now()-lastQuestionTime)/1000;
    let speedBonus = 0;
    if(elapsed<=3) speedBonus = 10;
    else if(elapsed<=8) speedBonus = 5;
    // dist bonus if centroid
    let distBonus = 0;
    if(!viaPolygon && distKm){
      if(distKm<=5) distBonus = 10;
      else if(distKm<=20) distBonus = 5;
    }
    const gained = base + comboBonus + speedBonus + distBonus;
    players[currentPlayerIndex].score += gained;
    el('score').innerText = players[currentPlayerIndex].score;
    evtLog(`✅ Doğru: ${foundName} +${gained}puan (combo:${combo}, hız:${Math.round(elapsed)}s${distKm?`, uzaklık:${distKm.toFixed(1)}km`:''})`);
    // show marker (use markerLayer so we can clear later)
    if(markerLayer) markerLayer.clearLayers();
    L.marker([latFromName(foundName), lonFromName(foundName)]).addTo(markerLayer || map).bindPopup(foundName).openPopup();
    // next question after small delay
    setTimeout(()=> newQuestion(), 700);
  } else {
    processWrong(distKm);
  }
}

function processWrong(dist){
  combo = 0;
  const penaltyLives = (mode==='hard'?2:1);
  players[currentPlayerIndex].time = players[currentPlayerIndex].time || 0;
  // decrease lives
  players[currentPlayerIndex].lives = (players[currentPlayerIndex].lives===undefined? (mode==='hard'?2:3) : players[currentPlayerIndex].lives);
  players[currentPlayerIndex].lives -= penaltyLives;
  el('lives').innerText = players[currentPlayerIndex].lives;
  players[currentPlayerIndex].score = players[currentPlayerIndex].score || 0;
  evtLog(`❌ Yanlış cevap. Kalan canlar: ${players[currentPlayerIndex].lives}`);
  if(players[currentPlayerIndex].lives <= 0){
    endTurnOrGame();
  } else {
    // show correct province briefly if available
    if(dist) evtLog(`En yakın merkez noktasına uzaklık: ${dist.toFixed(1)} km`);
  }
}

// helpers to map name->approx coords from geojson (centroid) or fallback table
function latFromName(name){
  // prefer plateCentroids if available
  const pc = plateCentroids[name];
  if(pc && pc.length===2) return pc[0];
  if(provincesGeo){
    const f = provincesGeo.features.find(fe=>{
      const ad = fe.properties?.AD || fe.properties?.name || fe.properties?.NAME || '';
      const pname = typeof ad==='string' && ad.includes('-') ? ad.split('-')[0].trim() : ad;
      return pname && pname.toLowerCase() === name.toLowerCase();
    });
    if(f){
      try{ const c = turf.centroid(f).geometry.coordinates; return c[1]; }catch(e){}
    }
  }
  return 39.0;
}
function lonFromName(name){
  const pc = plateCentroids[name];
  if(pc && pc.length===2) return pc[1];
  if(provincesGeo){
    const f = provincesGeo.features.find(fe=>{
      const ad = fe.properties?.AD || fe.properties?.name || fe.properties?.NAME || '';
      const pname = typeof ad==='string' && ad.includes('-') ? ad.split('-')[0].trim() : ad;
      return pname && pname.toLowerCase() === name.toLowerCase();
    });
    if(f){
      try{ const c = turf.centroid(f).geometry.coordinates; return c[0]; }catch(e){}
    }
  }
  return 35.0;
}

function haversineKm(lat1, lon1, lat2, lon2){
  const R=6371; const toRad=d=>d*Math.PI/180;
  const dLat=toRad(lat2-lat1); const dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return R*c;
}

// Turn control
function setupPlayerTurn(idx){
  const p = players[idx];
  // initialize per-player fields
  p.score = p.score || 0;
  p.time = 0;
  p.lives = (mode==='hard'?2:3);
  el('turnTitle').innerText = `Sıra: ${p.name}`;
  el('score').innerText = p.score;
  el('lives').innerText = p.lives;
  el('events').innerHTML = '';
  el('endActions').style.display = 'none';
  el('resultText').innerText = '';
  el('saveName').value = '';
}

function startTurn(){
  // start timer and question loop
  score = players[currentPlayerIndex].score || 0;
  el('score').innerText = score;
  el('lives').innerText = players[currentPlayerIndex].lives;
  timeLeft = defaultTimePerPlayer;
  el('timer').innerText = timeLeft;
  newQuestion();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timeLeft--;
    el('timer').innerText = timeLeft;
    players[currentPlayerIndex].time += 1;
    if(timeLeft<=0) endTurnOrGame();
  },1000);
  el('skipBtn').disabled = false;
  el('finishTurnBtn').disabled = false;
}

function endTurnOrGame(){
  if(timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  el('skipBtn').disabled = true;
  el('finishTurnBtn').disabled = true;
  evtLog(`🛑 ${players[currentPlayerIndex].name} sırası bitti. Skor: ${players[currentPlayerIndex].score}`);
  // advance if sequential multiplayer
  if(currentPlayerIndex < players.length-1){
    currentPlayerIndex++;
    setTimeout(()=>{
      setupPlayerTurn(currentPlayerIndex);
      startTurn();
    },800);
  } else {
    // all players done -> show result
    showMatchResult();
  }
}

el('skipBtn').addEventListener('click', ()=>{
  const p = players[currentPlayerIndex];
  p.score = Math.max(0, (p.score||0) - 2);
  // ensure lives initialized
  p.lives = (p.lives === undefined ? (mode==='hard' ? 2 : 3) : p.lives) - 1;
  el('score').innerText = p.score;
  el('lives').innerText = p.lives;
  evtLog(`⏭️ Soru atlandı (-2 skor, -1 can).`);
  if(p.lives <= 0){
    endTurnOrGame();
  } else {
    newQuestion();
  }
});

el('finishTurnBtn').addEventListener('click', ()=>{
  // immediate end of this player's turn
  players[currentPlayerIndex].lives = 0;
  endTurnOrGame();
});

function showMatchResult(){
  // compute winner or top score
  let best = players[0];
  for(const p of players) if(p.score > best.score) best = p;
  const msg = players.length>1 ? `Kazanan: ${best.name} (${best.score})` : `Sizin skorunuz: ${best.score}`;
  el('hintText').innerText = 'Oyun bitti.';
  el('resultText').innerText = msg;
  el('endActions').style.display = 'block';
  evtLog(`🏁 Oyun bitti. ${msg}`);

  // Also show a prominent overlay with winner name and score
  try{
    const overlay = document.getElementById('winnerOverlay');
    if(overlay){
      const title = document.getElementById('winnerTitle');
      const text = document.getElementById('winnerText');
      title.innerText = players.length>1 ? 'Maç Kazananı' : 'Sonuç';
      text.innerText = players.length>1 ? `${best.name} — ${best.score} puan` : `Sizin skorunuz: ${best.score} puan`;
      overlay.style.display = 'flex';
      // wire buttons
      document.getElementById('overlayRestartBtn').onclick = ()=> location.reload();
      document.getElementById('overlayCloseBtn').onclick = ()=> { overlay.style.display='none'; };
    } else {
      // fallback to alert
      alert(msg);
    }
  }catch(e){ console.error('Overlay show failed', e); alert(msg); }
}

// Leaderboard localStorage
function loadLeaders(){
  const raw = localStorage.getItem('geokahoot_leaders');
  return raw ? JSON.parse(raw) : [];
}
function saveLeader(name,score){
  if(!name) return alert('Skoru kaydetmek için lütfen bir isim girin.');
  const arr = loadLeaders();
  arr.push({name,score,date:new Date().toISOString()});
  arr.sort((a,b)=>b.score-a.score);
  localStorage.setItem('geokahoot_leaders', JSON.stringify(arr.slice(0,10)));
  renderLeaders();
}
function renderLeaders(){
  const ol = el('leaders'); ol.innerHTML = '';
  const arr = loadLeaders();
  arr.forEach(it=>{
    const li = document.createElement('li');
    li.textContent = `${it.name} — ${it.score}`;
    ol.appendChild(li);
  });
}
el('saveScoreBtn').addEventListener('click', ()=>{
  const name = el('saveName').value.trim() || 'Anon';
  // save best player's score (max)
  const bestScore = Math.max(...players.map(p=>p.score));
  saveLeader(name, bestScore);
});
el('restartBtn').addEventListener('click', ()=>{
  location.reload();
});

// initial leader render
renderLeaders();

// Rules button now navigates to a separate rules page
const rulesBtnEl = el('rulesBtn');
if(rulesBtnEl){
  rulesBtnEl.addEventListener('click', ()=>{ window.location.href = 'rules.html'; });
}

/* Utility:
   If geojson properties don't include coordinates for quick marker,
   latFromName/lonFromName try to use centroid. If centroid not available
   they fallback to default coords.
*/
