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
