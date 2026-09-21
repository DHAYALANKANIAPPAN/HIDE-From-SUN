(function(){
  "use strict";

  /* ---------------- Math & Sun Core Logic ---------------- */
  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;
  const norm360 = d => ((d % 360) + 360) % 360;
  const norm180 = d => { const x = norm360(d); return x > 180 ? x - 360 : x; };

  function haversine(lat1, lon1, lat2, lon2){
    const R = 6371000;
    const p1 = rad(lat1), p2 = rad(lat2);
    const dp = rad(lat2 - lat1), dl = rad(lon2 - lon1);
    const a = Math.sin(dp/2)**2 + Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function initialBearing(lat1, lon1, lat2, lon2){
    const p1 = rad(lat1), p2 = rad(lat2), dl = rad(lon2 - lon1);
    const y = Math.sin(dl) * Math.cos(p2);
    const x = Math.cos(p1)*Math.sin(p2) - Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
    return norm360(deg(Math.atan2(y, x)));
  }

  function sunPosition(date, lat, lon){
    const JD = date.getTime() / 86400000 + 2440587.5;
    const n = JD - 2451545.0;
    const L = norm360(280.460 + 0.9856474 * n);
    const g = norm360(357.528 + 0.9856003 * n);
    const lambda = L + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2*g));
    const epsilon = 23.439 - 0.0000004 * n;

    const alpha = norm360(deg(Math.atan2(Math.cos(rad(epsilon)) * Math.sin(rad(lambda)), Math.cos(rad(lambda)))));
    const deltaRad = Math.asin(Math.sin(rad(epsilon)) * Math.sin(rad(lambda)));

    const gmst = norm360(280.46061837 + 360.98564736629 * n);
    const lst = norm360(gmst + lon);
    const H = norm180(lst - alpha);

    const latRad = rad(lat);
    const sinAlt = Math.sin(latRad)*Math.sin(deltaRad) + Math.cos(latRad)*Math.cos(deltaRad)*Math.cos(rad(H));
    const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    const elevation = deg(altRad);

    const cosAz = (Math.sin(deltaRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(altRad));
    const sinAz = -Math.sin(rad(H)) * Math.cos(deltaRad) / Math.cos(altRad);
    const azimuth = norm360(deg(Math.atan2(sinAz, cosAz)));

    return { azimuth, elevation };
  }

  const TOLERANCE_WINDOWS = { hot: 30, normal: 40, mild: 55 };

  function classifySide(relBearing, elevation, deadzone){
    if (elevation <= 0) return { side: 'none', weight: 0 };
    const abs = Math.abs(relBearing);
    if (abs < deadzone || abs > (180 - deadzone)) return { side: 'none', weight: 0 };
    const weight = Math.sin(rad(abs));
    return { side: relBearing > 0 ? 'right' : 'left', weight };
  }

  function buildSegments(coordsLonLat, totalDurationSec, departureDate, deadzone){
    const dists = [];
    for (let i = 0; i < coordsLonLat.length - 1; i++){
      dists.push(haversine(coordsLonLat[i][1], coordsLonLat[i][0], coordsLonLat[i+1][1], coordsLonLat[i+1][0]));
    }
    const totalDist = dists.reduce((a,b)=>a+b,0) || 1;
    let cum = 0;
    const segments = [];
    for (let i = 0; i < coordsLonLat.length - 1; i++){
      const [lon1, lat1] = coordsLonLat[i];
      const [lon2, lat2] = coordsLonLat[i+1];
      const d = dists[i];
      const bearing = initialBearing(lat1, lon1, lat2, lon2);
      const durSec = totalDurationSec * (d / totalDist);
      const midOffsetSec = (cum + d/2) / totalDist * totalDurationSec;
      const timestamp = new Date(departureDate.getTime() + midOffsetSec * 1000);
      const midLat = (lat1 + lat2) / 2, midLon = (lon1 + lon2) / 2;
      const sun = sunPosition(timestamp, midLat, midLon);
      const relBearing = norm180(sun.azimuth - bearing);
      const cls = classifySide(relBearing, sun.elevation, deadzone);
      segments.push({
        start: [lat1, lon1], end: [lat2, lon2], distance: d, durationSec: durSec,
        bearing, timestamp, sunAzimuth: sun.azimuth, sunElevation: sun.elevation,
        relBearing, side: cls.side, weight: cls.weight
      });
      cum += d;
    }
    return segments;
  }

  function aggregate(segments){
    const agg = { left: 0, right: 0, none: 0, leftScore: 0, rightScore: 0, total: 0 };
    segments.forEach(s => {
      agg.total += s.durationSec;
      if (s.side === 'left'){ agg.left += s.durationSec; agg.leftScore += s.durationSec * s.weight; }
      else if (s.side === 'right'){ agg.right += s.durationSec; agg.rightScore += s.durationSec * s.weight; }
      else agg.none += s.durationSec;
    });
    return agg;
  }

  function mergeRuns(segments){
    const runs = [];
    let offset = 0;
    segments.forEach(s => {
      const last = runs[runs.length - 1];
      if (last && last.side === s.side){
        last.durationSec += s.durationSec;
        last.coords.push(s.end);
      } else {
        runs.push({ side: s.side, durationSec: s.durationSec, startOffsetSec: offset, coords: [s.start, s.end] });
      }
      offset += s.durationSec;
    });
    return runs;
  }

  /* ---------------- Helpers ---------------- */
  function fmtMin(sec){
    const m = Math.round(sec/60);
    if (m < 1) return '<1 min';
    if (m < 60) return m + ' min';
    const h = Math.floor(m/60), rem = m % 60;
    return h + 'h ' + (rem ? rem + 'm' : '');
  }
  function fmtLatLon(lat, lon){ return lat.toFixed(4) + ', ' + lon.toFixed(4); }
  function pad2(n){ return String(n).padStart(2, '0'); }
  function setDateTimeValue(date){
    dateInput.value = date.getFullYear() + '-' + pad2(date.getMonth()+1) + '-' + pad2(date.getDate());
    timeInput.value = pad2(date.getHours()) + ':' + pad2(date.getMinutes());
  }

  // Format full messy addresses into clean 2-line names for lists & inputs
  function formatPlaceName(displayName) {
    const parts = displayName.split(',');
    const main = parts[0] ? parts[0].trim() : '';
    const sub = parts.length > 1 ? parts.slice(1, 3).join(',').trim() : '';
    const short = main + (sub ? ', ' + sub : '');
    return { main, sub, short };
  }

  /* ---------------- Geocoding & Routing ---------------- */
  const HOME_REGION = { name: 'Tamil Nadu, India', lat: 11.1271, lon: 78.6569, viewbox: '76.0,8.0,80.5,13.7' };

  async function geocodeRaw(query, opts){
    const params = new URLSearchParams({ format: 'json', limit: '6', q: query, addressdetails: '0' });
    if (opts && opts.bounded){ params.set('viewbox', HOME_REGION.viewbox); params.set('bounded', '1'); }
    if (opts && opts.countrycodes){ params.set('countrycodes', opts.countrycodes); }
    const url = 'https://nominatim.openstreetmap.org/search?' + params.toString();
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Geocoding service unavailable');
    return res.json();
  }

  async function geocode(query){
    // 1) try biased to the home region first — best for local place names
    let results = [];
    try { results = await geocodeRaw(query, { bounded: true, countrycodes: 'in' }); } catch(e){}
    if (results && results.length) return results;
    // 2) fall back to an unrestricted global search (covers any other trip)
    return geocodeRaw(query, {});
  }

  async function reverseGeocode(lat, lon){
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Reverse geocoding unavailable');
    const data = await res.json();
    return (data && data.display_name) ? data.display_name : fmtLatLon(lat, lon);
  }

  async function searchNearby(term){
    // Force instant zoom if too far out so getBounds() is accurate immediately
    if (map.getZoom() < 12) {
      map.setZoom(13, { animate: false });
    }
    const b = map.getBounds();
    const viewbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
    // Exactly matching original logic: limit 8, bounded 1
    const params = new URLSearchParams({ format: 'json', q: term, viewbox, bounded: '1', limit: '8' });
    const url = 'https://nominatim.openstreetmap.org/search?' + params.toString();
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('unavailable');
    return res.json();
  }

  async function fetchRoutes(origin, destination){
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?alternatives=true&overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Routing service unavailable');
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || !data.routes.length) throw new Error('No route found');
    return data.routes;
  }

  /* ---------------- App State & DOM ---------------- */
  const state = {
    origin: null, destination: null, departure: null, mode: 'bus',
    routes: [], activeRouteIndex: 0, deadzone: 40, layout: 'unknown'
  };

  const $ = id => document.getElementById(id);
  const fromInput = $('from-input'), toInput = $('to-input');
  const fromSuggest = $('from-suggest'), toSuggest = $('to-suggest');
  const dateInput = $('date-input'), timeInput = $('time-input'), modeInput = $('mode-input');
  
  const formView = $('form-view');
  const loadingView = $('loading-view');
  const resultsView = $('results-view');
  const errorBanner = $('error-banner');
  const form = $('trip-form');

  // Initialize Default Time
  setDateTimeValue(new Date());

  /* ---------------- Map Initialization & Interaction ---------------- */
  let map = null, mapLayers = [];
  let fromMarker = null, toMarker = null;
  let pickingTarget = null; // 'from' or 'to'
  let nearbyMarkers = [];

  function initMap() {
    // attributionControl: false removes the text from the map entirely. 
    // Use Esri World Street Map tiles - 100% free, highly reliable, no API key required, and won't get 403 blocked.
    map = L.map('map-container', { zoomControl: false, attributionControl: false }).setView([11.1271, 78.6569], 7); 
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Map click handling for Picking locations
    map.on('click', async (e) => {
      if (!pickingTarget) return; // Ignore clicks if not actively picking
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      
      const targetInput = pickingTarget === 'from' ? fromInput : toInput;
      targetInput.value = 'Locating...';
      
      if (pickingTarget === 'from') { state.origin = { lat, lon }; }
      else { state.destination = { lat, lon }; }
      
      updateMapMarkers();
      
      // Reset picking mode
      const oldTarget = pickingTarget;
      pickingTarget = null;
      document.body.style.cursor = '';
      $(`pick-${oldTarget}-btn`).style.fontWeight = 'normal';
      $(`pick-${oldTarget}-btn`).textContent = '📍 Pick on map';

      try {
        const rawLabel = await reverseGeocode(lat, lon);
        const { short } = formatPlaceName(rawLabel);
        targetInput.value = short; // Use cleaner, shorter name
      } catch (err) {
        targetInput.value = fmtLatLon(lat, lon);
      }
    });
  }
  initMap();

  function updateMapMarkers() {
    if (fromMarker) { map.removeLayer(fromMarker); fromMarker = null; }
    if (toMarker) { map.removeLayer(toMarker); toMarker = null; }

    const bounds = [];
    if (state.origin) {
      fromMarker = L.circleMarker([state.origin.lat, state.origin.lon], { color: '#171a23', fillColor: '#171a23', fillOpacity: 1, radius: 6 }).addTo(map);
      bounds.push([state.origin.lat, state.origin.lon]);
    }
    if (state.destination) {
      toMarker = L.circleMarker([state.destination.lat, state.destination.lon], { color: '#e4572e', fillColor: '#e4572e', fillOpacity: 1, radius: 6 }).addTo(map);
      bounds.push([state.destination.lat, state.destination.lon]);
    }
    
    if (bounds.length > 0) {
      if (bounds.length === 1) map.flyTo(bounds[0], 12);
      else map.fitBounds(bounds, { padding: [50, 50], paddingTopLeft: [450, 50] }); // Offset for sidebar
    }
  }

  function togglePickingMode(target) {
    if (pickingTarget === target) {
      // cancel
      pickingTarget = null;
      document.body.style.cursor = '';
      $(`pick-${target}-btn`).style.fontWeight = 'normal';
      $(`pick-${target}-btn`).textContent = '📍 Pick on map';
    } else {
      // start picking
      if (pickingTarget) {
        // disable previous
        $(`pick-${pickingTarget}-btn`).style.fontWeight = 'normal';
        $(`pick-${pickingTarget}-btn`).textContent = '📍 Pick on map';
      }
      pickingTarget = target;
      document.body.style.cursor = 'crosshair';
      $(`pick-${target}-btn`).style.fontWeight = 'bold';
      $(`pick-${target}-btn`).textContent = '📍 Tap map to select';
      showError(`Tap anywhere on the map to set your ${target} location.`);
      setTimeout(clearError, 4000);
    }
  }

  $('pick-from-btn').addEventListener('click', () => togglePickingMode('from'));
  $('pick-to-btn').addEventListener('click', () => togglePickingMode('to'));

  /* ---------------- Nearby Bus Stands ---------------- */
  async function handleBusStandSearch(target) {
    const btn = $(`bus-${target}-btn`);
    const listContainer = $(`${target}-bus-list`);
    const targetInput = target === 'from' ? fromInput : toInput;
    
    btn.textContent = 'Searching...';
    listContainer.classList.remove('hidden');
    listContainer.innerHTML = '<div class="nl-status">Looking for bus stands in this map view...</div>';

    // clear old markers
    nearbyMarkers.forEach(m => map.removeLayer(m));
    nearbyMarkers = [];

    try {
      const results = await searchNearby('bus stand');
      if (!results.length) {
        listContainer.innerHTML = '<div class="nl-status">No bus stands found in this view. Pan or zoom the map and try again.</div>';
      } else {
        listContainer.innerHTML = '';
        results.forEach(r => {
          const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
          const { main, sub, short } = formatPlaceName(r.display_name);
          
          // Drop marker on the map
          const marker = L.circleMarker([lat, lon], { radius: 7, color: '#d98a1f', fillColor: '#f2a93b', fillOpacity: 0.9, weight: 2 }).addTo(map);
          marker.bindTooltip(main, { direction: 'top' }); // Only show the main name on the map tooltip
          nearbyMarkers.push(marker);

          // Create beautifully formatted button in the list
          const b = document.createElement('button');
          b.type = 'button';
          b.innerHTML = `<strong>🚌 ${main}</strong><br><span style="font-size:0.75rem; color:#666; font-weight:normal;">${sub}</span>`;
          b.addEventListener('click', () => {
            targetInput.value = short;
            if (target === 'from') state.origin = { lat, lon };
            else state.destination = { lat, lon };
            
            updateMapMarkers();
            listContainer.classList.add('hidden');
          });
          
          // Let the marker also trigger the same logic if clicked on the map directly
          marker.on('click', () => b.click());
          listContainer.appendChild(b);
        });
        clearError();
      }
    } catch(err) {
      listContainer.innerHTML = '<div class="nl-status">Failed to fetch nearby bus stands. Check network connection.</div>';
    } finally {
      btn.textContent = '🚌 Nearby bus stands';
    }
  }

  $('bus-from-btn').addEventListener('click', () => handleBusStandSearch('from'));
  $('bus-to-btn').addEventListener('click', () => handleBusStandSearch('to'));

  /* ---------------- Autocomplete & Inputs ---------------- */
  function wireAutocomplete(input, box, onPick){
    let debounceTimer = null;
    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (debounceTimer) clearTimeout(debounceTimer);
      if (q.length < 3){ box.hidden = true; box.innerHTML=''; return; }
      box.innerHTML = '<div class="ac-status">Searching…</div>';
      box.hidden = false;
      debounceTimer = setTimeout(async () => {
        try {
          const results = await geocode(q);
          if (input.value.trim() !== q) return; 
          if (!results.length){ box.innerHTML = '<div class="ac-status">No matches. Use "Pick on map" instead.</div>'; return; }
          box.innerHTML = '';
          results.forEach(r => {
            const { main, sub, short } = formatPlaceName(r.display_name);
            const b = document.createElement('button');
            b.type = 'button';
            // Use the same clean format for Autocomplete dropdowns
            b.innerHTML = `<strong>${main}</strong><br><span style="font-size:0.75rem; color:#666; font-weight:normal;">${sub}</span>`;
            b.addEventListener('click', () => {
              input.value = short;
              onPick({ lat: parseFloat(r.lat), lon: parseFloat(r.lon) });
              box.hidden = true;
            });
            box.appendChild(b);
          });
          box.hidden = false;
        } catch(e) {
          box.innerHTML = '<div class="ac-status">Search unavailable. Use map picker.</div>';
        }
      }, 400);
    });
    input.addEventListener('focus', () => { if (box.innerHTML && box.innerHTML !== '') box.hidden = false; });
    document.addEventListener('click', (e) => {
      if (!box.contains(e.target) && e.target !== input) box.hidden = true;
    });
  }

  wireAutocomplete(fromInput, fromSuggest, c => { state.origin = c; updateMapMarkers(); });
  wireAutocomplete(toInput, toSuggest, c => { state.destination = c; updateMapMarkers(); });

  $('swap-btn').addEventListener('click', () => {
    [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
    [state.origin, state.destination] = [state.destination, state.origin];
    updateMapMarkers();
  });

  /* ---------------- View Management ---------------- */
  function transitionTo(showEl, hideEls) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        hideEls.forEach(el => el.classList.add('hidden'));
        showEl.classList.remove('hidden');
      });
    } else {
      hideEls.forEach(el => el.classList.add('hidden'));
      showEl.classList.remove('hidden');
    }
  }

  $('back-btn').addEventListener('click', () => {
    transitionTo(formView, [resultsView, loadingView]);
    mapLayers.forEach(l => map.removeLayer(l));
    mapLayers = [];
    updateMapMarkers();
  });

  function showError(msg){
    errorBanner.textContent = msg;
    errorBanner.classList.add('show');
  }
  function clearError(){ errorBanner.classList.remove('show'); errorBanner.textContent=''; }

  /* ---------------- Form Submission ---------------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    
    if (!state.origin){
      try { const r = await geocode(fromInput.value.trim()); if (r.length) state.origin = { lat: parseFloat(r[0].lat), lon: parseFloat(r[0].lon) }; }
      catch(_){}
    }
    if (!state.destination){
      try { const r = await geocode(toInput.value.trim()); if (r.length) state.destination = { lat: parseFloat(r[0].lat), lon: parseFloat(r[0].lon) }; }
      catch(_){}
    }
    
    if (!state.origin || !state.destination){
      showError('Could not locate one of those places. Please select from the dropdown or pick on the map.');
      return;
    }

    const [y,m,d] = dateInput.value.split('-').map(Number);
    const [hh,mm] = timeInput.value.split(':').map(Number);
    state.departure = new Date(y, m-1, d, hh, mm, 0, 0);
    state.mode = modeInput.value;
    state.deadzone = TOLERANCE_WINDOWS[$('pref-select').value];

    transitionTo(loadingView, [formView, resultsView]);

    try {
      const rawRoutes = await fetchRoutes(state.origin, state.destination);
      state.routes = rawRoutes.map(r => {
        const coords = r.geometry.coordinates; // [lon,lat]
        const segments = buildSegments(coords, r.duration, state.departure, state.deadzone);
        const agg = aggregate(segments);
        const runs = mergeRuns(segments);
        return { geometry: coords, distance: r.distance, duration: r.duration, segments, runs, aggregate: agg };
      });
      state.activeRouteIndex = 0;
      
      renderRouteCards();
      renderDetail(0);
      
      transitionTo(resultsView, [formView, loadingView]);
    } catch(err){
      showError(err.message || 'Error finding route.');
      transitionTo(formView, [loadingView, resultsView]);
    }
  });

  /* ---------------- Rendering ---------------- */
  function verdictText(agg){
    if (agg.left < 1 && agg.right < 1) return { side: 'none', text: 'No significant sun expected.' };
    if (Math.abs(agg.left - agg.right) < 60) return { side: 'either', text: 'Both sides get similar sun.' };
    const better = agg.left < agg.right ? 'left' : 'right';
    return { side: better, text: `Sit on the ${better}` };
  }

  function renderRouteCards(){
    const routeGrid = $('route-grid');
    routeGrid.innerHTML = '';

    state.routes.forEach((route, idx) => {
      const agg = route.aggregate;
      const total = agg.total || 1;
      const card = document.createElement('div');
      card.className = 'route-card' + (idx === state.activeRouteIndex ? ' active' : '');
      const v = verdictText(agg);
      card.innerHTML = `
        <div class="rtitle">Route ${idx+1}${idx===0 ? ' (fastest)' : ''}</div>
        <div class="rmeta">${fmtMin(route.duration)} · ${(route.distance/1000).toFixed(0)} km</div>
        <div class="side-bar">
          <span class="l" style="width:${(agg.left/total*100).toFixed(1)}%"></span>
          <span class="r" style="width:${(agg.right/total*100).toFixed(1)}%"></span>
        </div>
        <div class="verdict">
          ${v.side === 'none' ? '<span class="pill none">no sun</span> ' : ''}
          ${v.side === 'left' ? '<span class="pill left">left</span> ' : ''}
          ${v.side === 'right' ? '<span class="pill right">right</span> ' : ''}
          <span>L ${fmtMin(agg.left)} · R ${fmtMin(agg.right)}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        state.activeRouteIndex = idx;
        document.querySelectorAll('.route-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderDetail(idx);
      });
      routeGrid.appendChild(card);
    });
  }

  function sideColor(side){
    return side === 'right' ? '#f2a93b' : side === 'left' ? '#2e6e62' : '#b9bec1';
  }

  function renderMapRoute(route){
    mapLayers.forEach(l => map.removeLayer(l));
    mapLayers = [];
    const bounds = [];
    route.runs.forEach(run => {
      const latlngs = run.coords.map(c => [c[0], c[1]]);
      const line = L.polyline(latlngs, { color: sideColor(run.side), weight: 6, opacity: 0.9 }).addTo(map);
      mapLayers.push(line);
      latlngs.forEach(p => bounds.push(p));
    });
    if (bounds.length) {
      const w = window.innerWidth;
      const padLeft = w > 768 ? 450 : 50; 
      const padBottom = w <= 768 ? (window.innerHeight * 0.4) : 50;
      map.fitBounds(bounds, { paddingBottomRight: [50, padBottom], paddingTopLeft: [padLeft, 50] });
    }
  }

  function renderSeats(route){
    const agg = route.aggregate;
    let leftLabel = 'Left', rightLabel = 'Right';
    if (state.layout === 'left2'){ leftLabel = '2-seater · Left'; rightLabel = '3-seater · Right'; }
    if (state.layout === 'right2'){ leftLabel = '3-seater · Left'; rightLabel = '2-seater · Right'; }
    $('label-left').textContent = leftLabel;
    $('label-right').textContent = rightLabel;
    $('time-left').textContent = fmtMin(agg.left);
    $('time-right').textContent = fmtMin(agg.right);

    const total = Math.max(agg.left, agg.right, 1);
    $('side-left').style.background = `rgba(46,110,98,${0.06 + 0.22*(agg.left/total)})`;
    $('side-right').style.background = `rgba(242,169,59,${0.06 + 0.22*(agg.right/total)})`;

    const leftSeatCount = state.layout === 'left2' ? 2 : state.layout === 'right2' ? 3 : 3;
    const rightSeatCount = state.layout === 'right2' ? 2 : state.layout === 'left2' ? 3 : 3;
    $('seats-left').innerHTML = Array(leftSeatCount).fill('<div class="seat"></div>').join('');
    $('seats-right').innerHTML = Array(rightSeatCount).fill('<div class="seat"></div>').join('');

    const banner = $('verdict-banner');
    const vbMain = $('vb-main'), vbSub = $('vb-sub');
    const v = verdictText(agg);
    if (v.side === 'none'){
      banner.classList.add('none');
      vbMain.textContent = 'No sun on this trip';
      vbSub.textContent = 'Sun is below the horizon or front/back.';
    } else if (v.side === 'either'){
      banner.classList.remove('none');
      vbMain.textContent = 'Either side works';
      vbSub.textContent = `Left: ${fmtMin(agg.left)}, Right: ${fmtMin(agg.right)}`;
    } else {
      banner.classList.remove('none');
      vbMain.textContent = `${v.text}`;
      const other = v.side === 'left' ? 'right' : 'left';
      vbSub.textContent = `${fmtMin(agg[v.side])} of sun vs. ${fmtMin(agg[other])} on the ${other}.`;
    }
  }

  function renderDetail(idx){
    const route = state.routes[idx];
    renderMapRoute(route);
    renderSeats(route);
  }

  /* ---------------- UI Listeners ---------------- */
  document.querySelectorAll('.seat-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seat-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.layout = btn.id === 'layout-left2' ? 'left2' : btn.id === 'layout-right2' ? 'right2' : 'unknown';
      if (state.routes.length) renderSeats(state.routes[state.activeRouteIndex]);
    });
  });

  $('pref-select').addEventListener('change', (e) => {
    state.deadzone = TOLERANCE_WINDOWS[e.target.value];
    if (!state.routes.length) return;
    state.routes = state.routes.map(r => {
      const segments = buildSegments(r.geometry, r.duration, state.departure, state.deadzone);
      const agg = aggregate(segments);
      const runs = mergeRuns(segments);
      return { ...r, segments, runs, aggregate: agg };
    });
    renderRouteCards();
    renderDetail(state.activeRouteIndex);
  });

  // Location request helper
  $('use-location-btn').addEventListener('click', () => {
    if (!navigator.geolocation) {
      showError('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude, lon = pos.coords.longitude;
      state.origin = { lat, lon };
      updateMapMarkers();
      try {
        const rawLabel = await reverseGeocode(lat, lon);
        const { short } = formatPlaceName(rawLabel);
        fromInput.value = short;
      } catch(e) {
        fromInput.value = fmtLatLon(lat, lon);
      }
    }, err => {
      showError('Location access blocked or unavailable.');
    });
  });

  /* ---------------- PWA Service Worker & Install ---------------- */
  let deferredPrompt;
  const installBtn = $('install-app-btn');
  const modal = $('download-modal');
  const modalClose = $('modal-close-btn');

  if (installBtn && modal) {
    // Hide button automatically if already installed and running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      installBtn.style.display = 'none';
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Native installation prompt
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      } else {
        // Fallback: show the custom modal giving them the ZIP download and instructions
        modal.classList.add('active');
      }
    });

    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    window.addEventListener('appinstalled', () => {
      installBtn.style.display = 'none';
      deferredPrompt = null;
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
      });
    });
  }

})();
