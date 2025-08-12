const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';

const pdfSelect = document.getElementById('pdfSelect');
const loadPdfBtn = document.getElementById('loadPdfBtn');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let pdfDoc = null;
let pageNum = 1;
let pageCount = 0;

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderContext);
    pageInfo.textContent = `Page ${num} of ${pageCount}`;
  });
}

function loadPdf(url) {
  pdfjsLib.getDocument(url).promise.then(doc => {
    pdfDoc = doc;
    pageCount = doc.numPages;
    pageNum = 1;
    renderPage(pageNum);
  });
}

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

// Optionally load the first PDF on page load
if (pdfSelect.value) {
  loadPdf(pdfSelect.value);
}