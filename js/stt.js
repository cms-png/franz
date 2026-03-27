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
