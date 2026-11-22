/*
 * Bhasha app: screens, state and events.
 * Flow: intro -> about you -> pick a language -> pick Easy or Hard -> lesson
 *       -> 3 test rounds -> results (decides the next level) -> back to lessons.
 * The translator (any language to any language) and Today (daily phrase, daily challenge,
 * flashcard review) are available from the top bar at any time.
 * Also here: speaking practice, badges, phrasebook, backup and restore, share card, install prompt.
 * Progress lives in localStorage only. Nothing leaves the device. The logic is in features.js.
 */
(function () {
  'use strict';

  var D = window.BhashaData;
  var Q = window.BhashaQuiz;
  var TR = window.BhashaTranslate;
  var F = window.BhashaFeatures;
  /* On the published web page the page can ask Claude to translate. In a plain copy of the page this stays null. */
  var sampleFn = null;
  try {
    if (window.claude && typeof window.claude.use === 'function') {
      Promise.resolve(window.claude.use('sample')).then(function (s) { sampleFn = typeof s === 'function' ? s : null; }, function () {});
    }
  } catch (e) {}
  var LANGS = D.LANGS;
  var byId = D.byId;
  var app = document.getElementById('app');

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
  function dstr(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dayOffset(n) { var d = new Date(); d.setDate(d.getDate() + n); return dstr(d); }
  function levelLabel(l) { return D.LEVELS[l].label; }

  var ICON = {
    spk: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mic: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
    back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>'
  };

  /* Tota the parrot, the mascot. mood: 'happy' or 'oops'. */
  function mascot(mood, small) {
    return '<span class="mascot ' + (mood || 'happy') + (small ? ' sm' : '') + '" aria-hidden="true">' +
      '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M38 88C26 100 22 112 30 116C40 110 46 100 50 92Z" fill="#E8564A"/>' +
      '<path d="M46 92C42 106 44 114 52 116C58 108 58 98 56 92Z" fill="#F5A623"/>' +
      '<path d="M54 100v10M66 100v10" stroke="#F5A623" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="62" cy="68" rx="30" ry="36" fill="#3DB36B"/>' +
      '<ellipse cx="70" cy="76" rx="17" ry="24" fill="#B7E8C6"/>' +
      '<path d="M44 62C34 74 38 92 52 98C58 84 56 70 50 60Z" fill="#2A8F55"/>' +
      '<circle cx="70" cy="34" r="22" fill="#3DB36B"/>' +
      '<path d="M62 14C62 6 70 4 74 10C70 10 68 12 68 16Z" fill="#E8564A"/>' +
      '<circle cx="81" cy="41" r="5" fill="#FFB4A8" opacity=".75"/>' +
      '<circle cx="74" cy="30" r="7" fill="#fff" stroke="#12212A" stroke-width="2"/>' +
      '<circle cx="76" cy="30" r="3.2" fill="#12212A"/><circle cx="77" cy="29" r="1" fill="#fff"/>' +
      '<path d="M86 28C100 28 106 38 100 46C95 50 88 46 86 40Z" fill="#F5A623"/>' +
      '<path d="M88 38Q95 41 100 38" stroke="#B87A00" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path class="sweat" d="M100 12q5 8 0 12q-5-4 0-12z" fill="#7CC7F0"/>' +
      '</svg></span>';
  }

  /* ---------- audio ---------- */
  var canSpeak = false;
  try { canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window; } catch (e) {}
  function speak(text, lang) {
    if (!canSpeak) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---------- speaking practice (browser speech recognition) ---------- */
  var SR = null;
  try { SR = window.SpeechRecognition || window.webkitSpeechRecognition || null; } catch (e) {}
  var recog = null;
  function stopMic() {
    if (recog) { try { recog.onresult = recog.onerror = recog.onend = null; recog.abort(); } catch (e) {} recog = null; }
  }
  function micError(code, l) {
    if (code === 'not-allowed' || code === 'service-not-allowed') return 'The microphone is blocked. Allow it in your browser settings, then try again.';
    if (code === 'no-speech') return 'I did not hear anything. Try again, a little closer to the microphone.';
    if (code === 'network') return 'Speech practice needs an internet connection in this browser.';
    if (code === 'language-not-supported') return 'This browser cannot listen for ' + l.name + '.';
    return 'The microphone did not work. Please try again.';
  }
  function startMic(id, l, ph, focusKey) {
    if (!SR) return;
    stopMic();
    if (canSpeak) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    S.sp = { id: id, state: 'listening' };
    render(focusKey);
    var finished = false;
    try {
      recog = new SR();
      recog.lang = l.sp; recog.interimResults = false; recog.maxAlternatives = 3; recog.continuous = false;
      recog.onresult = function (e) {
        finished = true;
        var list = [], r = e.results && e.results[0];
        if (r) for (var k = 0; k < r.length; k++) list.push(r[k].transcript);
        var score = F.speakScore(list, ph.native, ph.roman);
        S.sp = { id: id, state: 'done', score: score, heard: list[0] || '' };
        if (score > store.stats.speakBest) store.stats.speakBest = score;
        save(); render(focusKey); checkBadges();
      };
      recog.onerror = function (e) { finished = true; S.sp = { id: id, state: 'error', msg: micError(e && e.error, l) }; render(focusKey); };
      recog.onend = function () {
        if (!finished && S.sp && S.sp.id === id && S.sp.state === 'listening') { S.sp = { id: id, state: 'error', msg: micError('no-speech', l) }; render(focusKey); }
      };
      recog.start();
    } catch (e) { S.sp = { id: id, state: 'error', msg: micError('', l) }; render(focusKey); }
  }
  function micBtn(id, langId, set, i) {
    if (!SR) return '';
    var listening = S.sp && S.sp.id === id && S.sp.state === 'listening';
    return '<button class="icon-btn' + (listening ? ' live' : '') + '" aria-label="Practise saying it" data-a="mic" data-id="' + id + '" data-lang="' + langId + '" data-set="' + set + '" data-i="' + i + '" data-f="mic-' + id + '">' + ICON.mic + '</button>';
  }
  function micPanel(id) {
    var m = S.sp;
    if (!m || m.id !== id) return '';
    if (m.state === 'listening') return '<p class="micres" role="status">Listening… say it now.</p>';
    if (m.state === 'error') return '<p class="micres err" role="alert">' + esc(m.msg) + '</p>';
    return '<p class="micres ' + (m.score >= 80 ? 'good' : '') + '" role="status"><b>' + m.score + '%</b> ' + esc(F.speakVerdict(m.score)) +
      (m.heard ? ' <span class="small">I heard: “' + esc(m.heard) + '”</span>' : '') + '</p>';
  }

  /* ---------- install (PWA) and offline ---------- */
  var installPrompt = null, offlineReady = false;
  function isStandalone() {
    try { return !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; } catch (e) { return false; }
  }
  function isIOS() { try { return /iphone|ipad|ipod/i.test(navigator.userAgent || ''); } catch (e) { return false; } }
  function setInstallBtn() {
    var b = document.getElementById('install-btn');
    if (b) b.hidden = !installPrompt;
  }
  try {
    if (window.addEventListener) {
      window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installPrompt = e; setInstallBtn(); });
      window.addEventListener('appinstalled', function () { installPrompt = null; setInstallBtn(); toast('Bhasha is installed.'); });
    }
    if (navigator.serviceWorker && typeof location !== 'undefined' && /^https?:$/.test(location.protocol) && document.querySelector('link[rel="manifest"]')) {
      navigator.serviceWorker.register('sw.js').then(function () { return navigator.serviceWorker.ready; })
        .then(function () { offlineReady = true; }, function () {});
    }
  } catch (e) {}

  /* ---------- saved progress ---------- */
  var KEY = 'bhasha.v2';
  var store = loadStore();
  function loadStore() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return F.sanitize(JSON.parse(raw));
    } catch (e) {}
    return F.defaultStore();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function today() { return dayOffset(0); }
  function liveStreak() { return (store.last === dayOffset(0) || store.last === dayOffset(-1)) ? store.streak : 0; }
  function touch() {
    var t = dayOffset(0);
    if (store.last === t) return;
    store.streak = store.last === dayOffset(-1) ? store.streak + 1 : 1;
    store.bestStreak = Math.max(store.bestStreak || 0, store.streak);
    store.last = t;
    if (store.days.indexOf(t) === -1) store.days.push(t);
    if (store.days.length > 120) store.days = store.days.slice(-120);
  }
  function award(n) { store.xp += n; touch(); save(); renderStats(); }
  function renderStats() {
    var box = document.getElementById('stats');
    box.hidden = !store.profile;
    document.getElementById('st-streak').textContent = liveStreak();
    document.getElementById('st-xp').textContent = store.xp;
  }
  function knownIds() {
    return store.profile ? store.profile.known.slice() : [];
  }
  /* The daily record belongs to one date. A new day starts a fresh one. */
  function dailyRec() {
    if (store.daily.date !== today()) store.daily = { date: today(), phrase: false, quiz: false, score: 0 };
    return store.daily;
  }

  /* ---------- toast and badges ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 4500);
    if (toastTimer && toastTimer.unref) toastTimer.unref();
  }
  /* Looks for badges earned for the first time, saves them and tells the person. */
  function checkBadges() {
    var got = F.newBadges(store, today());
    if (got.length) {
      save();
      toast((got.length === 1 ? 'Badge earned: ' : 'Badges earned: ') + got.map(function (b) { return b.name; }).join(', '));
    }
    return got;
  }

  /* ---------- state ---------- */
  var S = {
    screen: store.profile ? 'home' : 'intro',
    draft: null, errors: {}, editing: false, fromForm: false, filter: 'all',
    lang: null, level: 'easy',
    session: null, r: 0, q: 0, picked: null, score: 0, rscore: 0, rscores: [], combo: 0,
    missed: [], fb: '', result: null, resetArmed: false,
    mode: 'test', newBadges: [], addedToReview: 0, sp: null, rv: null, restore: null, msg: '', msgKind: '',
    t: { from: 'english', to: 'hindi', text: '', result: null, error: '', busy: false, token: 0, copied: '', init: false, q: '' }
  };
  function curLang() { return byId[S.lang]; }
  function emptyDraft() { return { name: '', age: '', known: [], other: '', learn: '', purpose: '' }; }

  /* ---------- timer (Hard tests) ---------- */
  var timerId = null;
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function roundSeconds() {
    if (!S.session || S.session.level !== 'hard' || !store.timer) return 0;
    return S.session.rounds[S.r].seconds;
  }
  function startTimer(sec) {
    stopTimer();
    var end = Date.now() + sec * 1000;
    var bar = document.getElementById('tbar'), label = document.getElementById('tlabel');
    if (!bar || !label) return;
    timerId = setInterval(function () {
      var left = end - Date.now();
      if (left <= 0) { stopTimer(); answer(-1); return; }
      bar.style.width = (left / (sec * 1000) * 100) + '%';
      bar.classList.toggle('low', left < 5000);
      label.textContent = Math.ceil(left / 1000) + 's';
    }, 100);
  }

  /* ---------- reusable view parts ---------- */
  var STEP_NAMES = ['Welcome', 'About you', 'Choose a language', 'Choose a lesson', 'Lesson and test'];
  function steps(n) {
    return '<div class="steps"><span>Step ' + n + ' of 5</span><b>' + STEP_NAMES[n - 1] + '</b>' +
      '<span class="bar" aria-hidden="true"><span style="width:' + (n * 20) + '%"></span></span></div>';
  }
  function backBtn(action, label, key) {
    return '<button class="back" data-a="' + action + '" data-f="' + (key || 'back') + '">' + ICON.back + esc(label) + '</button>';
  }
  function langHeader(l) {
    return '<header class="lh" style="--h:' + l.hue + '">' +
      '<div class="big nat" lang="' + l.lang + '" dir="auto">' + esc(l.native) + '</div>' +
      '<div class="meta"><h1>' + esc(l.name) + '</h1><p class="region">' + esc(l.region) + ' · ' + esc(l.script) + '</p><p class="fact">' + esc(l.fact) + '</p></div></header>';
  }
  function purposeTip() {
    var p = store.profile && D.PURPOSES.filter(function (x) { return x.id === store.profile.purpose; })[0];
    return p ? p.tip : 'Short, silly rounds make words stick.';
  }
  function tile(l) {
    var tags = '';
    if (store.profile && store.profile.learn === l.id) tags += '<span class="tag">Your pick</span>';
    var rel = D.relatedKnown(l.id, knownIds());
    if (rel.length) tags += '<span class="tag soft">Like ' + esc(D.nameOf(rel[0])) + '</span>';
    var pr = store.progress[l.id];
    if (pr) tags += '<span class="tag soft">' + levelLabel(pr.level) + ' next</span>';
    return '<button class="tile" style="--h:' + l.hue + '" data-a="pick" data-v="' + l.id + '" data-f="tile-' + l.id + '">' +
      '<span class="hello nat" lang="' + l.lang + '" dir="auto">' + esc(l.easy[0][0]) + '</span>' +
      '<span class="say">' + esc(l.easy[0][1]) + '</span>' +
      '<span class="lname">' + esc(l.name) + '<span class="nat" lang="' + l.lang + '" dir="auto">' + esc(l.native) + '</span></span>' +
      '<span class="where">' + esc(l.region) + '</span>' +
      (tags ? '<span class="tags">' + tags + '</span>' : '') + '</button>';
  }

  /* ---------- screens ---------- */
  function introView() {
    var hellos = LANGS.map(function (l) {
      return '<span class="hello-chip" style="--h:' + l.hue + '"><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(l.easy[0][0]) + '</span><span class="rom">' + esc(l.name) + '</span></span>';
    }).join('');
    var indian = LANGS.filter(function (l) { return l.group === 'indian'; }).length;
    var intl = LANGS.length - indian;
    var cta = store.profile ? 'Back to my learning' : 'Start learning';
    return '<div class="screen">' +
      '<section class="hero2"><div class="hero-text">' +
      '<p class="eyebrow">Free · No sign-up · ' + LANGS.length + ' languages</p>' +
      '<h1>Learn a language. <em>Laugh</em> while you do it.</h1>' +
      '<p class="lead">Bhasha is a playful way to learn Indian and international languages. Short lessons, silly questions, and a parrot named Tota who judges you very gently.</p>' +
      '<div class="actions"><button class="btn primary big" data-a="start" data-f="start">' + cta + '</button><button class="btn big" data-a="translate" data-f="trans">Try the translator</button></div>' +
      '<p class="small">Setup takes about two minutes. Your answers stay on this device. <button class="link" data-a="settings" data-f="restore">Already use Bhasha? Restore a backup</button></p></div>' +
      '<div class="hero-art"><div class="bubble">Namaste! I am Tota. Ready to be a little silly?</div>' + mascot('happy') + '</div></section>' +

      '<section class="features">' +
      '<div class="feature"><h3>' + indian + ' Indian, ' + intl + ' international</h3><p>Hindi to Arabic, Tamil to Japanese. Every language comes with its own script and pronunciation help.</p></div>' +
      '<div class="feature"><h3>Easy and Hard lessons</h3><p>Start with everyday basics, or jump straight to real sentences like “Where is the toilet?”</p></div>' +
      '<div class="feature"><h3>Funny three-round tests</h3><p>Ridiculous situations, silly wrong answers and a parrot who reacts to everything you do.</p></div>' +
      '<div class="feature"><h3>Levels that adapt</h3><p>Your score after three rounds decides what comes next: harder, easier, or one more try.</p></div>' +
      '<div class="feature"><h3>A translator for everything</h3><p>Translate between any two languages, from Hindi to Hebrew. Lesson phrases come with pronunciation, and you can save favourites.</p></div>' +
      '<div class="feature"><h3>A reason to come back daily</h3><p>A new phrase and a five-question challenge every day, flashcards for what you miss, speaking practice and badges.</p></div>' +
      '<div class="feature"><h3>Install it and go offline</h3><p>Add Bhasha to your home screen and keep learning without internet. Back up your progress to a file any time.</p></div></section>' +

      '<section class="screen"><h2 class="sub">How it works</h2><ol class="how">' +
      '<li><b>Tell us about you</b><span>Your name, age, languages you know and why you want to learn.</span></li>' +
      '<li><b>Pick a language</b><span>Choose from all ' + LANGS.length + '. We mark the ones related to what you know.</span></li>' +
      '<li><b>Learn a lesson</b><span>Easy or Hard. Read, listen and read Tota’s memory tips.</span></li>' +
      '<li><b>Take three rounds</b><span>Warm-up, Silly situations and a Boss round. Then we set your next level.</span></li></ol></section>' +

      '<section class="screen"><h2 class="sub">Say hello in ' + LANGS.length + ' languages</h2><div class="hellos">' + hellos + '</div></section>' +

      '<div class="actions"><button class="btn primary big" data-a="start" data-f="start2">' + cta + '</button></div></div>';
  }

  function chip(action, v, label, on, key) {
    return '<button type="button" class="chip" aria-pressed="' + on + '" data-a="' + action + '" data-v="' + v + '" data-f="' + key + '">' + esc(label) + '</button>';
  }
  function fieldErr(id, msg) { return msg ? '<p class="err" id="' + id + '" role="alert">' + esc(msg) + '</p>' : ''; }

  function profileView() {
    var d = S.draft, e = S.errors;
    var known = D.KNOWN_CHOICES.map(function (k) { return chip('known', k.id, k.name, d.known.indexOf(k.id) !== -1, 'k-' + k.id); }).join('');
    var learn = LANGS.map(function (l) { return chip('learn', l.id, l.name, d.learn === l.id, 'l-' + l.id); }).join('') +
      chip('learn', 'unsure', 'Not sure yet', d.learn === 'unsure', 'l-unsure');
    var why = D.PURPOSES.map(function (p) { return chip('purpose', p.id, p.label, d.purpose === p.id, 'p-' + p.id); }).join('');
    return '<div class="screen">' + (S.editing ? backBtn('home', 'Back', 'back') : backBtn('intro', 'Back to welcome', 'back')) + steps(2) +
      '<div><h1 class="title">Tell us about you</h1><p class="lead">Five quick questions so Tota can pick a good starting point. Stays on this device.</p></div>' +
      '<form class="form" id="pf" novalidate>' +
      '<div class="field"><label for="f-name">Your name</label>' +
      '<input class="input" id="f-name" type="text" maxlength="30" autocomplete="given-name" value="' + esc(d.name) + '"' + (e.name ? ' aria-invalid="true" aria-describedby="e-name"' : '') + '>' + fieldErr('e-name', e.name) + '</div>' +
      '<div class="field"><label for="f-age">Your age</label>' +
      '<input class="input age" id="f-age" type="number" inputmode="numeric" min="4" max="100" value="' + esc(d.age) + '"' + (e.age ? ' aria-invalid="true" aria-describedby="e-age"' : '') + '>' + fieldErr('e-age', e.age) + '</div>' +
      '<fieldset class="field"><legend>Languages you already know</legend><span class="help">Pick all that apply.</span><div class="chips">' + known + '</div>' +
      '<label for="f-other" class="help">Any others? (optional)</label><input class="input" id="f-other" type="text" maxlength="60" placeholder="For example: Punjabi, Urdu" value="' + esc(d.other) + '">' + fieldErr('e-known', e.known) + '</fieldset>' +
      '<fieldset class="field"><legend>Language you want to learn</legend><span class="help">You can change this any time.</span><div class="chips">' + learn + '</div>' + fieldErr('e-learn', e.learn) + '</fieldset>' +
      '<fieldset class="field"><legend>Why do you want to learn?</legend><div class="chips">' + why + '</div>' + fieldErr('e-purpose', e.purpose) + '</fieldset>' +
      '<div class="actions"><button type="submit" class="btn primary big" data-f="submit">Continue</button></div></form></div>';
  }

  function languagesView() {
    var f = S.filter;
    var ind = LANGS.filter(function (l) { return l.group === 'indian'; });
    var intl = LANGS.filter(function (l) { return l.group === 'intl'; });
    function pill(v, label, n) { return '<button class="pill" aria-pressed="' + (f === v) + '" data-a="filter" data-v="' + v + '" data-f="f-' + v + '">' + label + '<span class="n">' + n + '</span></button>'; }
    function group(title, arr) { return '<section class="group"><h2>' + title + '<span>' + arr.length + ' languages</span></h2><div class="grid">' + arr.map(tile).join('') + '</div></section>'; }
    var p = store.profile;
    var intro = p && p.learn && p.learn !== 'unsure'
      ? 'You said you want to learn ' + D.nameOf(p.learn) + '. It is marked below, but you can open any language.'
      : 'Not sure yet? Languages tagged “Like …” are close relatives of one you know, so they feel familiar quickly.';
    return '<div class="screen">' + (p ? backBtn('home', 'My learning', 'back') : '') + (S.fromForm ? steps(3) : '') +
      '<div><h1 class="title">Languages on Bhasha</h1><p class="lead">' + esc(intro) + '</p></div>' +
      '<div class="filters" role="group" aria-label="Filter languages">' + pill('all', 'All', LANGS.length) + pill('indian', 'Indian', ind.length) + pill('intl', 'International', intl.length) + '</div>' +
      (f !== 'intl' ? group('Indian languages', ind) : '') + (f !== 'indian' ? group('International languages', intl) : '') +
      '<p class="foot">Pronunciations are written in simple English letters, so they are approximate.</p></div>';
  }

  function levelView() {
    var l = curLang(), p = store.profile;
    var rec = Q.recommend(l.id, knownIds(), store.progress[l.id], p && +p.age);
    function card(lv) {
      var isRec = rec.level === lv;
      return '<article class="lvl' + (isRec ? ' rec' : '') + '"><h3>' + levelLabel(lv) + '</h3>' +
        (isRec ? '<span class="tag">Recommended for you</span>' : '') +
        '<p><b>' + esc(D.LEVELS[lv].blurb) + '.</b> ' + esc(D.LEVELS[lv].detail) + '</p>' +
        (isRec ? '<p class="why">' + esc(rec.reason) + '</p>' : '') +
        '<button class="btn ' + (isRec ? 'primary' : '') + '" data-a="lesson" data-v="' + lv + '" data-f="lv-' + lv + '">Start ' + levelLabel(lv) + ' lesson</button></article>';
    }
    var pr = store.progress[l.id];
    var best = pr ? '<p class="small">Best scores: Easy ' + (pr.best.easy || 0) + '/15, Hard ' + (pr.best.hard || 0) + '/15 · ' + pr.sessions + ' test' + (pr.sessions === 1 ? '' : 's') + ' taken</p>' : '';
    return '<div class="screen">' + backBtn('languages', 'All languages', 'back') + steps(4) + langHeader(l) +
      '<div><h2 class="sub">Choose your lesson</h2><p class="lead">Easy teaches everyday basics. Hard teaches real sentences. Not sure? Take the recommended one. The test will adjust your level either way.</p></div>' +
      '<div class="levels">' + card('easy') + card('hard') + '</div>' + best +
      '<label class="check"><input type="checkbox" id="f-timer"' + (store.timer ? ' checked' : '') + '> Use the countdown timer in Hard tests</label></div>';
  }

  function lessonView() {
    var l = curLang(), set = S.level;
    var rows = l[set].map(function (ph, i) {
      var c = D.CONCEPTS[set][i];
      return '<li class="row"><div class="ph"><span class="en">' + esc(c.en) + '</span><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(ph[0]) + '</span><span class="rom">' + esc(ph[1]) + '</span>' +
        (ph[2] ? '<span class="note">' + esc(ph[2]) + '</span>' : '') + '<span class="tip">Tota’s tip: ' + esc(c.tip) + '</span>' + micPanel('lesson:' + set + ':' + i) + '</div>' +
        '<div class="rbtns">' + (canSpeak ? '<button class="icon-btn" aria-label="Listen: ' + esc(c.en) + '" data-a="say" data-v="' + set + '" data-i="' + i + '" data-f="say' + i + '">' + ICON.spk + '</button>' : '') +
        micBtn('lesson:' + set + ':' + i, l.id, set, i) + '</div></li>';
    }).join('');
    return '<div class="screen">' + backBtn('level', 'Choose another lesson', 'back') + steps(5) + langHeader(l) +
      '<div class="says">' + mascot('happy', true) + '<div class="bubble">' + esc(purposeTip()) + '</div></div>' +
      '<div><h2 class="sub">' + levelLabel(set) + ' lesson: ' + esc(D.LEVELS[set].blurb) + '</h2><p class="lead">Read each phrase twice, say it out loud, then take the test. ' + (canSpeak ? 'Audio uses voices on your device, and some languages may not have one.' : '') + (SR ? ' Tap the microphone to practise saying a phrase and get a score.' : '') + '</p></div>' +
      '<ul class="rows">' + rows + '</ul>' +
      '<div class="actions"><button class="btn primary big" data-a="starttest" data-f="starttest">Start the test</button></div>' +
      '<p class="small">3 rounds, 5 questions each. Your score decides your next level.</p></div>';
  }

  function roundIntroView() {
    var rd = S.session.rounds[S.r], sec = roundSeconds();
    return '<div class="screen"><div class="center">' + mascot('happy') +
      '<p class="eyebrow">Round ' + (S.r + 1) + ' of 3</p><h1 class="title">' + esc(rd.title) + '</h1>' +
      '<p class="lead">' + esc(rd.blurb) + '</p>' +
      (sec ? '<p class="small">You have ' + sec + ' seconds per question. Tick tock.</p>' : '<p class="small">No timer. Take your time and enjoy the silliness.</p>') +
      '<div class="actions"><button class="btn primary big" data-a="startround" data-f="startround">Start round ' + (S.r + 1) + '</button></div></div></div>';
  }

  function optHTML(o, k, q, lang) {
    var done = S.picked !== null;
    var cls = done ? (k === q.correct ? ' ok' : (k === S.picked ? ' no' : ' dim')) : '';
    var inner;
    if (o.kind === 'phrase') {
      var p = Q.phraseOf(lang, o.ref);
      inner = '<span class="nat" lang="' + lang.lang + '" dir="auto">' + esc(p.native) + '</span>' +
        ((S.session.level === 'easy' || done) ? '<span class="rom">' + esc(p.roman) + '</span>' : '');
    } else { inner = esc(o.text); }
    return '<button class="opt' + cls + '" data-a="choose" data-i="' + k + '" data-f="opt' + k + '"' + (done ? ' aria-disabled="true"' : '') + '>' + inner + '</button>';
  }

  function questionView() {
    var l = curLang(), rd = S.session.rounds[S.r], q = rd.questions[S.q];
    var ph = Q.phraseOf(l, q.ref);
    var done = S.picked !== null;
    var showRom = S.session.level === 'easy' || done;
    var romLine = showRom ? '<span class="rom">' + esc(ph.roman) + '</span>' : '';
    var speakBtn = canSpeak ? '<button class="icon-btn" aria-label="Listen" data-a="sayq" data-f="sayq">' + ICON.spk + '</button>' : '';
    var prompt;
    if (q.type === 'meaning') {
      prompt = '<span class="qlabel">What does this mean?</span><div class="qprompt"><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(ph.native) + '</span>' + romLine + '</div>' + speakBtn;
    } else if (q.type === 'scene') {
      prompt = '<span class="qlabel">Silly situation</span><p class="scene">' + esc(q.scene) + '</p><span class="qlabel">What do you say in ' + esc(l.name) + '?</span>';
    } else if (q.type === 'reverse') {
      prompt = '<span class="qlabel">How do you say this in ' + esc(l.name) + '?</span><div class="qbig">' + esc(ph.en) + '</div>';
    } else {
      prompt = '<span class="qlabel">True or false?</span><p class="claim">Tota swears that <span class="nat" lang="' + l.lang + '" dir="auto">' + esc(ph.native) + '</span> ' + romLine + ' means “' + esc(q.claim) + '”.</p>';
    }
    var sec = roundSeconds();
    var timer = sec ? '<div class="timer"><span class="bar" aria-hidden="true"><span class="tbar" id="tbar"' + (done ? ' style="width:0"' : '') + '></span></span><span id="tlabel">' + (done ? '' : sec + 's') + '</span></div>' : '';
    var combo = S.combo >= 2 ? '<span class="combo">Combo ×' + S.combo + '</span>' : '';
    var fb = '';
    if (done) {
      var ok = S.picked === q.correct;
      fb = '<div class="fb ' + (ok ? 'ok' : 'no') + '" role="status">' + mascot(ok ? 'happy' : 'oops', true) +
        '<div><p class="fbt">' + esc(S.fb) + (ok ? ' +' + (S.session.level === 'hard' ? 15 : 10) + ' XP' : '') + '</p>' +
        '<p class="fbs"><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(ph.native) + '</span> (' + esc(ph.roman) + ') means “' + esc(ph.en) + '”.</p></div></div>' +
        '<div class="actions"><button class="btn primary big grow" data-a="next" data-f="next">' + (S.q === 4 ? (S.mode === 'daily' ? 'See my score' : 'Finish round') : 'Next question') + '</button></div>';
    }
    return '<div class="screen">' +
      '<div class="prog"><span>' + (S.mode === 'daily' ? 'Daily challenge' : 'Round ' + (S.r + 1)) + ' · Question ' + (S.q + 1) + ' of 5</span><span class="bar" aria-hidden="true"><span style="width:' + (S.q * 20) + '%"></span></span>' + combo + '</div>' +
      timer +
      '<div class="qbox">' + prompt + '</div>' +
      '<div class="opts' + (q.type === 'tf' ? ' tf' : '') + '">' + q.options.map(function (o, k) { return optHTML(o, k, q, l); }).join('') + '</div>' + fb + '</div>';
  }

  function roundDoneView() {
    var s = S.rscores[S.r];
    var msg = s === 5 ? 'Perfect round! Tota is doing cartwheels.' : s >= 3 ? 'Nice work! Tota is proud of you.' : 'Tricky one. Tota survived, and so did you.';
    var last = S.r === 2;
    return '<div class="screen"><div class="center">' + mascot(s >= 3 ? 'happy' : 'oops') +
      '<p class="eyebrow">Round ' + (S.r + 1) + ' of 3 done</p><div class="round-score">' + s + '/5</div><p class="lead">' + msg + '</p>' +
      '<div class="actions"><button class="btn primary big" data-a="nextround" data-f="nextround">' + (last ? 'See my results' : 'On to round ' + (S.r + 2)) + '</button></div></div></div>';
  }

  function summaryView() {
    var R = S.result, l = curLang(), name = store.profile ? store.profile.name : 'friend';
    var nl = R.nl, pct = R.score / R.total;
    var head, mood = 'happy';
    if (nl.move === 'up') head = nl.atTop ? 'Hard mastered, ' + name + '! You have out-parroted Tota.' : 'You crushed it, ' + name + '! Time for Hard.';
    else if (nl.move === 'down') { head = 'That was a tricky one, ' + name + '. Let’s go gentler.'; mood = 'oops'; }
    else head = 'Solid work, ' + name + '! One more go will lock it in.';
    var verdict = nl.move === 'up'
      ? (nl.atTop ? 'Stay on Hard with a fresh mix, or start a new language.' : 'Next level: Hard. Real sentences and a timer.')
      : nl.move === 'down'
        ? (nl.atBottom ? 'Next: Easy again, with a fresh mix of questions.' : 'Next level: Easy. Everyday basics, no timer.')
        : 'Next: ' + levelLabel(nl.level) + ' again with new questions.';
    var stars = [1, 2, 3].map(function (n) { return '<span class="star' + (n <= R.stars ? ' on' : '') + '">' + ICON.star + '</span>'; }).join('');
    var rounds = S.session.rounds.map(function (rd, i) {
      return '<div class="rr"><span>' + esc(rd.title) + '</span><span class="bar" aria-hidden="true"><span style="width:' + (S.rscores[i] * 20) + '%"></span></span><span>' + S.rscores[i] + '</span></div>';
    }).join('');
    var seen = {}, rev = '';
    S.missed.forEach(function (ref) {
      var k = ref.set + ':' + ref.i;
      if (seen[k] || Object.keys(seen).length >= 4) return;
      seen[k] = 1;
      var p = Q.phraseOf(l, ref);
      rev += '<li><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(p.native) + '</span><span class="rom">' + esc(p.roman) + '</span><span>' + esc(p.en) + '</span></li>';
    });
    return '<div class="screen"><div class="result">' + mascot(mood) +
      '<div class="stars" role="img" aria-label="' + R.stars + ' out of 3 stars">' + stars + '</div>' +
      '<div class="score">' + R.score + '/' + R.total + '</div><h1 class="sub">' + esc(head) + '</h1>' + rounds +
      '<div class="verdict"><b>' + (nl.move === 'up' ? 'Level up' : nl.move === 'down' ? 'Gentler next' : 'Same level') + '</b><span>' + esc(verdict) + '</span></div>' +
      badgeNote() +
      (rev ? '<div class="revisit"><h3>Worth another look</h3><ul>' + rev + '</ul>' + (S.addedToReview ? '<p class="small">' + S.addedToReview + ' phrase' + (S.addedToReview === 1 ? '' : 's') + ' saved to your flashcard review.</p>' : '') + '</div>' : '<p class="small">No misses. Not a single one!</p>') +
      '<div class="actions"><button class="btn primary big" data-a="continue" data-v="' + nl.level + '" data-f="continue">Continue with ' + levelLabel(nl.level) + '</button>' +
      '<button class="btn" data-a="level" data-f="otherlevel">Choose a lesson</button><button class="btn" data-a="languages" data-f="otherlang">Another language</button>' +
      '<button class="btn" data-a="share" data-f="share">Share my result</button></div>' +
      '<p class="small">+20 XP for finishing the test. ' + Math.round(pct * 100) + '% correct.</p></div></div>';
  }

  function todayCard() {
    var d = dailyRec(), due = F.srsDue(store.srs, today()).length;
    return '<section class="todaycard"><div><h2>Today</h2><p>' +
      'Phrase of the day: <b>' + (d.phrase ? 'learned' : 'new') + '</b> · Daily challenge: <b>' + (d.quiz ? d.score + '/5' : 'ready') + '</b> · Review: <b>' + (due ? due + ' due' : 'caught up') + '</b></p></div>' +
      '<button class="btn primary" data-a="today" data-f="today">Open Today</button></section>';
  }
  function backupNudge() {
    var stale = !store.lastBackup || F.daysBetween(store.lastBackup, today()) >= 14;
    if (!(store.xp > 0 && stale)) return '';
    return '<span>You have not backed up lately. <button class="link" data-a="settings" data-f="nudge">Back up now</button></span>';
  }

  function homeView() {
    var p = store.profile;
    var focusId = (store.lastLang && byId[store.lastLang]) ? store.lastLang : (byId[p.learn] ? p.learn : null);
    var focus;
    if (focusId) {
      var l = byId[focusId], pr = store.progress[focusId];
      var rec = Q.recommend(focusId, knownIds(), pr, +p.age);
      var badges = '<span class="tag">Next: ' + levelLabel(rec.level) + '</span>' +
        (pr && pr.mastered.easy ? '<span class="tag soft">Easy mastered</span>' : '') +
        (pr && pr.mastered.hard ? '<span class="tag soft">Hard mastered</span>' : '') +
        (pr ? '<span class="tag soft">' + pr.sessions + ' test' + (pr.sessions === 1 ? '' : 's') + '</span>' : '');
      focus = '<section class="focus" style="--h:' + l.hue + '"><div class="big nat" lang="' + l.lang + '" dir="auto">' + esc(l.native) + '</div>' +
        '<div class="meta"><h2>' + esc(l.name) + '</h2><div class="badges">' + badges + '</div>' +
        '<div class="actions"><button class="btn primary big" data-a="continue" data-v="' + rec.level + '" data-lang="' + l.id + '" data-f="cont">Continue with ' + levelLabel(rec.level) + '</button>' +
        '<button class="btn" data-a="pick" data-v="' + l.id + '" data-f="choose-lesson">Choose a lesson</button></div></div></section>';
    } else {
      focus = '<section class="focus" style="--h:200"><div class="meta"><h2>Pick your first language</h2><p class="lead">You said you are not sure yet. No problem. Have a look around.</p>' +
        '<div class="actions"><button class="btn primary big" data-a="languages" data-f="cont">See the languages</button></div></div></section>';
    }
    var started = LANGS.filter(function (l) { return store.progress[l.id] && l.id !== focusId; });
    var other = started.length ? '<section class="group"><h2>Also learning<span>' + started.length + '</span></h2><div class="grid">' + started.map(tile).join('') + '</div></section>' : '';
    var purpose = D.PURPOSES.filter(function (x) { return x.id === p.purpose; })[0];
    var knownNames = p.known.map(D.nameOf).concat(p.other ? [p.other] : []).join(', ');
    return '<div class="screen"><div><h1 class="title">Welcome back, ' + esc(p.name) + '.</h1>' +
      '<p class="lead">' + (purpose ? 'Learning for: ' + esc(purpose.label.toLowerCase()) + '. ' : '') + 'You already know ' + esc(knownNames) + '.</p></div>' +
      todayCard() + focus + other +
      '<div class="actions"><button class="btn" data-a="languages" data-f="more">Learn another language</button><button class="btn" data-a="translate" data-f="trans">Translator</button>' +
      '<button class="btn" data-a="edit" data-f="edit">Edit my details</button><button class="btn" data-a="intro" data-f="replay">Replay welcome</button></div>' +
      '<div class="foot"><span>Your progress is saved in this browser only. <button class="link" data-a="settings" data-f="settings">Backup and install</button></span>' + backupNudge() +
      (S.resetArmed
        ? '<span class="actions"><button class="btn" data-a="reset-yes" data-f="ryes">Yes, erase everything</button><button class="btn" data-a="reset-no" data-f="rno">Keep my progress</button></span>'
        : '<button class="link" data-a="reset" data-f="reset" style="align-self:flex-start">Erase my progress</button>') + '</div></div>';
  }


  /* ---------- Today: daily phrase, daily challenge, review ---------- */
  var WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  function dailyLangId() {
    return F.dailyLang(store.lastLang, store.profile && store.profile.learn, today());
  }
  function levelFor(langId) {
    var p = store.profile;
    return Q.recommend(langId, knownIds(), store.progress[langId], p && +p.age).level;
  }
  function weekStrip() {
    return '<ol class="week" aria-label="Your last 7 days">' + F.lastDays(store.days, today(), 7).map(function (x) {
      var wd = new Date(x.date + 'T12:00:00').getDay();
      return '<li class="day' + (x.on ? ' on' : '') + '"><span class="dl" aria-hidden="true">' + WEEKDAY[wd] + '</span><span class="dot" aria-hidden="true"></span>' +
        '<span class="sr">' + x.date + (x.on ? ': you learned' : ': no learning') + '</span></li>';
    }).join('') + '</ol>';
  }

  function todayView() {
    var t = today(), d = dailyRec();
    var langId = dailyLangId(), l = byId[langId], ph = F.dailyPhrase(langId, t);
    var due = F.srsDue(store.srs, t).length, deck = Object.keys(store.srs).length;
    var live = liveStreak();
    var phrase = '<section class="dcard" style="--h:' + l.hue + '"><p class="eyebrow">Phrase of the day · ' + esc(l.name) + '</p>' +
      '<div class="dnat nat" lang="' + l.lang + '" dir="auto">' + esc(ph.native) + '</div><p class="rom">' + esc(ph.roman) + '</p>' +
      '<p class="den">“' + esc(ph.en) + '”</p>' + (ph.note ? '<p class="note">' + esc(ph.note) + '</p>' : '') +
      '<p class="tip">Tota’s tip: ' + esc(ph.tip) + '</p>' +
      '<div class="actions">' + (canSpeak ? '<button class="btn" data-a="dsay" data-f="dsay">Listen</button>' : '') +
      (SR ? '<button class="btn" data-a="mic" data-id="daily" data-lang="' + langId + '" data-set="' + ph.ref.set + '" data-i="' + ph.ref.i + '" data-f="mic-daily">' + (S.sp && S.sp.id === 'daily' && S.sp.state === 'listening' ? 'Listening…' : 'Say it') + '</button>' : '') +
      (d.phrase ? '<span class="tag">Learned today</span>' : '<button class="btn primary" data-a="dgot" data-f="dgot">I’ve got it (+5 XP)</button>') + '</div>' +
      micPanel('daily') + (SR ? '' : '<p class="small">Speaking practice works in Chrome and on Android.</p>') + '</section>';

    var lvl = levelFor(langId);
    var quiz = '<section class="tcard"><h2>Daily challenge</h2>' +
      '<p>' + (d.quiz ? 'Done today: <b>' + d.score + '/5</b>. Come back tomorrow for a new one.' : 'Five mixed questions in ' + esc(l.name) + ', ' + levelLabel(lvl) + ' level' + (lvl === 'hard' ? ', with a timer' : '') + '. Finishing keeps your streak going and earns +20 XP.') + '</p>' +
      '<div class="actions"><button class="btn ' + (d.quiz ? '' : 'primary big') + '" data-a="dstart" data-f="dstart">' + (d.quiz ? 'Practise again (no XP)' : 'Start the daily challenge') + '</button></div></section>';

    var review = '<section class="tcard"><h2>Flashcard review</h2><p>' +
      (due ? '<b>' + due + ' card' + (due === 1 ? '' : 's') + '</b> ready to review. Phrases you miss come back after 1, 2, 4, 8 and 16 days.' :
        deck ? 'All caught up. Cards come back when it is time.' : 'Nothing here yet. Phrases you miss in tests and the daily challenge are saved here for you.') + '</p>' +
      '<div class="actions"><button class="btn ' + (due ? 'primary' : '') + '" data-a="review" data-f="review"' + (due ? '' : ' aria-disabled="true"') + '>Start review</button></div></section>';

    var earned = Object.keys(store.badges).length;
    return '<div class="screen">' + backBtn('home', 'Back', 'back') +
      '<div><h1 class="title">Today</h1><p class="lead">' + (live ? '<b>' + live + '-day streak.</b> ' : 'Start a streak today. ') +
      (store.bestStreak > live ? 'Your best is ' + store.bestStreak + '. ' : '') + 'Today’s language follows the one you studied last.</p></div>' +
      weekStrip() + phrase + '<div class="tgrid">' + quiz + review + '</div>' +
      '<div class="actions"><button class="btn" data-a="badges" data-f="badges">Badges (' + earned + '/' + F.BADGES.length + ')</button>' +
      '<button class="btn" data-a="phrasebook" data-f="phrasebook">My phrasebook (' + store.favs.length + ')</button>' +
      '<button class="btn" data-a="settings" data-f="settings">Backup and install</button></div></div>';
  }

  function dailyDoneView() {
    var R = S.result, l = curLang();
    var stars = [1, 2, 3].map(function (n) { return '<span class="star' + (n <= R.stars ? ' on' : '') + '">' + ICON.star + '</span>'; }).join('');
    var msg = R.score === 5 ? 'Perfect! Tota is doing cartwheels.' : R.score >= 3 ? 'Nice work. Your streak is safe.' : 'Tricky one. Tomorrow’s will be new.';
    var seen = {}, rev = '';
    S.missed.forEach(function (ref) {
      var k = ref.set + ':' + ref.i;
      if (seen[k]) return;
      seen[k] = 1;
      var p = Q.phraseOf(l, ref);
      rev += '<li><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(p.native) + '</span><span class="rom">' + esc(p.roman) + '</span><span>' + esc(p.en) + '</span></li>';
    });
    return '<div class="screen"><div class="result">' + mascot(R.score >= 3 ? 'happy' : 'oops') +
      '<p class="eyebrow">Daily challenge · ' + esc(l.name) + '</p>' +
      '<div class="stars" role="img" aria-label="' + R.stars + ' out of 3 stars">' + stars + '</div>' +
      '<div class="score">' + R.score + '/' + R.total + '</div><h1 class="sub">' + esc(msg) + '</h1>' +
      badgeNote() +
      (rev ? '<div class="revisit"><h3>Added to your review</h3><ul>' + rev + '</ul></div>' : '<p class="small">No misses today.</p>') +
      '<div class="actions"><button class="btn primary big" data-a="today" data-f="today">Back to Today</button>' +
      '<button class="btn" data-a="share" data-f="share">Share my result</button></div>' +
      '<p class="small">' + (S.dailyXp ? '+' + S.dailyXp + ' XP earned.' : 'No XP this time, since you already finished today’s challenge.') + '</p></div></div>';
  }

  function badgeNote() {
    if (!S.newBadges.length) return '';
    return '<div class="verdict"><b>' + (S.newBadges.length === 1 ? 'New badge' : 'New badges') + '</b><span>' + S.newBadges.map(function (b) { return esc(b.name); }).join(', ') + '</span></div>';
  }

  function reviewView() {
    var R = S.rv, t = today();
    var back = backBtn('today', 'Today', 'back');
    if (!R || !R.queue.length) {
      var next = F.srsNext(store.srs, t), deck = Object.keys(store.srs).length;
      return '<div class="screen">' + back + '<div><h1 class="title">Flashcard review</h1><p class="lead">' +
        (deck ? 'All caught up.' + (next ? ' The next card is due in ' + F.daysBetween(t, next) + ' day' + (F.daysBetween(t, next) === 1 ? '' : 's') + '.' : '') :
          'Phrases you miss in tests and in the daily challenge are saved here, and come back at the right time to help them stick.') + '</p></div>' +
        '<div class="actions"><button class="btn primary big" data-a="languages" data-f="learn">Learn a phrase</button></div></div>';
    }
    if (R.finished) {
      return '<div class="screen"><div class="center">' + mascot(R.knew >= R.seen / 2 ? 'happy' : 'oops') + '<p class="eyebrow">Review done</p>' +
        '<div class="round-score">' + R.knew + '/' + R.seen + '</div><p class="lead">You knew ' + R.knew + ' of ' + R.seen + ' cards.' + (R.knew ? ' Those will come back later.' : '') + '</p>' +
        badgeNote() + '<div class="actions"><button class="btn primary big" data-a="today" data-f="today">Back to Today</button></div></div></div>';
    }
    var key = R.queue[R.idx], pk = F.srsParse(key), l = byId[pk.lang], ph = Q.phraseOf(l, pk.ref);
    var box = store.srs[key] ? store.srs[key].box : 1;
    var head = '<div class="prog"><span>Card ' + (R.idx + 1) + ' of ' + R.queue.length + '</span><span class="bar" aria-hidden="true"><span style="width:' + (R.idx / R.queue.length * 100) + '%"></span></span><span>Box ' + box + ' of ' + F.MAX_BOX + '</span></div>';
    var body;
    if (!R.flipped) {
      body = '<div class="qbox"><span class="qlabel">How do you say this in ' + esc(l.name) + '?</span><div class="qbig">' + esc(ph.en) + '</div></div>' +
        '<div class="actions"><button class="btn primary big grow" data-a="rflip" data-f="rflip">Show answer</button></div>';
    } else {
      body = '<div class="qbox"><span class="qlabel">' + esc(ph.en) + ' in ' + esc(l.name) + '</span><div class="qprompt"><span class="nat" lang="' + l.lang + '" dir="auto">' + esc(ph.native) + '</span><span class="rom">' + esc(ph.roman) + '</span></div>' +
        (ph.note ? '<p class="note">' + esc(ph.note) + '</p>' : '') + '<div class="actions">' + (canSpeak ? '<button class="icon-btn" aria-label="Listen" data-a="rsay" data-f="rsay">' + ICON.spk + '</button>' : '') +
        micBtn('review', pk.lang, pk.ref.set, pk.ref.i) + '</div>' + micPanel('review') + '</div>' +
        '<p class="small" style="text-align:center">Did you remember it?</p>' +
        '<div class="actions"><button class="btn big grow" data-a="rgrade" data-v="0" data-f="rno">Not yet</button><button class="btn primary big grow" data-a="rgrade" data-v="1" data-f="ryes">I knew it</button></div>';
    }
    return '<div class="screen">' + back + head + body + '</div>';
  }

  /* ---------- badges ---------- */
  function badgesView() {
    var items = F.BADGES.map(function (b) {
      var got = store.badges[b.id];
      return '<li class="badge' + (got ? ' on' : '') + '"><span class="bico" aria-hidden="true">' + ICON.star + '</span><div><b>' + esc(b.name) + '</b><span>' + esc(b.desc) + '</span>' +
        '<span class="small">' + (got ? 'Earned ' + esc(got) : 'Not yet earned') + '</span></div></li>';
    }).join('');
    return '<div class="screen">' + backBtn('today', 'Today', 'back') +
      '<div><h1 class="title">Badges</h1><p class="lead">' + Object.keys(store.badges).length + ' of ' + F.BADGES.length + ' earned.</p></div><ul class="badgelist">' + items + '</ul></div>';
  }

  /* ---------- phrasebook (saved translations) ---------- */
  function langName(id) { var x = TR.find(id); return x ? x.name : id; }
  function favId(f) { return f.from + '|' + f.to + '|' + f.text; }
  function favIndex(from, to, text) {
    for (var k = 0; k < store.favs.length; k++) if (favId(store.favs[k]) === from + '|' + to + '|' + text) return k;
    return -1;
  }
  function phrasebookView() {
    var items = store.favs.map(function (f, k) {
      var to = TR.find(f.to);
      return '<li class="fav"><div class="favt"><span class="qlabel">' + esc(langName(f.from)) + ' to ' + esc(langName(f.to)) + '</span><span class="favin">' + esc(f.text) + '</span>' +
        '<span class="tres2 nat" lang="' + esc(to ? to.lang : 'und') + '" dir="auto">' + esc(f.out) + '</span>' + (f.roman ? '<span class="rom">' + esc(f.roman) + '</span>' : '') + '</div>' +
        '<div class="favb">' + (canSpeak && to && to.sp ? '<button class="icon-btn" aria-label="Listen" data-a="favsay" data-i="' + k + '" data-f="favsay' + k + '">' + ICON.spk + '</button>' : '') +
        '<button class="btn" data-a="favdel" data-i="' + k + '" data-f="favdel' + k + '">Remove</button></div></li>';
    }).join('');
    return '<div class="screen">' + backBtn('today', 'Today', 'back') +
      '<div><h1 class="title">My phrasebook</h1><p class="lead">Translations you saved, ready to read or listen to. They stay on this device and are included in your backup.</p></div>' +
      (items ? '<ul class="favlist">' + items + '</ul>' : '<p class="lead">Nothing saved yet. Translate something and tap “Save to phrasebook”.</p>') +
      '<div class="actions"><button class="btn primary" data-a="translate" data-f="trans">Open the translator</button></div></div>';
  }

  /* ---------- backup, restore and install ---------- */
  function settingsView() {
    var inst;
    if (isStandalone()) inst = '<p>Bhasha is installed on this device.</p>';
    else if (installPrompt) inst = '<p>Add Bhasha to your home screen to open it like an app.</p><div class="actions"><button class="btn primary" data-a="install" data-f="install">Install Bhasha</button></div>';
    else if (isIOS()) inst = '<p>On iPhone or iPad: tap the Share button in Safari, then “Add to Home Screen”.</p>';
    else inst = '<p>Open your browser menu and choose “Install app” or “Add to Home screen”. This appears when Bhasha is opened from its web address, not from a downloaded file.</p>';
    var rs = S.restore, restore = '';
    if (rs) {
      var st = rs.store, nl = Object.keys(st.progress).length;
      restore = '<div class="confirm" role="alert"><p><b>Replace what is on this device?</b> This backup is for ' + esc(st.profile.name) + ': ' + st.xp + ' XP, ' + nl + ' language' + (nl === 1 ? '' : 's') + (rs.exported ? ', saved on ' + esc(rs.exported) : '') + '.</p>' +
        '<div class="actions"><button class="btn primary" data-a="restore-yes" data-f="ryes">Yes, restore it</button><button class="btn" data-a="restore-no" data-f="rno">Cancel</button></div></div>';
    }
    return '<div class="screen">' + backBtn('home', 'Back', 'back') +
      '<div><h1 class="title">Backup and install</h1><p class="lead">Your progress lives only in this browser. A backup file lets you move to a new phone or computer, or keep it safe if you clear your browser data.</p></div>' +
      '<section class="tcard"><h2>Back up my progress</h2><p>' + (store.lastBackup ? 'Last backup: ' + esc(store.lastBackup) + '.' : 'You have not made a backup yet.') + '</p>' +
      '<div class="actions"><button class="btn primary" data-a="backup" data-f="backup"' + (store.profile ? '' : ' aria-disabled="true"') + '>Download backup file</button></div></section>' +
      '<section class="tcard"><h2>Restore from a backup</h2><div class="field"><label for="f-restore">Choose a Bhasha backup file (.json)</label>' +
      '<input class="input" type="file" id="f-restore" accept=".json,application/json"></div>' + restore + '</section>' +
      '<div aria-live="polite">' + (S.msg ? '<p class="' + (S.msgKind === 'err' ? 'err' : 'okmsg') + '" role="' + (S.msgKind === 'err' ? 'alert' : 'status') + '">' + esc(S.msg) + '</p>' : '') + '</div>' +
      '<section class="tcard"><h2>Install the app</h2>' + inst +
      '<p class="small">' + (offlineReady ? 'Offline mode is ready: lessons, tests, review and your phrasebook work without internet.' : 'Offline mode switches on after your first visit from the web address.') + ' The translator still needs internet, except for lesson phrases.</p></section></div>';
  }

  function downloadBlob(name, blob) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
  }
  function doBackup() {
    S.msg = ''; S.msgKind = '';
    try {
      var name = F.backupName(today());
      store.lastBackup = today(); save();
      downloadBlob(name, new Blob([JSON.stringify(F.makeBackup(store), null, 2)], { type: 'application/json' }));
      S.msg = 'Saved as ' + name + '. Keep it somewhere safe, like your email or cloud drive.'; S.msgKind = 'ok';
      checkBadges();
    } catch (e) { S.msg = 'The backup could not be saved from this browser.'; S.msgKind = 'err'; }
    render('backup');
  }
  function readBackup(file) {
    S.msg = ''; S.msgKind = ''; S.restore = null;
    if (!file) return;
    if (file.size > 2000000) { S.msg = 'That file is too big to be a Bhasha backup.'; S.msgKind = 'err'; render('settings'); return; }
    Promise.resolve().then(function () { return file.text(); }).then(function (text) {
      var r = F.parseBackup(text);
      if (r.ok) S.restore = r; else { S.msg = r.error; S.msgKind = 'err'; }
    }, function () { S.msg = 'That file could not be read.'; S.msgKind = 'err'; }).then(function () {
      if (S.screen === 'settings') render(S.restore ? 'ryes' : 'settings');
    });
  }

  /* ---------- share card ---------- */
  function makeCardBlob(l, R, label) {
    return new Promise(function (resolve, reject) {
      var stack = '"Noto Sans Devanagari","Noto Sans Tamil","Noto Sans Bengali","Noto Sans Telugu","Noto Sans Kannada","Noto Sans Gujarati","Noto Sans Malayalam","Noto Sans JP","Noto Sans KR","Noto Sans SC","Noto Sans Arabic","Instrument Sans",sans-serif';
      var disp = '"Bricolage Grotesque","Instrument Sans",system-ui,sans-serif';
      var ready = Promise.resolve();
      try { if (document.fonts && document.fonts.load) ready = Promise.all([document.fonts.load('600 120px ' + stack, l.native), document.fonts.load('800 60px ' + disp, 'Bhasha')]); } catch (e) {}
      ready.catch(function () {}).then(function () {
        var c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
        var g = c.getContext && c.getContext('2d');
        if (!g) { reject(new Error('no canvas')); return; }
        function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
        function star(cx, cy, R0, on) {
          g.beginPath();
          for (var k = 0; k < 10; k++) { var rad = k % 2 ? R0 * 0.45 : R0, a = -Math.PI / 2 + k * Math.PI / 5; g[k ? 'lineTo' : 'moveTo'](cx + rad * Math.cos(a), cy + rad * Math.sin(a)); }
          g.closePath(); g.fillStyle = on ? '#E0A020' : '#D3DCDA'; g.fill();
        }
        g.fillStyle = '#0C6670'; g.fillRect(0, 0, 1080, 1080);
        g.fillStyle = '#FFFFFF'; rr(60, 60, 960, 960, 48); g.fill();
        g.textAlign = 'left'; g.fillStyle = '#12212A'; g.font = '800 64px ' + disp; g.fillText('Bhasha', 110, 160);
        g.textAlign = 'right'; g.fillStyle = '#566871'; g.font = '600 52px ' + stack; g.fillText('भाषा', 970, 160);
        g.textAlign = 'center';
        g.fillStyle = '#0C6670'; g.font = '600 150px ' + stack; g.fillText(l.native, 540, 390, 840);
        g.fillStyle = '#566871'; g.font = '600 48px ' + disp; g.fillText(l.name + ' · ' + label, 540, 470, 840);
        g.fillStyle = '#12212A'; g.font = '800 230px ' + disp; g.fillText(R.score + '/' + R.total, 540, 720);
        for (var n = 0; n < 3; n++) star(540 + (n - 1) * 110, 800, 46, n < R.stars);
        g.fillStyle = '#12212A'; g.font = '600 44px ' + disp; g.fillText('I scored ' + Math.round(R.score / R.total * 100) + '% in ' + l.name, 540, 910, 840);
        g.fillStyle = '#566871'; g.font = '500 34px ' + disp; g.fillText('Learn a language. Laugh while you do it.', 540, 975, 840);
        c.toBlob(function (b) { if (b) resolve(b); else reject(new Error('no blob')); }, 'image/png');
      }).catch(reject);
    });
  }
  function shareResult() {
    var R = S.result, l = curLang();
    if (!R || !l) return;
    var pct = Math.round(R.score / R.total * 100);
    var label = S.mode === 'daily' ? 'Daily challenge' : levelLabel(S.session.level) + ' test';
    var text = 'I scored ' + R.score + '/' + R.total + ' (' + pct + '%) in ' + l.name + ' on Bhasha. Learn a language, laugh while you do it.';
    var url = '';
    try { if (/^https?:$/.test(location.protocol)) url = location.origin + location.pathname; } catch (e) {}
    makeCardBlob(l, R, label).catch(function () { return null; }).then(function (blob) {
      var data = { title: 'Bhasha', text: text };
      if (url) data.url = url;
      var file = null;
      try { if (blob) file = new File([blob], 'bhasha-result.png', { type: 'image/png' }); } catch (e) {}
      try { if (file && navigator.canShare && navigator.canShare({ files: [file] })) { data.files = [file]; return navigator.share(data); } } catch (e) {}
      if (blob) { downloadBlob('bhasha-result.png', blob); toast('Saved your result card as an image.'); return; }
      if (navigator.share) return navigator.share(data);
      return navigator.clipboard.writeText(text + (url ? ' ' + url : '')).then(function () { toast('Copied your result. Paste it anywhere.'); });
    }).catch(function (e) {
      if (e && e.name === 'AbortError') return;
      toast('Sharing did not work here. Try again.');
    });
  }

  /* ---------- translator ---------- */
  var QUICK = [['easy', 0], ['easy', 1], ['easy', 9], ['hard', 3], ['hard', 4], ['hard', 5], ['hard', 1], ['hard', 7]];

  function langOptions(selected) {
    var all = TR.languages();
    function opt(l) { return '<option value="' + esc(l.id) + '"' + (l.id === selected ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }
    return '<optgroup label="English and Bhasha languages">' + all.filter(function (l) { return l.group === 'bhasha'; }).map(opt).join('') + '</optgroup>' +
      '<optgroup label="More languages (online only)">' + all.filter(function (l) { return l.group === 'extra'; }).map(opt).join('') + '</optgroup>';
  }

  function translateView() {
    var T = S.t, from = TR.find(T.from), to = TR.find(T.to);
    var chips = QUICK.map(function (q, k) {
      return '<button type="button" class="chip" data-a="tphrase" data-set="' + q[0] + '" data-i="' + q[1] + '" data-f="tp' + k + '">' + esc(D.CONCEPTS[q[0]][q[1]].en) + '</button>';
    }).join('');
    var out = '';
    if (T.busy) {
      out = '<p class="small" role="status">Translating…</p>';
    } else if (T.error) {
      out = '<p class="err" role="alert">' + esc(T.error) + '</p>';
    } else if (T.result) {
      var r = T.result;
      var src = r.source === 'phrasebook' ? 'From the Bhasha lessons.'
        : r.source === 'same' ? 'Both languages are the same.'
        : r.source === 'claude' ? 'Translated by Claude. It can make mistakes, so double-check anything important.'
        : 'Machine translation by MyMemory. It can make mistakes, so double-check anything important.';
      out = '<div class="tout"><span class="qlabel">' + esc(to.name) + '</span>' +
        '<p class="tres nat" lang="' + esc(to.lang) + '" dir="auto">' + esc(r.text) + '</p>' +
        (r.roman ? '<p class="rom">' + esc(r.roman) + '</p>' : '') + (r.note ? '<p class="note">' + esc(r.note) + '</p>' : '') +
        '<p class="small">' + src + '</p><div class="actions">' +
        (canSpeak ? '<button class="btn" data-a="tspeak" data-f="tspeak">Listen</button>' : '') +
        '<button class="btn" data-a="tcopy" data-f="tcopy">' + esc(T.copied || 'Copy') + '</button>' +
        (r.source === 'same' ? '' : (favIndex(T.from, T.to, T.q) === -1
          ? '<button class="btn" data-a="tsave" data-f="tsave">Save to phrasebook</button>'
          : '<button class="btn" data-a="tunsave" data-f="tunsave" aria-pressed="true">Saved. Remove</button>')) + '</div></div>';
    }
    return '<div class="screen">' + backBtn('home', 'Back', 'back') +
      '<div><h1 class="title">Translator</h1><p class="lead">Translate between any two languages. Phrases from the lessons work offline and show pronunciation. Anything else uses a free online translator.</p></div>' +
      '<div class="tr-row"><div class="field"><label for="t-from">From</label><select class="input" id="t-from" data-f="t-from">' + langOptions(T.from) + '</select></div>' +
      '<button class="icon-btn swap" data-a="tswap" data-f="tswap" aria-label="Swap languages"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/></svg></button>' +
      '<div class="field"><label for="t-to">To</label><select class="input" id="t-to" data-f="t-to">' + langOptions(T.to) + '</select></div></div>' +
      '<div class="field"><label for="t-in">Text to translate</label>' +
      '<textarea class="input" id="t-in" rows="4" maxlength="' + TR.MAX_CHARS + '" lang="' + esc(from.lang) + '" dir="auto" placeholder="Type or paste something">' + esc(T.text) + '</textarea></div>' +
      '<div class="actions"><button class="btn primary big" data-a="tgo" data-f="tgo">Translate</button><button class="btn big" data-a="tclear" data-f="tclear">Clear</button></div>' +
      '<div aria-live="polite">' + out + '</div>' +
      '<div class="field"><span class="help">Try a phrase from the lessons:</span><div class="chips">' + chips + '</div></div>' +
      '<div class="actions"><button class="btn" data-a="phrasebook" data-f="phrasebook">My phrasebook (' + store.favs.length + ')</button></div>' +
      '<p class="foot">Your own text is translated online (by Claude on the published page, or by the free MyMemory service in a downloaded copy), so it needs an internet connection. Machine translation is not perfect, especially for short words and less common languages.</p></div>';
  }

  var ERRORS = {
    empty: 'Type or paste something to translate.',
    offline: 'Can’t reach the online translator right now. Check your internet connection, or try a lesson phrase below, which works offline.',
    timeout: 'The translator took too long to answer. Please try again.',
    quota: 'The free translator has reached its daily limit. Try again later, or use a lesson phrase below.',
    unsupported: 'The online translator can’t do this language pair right now. Try a different language.',
    unavailable: 'Translation isn’t available right now. Please try again in a moment, or use a lesson phrase below.'
  };

  function doTranslate() {
    var T = S.t, text = T.text.trim();
    T.result = null; T.error = ''; T.copied = '';
    if (!text) { T.error = ERRORS.empty; render('t-in'); return; }
    var token = ++T.token;
    T.q = text;
    T.busy = true; render('tgo');
    TR.translate(T.from, T.to, text, sampleFn ? { sample: sampleFn } : undefined).then(function (r) {
      if (token !== T.token) return;
      T.busy = false; T.result = r;
    }, function (e) {
      if (token !== T.token) return;
      T.busy = false; T.error = ERRORS[e && e.kind] || 'Something went wrong. Please try again.';
    }).then(function () {
      if (S.screen === 'translate' && token === T.token) render('tgo');
    });
  }

  /* ---------- render ---------- */
  function currentView() {
    switch (S.screen) {
      case 'intro': return introView();
      case 'profile': return profileView();
      case 'languages': return languagesView();
      case 'level': return levelView();
      case 'lesson': return lessonView();
      case 'roundIntro': return roundIntroView();
      case 'question': return questionView();
      case 'roundDone': return roundDoneView();
      case 'summary': return summaryView();
      case 'translate': return translateView();
      case 'today': return todayView();
      case 'dailyDone': return dailyDoneView();
      case 'review': return reviewView();
      case 'badges': return badgesView();
      case 'phrasebook': return phrasebookView();
      case 'settings': return settingsView();
      default: return homeView();
    }
  }
  function render(focusKey) {
    stopTimer();
    app.innerHTML = currentView();
    renderStats();
    if (focusKey) {
      var el = app.querySelector('[data-f="' + focusKey + '"]');
      if (el) { try { el.focus({ preventScroll: true }); } catch (e) {} }
    }
    if (S.screen === 'question' && S.picked === null && roundSeconds()) startTimer(roundSeconds());
  }
  function show(screen, focusKey) {
    if (screen !== S.screen) { stopMic(); S.sp = null; }
    if (screen !== 'settings') { S.msg = ''; S.restore = null; }
    S.screen = screen;
    render(focusKey);
    window.scrollTo(0, 0);
  }

  /* ---------- profile form ---------- */
  function submitProfile() {
    var d = S.draft, e = {};
    var name = d.name.trim(), age = parseInt(d.age, 10);
    if (!name) e.name = 'Please tell us your name.';
    if (!(age >= 4 && age <= 100)) e.age = 'Enter an age between 4 and 100.';
    if (!d.known.length && !d.other.trim()) e.known = 'Pick at least one language you know, or type one in.';
    if (!d.learn) e.learn = 'Choose a language, or “Not sure yet”.';
    else if (d.known.indexOf(d.learn) !== -1) e.learn = 'You already know ' + D.nameOf(d.learn) + '. Choose a different language, or untick it above.';
    if (!d.purpose) e.purpose = 'Choose the reason that fits best.';
    S.errors = e;
    var first = e.name ? 'f-name' : e.age ? 'f-age' : e.known ? 'k-english' : e.learn ? 'l-unsure' : e.purpose ? 'p-travel' : null;
    if (first) {
      render();
      var el = app.querySelector('#' + first + ', [data-f="' + first + '"]');
      if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'center' }); }
      return;
    }
    store.profile = { name: name, age: age, known: d.known.slice(), other: d.other.trim(), learn: d.learn, purpose: d.purpose };
    if (byId[d.learn]) store.lastLang = d.learn;
    save();
    S.errors = {};
    if (S.editing) { S.editing = false; S.fromForm = false; show('home'); }
    else { S.fromForm = true; show('languages'); }
  }

  /* ---------- test flow ---------- */
  function startTest() {
    var l = curLang();
    S.session = Q.buildSession(l, S.level);
    S.r = 0; S.q = 0; S.picked = null; S.score = 0; S.rscore = 0; S.rscores = []; S.combo = 0; S.missed = []; S.result = null;
    S.mode = 'test'; S.newBadges = []; S.addedToReview = 0;
    store.lastLang = l.id; save();
    show('roundIntro', 'startround');
  }
  function answer(idx) {
    if (S.picked !== null) return;
    stopTimer();
    var q = S.session.rounds[S.r].questions[S.q];
    S.picked = idx;
    var ok = idx === q.correct;
    if (ok) {
      S.score++; S.rscore++; S.combo++;
      S.fb = pickOne(D.FEEDBACK.right);
      if (S.mode !== 'daily') award(S.session.level === 'hard' ? 15 : 10); /* the daily challenge pays out once, when it ends */
    } else {
      S.combo = 0;
      S.fb = pickOne(idx === -1 ? D.FEEDBACK.late : D.FEEDBACK.wrong);
      S.missed.push(q.ref);
      F.srsMiss(store.srs, F.srsKey(S.lang, q.ref), today());
      save();
    }
    render('next');
    var fbEl = app.querySelector('.fb');
    if (fbEl && fbEl.scrollIntoView) fbEl.scrollIntoView({ block: 'nearest' });
  }
  function finishSession() {
    var level = S.session.level, total = S.session.total, score = S.score;
    var nl = Q.nextLevel(level, score, total);
    var pr = store.progress[S.lang] || { level: 'easy', sessions: 0, best: { easy: 0, hard: 0 }, mastered: { easy: false, hard: false } };
    pr.sessions += 1;
    pr.best[level] = Math.max(pr.best[level] || 0, score);
    if (score / total >= 0.8) pr.mastered[level] = true;
    pr.level = nl.level;
    store.progress[S.lang] = pr;
    store.lastLang = S.lang;
    S.result = { score: score, total: total, nl: nl, stars: Q.stars(score, total) };
    if (score === total) store.stats.perfectTests++;
    if (S.rscores[2] === 5) store.stats.perfectBoss++;
    S.addedToReview = uniqueMissed();
    award(20);
    S.newBadges = checkBadges();
  }
  function uniqueMissed() {
    var seen = {};
    S.missed.forEach(function (r) { seen[r.set + ':' + r.i] = 1; });
    return Object.keys(seen).length;
  }
  function startDaily() {
    var id = dailyLangId(), level = levelFor(id);
    S.lang = id; S.level = level;
    S.session = F.dailyQuiz(id, level, today());
    S.mode = 'daily'; S.r = 0; S.q = 0; S.picked = null; S.score = 0; S.rscore = 0; S.rscores = []; S.combo = 0; S.missed = []; S.result = null; S.newBadges = []; S.addedToReview = 0; S.dailyXp = 0;
    show('question', 'opt0');
  }
  function finishDaily() {
    var d = dailyRec(), score = S.score, total = S.session.total;
    S.dailyXp = 0;
    if (!d.quiz) {
      d.quiz = true; d.score = score; store.stats.daily++;
      S.dailyXp = score * (S.session.level === 'hard' ? 15 : 10) + 20;
      award(S.dailyXp);
    } else save();
    S.result = { score: score, total: total, stars: Q.stars(score, total) };
    S.addedToReview = uniqueMissed();
    S.newBadges = checkBadges();
  }
  function startReview() {
    var queue = F.srsDue(store.srs, today()).slice(0, 10);
    S.rv = { queue: queue, idx: 0, flipped: false, knew: 0, seen: 0, finished: false, again: {} };
    S.sp = null;
    show('review', queue.length ? 'rflip' : 'back');
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-a]');
    if (!b) return;
    var a = b.dataset.a, v = b.dataset.v, f = b.dataset.f, i = parseInt(b.dataset.i, 10);
    switch (a) {
      case 'home':
        S.session = null; S.mode = 'test'; S.resetArmed = false; S.fromForm = false;
        show(store.profile ? 'home' : 'intro'); break;
      case 'intro': show('intro', 'start'); break;
      case 'start':
        if (store.profile) { show('home'); }
        else { S.draft = emptyDraft(); S.errors = {}; S.editing = false; show('profile', 'f-name'); }
        break;
      case 'edit':
        var p = store.profile;
        S.draft = { name: p.name, age: String(p.age), known: p.known.slice(), other: p.other || '', learn: p.learn, purpose: p.purpose };
        S.errors = {}; S.editing = true; show('profile', 'f-name'); break;
      case 'known':
        var k = S.draft.known.indexOf(v);
        if (k === -1) S.draft.known.push(v); else S.draft.known.splice(k, 1);
        delete S.errors.known; render(f); break;
      case 'learn': S.draft.learn = v; delete S.errors.learn; render(f); break;
      case 'purpose': S.draft.purpose = v; delete S.errors.purpose; render(f); break;
      case 'filter': S.filter = v; render(f); break;
      case 'languages': S.fromForm = false; show('languages'); break;
      case 'pick': S.lang = v; show('level'); break;
      case 'level': show('level'); break;
      case 'lesson': S.level = v; show('lesson'); break;
      case 'continue':
        if (b.dataset.lang) S.lang = b.dataset.lang;
        S.level = v; show('lesson'); break;
      case 'say': speak(curLang()[v][i][0], curLang().sp); break;
      case 'sayq':
        var cq = S.session.rounds[S.r].questions[S.q];
        speak(Q.phraseOf(curLang(), cq.ref).native, curLang().sp); break;
      case 'starttest': startTest(); break;
      case 'startround': S.q = 0; S.rscore = 0; S.picked = null; show('question', 'opt0'); break;
      case 'choose': answer(i); break;
      case 'next':
        if (S.q < 4) { S.q++; S.picked = null; show('question', 'opt0'); }
        else if (S.mode === 'daily') { S.rscores.push(S.rscore); finishDaily(); show('dailyDone', 'today'); }
        else { S.rscores.push(S.rscore); show('roundDone', 'nextround'); }
        break;
      case 'nextround':
        if (S.r < 2) { S.r++; S.q = 0; S.rscore = 0; S.picked = null; show('roundIntro', 'startround'); }
        else { finishSession(); show('summary', 'continue'); }
        break;
      case 'translate':
        S.session = null; S.resetArmed = false;
        if (!S.t.init) { S.t.init = true; if (store.profile && byId[store.profile.learn]) S.t.to = store.profile.learn; }
        show('translate', 't-in'); break;
      case 'tswap':
        var oldFrom = S.t.from;
        S.t.from = S.t.to; S.t.to = oldFrom;
        if (S.t.result && S.t.result.source !== 'same') S.t.text = S.t.result.text;
        S.t.result = null; S.t.error = ''; S.t.copied = ''; S.t.token++; S.t.busy = false;
        render(f); break;
      case 'tgo': doTranslate(); break;
      case 'tclear':
        S.t.text = ''; S.t.result = null; S.t.error = ''; S.t.copied = ''; S.t.token++; S.t.busy = false;
        render('t-in'); break;
      case 'tphrase':
        if (S.t.from !== 'english' && !byId[S.t.from]) S.t.from = 'english';
        S.t.text = TR.phraseText(S.t.from, b.dataset.set, i);
        if (S.t.to === S.t.from) S.t.to = S.t.from === 'english' ? (store.profile && byId[store.profile.learn] ? store.profile.learn : 'hindi') : 'english';
        doTranslate(); break;
      case 'tspeak': if (S.t.result) speak(S.t.result.text, TR.find(S.t.to).sp); break;
      case 'tcopy':
        var done = function (m) { S.t.copied = m; render('tcopy'); };
        try { navigator.clipboard.writeText(S.t.result.text).then(function () { done('Copied'); }, function () { done('Select the text to copy'); }); }
        catch (e2) { done('Select the text to copy'); }
        break;
      case 'today': S.session = null; S.mode = 'test'; show('today', 'back'); break;
      case 'dsay':
        var dp = F.dailyPhrase(dailyLangId(), today());
        speak(dp.native, byId[dailyLangId()].sp); break;
      case 'dgot':
        dailyRec().phrase = true; award(5); checkBadges(); render('dsay'); break;
      case 'dstart': startDaily(); break;
      case 'review': startReview(); break;
      case 'rflip': S.rv.flipped = true; S.sp = null; render('ryes'); break;
      case 'rsay':
        var rk = F.srsParse(S.rv.queue[S.rv.idx]);
        if (rk) speak(Q.phraseOf(byId[rk.lang], rk.ref).native, byId[rk.lang].sp); break;
      case 'rgrade':
        var gKey = S.rv.queue[S.rv.idx], knew = v === '1';
        F.srsGrade(store.srs, gKey, knew, today());
        store.stats.reviewed++; S.rv.seen++;
        if (knew) { S.rv.knew++; award(3); }
        else { save(); if (!S.rv.again[gKey]) { S.rv.again[gKey] = 1; S.rv.queue.push(gKey); } }
        S.rv.idx++; S.rv.flipped = false; S.sp = null;
        if (S.rv.idx >= S.rv.queue.length) S.rv.finished = true;
        S.newBadges = checkBadges();
        render(S.rv.finished ? 'today' : 'rflip'); break;
      case 'mic':
        var mLang = byId[b.dataset.lang], mp = mLang[b.dataset.set][i];
        startMic(b.dataset.id, mLang, { native: mp[0], roman: mp[1] }, f); break;
      case 'badges': show('badges', 'back'); break;
      case 'phrasebook': show('phrasebook', 'back'); break;
      case 'settings': S.msg = ''; S.msgKind = ''; show('settings', 'back'); break;
      case 'favsay':
        var fv = store.favs[i], fl = fv && TR.find(fv.to);
        if (fl && fl.sp) speak(fv.out, fl.sp); break;
      case 'favdel': store.favs.splice(i, 1); save(); render('phrasebook'); break;
      case 'tsave':
        if (!S.t.result || favIndex(S.t.from, S.t.to, S.t.q) !== -1) break;
        if (store.favs.length >= 200) { toast('Your phrasebook is full. Remove a phrase to add another.'); break; }
        store.favs.unshift({ from: S.t.from, to: S.t.to, text: S.t.q, out: S.t.result.text, roman: S.t.result.roman || '' });
        save(); render('tunsave'); toast('Saved to your phrasebook.'); checkBadges(); break;
      case 'tunsave':
        var ui = favIndex(S.t.from, S.t.to, S.t.q);
        if (ui !== -1) { store.favs.splice(ui, 1); save(); }
        render('tsave'); break;
      case 'backup': doBackup(); break;
      case 'restore-no': S.restore = null; render('settings'); break;
      case 'restore-yes':
        if (!S.restore) break;
        store = S.restore.store; S.restore = null; save();
        S.session = null; S.mode = 'test'; S.lang = null;
        show('home'); toast('Progress restored.'); break;
      case 'install':
        if (installPrompt) {
          var ip = installPrompt; installPrompt = null; setInstallBtn();
          try { ip.prompt(); if (ip.userChoice) ip.userChoice.then(function () { if (S.screen === 'settings') render(); }); } catch (e3) {}
        }
        break;
      case 'share': shareResult(); break;
      case 'reset': S.resetArmed = true; render('rno'); break;
      case 'reset-no': S.resetArmed = false; render('reset'); break;
      case 'reset-yes':
        try { localStorage.removeItem(KEY); } catch (e) {}
        store = F.defaultStore();
        S.resetArmed = false; show('intro'); break;
    }
  });

  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (S.screen === 'translate' && t.id === 't-in') { S.t.text = t.value; return; }
    if (S.screen !== 'profile' || !S.draft) return;
    if (t.id === 'f-name') S.draft.name = t.value;
    else if (t.id === 'f-age') S.draft.age = t.value;
    else if (t.id === 'f-other') S.draft.other = t.value;
  });
  document.addEventListener('change', function (ev) {
    var id = ev.target.id;
    if (id === 'f-timer') { store.timer = ev.target.checked; save(); }
    else if (id === 'f-restore') readBackup(ev.target.files && ev.target.files[0]);
    else if (S.screen === 'translate' && (id === 't-from' || id === 't-to')) {
      if (id === 't-from') S.t.from = ev.target.value; else S.t.to = ev.target.value;
      S.t.result = null; S.t.error = ''; S.t.copied = ''; S.t.token++; S.t.busy = false;
      render(id);
    }
  });
  document.addEventListener('submit', function (ev) {
    if (ev.target.id === 'pf') { ev.preventDefault(); submitProfile(); }
  });

  render();
})();
