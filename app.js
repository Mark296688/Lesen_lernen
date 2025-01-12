// Liste von Wörtern
const words = ["Apfel", "Baum", "Haus", "Katze", "Hund", "Auto", "Buch"];
let currentWord = "";

// Elemente aus dem DOM
const wordDisplay = document.getElementById("word-display");
const feedback = document.getElementById("feedback");
const newWordButton = document.getElementById("new-word-button");
const readWordButton = document.getElementById("read-word-button");
const displayDurationSelect = document.getElementById("display-duration");

// Web Speech API: Spracherkennung einrichten
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "de-DE";
recognition.interimResults = false; // Nur endgültige Ergebnisse
recognition.continuous = true; // Kontinuierlicher Modus
let recognizedText = ""; // Speichert das zuletzt erkannte Wort

// Funktion: Neues Wort anzeigen
function displayNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDisplay.textContent = currentWord;

  // Dauer aus Dropdown auswählen
  const displayDuration = parseFloat(displayDurationSelect.value) * 1000;

  // Wort nach der eingestellten Dauer ausblenden
  setTimeout(() => {
    wordDisplay.textContent = "🔒"; // Wort ausblenden (durch Symbol ersetzen)
  }, displayDuration);

  feedback.textContent = ""; // Feedback zurücksetzen
}

// Funktion: Ergebnis prüfen, wenn "Lesen" geklickt wird
function checkRecognition() {
  if (!recognizedText) {
    feedback.textContent = "Ich habe nichts erkannt. Bitte sprich ins Mikrofon.";
    feedback.style.color = "red";
    return;
  }

  if (recognizedText.toLowerCase() === currentWord.toLowerCase()) {
    feedback.textContent = "Richtig gelesen! 🎉";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Falsch. Du hast gesagt: "${recognizedText}"`;
    feedback.style.color = "red";
  }
}

// Ereignis: Spracherkennungsergebnisse speichern
recognition.onresult = (event) => {
  recognizedText = event.results[event.results.length - 1][0].transcript.trim();
};

// Fehlerbehandlung
recognition.onerror = (event) => {
  feedback.textContent = "Es gab ein Problem bei der Spracherkennung.";
  feedback.style.color = "red";
};

// Starte die Spracherkennung kontinuierlich beim Laden der Seite
recognition.start();

// Buttons mit Funktionen verknüpfen
newWordButton.addEventListener("click", displayNewWord);
readWordButton.addEventListener("click", checkRecognition);
