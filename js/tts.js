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
