module.exports = {
  globDirectory: './',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,mjs,ico,ftl,icc,bcmap,pfb,ttf,json,svg}',
    'pdfs/**/*.{pdf,PDF}'
  ],
  swDest: './sw.js',
  maximumFileSizeToCacheInBytes: 120 * 1024 * 1024 // 120MB
};
