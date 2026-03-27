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
