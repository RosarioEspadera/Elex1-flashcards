const topics = [
  "semiconductor-diode"
];

export async function loadAllFlashcardData() {
  const data = {};
  for (const topic of topics) {
    try {
      const res = await fetch(`data-Electronics1solving/${topic}.json`);
      data[topic] = await res.json();
    } catch (err) {
      console.error(`Failed to load ${topic}:`, err);
    }
  }
  return data;
}
