/*
 * Bhasha quiz engine. Pure functions, no DOM, so it can be unit-tested in Node.
 *
 * A test session has 3 rounds of 5 questions. The total score decides the
 * next level: 80% or more moves up, 40% or less moves down, otherwise stay.
 */
(function (root) {
  'use strict';

  var D = (typeof module === 'object' && module.exports) ? require('./data.js') : root.BhashaData;

  var QUESTIONS_PER_ROUND = 5;

  var ROUNDS = [
    { id: 'warmup', title: 'Warm-up', blurb: 'What do these mean? Tota has slipped in a few silly answers.' },
    { id: 'silly', title: 'Silly situations', blurb: 'Pick the right phrase for each ridiculous moment.' },
    { id: 'boss', title: 'Boss round', blurb: 'A mix of everything. Tota is nervous for you.' }
  ];

  var SECONDS_HARD = [20, 20, 15];

  /* ---------- small helpers ---------- */
  function shuffle(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pickOne(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  function range(n) { var r = []; for (var i = 0; i < n; i++) r.push(i); return r; }
  function key(ref) { return ref.set + ':' + ref.i; }

  function conceptOf(ref) { return D.CONCEPTS[ref.set][ref.i]; }
  function phraseOf(lang, ref) {
    var p = lang[ref.set][ref.i];
    return { native: p[0], roman: p[1], note: p[2] || '', en: conceptOf(ref).en };
  }

  /* ---------- pools ---------- */
  function poolFor(level, rnd) {
    var pool = [];
    var easyN = D.CONCEPTS.easy.length, hardN = D.CONCEPTS.hard.length;
    if (level === 'easy') {
      range(easyN).forEach(function (i) { pool.push({ set: 'easy', i: i }); });
      return pool;
    }
    range(hardN).forEach(function (i) { pool.push({ set: 'hard', i: i }); });
    shuffle(range(easyN), rnd).slice(0, 4).forEach(function (i) { pool.push({ set: 'easy', i: i }); });
    return pool;
  }

  /* Choose n refs, preferring the ones used least so far, random among ties. */
  function chooseRefs(pool, n, used, rnd) {
    var keyed = pool.map(function (r) { return { r: r, u: used[key(r)] || 0, x: rnd() }; });
    keyed.sort(function (a, b) { return (a.u - b.u) || (a.x - b.x); });
    var out = keyed.slice(0, n).map(function (k) { return k.r; });
    out.forEach(function (r) { used[key(r)] = (used[key(r)] || 0) + 1; });
    return out;
  }

  function others(pool, ref, n, rnd) {
    return shuffle(pool.filter(function (r) { return key(r) !== key(ref); }), rnd).slice(0, n);
  }

  function finish(q, options, rnd) {
    var shuffled = shuffle(options, rnd);
    q.options = shuffled;
    q.correct = shuffled.findIndex(function (o) { return o.ok === true; });
    return q;
  }

  /* ---------- question builders ---------- */
  function qMeaning(pool, ref, rnd) {
    var opts = [{ kind: 'text', text: conceptOf(ref).en, ok: true }];
    others(pool, ref, 2, rnd).forEach(function (r) { opts.push({ kind: 'text', text: conceptOf(r).en }); });
    opts.push({ kind: 'text', text: pickOne(D.SILLY, rnd), silly: true });
    return finish({ type: 'meaning', ref: ref }, opts, rnd);
  }

  function phraseOptions(pool, ref, rnd) {
    var opts = [{ kind: 'phrase', ref: ref, ok: true }];
    others(pool, ref, 3, rnd).forEach(function (r) { opts.push({ kind: 'phrase', ref: r }); });
    return opts;
  }

  function qScene(pool, ref, rnd) {
    var q = { type: 'scene', ref: ref, scene: pickOne(conceptOf(ref).scenes, rnd) };
    return finish(q, phraseOptions(pool, ref, rnd), rnd);
  }

  function qReverse(pool, ref, rnd) {
    return finish({ type: 'reverse', ref: ref }, phraseOptions(pool, ref, rnd), rnd);
  }

  function qTrueFalse(pool, ref, rnd) {
    var truth = rnd() < 0.5;
    var claimRef = truth ? ref : others(pool, ref, 1, rnd)[0];
    var q = {
      type: 'tf', ref: ref, claimRef: claimRef, claim: conceptOf(claimRef).en,
      options: [{ kind: 'text', text: 'True' }, { kind: 'text', text: 'False' }],
      correct: truth ? 0 : 1
    };
    q.options[q.correct].ok = true;
    return q;
  }

  var BUILDERS = { meaning: qMeaning, scene: qScene, reverse: qReverse, tf: qTrueFalse };

  /* ---------- sessions ---------- */
  function buildSession(lang, level, rnd) {
    rnd = rnd || Math.random;
    var pool = poolFor(level, rnd);
    var used = {};
    var plans = [
      range(QUESTIONS_PER_ROUND).map(function () { return 'meaning'; }),
      range(QUESTIONS_PER_ROUND).map(function () { return 'scene'; }),
      shuffle(['reverse', 'reverse', 'scene', 'tf', 'meaning'], rnd)
    ];
    var rounds = ROUNDS.map(function (meta, r) {
      var refs = chooseRefs(pool, QUESTIONS_PER_ROUND, used, rnd);
      var questions = refs.map(function (ref, k) { return BUILDERS[plans[r][k]](pool, ref, rnd); });
      return {
        id: meta.id, title: meta.title, blurb: meta.blurb,
        seconds: level === 'hard' ? SECONDS_HARD[r] : 0,
        questions: questions
      };
    });
    return { lang: lang.id, level: level, rounds: rounds, total: ROUNDS.length * QUESTIONS_PER_ROUND };
  }

  /* ---------- levelling ---------- */
  function nextLevel(level, score, total) {
    var pct = total ? score / total : 0;
    if (pct >= 0.8) {
      return { level: 'hard', move: 'up', atTop: level === 'hard' };
    }
    if (pct <= 0.4) {
      return { level: 'easy', move: 'down', atBottom: level === 'easy' };
    }
    return { level: level, move: 'same' };
  }

  function stars(score, total) {
    var pct = total ? score / total : 0;
    return pct >= 0.8 ? 3 : pct >= 0.55 ? 2 : 1;
  }

  function recommend(learnId, knownIds, progress, age) {
    if (progress && progress.level) {
      return { level: progress.level, reason: 'Picked from how your last test went.' };
    }
    var rel = D.relatedKnown(learnId, knownIds || []);
    if (rel.length) {
      return { level: 'hard', reason: 'You know ' + D.nameOf(rel[0]) + ', a relative of ' + D.nameOf(learnId) + ', so many words will feel familiar.' };
    }
    if (age && age <= 10) {
      return { level: 'easy', reason: 'A gentle start with plenty of giggles.' };
    }
    return { level: 'easy', reason: 'The best place to start with a new language.' };
  }

  var api = {
    ROUNDS: ROUNDS, QUESTIONS_PER_ROUND: QUESTIONS_PER_ROUND,
    conceptOf: conceptOf, phraseOf: phraseOf, poolFor: poolFor,
    buildSession: buildSession, nextLevel: nextLevel, stars: stars, recommend: recommend
  };

  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.BhashaQuiz = api; }
})(typeof self !== 'undefined' ? self : this);
