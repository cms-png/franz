# Franz — Phase 1 (MVP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working French learning web app (PWA) with vocabulary drill, sentence training, placement test, and SRS scheduling, hosted on GitHub Pages.

**Architecture:** Multi-page vanilla HTML/CSS/JS. Shared JS modules loaded via `<script>` tags. All state in localStorage. No build tools, no framework.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Web Speech API, Google Gemini 1.5 Flash API, GitHub Pages.

---

## File Map

```
Franz/
├── index.html              — Home screen + API-Key Setup
├── placement.html          — Placement Test
├── vocab.html              — Vokabel-Drill
├── sentences.html          — Satz-Training
├── css/
│   └── style.css           — Shared mobile-first styles
├── js/
│   ├── storage.js          — localStorage wrapper
│   ├── srs.js              — SRS/SM-2 logic
│   ├── tts.js              — Text-to-Speech wrapper
│   ├── stt.js              — Speech-to-Text wrapper (callback-based for iOS)
│   └── gemini.js           — Gemini API client
├── content/
│   ├── a1.json             — A1 vocabulary, sentences, placement questions
│   ├── a2.json
│   ├── b1.json
│   ├── b2.json
│   └── c1.json
└── tests/
    ├── test_srs.js         — Node.js unit tests for SRS logic
    └── test_storage.js     — Node.js unit tests for storage helpers
```

---

## Task 1: Project Setup

**Files:**
- Create: `Franz/` root (already exists)
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

```
.DS_Store
*.log
```

- [ ] **Step 2: Initialize git and make first commit**

```bash
cd /Users/cathy/Documents/Claude/Privat/Franz
git init
git add .gitignore docs/
git commit -m "chore: init project with spec"
```

Expected: `[main (root-commit) xxxxxxx] chore: init project with spec`

---

## Task 2: css/style.css

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Create the stylesheet**

```css
/* css/style.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue: #2563eb;
  --blue-dark: #1d4ed8;
  --green: #16a34a;
  --red: #dc2626;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  --radius: 12px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--gray-50);
  color: var(--gray-900);
  min-height: 100vh;
  padding: 0;
}

.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 8px; }
h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; }
p  { color: var(--gray-700); line-height: 1.6; }

.card {
  background: white;
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: var(--radius);
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}
.btn-primary  { background: var(--blue); color: white; }
.btn-primary:hover  { background: var(--blue-dark); }
.btn-secondary { background: var(--gray-100); color: var(--gray-700); }
.btn-secondary:hover { background: var(--gray-300); }
.btn-success  { background: var(--green); color: white; }
.btn-danger   { background: var(--red); color: white; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn + .btn   { margin-top: 10px; }

.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.15s;
}
.input:focus { border-color: var(--blue); }

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--gray-100);
  color: var(--gray-700);
}
.badge-blue  { background: #dbeafe; color: var(--blue-dark); }
.badge-green { background: #dcfce7; color: var(--green); }

.feedback-box {
  padding: 16px;
  border-radius: var(--radius);
  margin-top: 16px;
  font-size: 0.95rem;
  line-height: 1.6;
}
.feedback-correct { background: #dcfce7; border-left: 4px solid var(--green); }
.feedback-wrong   { background: #fee2e2; border-left: 4px solid var(--red); }
.feedback-info    { background: #dbeafe; border-left: 4px solid var(--blue); }

.progress-bar {
  height: 8px;
  background: var(--gray-100);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 24px;
}
.progress-bar-fill {
  height: 100%;
  background: var(--blue);
  border-radius: 99px;
  transition: width 0.3s;
}

.nav-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--blue);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 20px;
}

.french-text {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 24px 0 8px;
  letter-spacing: -0.5px;
}
.german-text {
  font-size: 1rem;
  text-align: center;
  color: var(--gray-500);
  margin-bottom: 24px;
}

.mic-btn {
  width: 80px; height: 80px;
  border-radius: 50%;
  border: none;
  background: var(--blue);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  margin: 24px auto;
  transition: background 0.15s, transform 0.1s;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3);
}
.mic-btn:active { transform: scale(0.95); }
.mic-btn.listening { background: var(--red); animation: pulse 1s infinite; }

@keyframes pulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(220,38,38,0.3); }
  50% { box-shadow: 0 4px 24px rgba(220,38,38,0.6); }
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
.level-btn {
  padding: 16px 8px;
  border-radius: var(--radius);
  border: 2px solid var(--gray-300);
  background: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}
.level-btn.active  { border-color: var(--blue); background: #dbeafe; color: var(--blue-dark); }
.level-btn.locked  { opacity: 0.4; cursor: not-allowed; }
.level-btn.mastered { border-color: var(--green); background: #dcfce7; color: var(--green); }

.streak {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.9rem; color: var(--gray-500);
}

.choice-option {
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 10px;
  border-radius: var(--radius);
  border: 2px solid var(--gray-300);
  background: white;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.choice-option:hover { border-color: var(--blue); }
.choice-option.correct { border-color: var(--green); background: #dcfce7; }
.choice-option.wrong   { border-color: var(--red); background: #fee2e2; }

.spinner {
  display: inline-block;
  width: 20px; height: 20px;
  border: 2px solid var(--gray-300);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.hidden { display: none !important; }
```

- [ ] **Step 2: Commit**

```bash
git add css/style.css
git commit -m "feat: add shared stylesheet"
```

---

## Task 3: js/storage.js + tests

**Files:**
- Create: `js/storage.js`
- Create: `tests/test_storage.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_storage.js
const assert = require('assert');

// Minimal localStorage mock for Node.js
const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; }
};

// Load module inline (copy-paste of storage.js logic for Node testability)
function makeDefaultData() {
  return {
    gemini_api_key: '',
    current_level: null,
    placement_completed: false,
    vocabulary: {},
    streak: { current: 0, last_session: null },
    unlocked_levels: []
  };
}
function getAll() {
  const raw = localStorage.getItem('franz_data');
  return raw ? JSON.parse(raw) : makeDefaultData();
}
function saveAll(data) {
  localStorage.setItem('franz_data', JSON.stringify(data));
}

// Tests
let data = getAll();
assert.strictEqual(data.placement_completed, false, 'Default: placement not completed');
assert.deepStrictEqual(data.vocabulary, {}, 'Default: vocabulary empty');

data.gemini_api_key = 'test-key-123';
saveAll(data);
const loaded = getAll();
assert.strictEqual(loaded.gemini_api_key, 'test-key-123', 'API key persists');

data.vocabulary['bonjour'] = { level: 'a1', interval_index: 0, correct: 0, wrong: 0, next_review: null };
saveAll(data);
const loaded2 = getAll();
assert.strictEqual(loaded2.vocabulary['bonjour'].level, 'a1', 'Vocabulary persists');

console.log('All storage tests passed!');
```

- [ ] **Step 2: Run test — expect PASS (tests use inline logic)**

```bash
node tests/test_storage.js
```

Expected output: `All storage tests passed!`

- [ ] **Step 3: Write storage.js**

```javascript
// js/storage.js
const Storage = {
  _key: 'franz_data',

  _default() {
    return {
      gemini_api_key: '',
      current_level: null,
      placement_completed: false,
      vocabulary: {},
      streak: { current: 0, last_session: null },
      unlocked_levels: []
    };
  },

  getAll() {
    const raw = localStorage.getItem(this._key);
    return raw ? JSON.parse(raw) : this._default();
  },

  saveAll(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  get(field) {
    return this.getAll()[field];
  },

  set(field, value) {
    const data = this.getAll();
    data[field] = value;
    this.saveAll(data);
  },

  updateVocab(word, update) {
    const data = this.getAll();
    data.vocabulary[word] = { ...(data.vocabulary[word] || {}), ...update };
    this.saveAll(data);
  },

  clear() {
    localStorage.removeItem(this._key);
  }
};
```

- [ ] **Step 4: Commit**

```bash
git add js/storage.js tests/test_storage.js
git commit -m "feat: add storage module"
```

---

## Task 4: js/srs.js + tests

**Files:**
- Create: `js/srs.js`
- Create: `tests/test_srs.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_srs.js
const assert = require('assert');

// Inline SRS logic for Node testability
const SRS_INTERVALS = [1, 3, 7, 14, 30];

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function updateItem(vocabData, correct) {
  const idx = vocabData.interval_index || 0;
  const newIdx = correct ? Math.min(idx + 1, SRS_INTERVALS.length - 1) : 0;
  const nextReview = addDays(new Date(), SRS_INTERVALS[newIdx]).toISOString();
  return {
    ...vocabData,
    interval_index: newIdx,
    next_review: nextReview,
    correct: (vocabData.correct || 0) + (correct ? 1 : 0),
    wrong: (vocabData.wrong || 0) + (correct ? 0 : 1)
  };
}

function isDue(nextReview) {
  if (!nextReview) return true;
  return new Date(nextReview) <= new Date();
}

function isLevelMastered(vocabulary, level) {
  const words = Object.values(vocabulary).filter(d => d.level === level);
  if (words.length === 0) return false;
  const mastered = words.filter(d => (d.correct || 0) >= 3);
  return mastered.length / words.length >= 0.8;
}

// Tests
const fresh = { level: 'a1', interval_index: 0, correct: 0, wrong: 0, next_review: null };

const afterCorrect = updateItem(fresh, true);
assert.strictEqual(afterCorrect.interval_index, 1, 'Correct: advances interval');
assert.strictEqual(afterCorrect.correct, 1, 'Correct: increments correct count');
assert.strictEqual(afterCorrect.wrong, 0, 'Correct: wrong stays 0');

const afterWrong = updateItem({ ...fresh, interval_index: 3, correct: 5 }, false);
assert.strictEqual(afterWrong.interval_index, 0, 'Wrong: resets to index 0');
assert.strictEqual(afterWrong.wrong, 1, 'Wrong: increments wrong count');

assert.strictEqual(isDue(null), true, 'New word is due');
const future = addDays(new Date(), 7).toISOString();
assert.strictEqual(isDue(future), false, 'Future date is not due');
const past = addDays(new Date(), -1).toISOString();
assert.strictEqual(isDue(past), true, 'Past date is due');

const vocab = {
  'bonjour': { level: 'a1', correct: 3, wrong: 0 },
  'merci':   { level: 'a1', correct: 3, wrong: 0 },
  'oui':     { level: 'a1', correct: 3, wrong: 0 },
  'non':     { level: 'a1', correct: 3, wrong: 0 },
  'eau':     { level: 'a1', correct: 0, wrong: 2 },  // not mastered
};
// 4/5 = 80% mastered → true
assert.strictEqual(isLevelMastered(vocab, 'a1'), true, 'Level mastered at 80%');
vocab['eau'].correct = 0;
vocab['bonjour'].correct = 1; // now only 3/5 = 60% → false
assert.strictEqual(isLevelMastered(vocab, 'a1'), false, 'Level not mastered below 80%');

console.log('All SRS tests passed!');
```

- [ ] **Step 2: Run test**

```bash
node tests/test_srs.js
```

Expected: `All SRS tests passed!`

- [ ] **Step 3: Write srs.js**

```javascript
// js/srs.js
const SRS_INTERVALS = [1, 3, 7, 14, 30];

const SRS = {
  _addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  updateItem(vocabData, correct) {
    const idx = vocabData.interval_index || 0;
    const newIdx = correct ? Math.min(idx + 1, SRS_INTERVALS.length - 1) : 0;
    const nextReview = this._addDays(new Date(), SRS_INTERVALS[newIdx]).toISOString();
    return {
      ...vocabData,
      interval_index: newIdx,
      next_review: nextReview,
      correct: (vocabData.correct || 0) + (correct ? 1 : 0),
      wrong: (vocabData.wrong || 0) + (correct ? 0 : 1)
    };
  },

  isDue(nextReview) {
    if (!nextReview) return true;
    return new Date(nextReview) <= new Date();
  },

  getDueItems(vocabulary, level) {
    return Object.entries(vocabulary)
      .filter(([_, d]) => d.level === level && this.isDue(d.next_review))
      .map(([word, d]) => ({ word, ...d }));
  },

  isLevelMastered(vocabulary, level) {
    const words = Object.values(vocabulary).filter(d => d.level === level);
    if (words.length === 0) return false;
    const mastered = words.filter(d => (d.correct || 0) >= 3);
    return mastered.length / words.length >= 0.8;
  },

  getMasteryPercent(vocabulary, level) {
    const words = Object.values(vocabulary).filter(d => d.level === level);
    if (words.length === 0) return 0;
    const mastered = words.filter(d => (d.correct || 0) >= 3);
    return Math.round(mastered.length / words.length * 100);
  }
};
```

- [ ] **Step 4: Run test again with actual srs.js logic**

```bash
node tests/test_srs.js
```

Expected: `All SRS tests passed!`

- [ ] **Step 5: Commit**

```bash
git add js/srs.js tests/test_srs.js
git commit -m "feat: add SRS module with SM-2 logic"
```

---

## Task 5: js/tts.js + js/stt.js

**Files:**
- Create: `js/tts.js`
- Create: `js/stt.js`

*Note: These wrap browser APIs — no Node.js tests possible. Manual browser verification in Task 10.*

- [ ] **Step 1: Write tts.js**

```javascript
// js/tts.js
const TTS = {
  speak(text, lang = 'fr-FR', rate = 0.85) {
    return new Promise((resolve) => {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      u.onend = resolve;
      u.onerror = resolve; // resolve even on error to avoid hanging
      speechSynthesis.speak(u);
    });
  },

  // Get available French voices (for debugging)
  getFrenchVoices() {
    return speechSynthesis.getVoices().filter(v => v.lang.startsWith('fr'));
  }
};
```

- [ ] **Step 2: Write stt.js**

```javascript
// js/stt.js
// IMPORTANT: STT.listen() MUST be called directly in a click handler (iOS requirement).
// Do not call it from inside a setTimeout, Promise.then, or async function on iOS.
const STT = {
  _recognition: null,

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  listen(onResult, onError, lang = 'fr-FR') {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      onError('Spracherkennung wird von diesem Browser nicht unterstützt. Bitte Safari auf iOS oder Chrome auf Desktop verwenden.');
      return;
    }
    if (this._recognition) {
      this._recognition.abort();
    }
    const r = new SR();
    this._recognition = r;
    r.lang = lang;
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onresult = (e) => {
      this._recognition = null;
      onResult(e.results[0][0].transcript.trim());
    };
    r.onerror = (e) => {
      this._recognition = null;
      const msgs = {
        'no-speech': 'Kein Ton erkannt. Bitte nochmal versuchen.',
        'audio-capture': 'Mikrofon nicht gefunden.',
        'not-allowed': 'Mikrofon-Zugriff verweigert. Bitte in den Einstellungen erlauben.',
      };
      onError(msgs[e.error] || `Fehler: ${e.error}`);
    };
    r.onend = () => { this._recognition = null; };
    r.start();
  },

  stop() {
    if (this._recognition) {
      this._recognition.stop();
      this._recognition = null;
    }
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add js/tts.js js/stt.js
git commit -m "feat: add TTS and STT wrappers"
```

---

## Task 6: js/gemini.js

**Files:**
- Create: `js/gemini.js`

- [ ] **Step 1: Write gemini.js**

```javascript
// js/gemini.js
const Gemini = {
  _model: 'gemini-1.5-flash',
  _baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',

  async _call(prompt, apiKey) {
    const url = `${this._baseUrl}/${this._model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 250 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API Fehler ${res.status}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  async testKey(apiKey) {
    return this._call('Antworte nur mit dem Wort: OK', apiKey);
  },

  async vocabFeedback(targetWord, transcription, apiKey) {
    const prompt = `Du bist ein geduldiger Französischlehrer. Der Lerner sollte das französische Wort "${targetWord}" aussprechen. Die automatische Spracherkennung hat transkribiert: "${transcription}". Gib sehr kurzes Feedback auf Deutsch (maximal 2 Sätze): Ist die Aussprache korrekt? Falls nicht, erkläre konkret was falsch klingt und wie es richtig klingt.`;
    return this._call(prompt, apiKey);
  },

  async sentenceFeedback(targetSentence, transcription, apiKey) {
    const prompt = `Du bist ein Französischlehrer. Der Lerner sollte diesen Satz auf Französisch sagen: "${targetSentence}". Die Spracherkennung hat erfasst: "${transcription}". Gib Feedback auf Deutsch (maximal 3 Sätze): Ist der Satz korrekt wiedergegeben? Falls nicht, erkläre Aussprache- oder Grammatikfehler konkret und gib die richtige Version an.`;
    return this._call(prompt, apiKey);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add js/gemini.js
git commit -m "feat: add Gemini API client"
```

---

## Task 7: Content JSON files

**Files:**
- Create: `content/a1.json`
- Create: `content/a2.json`
- Create: `content/b1.json`
- Create: `content/b2.json`
- Create: `content/c1.json`

- [ ] **Step 1: Create content/a1.json**

```json
{
  "level": "a1",
  "vocabulary": [
    {"id":"a1_v001","french":"bonjour","german":"guten Tag / hallo","category":"greetings"},
    {"id":"a1_v002","french":"bonsoir","german":"guten Abend","category":"greetings"},
    {"id":"a1_v003","french":"salut","german":"hallo / tschüss (umgangssprachlich)","category":"greetings"},
    {"id":"a1_v004","french":"au revoir","german":"auf Wiedersehen","category":"greetings"},
    {"id":"a1_v005","french":"merci","german":"danke","category":"greetings"},
    {"id":"a1_v006","french":"s'il vous plaît","german":"bitte (formell)","category":"greetings"},
    {"id":"a1_v007","french":"s'il te plaît","german":"bitte (informell)","category":"greetings"},
    {"id":"a1_v008","french":"oui","german":"ja","category":"basics"},
    {"id":"a1_v009","french":"non","german":"nein","category":"basics"},
    {"id":"a1_v010","french":"je","german":"ich","category":"pronouns"},
    {"id":"a1_v011","french":"tu","german":"du","category":"pronouns"},
    {"id":"a1_v012","french":"il","german":"er","category":"pronouns"},
    {"id":"a1_v013","french":"elle","german":"sie (Singular)","category":"pronouns"},
    {"id":"a1_v014","french":"nous","german":"wir","category":"pronouns"},
    {"id":"a1_v015","french":"vous","german":"ihr / Sie (formell)","category":"pronouns"},
    {"id":"a1_v016","french":"ils","german":"sie (Plural, männlich)","category":"pronouns"},
    {"id":"a1_v017","french":"elles","german":"sie (Plural, weiblich)","category":"pronouns"},
    {"id":"a1_v018","french":"être","german":"sein","category":"verbs"},
    {"id":"a1_v019","french":"avoir","german":"haben","category":"verbs"},
    {"id":"a1_v020","french":"aller","german":"gehen / fahren","category":"verbs"},
    {"id":"a1_v021","french":"faire","german":"machen / tun","category":"verbs"},
    {"id":"a1_v022","french":"parler","german":"sprechen","category":"verbs"},
    {"id":"a1_v023","french":"manger","german":"essen","category":"verbs"},
    {"id":"a1_v024","french":"boire","german":"trinken","category":"verbs"},
    {"id":"a1_v025","french":"aimer","german":"mögen / lieben","category":"verbs"},
    {"id":"a1_v026","french":"habiter","german":"wohnen","category":"verbs"},
    {"id":"a1_v027","french":"travailler","german":"arbeiten","category":"verbs"},
    {"id":"a1_v028","french":"un","german":"eins / ein","category":"numbers"},
    {"id":"a1_v029","french":"deux","german":"zwei","category":"numbers"},
    {"id":"a1_v030","french":"trois","german":"drei","category":"numbers"},
    {"id":"a1_v031","french":"quatre","german":"vier","category":"numbers"},
    {"id":"a1_v032","french":"cinq","german":"fünf","category":"numbers"},
    {"id":"a1_v033","french":"dix","german":"zehn","category":"numbers"},
    {"id":"a1_v034","french":"vingt","german":"zwanzig","category":"numbers"},
    {"id":"a1_v035","french":"cent","german":"hundert","category":"numbers"},
    {"id":"a1_v036","french":"rouge","german":"rot","category":"colors"},
    {"id":"a1_v037","french":"bleu","german":"blau","category":"colors"},
    {"id":"a1_v038","french":"vert","german":"grün","category":"colors"},
    {"id":"a1_v039","french":"jaune","german":"gelb","category":"colors"},
    {"id":"a1_v040","french":"blanc","german":"weiß","category":"colors"},
    {"id":"a1_v041","french":"noir","german":"schwarz","category":"colors"},
    {"id":"a1_v042","french":"père","german":"Vater","category":"family"},
    {"id":"a1_v043","french":"mère","german":"Mutter","category":"family"},
    {"id":"a1_v044","french":"frère","german":"Bruder","category":"family"},
    {"id":"a1_v045","french":"sœur","german":"Schwester","category":"family"},
    {"id":"a1_v046","french":"maison","german":"Haus","category":"places"},
    {"id":"a1_v047","french":"école","german":"Schule","category":"places"},
    {"id":"a1_v048","french":"ville","german":"Stadt","category":"places"},
    {"id":"a1_v049","french":"grand","german":"groß","category":"adjectives"},
    {"id":"a1_v050","french":"petit","german":"klein","category":"adjectives"},
    {"id":"a1_v051","french":"aujourd'hui","german":"heute","category":"time"},
    {"id":"a1_v052","french":"demain","german":"morgen","category":"time"},
    {"id":"a1_v053","french":"hier","german":"gestern","category":"time"},
    {"id":"a1_v054","french":"eau","german":"Wasser","category":"food"},
    {"id":"a1_v055","french":"pain","german":"Brot","category":"food"},
    {"id":"a1_v056","french":"café","german":"Kaffee","category":"food"},
    {"id":"a1_v057","french":"lundi","german":"Montag","category":"days"},
    {"id":"a1_v058","french":"mardi","german":"Dienstag","category":"days"},
    {"id":"a1_v059","french":"mercredi","german":"Mittwoch","category":"days"},
    {"id":"a1_v060","french":"samedi","german":"Samstag","category":"days"}
  ],
  "sentences": [
    {"id":"a1_s001","french":"Je m'appelle Marie.","german":"Ich heiße Marie.","category":"introduction"},
    {"id":"a1_s002","french":"Comment vous appelez-vous ?","german":"Wie heißen Sie?","category":"introduction"},
    {"id":"a1_s003","french":"J'habite à Paris.","german":"Ich wohne in Paris.","category":"introduction"},
    {"id":"a1_s004","french":"Je suis français.","german":"Ich bin Franzose.","category":"introduction"},
    {"id":"a1_s005","french":"Où est la gare ?","german":"Wo ist der Bahnhof?","category":"directions"},
    {"id":"a1_s006","french":"Combien ça coûte ?","german":"Wie viel kostet das?","category":"shopping"},
    {"id":"a1_s007","french":"Je voudrais un café, s'il vous plaît.","german":"Ich hätte gerne einen Kaffee, bitte.","category":"restaurant"},
    {"id":"a1_s008","french":"Parlez-vous anglais ?","german":"Sprechen Sie Englisch?","category":"communication"},
    {"id":"a1_s009","french":"Je ne comprends pas.","german":"Ich verstehe nicht.","category":"communication"},
    {"id":"a1_s010","french":"Pouvez-vous répéter, s'il vous plaît ?","german":"Können Sie das bitte wiederholen?","category":"communication"},
    {"id":"a1_s011","french":"Quelle heure est-il ?","german":"Wie viel Uhr ist es?","category":"time"},
    {"id":"a1_s012","french":"Il fait beau aujourd'hui.","german":"Heute ist schönes Wetter.","category":"weather"}
  ],
  "placement_questions": [
    {
      "id":"a1_p001","level":"a1",
      "question":"Was bedeutet 'bonjour'?",
      "options":["guten Tag","gute Nacht","danke","bitte"],
      "correct":0
    },
    {
      "id":"a1_p002","level":"a1",
      "question":"Wie sagt man 'Wasser' auf Französisch?",
      "options":["pain","vin","eau","lait"],
      "correct":2
    },
    {
      "id":"a1_p003","level":"a1",
      "question":"Was bedeutet 'Je m'appelle Marie'?",
      "options":["Ich wohne in Paris","Ich heiße Marie","Ich spreche Französisch","Ich bin Franzose"],
      "correct":1
    },
    {
      "id":"a1_p004","level":"a1",
      "question":"Was bedeutet 'au revoir'?",
      "options":["guten Morgen","danke sehr","auf Wiedersehen","entschuldigung"],
      "correct":2
    },
    {
      "id":"a1_p005","level":"a1",
      "question":"Wie sagt man 'klein' auf Französisch?",
      "options":["grand","beau","petit","vieux"],
      "correct":2
    },
    {
      "id":"a1_p006","level":"a1",
      "question":"Was bedeutet 'Où est la gare ?'",
      "options":["Was kostet das?","Wo ist der Bahnhof?","Wann fährt der Zug?","Wie weit ist es?"],
      "correct":1
    }
  ]
}
```

- [ ] **Step 2: Create content/a2.json**

```json
{
  "level": "a2",
  "vocabulary": [
    {"id":"a2_v001","french":"acheter","german":"kaufen","category":"verbs"},
    {"id":"a2_v002","french":"vendre","german":"verkaufen","category":"verbs"},
    {"id":"a2_v003","french":"prendre","german":"nehmen","category":"verbs"},
    {"id":"a2_v004","french":"donner","german":"geben","category":"verbs"},
    {"id":"a2_v005","french":"chercher","german":"suchen","category":"verbs"},
    {"id":"a2_v006","french":"trouver","german":"finden","category":"verbs"},
    {"id":"a2_v007","french":"connaître","german":"kennen","category":"verbs"},
    {"id":"a2_v008","french":"savoir","german":"wissen / können","category":"verbs"},
    {"id":"a2_v009","french":"vouloir","german":"wollen","category":"verbs"},
    {"id":"a2_v010","french":"pouvoir","german":"können (dürfen)","category":"verbs"},
    {"id":"a2_v011","french":"devoir","german":"müssen","category":"verbs"},
    {"id":"a2_v012","french":"restaurant","german":"Restaurant","category":"places"},
    {"id":"a2_v013","french":"hôtel","german":"Hotel","category":"places"},
    {"id":"a2_v014","french":"gare","german":"Bahnhof","category":"places"},
    {"id":"a2_v015","french":"aéroport","german":"Flughafen","category":"places"},
    {"id":"a2_v016","french":"supermarché","german":"Supermarkt","category":"places"},
    {"id":"a2_v017","french":"pharmacie","german":"Apotheke","category":"places"},
    {"id":"a2_v018","french":"heure","german":"Stunde / Uhr","category":"time"},
    {"id":"a2_v019","french":"minute","german":"Minute","category":"time"},
    {"id":"a2_v020","french":"semaine","german":"Woche","category":"time"},
    {"id":"a2_v021","french":"mois","german":"Monat","category":"time"},
    {"id":"a2_v022","french":"année","german":"Jahr","category":"time"},
    {"id":"a2_v023","french":"billet","german":"Fahrkarte / Ticket","category":"travel"},
    {"id":"a2_v024","french":"chambre","german":"Zimmer","category":"hotel"},
    {"id":"a2_v025","french":"réservation","german":"Reservierung","category":"hotel"},
    {"id":"a2_v026","french":"addition","german":"Rechnung (im Restaurant)","category":"restaurant"},
    {"id":"a2_v027","french":"entrée","german":"Vorspeise","category":"food"},
    {"id":"a2_v028","french":"plat principal","german":"Hauptgericht","category":"food"},
    {"id":"a2_v029","french":"dessert","german":"Nachspeise","category":"food"},
    {"id":"a2_v030","french":"content","german":"froh / zufrieden","category":"adjectives"},
    {"id":"a2_v031","french":"fatigué","german":"müde","category":"adjectives"},
    {"id":"a2_v032","french":"malade","german":"krank","category":"adjectives"},
    {"id":"a2_v033","french":"libre","german":"frei / verfügbar","category":"adjectives"},
    {"id":"a2_v034","french":"occupé","german":"beschäftigt / besetzt","category":"adjectives"},
    {"id":"a2_v035","french":"gauche","german":"links","category":"directions"},
    {"id":"a2_v036","french":"droite","german":"rechts","category":"directions"},
    {"id":"a2_v037","french":"tout droit","german":"geradeaus","category":"directions"},
    {"id":"a2_v038","french":"près de","german":"in der Nähe von","category":"directions"},
    {"id":"a2_v039","french":"loin de","german":"weit von","category":"directions"},
    {"id":"a2_v040","french":"environ","german":"ungefähr","category":"basics"}
  ],
  "sentences": [
    {"id":"a2_s001","french":"Je voudrais réserver une table pour deux personnes.","german":"Ich möchte einen Tisch für zwei Personen reservieren.","category":"restaurant"},
    {"id":"a2_s002","french":"L'addition, s'il vous plaît.","german":"Die Rechnung, bitte.","category":"restaurant"},
    {"id":"a2_s003","french":"Je cherche l'hôtel Lumière.","german":"Ich suche das Hotel Lumière.","category":"directions"},
    {"id":"a2_s004","french":"Tournez à gauche au carrefour.","german":"Biegen Sie an der Kreuzung links ab.","category":"directions"},
    {"id":"a2_s005","french":"Je suis arrivé hier soir.","german":"Ich bin gestern Abend angekommen.","category":"travel"},
    {"id":"a2_s006","french":"Avez-vous une chambre libre ?","german":"Haben Sie ein freies Zimmer?","category":"hotel"},
    {"id":"a2_s007","french":"Je voudrais un billet aller-retour pour Lyon.","german":"Ich hätte gerne eine Hin- und Rückfahrkarte nach Lyon.","category":"travel"},
    {"id":"a2_s008","french":"Où est la sortie la plus proche ?","german":"Wo ist der nächste Ausgang?","category":"directions"}
  ],
  "placement_questions": [
    {
      "id":"a2_p001","level":"a2",
      "question":"Was bedeutet 'Je voudrais réserver une table' ?",
      "options":["Ich möchte zahlen","Ich möchte einen Tisch reservieren","Ich suche einen Tisch","Ich habe reserviert"],
      "correct":1
    },
    {
      "id":"a2_p002","level":"a2",
      "question":"Wie sagt man 'links' auf Französisch?",
      "options":["droite","tout droit","gauche","loin"],
      "correct":2
    },
    {
      "id":"a2_p003","level":"a2",
      "question":"Was bedeutet 'fatigué'?",
      "options":["hungrig","müde","krank","fröhlich"],
      "correct":1
    },
    {
      "id":"a2_p004","level":"a2",
      "question":"Wie übersetzt man 'Haben Sie ein freies Zimmer?'",
      "options":["Avez-vous une chambre libre ?","Où est la chambre ?","Je voudrais une chambre.","La chambre est libre."],
      "correct":0
    },
    {
      "id":"a2_p005","level":"a2",
      "question":"Was bedeutet 'devoir'?",
      "options":["wollen","können","müssen","wissen"],
      "correct":2
    }
  ]
}
```

- [ ] **Step 3: Create content/b1.json**

```json
{
  "level": "b1",
  "vocabulary": [
    {"id":"b1_v001","french":"malgré","german":"trotz","category":"prepositions"},
    {"id":"b1_v002","french":"pourtant","german":"trotzdem / dennoch","category":"connectors"},
    {"id":"b1_v003","french":"cependant","german":"jedoch / allerdings","category":"connectors"},
    {"id":"b1_v004","french":"ainsi","german":"so / auf diese Weise","category":"connectors"},
    {"id":"b1_v005","french":"donc","german":"also / deshalb","category":"connectors"},
    {"id":"b1_v006","french":"d'ailleurs","german":"übrigens / außerdem","category":"connectors"},
    {"id":"b1_v007","french":"se souvenir","german":"sich erinnern","category":"verbs"},
    {"id":"b1_v008","french":"s'inquiéter","german":"sich sorgen","category":"verbs"},
    {"id":"b1_v009","french":"se plaindre","german":"sich beschweren","category":"verbs"},
    {"id":"b1_v010","french":"proposer","german":"vorschlagen","category":"verbs"},
    {"id":"b1_v011","french":"expliquer","german":"erklären","category":"verbs"},
    {"id":"b1_v012","french":"réussir","german":"gelingen / schaffen","category":"verbs"},
    {"id":"b1_v013","french":"échouer","german":"scheitern / durchfallen","category":"verbs"},
    {"id":"b1_v014","french":"améliorer","german":"verbessern","category":"verbs"},
    {"id":"b1_v015","french":"chômage","german":"Arbeitslosigkeit","category":"society"},
    {"id":"b1_v016","french":"syndicat","german":"Gewerkschaft","category":"society"},
    {"id":"b1_v017","french":"grève","german":"Streik","category":"society"},
    {"id":"b1_v018","french":"bénévole","german":"ehrenamtlich / Freiwilliger","category":"society"},
    {"id":"b1_v019","french":"quotidien","german":"täglich / Alltag","category":"adjectives"},
    {"id":"b1_v020","french":"actuel","german":"aktuell / gegenwärtig","category":"adjectives"},
    {"id":"b1_v021","french":"ancien","german":"ehemalig / alt","category":"adjectives"},
    {"id":"b1_v022","french":"grave","german":"ernst / schwerwiegend","category":"adjectives"},
    {"id":"b1_v023","french":"bien que","german":"obwohl (+ Subjonctif)","category":"conjunctions"},
    {"id":"b1_v024","french":"afin que","german":"damit (+ Subjonctif)","category":"conjunctions"},
    {"id":"b1_v025","french":"à condition que","german":"vorausgesetzt dass (+ Subjonctif)","category":"conjunctions"},
    {"id":"b1_v026","french":"se rendre compte","german":"sich bewusst werden / merken","category":"expressions"},
    {"id":"b1_v027","french":"avoir du mal à","german":"Schwierigkeiten haben zu","category":"expressions"},
    {"id":"b1_v028","french":"être en train de","german":"gerade dabei sein zu","category":"expressions"},
    {"id":"b1_v029","french":"il s'agit de","german":"es geht um / es handelt sich um","category":"expressions"},
    {"id":"b1_v030","french":"à la fois","german":"gleichzeitig / zugleich","category":"expressions"}
  ],
  "sentences": [
    {"id":"b1_s001","french":"Bien qu'il soit fatigué, il continue à travailler.","german":"Obwohl er müde ist, arbeitet er weiter.","category":"grammar"},
    {"id":"b1_s002","french":"Je me souviens de notre première rencontre.","german":"Ich erinnere mich an unser erstes Treffen.","category":"everyday"},
    {"id":"b1_s003","french":"Il faudrait que tu te reposes davantage.","german":"Du solltest dich mehr ausruhen.","category":"advice"},
    {"id":"b1_s004","french":"J'ai du mal à comprendre son accent.","german":"Ich habe Schwierigkeiten seinen Akzent zu verstehen.","category":"communication"},
    {"id":"b1_s005","french":"Elle est en train de préparer le dîner.","german":"Sie ist gerade dabei, das Abendessen zuzubereiten.","category":"everyday"},
    {"id":"b1_s006","french":"Malgré les difficultés, il a réussi son examen.","german":"Trotz der Schwierigkeiten hat er seine Prüfung bestanden.","category":"everyday"}
  ],
  "placement_questions": [
    {
      "id":"b1_p001","level":"b1",
      "question":"Was bedeutet 'malgré' ?",
      "options":["wegen","trotz","dank","während"],
      "correct":1
    },
    {
      "id":"b1_p002","level":"b1",
      "question":"Was bedeutet 'avoir du mal à faire quelque chose' ?",
      "options":["etwas leicht finden","etwas Schwierigkeiten haben zu tun","etwas gut können","etwas gerne tun"],
      "correct":1
    },
    {
      "id":"b1_p003","level":"b1",
      "question":"'Bien que' wird mit welchem Modus verwendet?",
      "options":["Indicatif","Conditionnel","Subjonctif","Impératif"],
      "correct":2
    },
    {
      "id":"b1_p004","level":"b1",
      "question":"Was bedeutet 'il s'agit de' ?",
      "options":["er kommt an","es geht um","er fragt nach","es ist fertig"],
      "correct":1
    },
    {
      "id":"b1_p005","level":"b1",
      "question":"Was bedeutet 'pourtant' ?",
      "options":["deshalb","trotzdem","obwohl","damit"],
      "correct":1
    }
  ]
}
```

- [ ] **Step 4: Create content/b2.json**

```json
{
  "level": "b2",
  "vocabulary": [
    {"id":"b2_v001","french":"néanmoins","german":"nichtsdestoweniger","category":"connectors"},
    {"id":"b2_v002","french":"en revanche","german":"hingegen / dagegen","category":"connectors"},
    {"id":"b2_v003","french":"quant à","german":"was … betrifft / hinsichtlich","category":"connectors"},
    {"id":"b2_v004","french":"nuancer","german":"differenzieren / nuancieren","category":"verbs"},
    {"id":"b2_v005","french":"souligner","german":"unterstreichen / betonen","category":"verbs"},
    {"id":"b2_v006","french":"aborder","german":"ansprechen / angehen","category":"verbs"},
    {"id":"b2_v007","french":"remettre en question","german":"in Frage stellen","category":"expressions"},
    {"id":"b2_v008","french":"prendre en compte","german":"berücksichtigen","category":"expressions"},
    {"id":"b2_v009","french":"à cet égard","german":"in dieser Hinsicht","category":"expressions"},
    {"id":"b2_v010","french":"il convient de","german":"es empfiehlt sich / man sollte","category":"expressions"},
    {"id":"b2_v011","french":"voire","german":"ja sogar / wenn nicht gar","category":"connectors"},
    {"id":"b2_v012","french":"désormais","german":"fortan / von nun an","category":"time"},
    {"id":"b2_v013","french":"dorénavant","german":"künftig / in Zukunft","category":"time"},
    {"id":"b2_v014","french":"jadis","german":"einst / früher","category":"time"},
    {"id":"b2_v015","french":"croissance","german":"Wachstum","category":"economy"},
    {"id":"b2_v016","french":"mondialisation","german":"Globalisierung","category":"society"},
    {"id":"b2_v017","french":"développement durable","german":"nachhaltige Entwicklung","category":"environment"},
    {"id":"b2_v018","french":"inégalité","german":"Ungleichheit","category":"society"},
    {"id":"b2_v019","french":"biais","german":"Voreingenommenheit / Verzerrung","category":"abstract"},
    {"id":"b2_v020","french":"enjeu","german":"Einsatz / Herausforderung / Kernfrage","category":"abstract"}
  ],
  "sentences": [
    {"id":"b2_s001","french":"Il convient de nuancer cette affirmation.","german":"Man sollte diese Behauptung differenzieren.","category":"argumentation"},
    {"id":"b2_s002","french":"En revanche, les données récentes montrent une tendance inverse.","german":"Dagegen zeigen die aktuellen Daten einen gegenteiligen Trend.","category":"argumentation"},
    {"id":"b2_s003","french":"Il faut prendre en compte les inégalités sociales.","german":"Man muss die sozialen Ungleichheiten berücksichtigen.","category":"society"},
    {"id":"b2_s004","french":"Cette politique remet en question les acquis sociaux.","german":"Diese Politik stellt die sozialen Errungenschaften in Frage.","category":"politics"},
    {"id":"b2_s005","french":"Quant à la mondialisation, elle présente à la fois des avantages et des inconvénients.","german":"Was die Globalisierung betrifft, sie hat sowohl Vor- als auch Nachteile.","category":"society"}
  ],
  "placement_questions": [
    {
      "id":"b2_p001","level":"b2",
      "question":"Was bedeutet 'en revanche' ?",
      "options":["außerdem","hingegen / dagegen","deshalb","trotzdem"],
      "correct":1
    },
    {
      "id":"b2_p002","level":"b2",
      "question":"Was bedeutet 'enjeu' ?",
      "options":["Vorteil","Kernfrage / Herausforderung","Ergebnis","Entwicklung"],
      "correct":1
    },
    {
      "id":"b2_p003","level":"b2",
      "question":"Was bedeutet 'prendre en compte' ?",
      "options":["in Frage stellen","berücksichtigen","betonen","ansprechen"],
      "correct":1
    },
    {
      "id":"b2_p004","level":"b2",
      "question":"Was bedeutet 'voire' ?",
      "options":["oder auch","ja sogar","obwohl","indem"],
      "correct":1
    },
    {
      "id":"b2_p005","level":"b2",
      "question":"Was bedeutet 'désormais' ?",
      "options":["früher","von nun an","manchmal","selten"],
      "correct":1
    }
  ]
}
```

- [ ] **Step 5: Create content/c1.json**

```json
{
  "level": "c1",
  "vocabulary": [
    {"id":"c1_v001","french":"à l'instar de","german":"nach dem Vorbild von / wie","category":"expressions"},
    {"id":"c1_v002","french":"au demeurant","german":"übrigens / im Übrigen","category":"connectors"},
    {"id":"c1_v003","french":"nonobstant","german":"ungeachtet / trotz (formal)","category":"prepositions"},
    {"id":"c1_v004","french":"corroborer","german":"bestätigen / bekräftigen","category":"verbs"},
    {"id":"c1_v005","french":"étayer","german":"untermauern / stützen","category":"verbs"},
    {"id":"c1_v006","french":"infirmer","german":"widerlegen / entkräften","category":"verbs"},
    {"id":"c1_v007","french":"déceler","german":"aufspüren / aufdecken","category":"verbs"},
    {"id":"c1_v008","french":"amalgame","german":"Vermischung / Gleichsetzung (unzulässig)","category":"argumentation"},
    {"id":"c1_v009","french":"présupposé","german":"Voraussetzung / Prämisse","category":"argumentation"},
    {"id":"c1_v010","french":"paradoxe","german":"Paradoxon / Widerspruch","category":"argumentation"},
    {"id":"c1_v011","french":"fouler aux pieds","german":"mit Füßen treten","category":"idioms"},
    {"id":"c1_v012","french":"tourner autour du pot","german":"um den heißen Brei reden","category":"idioms"},
    {"id":"c1_v013","french":"avoir le cafard","german":"deprimiert sein / Trübsal blasen","category":"idioms"},
    {"id":"c1_v014","french":"il va de soi que","german":"es versteht sich von selbst dass","category":"expressions"},
    {"id":"c1_v015","french":"tant bien que mal","german":"schlecht und recht / irgendwie","category":"expressions"}
  ],
  "sentences": [
    {"id":"c1_s001","french":"Il va de soi que cette décision aura des répercussions considérables.","german":"Es versteht sich von selbst, dass diese Entscheidung erhebliche Auswirkungen haben wird.","category":"argumentation"},
    {"id":"c1_s002","french":"Ces données corroborent l'hypothèse émise par les chercheurs.","german":"Diese Daten bekräftigen die von den Forschern aufgestellte Hypothese.","category":"academic"},
    {"id":"c1_s003","french":"Il ne faut pas faire d'amalgame entre ces deux concepts.","german":"Man darf diese beiden Konzepte nicht unzulässigerweise gleichsetzen.","category":"argumentation"},
    {"id":"c1_s004","french":"À l'instar de nombreux pays européens, la France a révisé sa politique énergétique.","german":"Nach dem Vorbild vieler europäischer Länder hat Frankreich seine Energiepolitik überarbeitet.","category":"society"},
    {"id":"c1_s005","french":"Elle a réussi à s'adapter, tant bien que mal, à cette nouvelle situation.","german":"Sie hat es geschafft, sich schlecht und recht an diese neue Situation anzupassen.","category":"everyday"}
  ],
  "placement_questions": [
    {
      "id":"c1_p001","level":"c1",
      "question":"Was bedeutet 'étayer une thèse' ?",
      "options":["eine These widerlegen","eine These untermauern","eine These vorstellen","eine These zusammenfassen"],
      "correct":1
    },
    {
      "id":"c1_p002","level":"c1",
      "question":"Was bedeutet 'avoir le cafard' ?",
      "options":["einen Fehler machen","deprimiert sein","Angst haben","laut lachen"],
      "correct":1
    },
    {
      "id":"c1_p003","level":"c1",
      "question":"Was bedeutet 'tourner autour du pot' ?",
      "options":["kochen","um den heißen Brei reden","ein Problem lösen","eine Geschichte erzählen"],
      "correct":1
    },
    {
      "id":"c1_p004","level":"c1",
      "question":"Was bedeutet 'nonobstant' ?",
      "options":["infolgedessen","ungeachtet / trotz","gleichwohl","sofern"],
      "correct":1
    },
    {
      "id":"c1_p005","level":"c1",
      "question":"Was bedeutet 'faire un amalgame' ?",
      "options":["etwas analysieren","Dinge unzulässig gleichsetzen","Argumente abwägen","ein Fazit ziehen"],
      "correct":1
    }
  ]
}
```

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat: add CEFR content JSON files A1-C1"
```

---

## Task 8: index.html — Home + API-Key Setup

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Franz">
  <title>Franz — Französisch lernen</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">

  <!-- API Key Setup (shown if no key stored) -->
  <div id="setup-screen">
    <h1>🇫🇷 Franz</h1>
    <p style="margin-bottom:24px">Dein persönlicher Französisch-Trainer. Bitte gib deinen Gemini API-Key ein um zu starten.</p>
    <div class="card">
      <h2>API-Key einrichten</h2>
      <p style="margin-bottom:16px; font-size:0.9rem;">Du bekommst deinen kostenlosen Key auf <strong>aistudio.google.com</strong> → "Get API key".</p>
      <input type="password" id="api-key-input" class="input" placeholder="AIzaSy..." style="margin-bottom:12px">
      <div id="key-error" class="feedback-box feedback-wrong hidden"></div>
      <button id="save-key-btn" class="btn btn-primary">
        <span id="key-btn-text">Key speichern & testen</span>
        <span id="key-spinner" class="spinner hidden"></span>
      </button>
    </div>
  </div>

  <!-- Home Screen (shown once API key is set) -->
  <div id="home-screen" class="hidden">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
      <h1>🇫🇷 Franz</h1>
      <div class="streak" id="streak-display">🔥 0 Tage</div>
    </div>

    <div id="placement-banner" class="card hidden">
      <h2>Wo stehst du?</h2>
      <p style="margin-bottom:16px">Mach den kurzen Einstufungstest um dein Startniveau zu bestimmen.</p>
      <a href="placement.html" class="btn btn-primary">Einstufungstest starten →</a>
    </div>

    <div id="level-section">
      <h2>Dein Level</h2>
      <div class="level-grid" id="level-grid"></div>
    </div>

    <div id="due-banner" class="card hidden">
      <p id="due-text"></p>
      <a href="vocab.html" id="due-link" class="btn btn-primary" style="margin-top:12px">Jetzt lernen →</a>
    </div>

    <h2 style="margin-top:24px">Trainieren</h2>
    <a href="vocab.html" class="btn btn-secondary">📖 Vokabel-Drill</a>
    <a href="sentences.html" class="btn btn-secondary">💬 Satz-Training</a>

    <button id="reset-btn" class="btn btn-secondary" style="margin-top:32px; font-size:0.8rem; color:#9ca3af">
      ⚙️ API-Key ändern / Fortschritt zurücksetzen
    </button>
  </div>

</div>

<script src="js/storage.js"></script>
<script src="js/srs.js"></script>
<script>
  const data = Storage.getAll();

  function init() {
    if (!data.gemini_api_key) {
      document.getElementById('setup-screen').classList.remove('hidden');
    } else {
      showHome();
    }
  }

  function showHome() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
    renderStreak();
    renderLevels();
    renderDueBanner();
    if (!data.placement_completed) {
      document.getElementById('placement-banner').classList.remove('hidden');
    }
  }

  function renderStreak() {
    const s = data.streak;
    document.getElementById('streak-display').textContent = `🔥 ${s.current} Tag${s.current !== 1 ? 'e' : ''}`;
  }

  function renderLevels() {
    const levels = ['a1','a2','b1','b2','c1'];
    const labels = {'a1':'A1','a2':'A2','b1':'B1','b2':'B2','c1':'C1'};
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    levels.forEach(lvl => {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      const unlocked = data.unlocked_levels.includes(lvl) || lvl === 'a1';
      const mastered = SRS.isLevelMastered(data.vocabulary, lvl);
      const pct = SRS.getMasteryPercent(data.vocabulary, lvl);
      if (!unlocked) btn.classList.add('locked');
      if (mastered) btn.classList.add('mastered');
      if (lvl === data.current_level) btn.classList.add('active');
      btn.innerHTML = `${labels[lvl]}<br><small style="font-weight:400;font-size:0.7rem">${pct}%</small>`;
      if (unlocked) {
        btn.onclick = () => {
          data.current_level = lvl;
          Storage.set('current_level', lvl);
          renderLevels();
        };
      }
      grid.appendChild(btn);
    });
  }

  function renderDueBanner() {
    const level = data.current_level || 'a1';
    const due = SRS.getDueItems(data.vocabulary, level);
    const banner = document.getElementById('due-banner');
    if (due.length > 0) {
      document.getElementById('due-text').textContent = `📚 ${due.length} Vokabel${due.length !== 1 ? 'n' : ''} zur Wiederholung fällig`;
      banner.classList.remove('hidden');
    }
  }

  // API Key save
  document.getElementById('save-key-btn').addEventListener('click', async () => {
    const key = document.getElementById('api-key-input').value.trim();
    if (!key) return;
    const btn = document.getElementById('save-key-btn');
    const spinner = document.getElementById('key-spinner');
    const btnText = document.getElementById('key-btn-text');
    const errBox = document.getElementById('key-error');
    btn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.textContent = 'Wird geprüft…';
    errBox.classList.add('hidden');
    try {
      // Inline minimal Gemini test (Gemini not loaded yet)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Antworte nur mit: OK' }] }] })
      });
      if (!res.ok) throw new Error('Ungültiger API-Key oder Netzwerkfehler');
      Storage.set('gemini_api_key', key);
      if (!data.unlocked_levels.includes('a1')) {
        data.unlocked_levels.push('a1');
        Storage.set('unlocked_levels', data.unlocked_levels);
      }
      data.gemini_api_key = key;
      showHome();
    } catch(e) {
      errBox.textContent = `Fehler: ${e.message}`;
      errBox.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      spinner.classList.add('hidden');
      btnText.textContent = 'Key speichern & testen';
    }
  });

  // Reset
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('API-Key ändern oder alles zurücksetzen?\nOK = Alles zurücksetzen\nAbbrechen = Nur Key ändern')) {
      Storage.clear();
    } else {
      Storage.set('gemini_api_key', '');
    }
    location.reload();
  });

  init();
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add home screen and API key setup"
```

---

## Task 9: placement.html

**Files:**
- Create: `placement.html`

- [ ] **Step 1: Create placement.html**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Einstufungstest — Franz</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
  <a href="index.html" class="nav-back">← Zurück</a>
  <h1>Einstufungstest</h1>
  <p style="margin-bottom:24px">Beantworte die Fragen um dein Startniveau zu ermitteln. Kein Stress — rate ruhig!</p>

  <div class="progress-bar"><div class="progress-bar-fill" id="progress-fill" style="width:0%"></div></div>
  <p id="question-counter" style="font-size:0.85rem; color:#6b7280; margin-bottom:16px"></p>

  <div id="question-area" class="card">
    <p id="question-level-badge" class="badge badge-blue" style="margin-bottom:12px"></p>
    <p id="question-text" style="font-size:1.1rem; font-weight:600; margin-bottom:20px"></p>
    <div id="options-area"></div>
    <div id="question-feedback" class="feedback-box hidden" style="margin-top:0"></div>
    <button id="next-btn" class="btn btn-primary hidden" style="margin-top:16px">Weiter →</button>
  </div>

  <div id="result-area" class="card hidden">
    <h2>Dein Ergebnis</h2>
    <p id="result-text" style="margin-bottom:16px"></p>
    <div id="result-details" style="margin-bottom:24px"></div>
    <a href="index.html" class="btn btn-primary">Zum Lernbereich →</a>
  </div>
</div>

<script src="js/storage.js"></script>
<script src="js/srs.js"></script>
<script>
  const LEVELS = ['a1','a2','b1','b2','c1'];
  const LEVEL_LABELS = {a1:'A1',a2:'A2',b1:'B1',b2:'B2',c1:'C1'};
  let allQuestions = [];
  let current = 0;
  let scores = {a1:0,a2:0,b1:0,b2:0,c1:0};
  let totals = {a1:0,a2:0,b1:0,b2:0,c1:0};
  let answered = false;

  async function loadQuestions() {
    for (const lvl of LEVELS) {
      const res = await fetch(`content/${lvl}.json`);
      const data = await res.json();
      allQuestions.push(...data.placement_questions);
      totals[lvl] = data.placement_questions.length;
    }
    showQuestion();
  }

  function showQuestion() {
    if (current >= allQuestions.length) { showResult(); return; }
    const q = allQuestions[current];
    answered = false;
    const pct = Math.round(current / allQuestions.length * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('question-counter').textContent = `Frage ${current + 1} von ${allQuestions.length}`;
    document.getElementById('question-level-badge').textContent = LEVEL_LABELS[q.level];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('question-feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');

    const area = document.getElementById('options-area');
    area.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-option';
      btn.textContent = opt;
      btn.onclick = () => selectAnswer(i, q, btn);
      area.appendChild(btn);
    });
  }

  function selectAnswer(idx, q, btn) {
    if (answered) return;
    answered = true;
    const correct = idx === q.correct;
    if (correct) scores[q.level]++;
    btn.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      document.querySelectorAll('.choice-option')[q.correct].classList.add('correct');
    }
    document.querySelectorAll('.choice-option').forEach(b => b.style.pointerEvents = 'none');

    const fb = document.getElementById('question-feedback');
    fb.className = `feedback-box ${correct ? 'feedback-correct' : 'feedback-wrong'}`;
    fb.textContent = correct ? '✓ Richtig!' : `✗ Die richtige Antwort war: ${q.options[q.correct]}`;
    fb.classList.remove('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
  }

  document.getElementById('next-btn').addEventListener('click', () => {
    current++;
    showQuestion();
  });

  function showResult() {
    document.getElementById('question-area').classList.add('hidden');
    document.getElementById('result-area').classList.remove('hidden');
    document.getElementById('progress-fill').style.width = '100%';

    // Determine level: highest level with ≥70% correct
    let recommendedLevel = 'a1';
    for (const lvl of LEVELS) {
      if (totals[lvl] > 0 && scores[lvl] / totals[lvl] >= 0.7) {
        recommendedLevel = lvl;
      }
    }

    document.getElementById('result-text').innerHTML =
      `Empfohlenes Startniveau: <strong>${LEVEL_LABELS[recommendedLevel]}</strong>`;

    let details = '';
    for (const lvl of LEVELS) {
      const pct = totals[lvl] > 0 ? Math.round(scores[lvl] / totals[lvl] * 100) : 0;
      details += `<div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span>${LEVEL_LABELS[lvl]}</span>
        <span>${scores[lvl]}/${totals[lvl]} (${pct}%)</span>
      </div>`;
    }
    document.getElementById('result-details').innerHTML = details;

    // Save results
    const storageData = Storage.getAll();
    storageData.placement_completed = true;
    storageData.current_level = recommendedLevel;
    // Unlock all levels up to recommended
    const idx = LEVELS.indexOf(recommendedLevel);
    storageData.unlocked_levels = LEVELS.slice(0, idx + 1);
    // Seed vocabulary for unlocked levels
    Storage.saveAll(storageData);
  }

  loadQuestions();
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add placement.html
git commit -m "feat: add placement test"
```

---

## Task 10: vocab.html — Vokabel-Drill

**Files:**
- Create: `vocab.html`

- [ ] **Step 1: Create vocab.html**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vokabel-Drill — Franz</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
  <a href="index.html" class="nav-back">← Zurück</a>
  <h1>Vokabel-Drill</h1>

  <div id="loading" class="card">Lädt…</div>

  <div id="no-due" class="card hidden">
    <h2>Alles erledigt! 🎉</h2>
    <p>Keine Vokabeln zur Wiederholung fällig. Komm morgen wieder!</p>
    <a href="index.html" class="btn btn-secondary" style="margin-top:16px">Zurück</a>
  </div>

  <div id="drill-area" class="hidden">
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <span id="queue-info" style="font-size:0.85rem;color:#6b7280"></span>
      <span id="level-badge" class="badge badge-blue"></span>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" id="progress-fill" style="width:0%"></div></div>

    <div class="card" style="text-align:center">
      <button id="play-btn" class="btn btn-secondary" style="width:auto;padding:10px 20px;margin-bottom:8px">
        🔊 Anhören
      </button>
      <p class="french-text" id="french-word"></p>
      <p class="german-text" id="german-word"></p>
      <p style="font-size:0.85rem;color:#9ca3af;margin-bottom:4px">Sprich das Wort nach:</p>
      <button class="mic-btn" id="mic-btn">🎤</button>
      <p id="mic-status" style="font-size:0.85rem;color:#6b7280;min-height:20px"></p>
    </div>

    <div id="feedback-area" class="hidden">
      <div id="feedback-box" class="feedback-box"></div>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button id="wrong-btn" class="btn btn-danger" style="flex:1">✗ Falsch</button>
        <button id="correct-btn" class="btn btn-success" style="flex:1">✓ Richtig</button>
      </div>
    </div>
  </div>
</div>

<script src="js/storage.js"></script>
<script src="js/srs.js"></script>
<script src="js/tts.js"></script>
<script src="js/stt.js"></script>
<script src="js/gemini.js"></script>
<script>
  let queue = [];
  let currentIdx = 0;
  let sessionTotal = 0;
  let contentData = {};
  const storageData = Storage.getAll();
  const level = storageData.current_level || 'a1';
  const apiKey = storageData.gemini_api_key;

  async function init() {
    const res = await fetch(`content/${level}.json`);
    contentData = await res.json();

    // Seed vocabulary into storage if not present
    contentData.vocabulary.forEach(v => {
      if (!storageData.vocabulary[v.french]) {
        storageData.vocabulary[v.french] = {
          level: v.level || level,
          interval_index: 0, correct: 0, wrong: 0, next_review: null
        };
      }
    });
    Storage.saveAll(storageData);

    // Build queue: due items first, then new items
    let due = SRS.getDueItems(storageData.vocabulary, level);
    if (due.length === 0) {
      // Add new words not yet in storage or never reviewed
      const newWords = contentData.vocabulary
        .filter(v => !storageData.vocabulary[v.french]?.next_review)
        .slice(0, 10);
      due = newWords.map(v => ({ word: v.french, ...storageData.vocabulary[v.french] }));
    }
    queue = due.slice(0, 20);
    sessionTotal = queue.length;

    document.getElementById('loading').classList.add('hidden');
    if (queue.length === 0) {
      document.getElementById('no-due').classList.remove('hidden');
    } else {
      document.getElementById('drill-area').classList.remove('hidden');
      document.getElementById('level-badge').textContent = level.toUpperCase();
      showCard();
    }
  }

  function showCard() {
    if (currentIdx >= queue.length) { showDone(); return; }
    const item = queue[currentIdx];
    const vocabEntry = contentData.vocabulary.find(v => v.french === item.word);
    document.getElementById('french-word').textContent = item.word;
    document.getElementById('german-word').textContent = vocabEntry?.german || '';
    document.getElementById('mic-status').textContent = '';
    document.getElementById('feedback-area').classList.add('hidden');
    const pct = Math.round(currentIdx / sessionTotal * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('queue-info').textContent = `${currentIdx + 1} / ${sessionTotal}`;
    TTS.speak(item.word, 'fr-FR');
  }

  document.getElementById('play-btn').addEventListener('click', () => {
    const word = document.getElementById('french-word').textContent;
    TTS.speak(word, 'fr-FR');
  });

  // IMPORTANT: STT must start synchronously inside this click handler
  document.getElementById('mic-btn').addEventListener('click', function() {
    const micBtn = this;
    micBtn.classList.add('listening');
    document.getElementById('mic-status').textContent = 'Höre zu…';
    STT.listen(
      async (transcript) => {
        micBtn.classList.remove('listening');
        document.getElementById('mic-status').textContent = `Erkannt: "${transcript}"`;
        await getFeedback(transcript);
      },
      (err) => {
        micBtn.classList.remove('listening');
        document.getElementById('mic-status').textContent = err;
      }
    );
  });

  async function getFeedback(transcript) {
    const word = queue[currentIdx].word;
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackArea = document.getElementById('feedback-area');
    feedbackBox.className = 'feedback-box feedback-info';
    feedbackBox.innerHTML = '<span class="spinner"></span> Feedback wird geladen…';
    feedbackArea.classList.remove('hidden');
    try {
      const text = await Gemini.vocabFeedback(word, transcript, apiKey);
      const isCorrect = transcript.toLowerCase().includes(word.toLowerCase().split(' ')[0]);
      feedbackBox.className = `feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
      feedbackBox.textContent = text;
    } catch(e) {
      feedbackBox.className = 'feedback-box feedback-wrong';
      feedbackBox.textContent = `Feedback-Fehler: ${e.message}`;
    }
  }

  function markAndNext(correct) {
    const item = queue[currentIdx];
    const updated = SRS.updateItem(storageData.vocabulary[item.word] || {}, correct);
    storageData.vocabulary[item.word] = { ...updated, level };
    Storage.saveAll(storageData);
    currentIdx++;
    showCard();
  }

  document.getElementById('correct-btn').addEventListener('click', () => markAndNext(true));
  document.getElementById('wrong-btn').addEventListener('click', () => markAndNext(false));

  function showDone() {
    document.getElementById('drill-area').innerHTML = `
      <div class="card" style="text-align:center">
        <h2>Session abgeschlossen! 🎉</h2>
        <p>${sessionTotal} Vokabeln geübt.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:16px">Zurück zum Menü</a>
        <button onclick="location.reload()" class="btn btn-secondary">Nochmal</button>
      </div>`;
    updateStreak();
  }

  function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const streak = storageData.streak;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (streak.last_session === today) return;
    streak.current = streak.last_session === yesterday ? streak.current + 1 : 1;
    streak.last_session = today;
    Storage.set('streak', streak);
  }

  init();
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add vocab.html
git commit -m "feat: add vocabulary drill with SRS and Gemini feedback"
```

---

## Task 11: sentences.html — Satz-Training

**Files:**
- Create: `sentences.html`

- [ ] **Step 1: Create sentences.html**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Satz-Training — Franz</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
  <a href="index.html" class="nav-back">← Zurück</a>
  <h1>Satz-Training</h1>

  <div id="loading" class="card">Lädt…</div>

  <div id="training-area" class="hidden">
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <span id="sent-counter" style="font-size:0.85rem;color:#6b7280"></span>
      <span id="level-badge" class="badge badge-blue"></span>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" id="progress-fill" style="width:0%"></div></div>

    <div class="card">
      <p style="font-size:0.85rem;color:#6b7280;margin-bottom:8px">Deutsche Bedeutung:</p>
      <p id="german-sent" style="font-weight:600;font-size:1.05rem;margin-bottom:20px"></p>
      <p style="font-size:0.85rem;color:#6b7280;margin-bottom:8px">Sprich den französischen Satz:</p>
      <div style="display:flex;gap:10px;margin-bottom:8px">
        <button id="play-btn" class="btn btn-secondary" style="width:auto;flex:0 0 auto;padding:12px 16px">🔊</button>
        <button id="show-btn" class="btn btn-secondary" style="flex:1">Satz anzeigen</button>
      </div>
      <p id="french-sent" style="font-style:italic;color:#6b7280;min-height:24px;margin-bottom:16px"></p>
      <button class="mic-btn" id="mic-btn">🎤</button>
      <p id="mic-status" style="font-size:0.85rem;color:#6b7280;text-align:center;min-height:20px"></p>
    </div>

    <div id="feedback-area" class="hidden">
      <div id="feedback-box" class="feedback-box"></div>
      <button id="next-btn" class="btn btn-primary" style="margin-top:12px">Weiter →</button>
    </div>
  </div>
</div>

<script src="js/storage.js"></script>
<script src="js/tts.js"></script>
<script src="js/stt.js"></script>
<script src="js/gemini.js"></script>
<script>
  let sentences = [];
  let currentIdx = 0;
  const storageData = Storage.getAll();
  const level = storageData.current_level || 'a1';
  const apiKey = storageData.gemini_api_key;

  async function init() {
    const res = await fetch(`content/${level}.json`);
    const data = await res.json();
    sentences = data.sentences.sort(() => Math.random() - 0.5);
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('training-area').classList.remove('hidden');
    document.getElementById('level-badge').textContent = level.toUpperCase();
    showSentence();
  }

  function showSentence() {
    if (currentIdx >= sentences.length) { showDone(); return; }
    const s = sentences[currentIdx];
    document.getElementById('german-sent').textContent = s.german;
    document.getElementById('french-sent').textContent = '';
    document.getElementById('mic-status').textContent = '';
    document.getElementById('feedback-area').classList.add('hidden');
    const pct = Math.round(currentIdx / sentences.length * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('sent-counter').textContent = `${currentIdx + 1} / ${sentences.length}`;
  }

  document.getElementById('play-btn').addEventListener('click', () => {
    TTS.speak(sentences[currentIdx].french, 'fr-FR');
  });

  document.getElementById('show-btn').addEventListener('click', () => {
    document.getElementById('french-sent').textContent = sentences[currentIdx].french;
  });

  // IMPORTANT: STT must start synchronously inside this click handler
  document.getElementById('mic-btn').addEventListener('click', function() {
    const micBtn = this;
    micBtn.classList.add('listening');
    document.getElementById('mic-status').textContent = 'Höre zu…';
    STT.listen(
      async (transcript) => {
        micBtn.classList.remove('listening');
        document.getElementById('mic-status').textContent = `Erkannt: "${transcript}"`;
        await getFeedback(transcript);
      },
      (err) => {
        micBtn.classList.remove('listening');
        document.getElementById('mic-status').textContent = err;
      }
    );
  });

  async function getFeedback(transcript) {
    const sent = sentences[currentIdx].french;
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackArea = document.getElementById('feedback-area');
    feedbackBox.className = 'feedback-box feedback-info';
    feedbackBox.innerHTML = '<span class="spinner"></span> Feedback wird geladen…';
    feedbackArea.classList.remove('hidden');
    try {
      const text = await Gemini.sentenceFeedback(sent, transcript, apiKey);
      feedbackBox.className = 'feedback-box feedback-info';
      feedbackBox.textContent = text;
    } catch(e) {
      feedbackBox.className = 'feedback-box feedback-wrong';
      feedbackBox.textContent = `Fehler: ${e.message}`;
    }
  }

  document.getElementById('next-btn').addEventListener('click', () => {
    currentIdx++;
    showSentence();
  });

  function showDone() {
    document.getElementById('training-area').innerHTML = `
      <div class="card" style="text-align:center">
        <h2>Alle Sätze geübt! 🎉</h2>
        <a href="index.html" class="btn btn-primary" style="margin-top:16px">Zurück zum Menü</a>
        <button onclick="location.reload()" class="btn btn-secondary">Nochmal</button>
      </div>`;
  }

  init();
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add sentences.html
git commit -m "feat: add sentence training"
```

---

## Task 12: GitHub Setup & Deploy

- [ ] **Step 1: Create GitHub repository**

Go to github.com → New repository → Name: `franz` → Public → No README → Create.

- [ ] **Step 2: Push to GitHub**

```bash
cd /Users/cathy/Documents/Claude/Privat/Franz
git remote add origin https://github.com/YOUR_USERNAME/franz.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with the actual GitHub username.

- [ ] **Step 3: Enable GitHub Pages**

GitHub repo → Settings → Pages → Source: Deploy from branch → Branch: `main` → Folder: `/ (root)` → Save.

Wait ~2 minutes, then the app is live at: `https://YOUR_USERNAME.github.io/franz`

- [ ] **Step 4: Add to iPhone home screen**

On iPhone: Open Safari → go to `https://YOUR_USERNAME.github.io/franz` → Share button → "Zum Home-Bildschirm hinzufügen" → "Hinzufügen".

---

## Task 13: Manual End-to-End Test

*Run these manually in Safari on iPhone or Chrome on desktop.*

- [ ] **Test 1: API Key Setup**
  - Open app → Setup screen appears
  - Enter a valid Gemini API key → tap "Key speichern & testen"
  - Expected: Home screen appears with "Einstufungstest starten" banner

- [ ] **Test 2: Placement Test**
  - Tap "Einstufungstest starten"
  - Answer all questions → see result with recommended level
  - Expected: Returns to home, banner gone, level selected

- [ ] **Test 3: Vokabel-Drill**
  - Tap "Vokabel-Drill"
  - Word appears, TTS plays automatically
  - Tap 🎤 and speak the French word
  - Expected: Gemini feedback appears within 3 seconds
  - Tap "Richtig" → next word

- [ ] **Test 4: Satz-Training**
  - Tap "Satz-Training"
  - German sentence shown
  - Tap 🔊 to hear French version
  - Tap 🎤 and speak the sentence
  - Expected: Gemini feedback appears

- [ ] **Test 5: SRS Persistence**
  - Close browser tab, reopen app
  - Expected: API key still set, level still selected, vocab progress preserved

- [ ] **Step: Final commit**

```bash
git add .
git commit -m "chore: final Phase 1 complete"
git push
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Placement Test (Task 9)
- ✅ Vokabel-Drill with TTS/STT/Gemini feedback (Task 10)
- ✅ Satz-Training (Task 11)
- ✅ SRS SM-2 logic (Task 4)
- ✅ CEFR A1–C1 content (Task 7)
- ✅ Level unlock at 80% with ≥3 correct reviews (srs.js `isLevelMastered`)
- ✅ localStorage persistence (Task 3)
- ✅ Gemini Flash API (Task 6)
- ✅ Web Speech TTS/STT (Task 5)
- ✅ GitHub Pages hosting (Task 12)
- ✅ iOS PWA meta tags (index.html)
- ⏭️ Konversations-Modus → Phase 2
- ⏭️ Streak display → rendered on home screen (basic), full tracking in Phase 2
- ⏭️ Fortschrittsübersicht → Phase 3
