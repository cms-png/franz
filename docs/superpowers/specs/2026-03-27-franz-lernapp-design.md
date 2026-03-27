# Franz — Französische Konversations-Lernapp: Design Spec

**Datum:** 2026-03-27
**Status:** Approved
**Zielplattform:** Web App (PWA), optimiert für iOS Safari
**Nutzer:** Einzelnutzer (privat, kein App Store)

---

## Überblick

Franz ist eine interaktive Web-App zum Erlernen der französischen Konversation. Sie kombiniert Vokabel-Drill, Satz-Training und geführte Konversation mit Spracheingabe und KI-Feedback. Die App folgt dem CEFR-Rahmen (A1–C1) und passt sich dem Lernfortschritt des Nutzers an.

---

## Methodik

Kombination aus drei anerkannten Ansätzen:

- **Spaced Repetition System (SRS)** — Vokabeln werden nach der Forgetting Curve wiederholt (wie Anki). Jede Vokabel hat einen Wiederholungszeitpunkt der sich nach Beherrschungsgrad verschiebt.
- **Communicative Language Teaching (CLT)** — Konversationsmodus mit realistischen Alltagssituationen, Fokus auf echte Kommunikation.
- **Comprehensible Input (CI)** — Hören vor Sprechen: TTS liest vor, Nutzer hört und wiederholt, natürliche Spracherwerbsreihenfolge.

---

## Technischer Stack

| Komponente | Technologie | Kosten |
|---|---|---|
| Text-to-Speech (Vorlesen) | Web Speech API (SpeechSynthesis) | Kostenlos |
| Speech-to-Text (Erkennung) | Web Speech API (SpeechRecognition) | Kostenlos |
| KI-Feedback & Konversation | Google Gemini Flash API | Kostenlos (Free Tier: 1.500 Req/Tag) |
| Datenspeicherung | localStorage (Browser) | Kostenlos, lokal |
| Hosting | GitHub Pages | Kostenlos |
| Frontend | HTML + CSS + Vanilla JavaScript | — |

**Gemini API-Key:** Wird vom Nutzer einmalig in der App eingegeben und in localStorage gespeichert. Verlässt nie das Gerät, kein Backend erforderlich.

**Offline:** Nicht unterstützt. App erfordert Internetverbindung für Gemini-Feedback. TTS/STT funktionieren auch offline (Browser-nativ).

**iOS-Hinweis:** Web Speech API auf iOS Safari erfordert einen Nutzer-Tipp (Button) zur Aktivierung der Spracherkennung — iOS-Sicherheitsbeschränkung, kein Workaround möglich.

---

## CEFR Level-Struktur

| Level | Vokabeln | Schwerpunkt |
|---|---|---|
| A1 | ~300 | Basisphrasen, Begrüßung, Zahlen, Familie |
| A2 | ~600 | Alltagssituationen: Einkaufen, Reisen, Restaurant |
| B1 | ~1.200 | Meinungen, Beschreibungen, passé composé, Subjunktiv einfach |
| B2 | ~2.000 | Abstrakte Themen, Diskussionen, komplexe Grammatik |
| C1 | ~3.000 | Idiomatische Ausdrücke, fließende Konversation, kulturelle Referenzen |

**Level-Freischaltung:** Ein Level wird freigeschaltet, wenn der Nutzer ≥80% der Vokabeln des vorherigen Levels mit jeweils mindestens 3 fehlerfreien Wiederholungen abgeschlossen hat.

**Startniveau:** Wird durch den Placement Test bestimmt. Nutzer muss nicht bei A1 beginnen.

---

## Lerninhalt

**Quellen:**
- **Kuratierter Grundstock** — JSON-Dateien pro Level mit Vokabeln, Beispielsätzen und Konversationsthemen nach CEFR-Standard
- **Dynamisch generiert** — Gemini ergänzt neue Übungssätze und Konversationsszenarien passend zum aktuellen Level

**Dateistruktur Inhalt:**
```
content/
├── a1.json
├── a2.json
├── b1.json
├── b2.json
└── c1.json
```

Jede JSON-Datei enthält: `vocabulary[]`, `sentences[]`, `conversation_topics[]`

---

## Lernmodi

### 1. Placement Test
- 20–30 Fragen: Vokabeln erkennen, Sätze verstehen, kurze Übersetzungen
- Rein textbasiert (kein Sprechen), ausschließlich Mehrfachauswahl — kein Freitext, kein Gemini-API-Call nötig
- Ergebnis: Empfohlenes Startniveau (A1–C1), berechnet aus Trefferquote pro Level-Bereich
- Einmalig beim ersten Start, jederzeit wiederholbar

### 2. Vokabel-Drill
**Ablauf einer Übung:**
1. Wort wird auf Französisch per TTS vorgelesen
2. Deutsche Bedeutung wird angezeigt
3. Nutzer tippt Mikrofon-Button und spricht das französische Wort
4. Web Speech API transkribiert die Aussprache
5. Gemini bewertet: Prompt enthält Zielwort + Transkription, Antwort auf Deutsch
6. Feedback wird angezeigt (kurz: "Gut!", oder "Tipp: das -eau sprichst du wie 'o'")
7. SRS-Wert wird aktualisiert

**SRS-Logik (vereinfacht nach SM-2):**
- Neu → 1 Tag → 3 Tage → 7 Tage → 14 Tage → 30 Tage
- Fehler → zurück auf 1 Tag
- "Heute zu lernen"-Queue zeigt fällige Wiederholungen

### 3. Satz-Training
- Satz wird per TTS vorgelesen (Französisch)
- Nutzer spricht den Satz nach ODER übersetzt einen deutschen Satz ins Französische
- Gemini bewertet: Aussprache (via Transkription), Grammatik, Vollständigkeit
- Feedback auf Deutsch mit konkreten Verbesserungshinweisen

### 4. Konversations-Modus
- Nutzer wählt ein Thema/Szenario (z.B. "Im Restaurant", "Nach dem Weg fragen")
- Gemini spielt den Gesprächspartner auf dem Level des Nutzers
- Nutzer antwortet per Sprache (STT → Transkription → Gemini)
- Nach dem Gespräch (4–8 Turns): Auswertung
  - Was war korrekt
  - Grammatikfehler mit Erklärung
  - Natürlichere Alternativen
  - Aussprache-Hinweise

---

## Datenspeicherung (localStorage)

```json
{
  "gemini_api_key": "...",
  "current_level": "b1",
  "placement_completed": true,
  "vocabulary": {
    "bonjour": { "level": "a1", "interval": 7, "next_review": "2026-04-03", "correct": 12, "wrong": 1 },
    "...": {}
  },
  "streak": { "current": 5, "last_session": "2026-03-27" },
  "unlocked_levels": ["a1", "a2", "b1"]
}
```

---

## Gemini API — Prompt-Strategien

**Vokabel-Feedback Prompt (Beispiel):**
```
Du bist ein Französischlehrer. Der Lerner sollte das Wort "bonjour" aussprechen.
Die Spracherkennung hat transkribiert: "[transkription]".
Gib kurzes Feedback auf Deutsch (max. 2 Sätze): War es korrekt?
Falls nicht, erkläre den Aussprache-Fehler konkret.
```

**Konversations-Prompt (Beispiel):**
```
Du bist ein freundlicher Franzose in einem Pariser Café. Der Lerner ist auf B1-Niveau.
Führe ein natürliches Gespräch auf Französisch. Antworte kurz (1-3 Sätze).
Wenn der Lerner einen groben Fehler macht, antworte trotzdem natürlich — die Auswertung kommt später.
```

---

## Implementierungsphasen

### Phase 1 — Kern (MVP)
- [ ] Projektstruktur + GitHub Pages Setup
- [ ] API-Key Eingabe + localStorage
- [ ] CEFR Content JSON (A1–C1, kuratiert)
- [ ] Placement Test
- [ ] Vokabel-Drill mit TTS + STT + Gemini-Feedback
- [ ] SRS-Logik (SM-2 vereinfacht)
- [ ] Satz-Training
- [ ] Level-Navigation + Freischaltung

### Phase 2 — Konversation
- [ ] Konversations-Modus mit Themenauswahl
- [ ] Dynamische Gemini-Übungsgenerierung
- [ ] Tages-Streak

### Phase 3 — Feinschliff
- [ ] Fehler-Analyse (häufigste Schwächen)
- [ ] Fortschrittsübersicht / Lernkurve
- [ ] Eigene Vokabeln hinzufügen
- [ ] Konversationsthemen erweitern

---

## Nicht im Scope

- Backend / Server
- User Accounts / Login
- Cloud-Sync
- Offline-Modus
- App Store Veröffentlichung
- Android-Unterstützung (funktioniert im Browser, aber nicht optimiert)
- Push-Notifications / Lern-Erinnerungen
