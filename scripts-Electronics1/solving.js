import { loadAllFlashcardData } from './dataLoadersolving.js';
import { checkVersion } from "./scripts-Electronics1/app.js";

document.getElementById("updateCheckBtn").addEventListener("click", checkVersion);


const topicCards = document.querySelectorAll('.topic-card');
const flashcardViewer = document.querySelector('.flashcard-viewer');
const flashcard = document.querySelector('.flashcard');
const front = document.querySelector('.front');
const back = document.querySelector('.back');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progressInfo = document.getElementById('progress-info');

let currentCards = [];
let currentIndex = 0;
let currentTopic = ''; // ← Add this line


// Load all topics (optional grid view)
loadAllFlashcardData().then(allData => {
  // Optional: renderFlashcards(allData);
});

// Topic selection
topicCards.forEach(card => {
  card.addEventListener('click', async () => {
    const topic = card.dataset.topic;
    currentTopic = topic;
    const res = await fetch(`data-Electronics1solving/${topic}.json`);
    currentCards = await res.json();
    currentIndex = 0;
    showCard();
    flashcardViewer.classList.remove('hidden');
  });
});

// Flip on click
flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('flipped');
});

// Navigation
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentCards.length;
  showCard('right');
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
  showCard('left');
});

// Render flashcard
function showCard(direction = 'right') {
  const card = currentCards[currentIndex];
  front.innerHTML = '';
  back.innerHTML = '';
  renderContent(front, card.question);
  renderContent(back, card.answer);

  flashcard.classList.remove('flipped', 'slide-left', 'slide-right');
  void flashcard.offsetWidth; // trigger reflow
  flashcard.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');

  progressInfo.textContent = `Showing ${currentTopic} flashcard ${currentIndex + 1}`;
}

// Render content (text + images)
function renderContent(container, content) {
  if (typeof content === 'string') {
    container.textContent = content;
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (typeof item === 'string') {
        const p = document.createElement('p');
        p.textContent = item;
        container.appendChild(p);
      } else if (item.type === 'img') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || '';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        container.appendChild(img);
      }
    });
  }
}
