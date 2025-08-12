import { loadAllFlashcardData } from './dataLoader.js';
import { checkVersion } from "./scripts-Electronics1/app.js";

document.getElementById("updateCheckBtn").addEventListener("click", checkVersion);

loadAllFlashcardData().then(allData => {
  renderFlashcards(allData); // Placeholder for future bulk rendering
});

async function loadTopic(topic) {
  const res = await fetch(`data-Electronics1/${topic}.json`);
  const cards = await res.json();
  renderFlashcards(cards); // Optional: show all cards in grid
}

const topicCards = document.querySelectorAll(".topic-card");
const flashcardViewer = document.querySelector(".flashcard-viewer");
const flashcard = document.querySelector(".flashcard");
const front = document.querySelector(".front");
const back = document.querySelector(".back");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progressInfo = document.getElementById("progress-info");

let currentCards = [];
let currentIndex = 0;

topicCards.forEach(card => {
  card.onclick = async () => {
    const topic = card.dataset.topic;
    const res = await fetch(`data-Electronics1/${topic}.json`);
    currentCards = await res.json();
    currentIndex = 0;
    showCard();
    flashcardViewer.classList.remove("hidden");
    progressInfo.textContent = `Studying: ${topic} (${currentCards.length} cards)`;
  };
});

flashcard.onclick = () => {
  flashcard.classList.toggle("flipped");
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
  showCard("left");
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % currentCards.length;
  showCard("right");
};


function showCard(direction = "right") {
  const card = currentCards[currentIndex];
  front.textContent = card.question;
  back.textContent = card.answer;
  flashcard.classList.remove("flipped");

  flashcard.classList.remove("slide-left", "slide-right");
  void flashcard.offsetWidth; // Force reflow
  flashcard.classList.add(direction === "left" ? "slide-left" : "slide-right");
}


function renderFlashcards(data) {
  console.log("Loaded all flashcard data:", data);

  // Optional: render all cards in a grid for editor mode
  const container = document.querySelector(".card-grid");
  if (!container) return;

  container.innerHTML = "";
  Object.entries(data).forEach(([topic, cards]) => {
    const section = document.createElement("section");
    section.className = "topic-section";
    section.innerHTML = `<h2>${topic}</h2>`;
    cards.forEach(card => {
      const div = document.createElement("div");
      div.className = "card-preview";
      div.innerHTML = `
        <div class="question">${card.question}</div>
        <div class="answer">${card.answer}</div>
      `;
      section.appendChild(div);
    });
    container.appendChild(section);
  });
}
