// js/tts.js
const TTS = {
  _voices: [],

  init() {
    const load = () => { this._voices = speechSynthesis.getVoices(); };
    load();
    speechSynthesis.onvoiceschanged = load;
  },

  // Must be called synchronously inside a click handler (browser autoplay policy)
  speak(text, lang = 'fr-FR', rate = 0.85) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    const match = this._voices.find(v => v.lang.startsWith('fr'));
    if (match) u.voice = match;
    speechSynthesis.speak(u);
  }
};

TTS.init();
