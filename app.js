// Liste von Wörtern
const words = ["Apfel", "Baum", "Haus", "Katze", "Hund", "Auto", "Buch"];
let currentWord = "";

// Elemente aus dem DOM
const wordDisplay = document.getElementById("word-display");
const feedback = document.getElementById("feedback");
const newWordButton = document.getElementById("new-word-button");
const displayDurationSelect = document.getElementById("display-duration");

// Web Speech API: Spracherkennung einrichten
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "de-DE";
recognition.interimResults = false;
recognition.continuous = true; // Kontinuierliche Erkennung aktivieren

let recognitionActive = false; // Status der Spracherkennung

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

// Spracherkennung starten (falls noch nicht aktiv)
function startRecognition() {
  if (recognitionActive) {
    feedback.textContent = "Spracherkennung läuft bereits.";
    feedback.style.color = "blue";
    return;
  }

  recognitionActive = true;
  recognition.start();
  feedback.textContent = "Spracherkennung gestartet. Lies das Wort vor!";
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

// Ereignis: Spracherkennung läuft weiter
recognition.onend = () => {
  if (recognitionActive) {
    recognition.start(); // Spracherkennung automatisch neu starten
  }
};

// Fehlerbehandlung
recognition.onerror = (event) => {
  feedback.textContent = "Es gab ein Problem bei der Spracherkennung.";
  feedback.style.color = "red";
  recognitionActive = false; // Bei schwerwiegenden Fehlern stoppen
};

// Buttons mit Funktionen verknüpfen
newWordButton.addEventListener("click", displayNewWord);
startRecognition(); // Spracherkennung direkt beim Laden der Seite starten
