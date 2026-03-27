// tests/test_storage.js
const assert = require('assert');

// Minimal localStorage mock for Node.js
const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; }
};

// Inline storage logic for Node testability
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
