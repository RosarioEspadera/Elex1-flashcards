let pdfjsLib = window.pdfjsLib;
if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';
} else {
  console.error('PDF.js library not loaded.');
}

const pdfSelect = document.getElementById('pdfSelect');
const loadPdfBtn = document.getElementById('loadPdfBtn');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let pdfDoc = null, pageNum = 1, pageCount = 0;

// Load PDF list from JSON
fetch('pdf/pdfs.json')
  .then(response => response.json())
  .then(pdfList => {
    pdfList.forEach(pdf => {
      const option = document.createElement('option');
      option.value = pdf.file;
      option.textContent = pdf.name;
      pdfSelect.appendChild(option);
    });
    if (pdfList.length > 0) {
      loadPdf(pdfList[0].file);
    }
  });

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    page.render({ canvasContext: ctx, viewport }).promise.then(() => {
      pageInfo.textContent = `Page ${num} of ${pageCount}`;
      prevPageBtn.disabled = (num <= 1);
      nextPageBtn.disabled = (num >= pageCount);
    });
  });
}

function loadPdf(url) {
  pdfjsLib.getDocument(url).promise.then(doc => {
    pdfDoc = doc;
    pageCount = doc.numPages;
    pageNum = 1;
    renderPage(pageNum);
  }).catch(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pageInfo.textContent = 'Failed to load PDF.';
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