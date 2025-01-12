// Variablen zur Speicherung von Wörtern und dem Schwierigkeitsgrad
let words = [];
let currentLevel = "Einfach"; // Standard-Schwierigkeitsgrad

// Elemente aus dem DOM
const wordDisplay = document.getElementById("word-display");
const feedback = document.getElementById("feedback");
const newWordButton = document.getElementById("new-word-button");
const readWordButton = document.getElementById("read-word-button");
const displayDurationSelect = document.getElementById("display-duration");
const levelSelect = document.createElement("select"); // Dropdown für Schwierigkeitsstufen

// Schwierigkeitsstufen-Dropdown erstellen
["Einfach", "Mittel", "Schwer"].forEach(level => {
  const option = document.createElement("option");
  option.value = level;
  option.textContent = level;
  levelSelect.appendChild(option);
});
document.body.insertBefore(levelSelect, newWordButton); // Dropdown oberhalb des Buttons einfügen

// Funktion: Wörter aus JSON-Datei laden
function loadWords() {
  fetch("./words.json")
    .then(response => response.json())
    .then(data => {
      words = data.words;
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
    wordDisplay.textContent = "Keine Wörter gefunden.";
    return;
  }

  const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  wordDisplay.textContent = randomWord.text;

  // Dauer aus Dropdown auswählen
  const displayDuration = parseFloat(displayDurationSelect.value) * 1000;

  // Wort nach der eingestellten Dauer ausblenden
  setTimeout(() => {
    wordDisplay.textContent = "🔒"; // Wort ausblenden (durch Symbol ersetzen)
  }, displayDuration);

  feedback.textContent = ""; // Feedback zurücksetzen
}

// Funktion: Schwierigkeitsgrad ändern
levelSelect.addEventListener("change", (event) => {
  currentLevel = event.target.value;
  feedback.textContent = `Schwierigkeitsgrad geändert zu: ${currentLevel}`;
  feedback.style.color = "black";
});

// Buttons mit Funktionen verknüpfen
newWordButton.addEventListener("click", displayNewWord);
readWordButton.addEventListener("click", startRecognition);

// Wörter beim Start laden
loadWords();
