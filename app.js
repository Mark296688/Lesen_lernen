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
let permissionGranted = false; // Status, ob Berechtigung erteilt wurde

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

// Funktion: Spracherkennung starten
function startRecognition() {
  if (!permissionGranted) {
    // Berechtigung sicherstellen, falls noch nicht erteilt
    recognition.start();
    recognition.stop();
    permissionGranted = true;
  }

  // Starte die Spracherkennung
  recognition.start();
  feedback.textContent = "Lies das Wort vor!";
  feedback.style.color = "black";
}

// Ereignis: Ergebnis der Spracherkennung verarbeiten
recognition.onresult = (event) => {
  const gesprochenesWort = event.results[0][0].transcript.trim();

  if (gesprochenesWort.toLowerCase() === currentWord.toLowerCase()) {
    feedback.textContent = "Richtig gelesen! 🎉";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Falsch. Du hast gesagt: "${gesprochenesWort}"`;
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

// Berechtigung einmalig beim Laden der Seite anfragen
recognition.start();
recognition.stop();
