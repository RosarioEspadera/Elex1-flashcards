const topicList = [
  "semiconductor-diode"
];

export async function loadAllFlashcardData() {
  const allData = {};

  await Promise.all(
    topicList.map(async topic => {
      try {
        const res = await fetch(`data-Electronics1solving/${topic}.json`);
        const cards = await res.json();
        allData[topic] = cards.map(card => normalizeCard(card));
      } catch (err) {
        console.warn(`Failed to load topic: ${topic}`, err);
      }
    })
  );

  return allData;
}

function normalizeCard(card) {
  return {
    question: normalizeContent(card.question),
    answer: normalizeContent(card.answer)
  };
}

function normalizeContent(content) {
  if (typeof content === "string") return [content];

  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === "string") return item;
      if (item.type === "img") {
        return {
          type: "img",
          src: item.src,
          alt: item.alt || ""
        };
      }
      return item;
    });
  }

  return [String(content)];
}
