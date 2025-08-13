import { loadAllFlashcardData } from './dataLoader.js';
import { checkVersion } from './app.js';

document.getElementById("updateCheckBtn").addEventListener("click", checkVersion);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('Service Worker registered!', reg);

      // Listen for updates
      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'activated') {
            showOfflineReadyNotification();
          }
        };
      };

      // If already active
      if (reg.active) {
        showOfflineReadyNotification();
      }
    }).catch(err => console.error('Service Worker registration failed:', err));
  }

  function showOfflineReadyNotification() {
    const toast = document.createElement('div');
    toast.textContent = '✅ App is ready for offline use!';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#2e7d32';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
  }

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
