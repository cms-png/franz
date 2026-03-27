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
