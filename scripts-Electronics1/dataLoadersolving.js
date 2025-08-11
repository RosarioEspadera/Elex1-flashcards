// This module loads all available flashcard topics for optional grid rendering or preloading

export async function loadAllFlashcardData() {
  const topics = [
    'semiconductor-diode',
    // Add more topics here as you expand (e.g. 'ohms-law', 'resistance', etc.)
  ];

  const allData = {};

  for (const topic of topics) {
    try {
      const res = await fetch(`data-Electronics1solving/${topic}.json`);
      const cards = await res.json();
      allData[topic] = cards;
    } catch (err) {
      console.error(`Failed to load flashcards for ${topic}:`, err);
    }
  }

  return allData;
}
