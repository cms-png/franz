// js/gemini.js — verwendet Groq API (kostenlos, EU-kompatibel)
const Gemini = {
  _model: 'llama-3.3-70b-versatile',
  _baseUrl: 'https://api.groq.com/openai/v1/chat/completions',

  async _call(prompt, apiKey) {
    const res = await fetch(this._baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: this._model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 250
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API Fehler ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
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
