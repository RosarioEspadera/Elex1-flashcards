const topics = [
  "amplifiers",
  "biasing",
  "bjts",
  "diodes",
  "fets",
  "power-supplies",
  "dc-math",
  "safety",
  "electrical-properties",
  "resistance",
  "dc-ohms-law"
];

export async function loadAllFlashcardData() {
  const data = {};
  for (const topic of topics) {
    try {
      const res = await fetch(`data-Electronics1/${topic}.json`);
      data[topic] = await res.json();
    } catch (err) {
      console.error(`Failed to load ${topic}:`, err);
    }
  }
  return data;
}
