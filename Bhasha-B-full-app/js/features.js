/*
 * Bhasha features: the logic behind the daily challenge, flashcard review,
 * badges, progress backup and speaking score. Pure functions, no DOM,
 * so it can be unit-tested in Node. app.js does the screens and storage.
 */
(function (root) {
  'use strict';

  var D = (typeof module === 'object' && module.exports) ? require('./data.js') : root.BhashaData;
  var Q = (typeof module === 'object' && module.exports) ? require('./quiz.js') : root.BhashaQuiz;

  /* ---------- dates ("YYYY-MM-DD" strings) ---------- */
  function dstr(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return dstr(d); }
  function daysBetween(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
  function validDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && dstr(parse(s)) === s; }

  /* ---------- seeded random, so everyone gets the same daily phrase ---------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function seeded(str) {
    var a = hash(str);
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- daily phrase and daily challenge ---------- */
  /* One phrase per day for a language. Same date and language always give the same phrase. */
  function dailyPhrase(langId, date) {
    var rnd = seeded('phrase|' + langId + '|' + date);
    var all = [];
    ['easy', 'hard'].forEach(function (set) { D.CONCEPTS[set].forEach(function (c, i) { all.push({ set: set, i: i }); }); });
    var ref = all[Math.floor(rnd() * all.length)];
    var lang = D.byId[langId];
    var p = lang[ref.set][ref.i];
    return { ref: ref, native: p[0], roman: p[1], note: p[2] || '', en: D.CONCEPTS[ref.set][ref.i].en, tip: D.CONCEPTS[ref.set][ref.i].tip };
  }

  /* Five mixed questions, the same for the same date, language and level. */
  function dailyQuiz(langId, level, date) {
    var lang = D.byId[langId];
    var rnd = seeded('quiz|' + langId + '|' + level + '|' + date);
    var s = Q.buildSession(lang, level, rnd);
    var round = s.rounds[2];
    return {
      lang: langId, level: level, total: round.questions.length,
      rounds: [{ id: 'daily', title: 'Daily challenge', blurb: 'Five quick questions to keep your streak alive.', seconds: level === 'hard' ? 20 : 0, questions: round.questions }]
    };
  }

  /* Which language the daily content uses. */
  function dailyLang(lastLang, learn, date) {
    if (lastLang && D.byId[lastLang]) return lastLang;
    if (learn && D.byId[learn]) return learn;
    return D.LANGS[hash('lang|' + date) % D.LANGS.length].id;
  }

  /* ---------- spaced repetition (Leitner boxes) ---------- */
  var BOX_DAYS = [0, 1, 2, 4, 8, 16]; /* index = box, 1..5 */
  var MAX_BOX = 5;

  function srsKey(langId, ref) { return langId + ':' + ref.set + ':' + ref.i; }
  function srsParse(key) {
    var p = String(key).split(':');
    if (p.length !== 3 || !D.byId[p[0]] || (p[1] !== 'easy' && p[1] !== 'hard')) return null;
    var i = +p[2];
    if (!(i >= 0 && i < D.CONCEPTS[p[1]].length)) return null;
    return { lang: p[0], ref: { set: p[1], i: i } };
  }
  /* Add a missed phrase. If it is already known, it drops back to box 1. */
  function srsMiss(srs, key, today) {
    if (!srsParse(key)) return srs;
    srs[key] = { box: 1, due: today };
    return srs;
  }
  function srsGrade(srs, key, knew, today) {
    var c = srs[key];
    if (!c) return srs;
    if (knew) {
      if (c.box >= MAX_BOX) { delete srs[key]; return srs; } /* learned: graduate out of the deck */
      c.box += 1; c.due = addDays(today, BOX_DAYS[c.box]);
    } else {
      c.box = 1; c.due = today;
    }
    return srs;
  }
  function srsDue(srs, today) {
    return Object.keys(srs).filter(function (k) { return srs[k].due <= today && srsParse(k); })
      .sort(function (a, b) { return (srs[a].box - srs[b].box) || (srs[a].due < srs[b].due ? -1 : 1) || (a < b ? -1 : 1); });
  }
  function srsNext(srs, today) {
    var soon = null;
    Object.keys(srs).forEach(function (k) { if (srs[k].due > today && (soon === null || srs[k].due < soon)) soon = srs[k].due; });
    return soon;
  }

  /* ---------- activity strip (last 7 days) ---------- */
  function lastDays(days, today, n) {
    var out = [];
    for (var k = n - 1; k >= 0; k--) { var d = addDays(today, -k); out.push({ date: d, on: days.indexOf(d) !== -1 }); }
    return out;
  }

  /* ---------- badges ---------- */
  var BADGES = [
    { id: 'first-test', name: 'First steps', desc: 'Finish your first test.', test: function (s) { return totalSessions(s) >= 1; } },
    { id: 'streak-3', name: 'Warming up', desc: 'Reach a 3-day streak.', test: function (s) { return s.bestStreak >= 3; } },
    { id: 'streak-7', name: '7-day streak', desc: 'Learn 7 days in a row.', test: function (s) { return s.bestStreak >= 7; } },
    { id: 'streak-30', name: 'Unstoppable', desc: 'Learn 30 days in a row.', test: function (s) { return s.bestStreak >= 30; } },
    { id: 'hard-pass', name: 'First Hard level passed', desc: 'Score 80% or more on a Hard test.', test: function (s) { return anyMastered(s, 'hard'); } },
    { id: 'boss-perfect', name: 'Boss round perfect', desc: 'Get 5 out of 5 in a Boss round.', test: function (s) { return s.stats.perfectBoss >= 1; } },
    { id: 'perfect-test', name: 'Flawless', desc: 'Score 15 out of 15 in a test.', test: function (s) { return s.stats.perfectTests >= 1; } },
    { id: 'polyglot', name: 'Polyglot', desc: 'Take tests in 3 different languages.', test: function (s) { return Object.keys(s.progress).length >= 3; } },
    { id: 'xp-500', name: '500 XP', desc: 'Earn 500 XP.', test: function (s) { return s.xp >= 500; } },
    { id: 'daily-1', name: 'Daily habit', desc: 'Finish a daily challenge.', test: function (s) { return s.stats.daily >= 1; } },
    { id: 'daily-7', name: 'Daily regular', desc: 'Finish 7 daily challenges.', test: function (s) { return s.stats.daily >= 7; } },
    { id: 'review-20', name: 'Memory builder', desc: 'Review 20 flashcards.', test: function (s) { return s.stats.reviewed >= 20; } },
    { id: 'speaker', name: 'Say it loud', desc: 'Score 80% or more in speaking practice.', test: function (s) { return s.stats.speakBest >= 80; } },
    { id: 'phrasebook', name: 'Collector', desc: 'Save 5 phrases in your phrasebook.', test: function (s) { return s.favs.length >= 5; } },
    { id: 'backup', name: 'Safe and sound', desc: 'Back up your progress to a file.', test: function (s) { return !!s.lastBackup; } }
  ];
  function totalSessions(s) { return Object.keys(s.progress).reduce(function (n, k) { return n + (s.progress[k].sessions || 0); }, 0); }
  function anyMastered(s, level) { return Object.keys(s.progress).some(function (k) { return s.progress[k].mastered && s.progress[k].mastered[level]; }); }

  /* Returns the badges earned for the first time, and records them in store.badges. */
  function newBadges(store, today) {
    var got = [];
    BADGES.forEach(function (b) {
      if (!store.badges[b.id] && b.test(store)) { store.badges[b.id] = today; got.push(b); }
    });
    return got;
  }

  /* ---------- backup ---------- */
  var BACKUP_FORMAT = 1;
  function defaultStore() {
    return {
      profile: null, progress: {}, xp: 0, streak: 0, bestStreak: 0, last: '', lastLang: '', timer: true,
      days: [], daily: { date: '', phrase: false, quiz: false, score: 0 },
      srs: {}, badges: {}, favs: [],
      stats: { perfectBoss: 0, perfectTests: 0, daily: 0, reviewed: 0, speakBest: 0 },
      lastBackup: ''
    };
  }
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function num(x, max) { x = +x; return isFinite(x) && x >= 0 ? Math.min(Math.floor(x), max || 1e9) : 0; }
  function str(x, max) { return typeof x === 'string' ? x.slice(0, max || 200) : ''; }

  /* Clean untrusted data (a backup file, or old saved data) into a valid store. Unknown fields are dropped. */
  function sanitize(raw) {
    var s = defaultStore();
    if (!isObj(raw)) return s;
    if (isObj(raw.profile)) {
      var p = raw.profile;
      s.profile = {
        name: str(p.name, 30), age: num(p.age, 100), known: Array.isArray(p.known) ? p.known.filter(function (k) { return k === 'english' || D.byId[k]; }) : [],
        other: str(p.other, 60), learn: (p.learn === 'unsure' || D.byId[p.learn]) ? p.learn : 'unsure',
        purpose: D.PURPOSES.some(function (x) { return x.id === p.purpose; }) ? p.purpose : D.PURPOSES[0].id
      };
      if (!s.profile.name) s.profile = null;
    }
    if (isObj(raw.progress)) {
      Object.keys(raw.progress).forEach(function (id) {
        var r = raw.progress[id];
        if (!D.byId[id] || !isObj(r)) return;
        s.progress[id] = {
          level: r.level === 'hard' ? 'hard' : 'easy', sessions: num(r.sessions, 100000),
          best: { easy: num(r.best && r.best.easy, 15), hard: num(r.best && r.best.hard, 15) },
          mastered: { easy: !!(r.mastered && r.mastered.easy), hard: !!(r.mastered && r.mastered.hard) }
        };
      });
    }
    s.xp = num(raw.xp, 100000000); s.streak = num(raw.streak, 100000); s.bestStreak = Math.max(num(raw.bestStreak, 100000), s.streak);
    s.last = validDate(raw.last) ? raw.last : '';
    s.lastLang = D.byId[raw.lastLang] ? raw.lastLang : '';
    s.timer = raw.timer !== false;
    if (Array.isArray(raw.days)) s.days = raw.days.filter(validDate).slice(-120);
    if (isObj(raw.daily)) s.daily = { date: validDate(raw.daily.date) ? raw.daily.date : '', phrase: !!raw.daily.phrase, quiz: !!raw.daily.quiz, score: num(raw.daily.score, 5) };
    if (isObj(raw.srs)) {
      Object.keys(raw.srs).slice(0, 2000).forEach(function (k) {
        var c = raw.srs[k];
        if (srsParse(k) && isObj(c) && validDate(c.due)) s.srs[k] = { box: Math.min(Math.max(num(c.box, MAX_BOX), 1), MAX_BOX), due: c.due };
      });
    }
    if (isObj(raw.badges)) {
      BADGES.forEach(function (b) { if (validDate(raw.badges[b.id])) s.badges[b.id] = raw.badges[b.id]; });
    }
    if (Array.isArray(raw.favs)) {
      s.favs = raw.favs.filter(function (f) { return isObj(f) && typeof f.text === 'string' && typeof f.out === 'string' && typeof f.from === 'string' && typeof f.to === 'string'; })
        .slice(0, 200).map(function (f) { return { from: str(f.from, 30), to: str(f.to, 30), text: str(f.text, 500), out: str(f.out, 1000), roman: str(f.roman, 1000) }; });
    }
    if (isObj(raw.stats)) {
      Object.keys(s.stats).forEach(function (k) { s.stats[k] = num(raw.stats[k], 1000000); });
    }
    s.lastBackup = validDate(raw.lastBackup) ? raw.lastBackup : '';
    return s;
  }

  function makeBackup(store, now) {
    return { app: 'bhasha', format: BACKUP_FORMAT, exported: (now || new Date()).toISOString(), data: store };
  }
  /* Returns { ok: true, store, exported } or { ok: false, error }. */
  function parseBackup(text) {
    var j;
    try { j = JSON.parse(text); } catch (e) { return { ok: false, error: 'That file is not a Bhasha backup. It could not be read as JSON.' }; }
    if (!isObj(j) || j.app !== 'bhasha' || !isObj(j.data)) return { ok: false, error: 'That file is not a Bhasha backup.' };
    if (typeof j.format !== 'number' || j.format > BACKUP_FORMAT) return { ok: false, error: 'This backup was made by a newer version of Bhasha. Please update the app and try again.' };
    var s = sanitize(j.data);
    if (!s.profile) return { ok: false, error: 'This backup has no profile in it, so there is nothing to restore.' };
    return { ok: true, store: s, exported: typeof j.exported === 'string' ? j.exported.slice(0, 10) : '' };
  }
  function backupName(date) { return 'bhasha-backup-' + date + '.json'; }

  /* ---------- speaking score ---------- */
  function normSpeech(s) {
    return String(s).normalize('NFKD').toLowerCase()
      .replace(/[̀-ͯ]/g, '') /* Latin accents; marks in Indian scripts are kept */
      .normalize('NFC')
      .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  function levenshtein(a, b) {
    var A = Array.from(a), B = Array.from(b), prev = [], cur, i, j;
    for (j = 0; j <= B.length; j++) prev[j] = j;
    for (i = 1; i <= A.length; i++) {
      cur = [i];
      for (j = 1; j <= B.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[B.length];
  }
  function similarity(heard, target) {
    var a = normSpeech(heard), b = normSpeech(target);
    if (!a || !b) return 0;
    var len = Math.max(Array.from(a).length, Array.from(b).length);
    return Math.round((1 - levenshtein(a, b) / len) * 100);
  }
  /* Score a spoken attempt against the native text, or its written pronunciation if the browser answered in Latin letters. */
  function speakScore(heardList, native, roman) {
    var best = 0;
    (heardList || []).forEach(function (h) { best = Math.max(best, similarity(h, native), similarity(h, roman)); });
    return best;
  }
  function speakVerdict(score) {
    return score >= 80 ? 'Great! That sounded right.' : score >= 50 ? 'Close! Listen once more and try again.' : 'Not quite yet. Tap Listen, then try again.';
  }

  var api = {
    dstr: dstr, addDays: addDays, daysBetween: daysBetween, validDate: validDate, seeded: seeded, hash: hash,
    dailyPhrase: dailyPhrase, dailyQuiz: dailyQuiz, dailyLang: dailyLang,
    BOX_DAYS: BOX_DAYS, MAX_BOX: MAX_BOX, srsKey: srsKey, srsParse: srsParse, srsMiss: srsMiss, srsGrade: srsGrade, srsDue: srsDue, srsNext: srsNext,
    lastDays: lastDays, BADGES: BADGES, newBadges: newBadges,
    defaultStore: defaultStore, sanitize: sanitize, makeBackup: makeBackup, parseBackup: parseBackup, backupName: backupName,
    similarity: similarity, speakScore: speakScore, speakVerdict: speakVerdict
  };

  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.BhashaFeatures = api; }
})(typeof self !== 'undefined' ? self : this);
