import * as pdfjsLib from './pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.mjs';

const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');

function loadPDF(url) {
  pdfjsLib.getDocument(url).promise.then(pdf => {
    pdf.getPage(1).then(page => {
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }).catch(err => {
    console.error('Error loading PDF:', err);
  });
}

// ✅ Expose to global scope
window.loadPDF = loadPDF;

// Load default PDF
loadPDF('pdfs/file1.pdf');
