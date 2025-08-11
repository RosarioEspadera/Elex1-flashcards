import { loadAllFlashcardData } from './dataLoadersolving.js';

loadAllFlashcardData().then(allData => {
  renderFlashcards(allData); // Optional: grid view for editor mode
});

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
    const res = await fetch(`data-Electronics1solving/${topic}.json`);
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

  // Reset content
  front.innerHTML = "";
  back.innerHTML = "";

  // Render question
  renderContent(front, card.question);

  // Render answer
  renderContent(back, card.answer);

  // Animate
  flashcard.classList.remove("flipped", "slide-left", "slide-right");
  void flashcard.offsetWidth;
  flashcard.classList.add(direction === "left" ? "slide-left" : "slide-right");
}

function renderContent(container, content) {
  if (typeof content === "string") {
    container.innerHTML = content;
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (typeof item === "string") {
        container.innerHTML += item;
      } else if (item.type === "img") {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt || "";
        img.style.maxWidth = "100%";
        container.appendChild(img);
      }
    });
  }
}

function renderFlashcards(data) {
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
        <div class="question">${typeof card.question === "string" ? card.question : "[Image or rich content]"}</div>
        <div class="answer">${typeof card.answer === "string" ? card.answer : "[Image or rich content]"}</div>
      `;
      section.appendChild(div);
    });
    container.appendChild(section);
  });
}
