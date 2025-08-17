const fileInput = document.getElementById('file-input');
const viewer = document.getElementById('pdf-viewer');
const pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file.type !== 'application/pdf') {
    alert('Please select a valid PDF file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const typedArray = new Uint8Array(this.result);
    pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
      viewer.innerHTML = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then((page) => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          page.render({ canvasContext: context, viewport });
          viewer.appendChild(canvas);
        });
      }
    });
  };
  reader.readAsArrayBuffer(file);
});
