// Imports
import { loadAllFlashcardData } from './dataLoader.js';
import { checkVersion } from './app.js';
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';


// IndexedDB setup
const db = await openDB('elex-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('assets')) {
      db.createObjectStore('assets');
    }
  }
});

// Cache all files
window.cacheAllFiles = async function () {
  const res = await fetch('../assets-manifest.json');
  const files = await res.json();

  for (const file of files) {
    try {
      const response = await fetch(file);
      const blob = await response.blob();
      await db.put('assets', blob, file);
    } catch (err) {
      console.warn('Failed to cache:', file, err);
    }
  }

  console.log("✅ All materials cached for offline use.");
};

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// Service worker events
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('Service worker now controlling the page');
  location.reload();
});

navigator.serviceWorker.addEventListener('message', event => {
  if (event.data?.type === 'download-progress') {
    const { downloaded, total } = event.data;
    const percent = Math.round((downloaded / total) * 100);
    const bar = document.getElementById('progress-bar');
    if (bar) {
      bar.style.width = percent + '%';
      bar.textContent = `Downloading: ${percent}%`;
    }

    if (percent === 100) {
      showToast('✅ All files downloaded. Ready for offline use!');
    }
  }
});

// Install prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.style.display = 'block';
  }
});

if (installBtn) {
  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => {
        deferredPrompt = null;
      });
    }
  });
}

// Toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#6b4f3b',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: '1000',
    fontFamily: 'sans-serif',
    fontSize: '14px'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// Flashcard logic
document.getElementById("updateCheckBtn").addEventListener("click", checkVersion);

loadAllFlashcardData().then(allData => {
  renderFlashcards(allData);
});

async function loadTopic(topic) {
  const res = await fetch(`data-Electronics1/${topic}.json`);
  const cards = await res.json();
  renderFlashcards(cards);
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
  void flashcard.offsetWidth;
  flashcard.classList.add(direction === "left" ? "slide-left" : "slide-right");
}

function renderFlashcards(data) {
  console.log("Loaded all flashcard data:", data);
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
