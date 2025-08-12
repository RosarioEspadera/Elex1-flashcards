let pdfjsLib = window.pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';

const url = 'Basic-Electricity-and-Electronics-1.pdf';
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let pdfDoc = null, pageNum = 1, pageCount = 0;

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    page.render({ canvasContext: ctx, viewport }).promise.then(() => {
      pageInfo.textContent = `Page ${num} of ${pageCount}`;
    });
  });
}

pdfjsLib.getDocument(url).promise.then(doc => {
  pdfDoc = doc;
  pageCount = doc.numPages;
  renderPage(pageNum);
});

prevPageBtn.addEventListener('click', () => {
  if (pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
  }
});
nextPageBtn.addEventListener('click', () => {
  if (pageNum < pageCount) {
    pageNum++;
    renderPage(pageNum);
  }
});