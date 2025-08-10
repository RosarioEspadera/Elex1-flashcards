fetch(`data-Electronics1/${topic}.json`)
  .then(res => res.json())
  .then(data => renderFlashcards(data));
