// Variablen zur Speicherung von Wörtern und dem aktuellen Schwierigkeitsgrad
let words = [];
let currentWord = "";
let currentLevel = "Einfach"; // Standard-Schwierigkeitsgrad
let recognizedText = ""; // Speichert das zuletzt erkannte Wort

// Elemente aus dem DOM
const wordDisplay = document.getElementById("word-display");
const feedback = document.getElementById("feedback");
const newWordButton = document.getElementById("new-word-button");
const readWordButton = document.getElementById("read-word-button");
const displayDurationSelect = document.getElementById("display-duration");

// Web Speech API: Spracherkennung einrichten
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "de-DE"; // Deutsche Sprache
recognition.interimResults = false; // Nur endgültige Ergebnisse
recognition.continuous = false; // Nur ein kurzer Spracherkennungsdurchgang

// Dropdown-Menü für Schwierigkeitsstufen erstellen
function createLevelDropdown() {
  const levelContainer = document.createElement("div");
  levelContainer.id = "level-container";

  const levelLabel = document.createElement("label");
  levelLabel.htmlFor = "level-select";
  levelLabel.textContent = "Schwierigkeitsstufe:";

  const levelSelect = document.createElement("select");
  levelSelect.id = "level-select";
  ["Einfach", "Mittel", "Schwer"].forEach(level => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level;
    levelSelect.appendChild(option);
  });

  levelContainer.appendChild(levelLabel);
  levelContainer.appendChild(levelSelect);

  // Füge das Dropdown-Menü oberhalb des Buttons „Neues Wort“ ein
  const buttonContainer = document.querySelector(".app-container");
  buttonContainer.insertBefore(levelContainer, newWordButton);

  // Ereignis: Ändere den aktuellen Schwierigkeitsgrad
  levelSelect.addEventListener("change", (event) => {
    currentLevel = event.target.value;
    feedback.textContent = `Schwierigkeitsgrad geändert zu: ${currentLevel}`;
    feedback.style.color = "black";
  });
}

// Funktion: Wörter aus JSON-Datei laden
function loadWords() {
  fetch("./words.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Wörter.");
      }
      return response.json();
    })
    .then(data => {
      words = data.words;
      feedback.textContent = "Wörter erfolgreich geladen.";
      feedback.style.color = "green";
    })
    .catch(error => {
      feedback.textContent = "Fehler beim Laden der Wörter.";
      feedback.style.color = "red";
      console.error("JSON-Fehler:", error);
    });
}

// Funktion: Neues Wort anzeigen (nach Schwierigkeitsgrad filtern)
function displayNewWord() {
  const filteredWords = words.filter(word => word.level === currentLevel);
  if (filteredWords.length === 0) {
    wordDisplay.textContent = "Keine Wörter für diese Schwierigkeitsstufe gefunden.";
    return;
  }

  const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  currentWord = randomWord.text;
  wordDisplay.textContent = currentWord;

  // Dauer aus Dropdown auswählen
  const displayDuration = parseFloat(displayDurationSelect.value) * 1000;

  // Wort nach der eingestellten Dauer ausblenden
  setTimeout(() => {
    wordDisplay.textContent = "🔒"; // Wort ausblenden (durch Symbol ersetzen)
  }, displayDuration);

  feedback.textContent = ""; // Feedback zurücksetzen
}

// Funktion: Spracherkennung starten
function startRecognition() {
  if (!currentWord) {
    feedback.textContent = "Bitte wähle zuerst ein Wort aus.";
    feedback.style.color = "red";
    return;
  }

  feedback.textContent = "Lies das Wort vor!";
  feedback.style.color = "black";

  recognition.start();
}

// Ereignis: Ergebnis der Spracherkennung verarbeiten
recognition.onresult = (event) => {
  recognizedText = event.results[0][0].transcript.trim();

  if (recognizedText.toLowerCase() === currentWord.toLowerCase()) {
    feedback.textContent = "Richtig gelesen! 🎉";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Falsch. Du hast gesagt: "${recognizedText}"`;
    feedback.style.color = "red";
  }
};

// Fehlerbehandlung
recognition.onerror = (event) => {
  feedback.textContent = "Es gab ein Problem bei der Spracherkennung.";
  feedback.style.color = "red";
};

// Buttons mit Funktionen verknüpfen
newWordButton.addEventListener("click", displayNewWord);
readWordButton.addEventListener("click", startRecognition);

// Wörter beim Start laden und Dropdown-Menü erstellen
createLevelDropdown();
loadWords();
