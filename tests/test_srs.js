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
  'eau':     { level: 'a1', correct: 0, wrong: 2 },
};
assert.strictEqual(isLevelMastered(vocab, 'a1'), true, 'Level mastered at 80%');
vocab['bonjour'].correct = 1;
assert.strictEqual(isLevelMastered(vocab, 'a1'), false, 'Level not mastered below 80%');

console.log('All SRS tests passed!');
