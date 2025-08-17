let pdfDoc = null;
let pageNum = 1;
let scale = 1.5;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file.type === 'application/pdf') {
    const reader = new FileReader();
    reader.onload = function () {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then((doc) => {
        pdfDoc = doc;
        renderPage(pageNum);
      });
    };
    reader.readAsArrayBuffer(file);
  }
});

function renderPage(num) {
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    page.render({ canvasContext: ctx, viewport });
  });
}

function zoomIn() {
  scale += 0.25;
  renderPage(pageNum);
}

function zoomOut() {
  scale = Math.max(0.5, scale - 0.25);
  renderPage(pageNum);
}
