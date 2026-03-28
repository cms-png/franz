// js/tts.js
const TTS = {
  speak(text, lang = 'fr-FR', rate = 0.85) {
    return new Promise((resolve) => {
      const doSpeak = () => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate;
        u.onend = resolve;
        u.onerror = resolve;

        // Try to find a matching voice
        const voices = speechSynthesis.getVoices();
        const match = voices.find(v => v.lang.startsWith('fr'));
        if (match) u.voice = match;

        speechSynthesis.speak(u);
      };

      // Voices may not be loaded yet on first call
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        doSpeak();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          speechSynthesis.onvoiceschanged = null;
          doSpeak();
        };
        // Fallback: try anyway after short delay (iOS sometimes doesn't fire onvoiceschanged)
        setTimeout(() => {
          if (speechSynthesis.pending || speechSynthesis.speaking) return;
          doSpeak();
        }, 500);
      }
    });
  }
};
