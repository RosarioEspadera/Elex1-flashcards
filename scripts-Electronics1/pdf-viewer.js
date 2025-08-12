// PDF.js setup for CDN compatibility (v4.x)
let pdfjsLib = window.pdfjsLib;
if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';
}
// DOM elements
const pdfSelect = document.getElementById('pdfSelect');
const loadPdfBtn = document.getElementById('loadPdfBtn');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

canvas.width = 800;
canvas.height = 1000;
let pdfDoc = null;
let pageNum = 1;
let pageCount = 0;

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
      .then(() => {
        pageInfo.textContent = `Page ${num} of ${pageCount}`;
      })
      .catch(err => {
        pageInfo.textContent = 'Error rendering page: ' + err.message;
      });
  }).catch(err => {
    pageInfo.textContent = 'Error loading page: ' + err.message;
  });
}

// Load a PDF file
// filepath: /workspaces/Elex1-flashcards/scripts-Electronics1/pdf-viewer.js
function loadPdf(url) {
  if (!pdfjsLib || !pdfjsLib.getDocument) {
    pageInfo.textContent = 'PDF.js library not loaded.';
    return;
  }
  pdfjsLib.getDocument(url).promise.then(doc => {
    pdfDoc = doc;
    pageCount = doc.numPages;
    pageNum = 1;
    renderPage(pageNum);
  }).catch(_err => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pageInfo.textContent = 'Failed to load PDF.';
  });
}

// Event listeners
loadPdfBtn.addEventListener('click', () => {
  const selectedPdf = pdfSelect.value;
  loadPdf(selectedPdf);
});

prevPageBtn.addEventListener('click', () => {
  if (pdfDoc && pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
  }
});

nextPageBtn.addEventListener('click', () => {
  if (pdfDoc && pageNum < pageCount) {
    pageNum++;
    renderPage(pageNum);
  }
});

// Load first PDF on page load if available
window.addEventListener('DOMContentLoaded', () => {
  if (pdfSelect.value) {
    loadPdf(pdfSelect.value);
  }
});